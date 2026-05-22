import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface Chapter {
  id: string;
  number: number;
  title: string;
  sections: Array<{
    id: string;
    number: string;
    heading: string;
    content: string;
    images: Array<{ id: string; url: string; caption: string }>;
  }>;
}

interface GeneratedContent {
  abstract: string;
  acknowledgement: string;
  chapters: Chapter[];
}

type ChapterBlueprint = {
  number: number;
  title: string;
  sections: Array<{ number: string; heading: string }>;
};

class AIHttpError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.status = status;
    this.name = "AIHttpError";
  }
}

const cleanModelText = (text: string) =>
  text
    .replace(/```json\n?/g, "")
    .replace(/```\n?/g, "")
    .trim();

const escapeControlChars = (str: string): string => {
  let result = "";
  let inString = false;
  let escaped = false;

  for (let i = 0; i < str.length; i++) {
    const char = str[i];
    const charCode = str.charCodeAt(i);

    if (escaped) {
      escaped = false;
      result += char;
      continue;
    }

    if (char === "\\" && inString) {
      escaped = true;
      result += char;
      continue;
    }

    if (char === '"') {
      inString = !inString;
      result += char;
      continue;
    }

    if (inString && charCode < 32) {
      if (char === "\n") result += "\\n";
      else if (char === "\r") result += "\\r";
      else if (char === "\t") result += "\\t";
      else result += "\\u" + charCode.toString(16).padStart(4, "0");
    } else {
      result += char;
    }
  }

  return result;
};

const repairJSON = (jsonStr: string): string => {
  let repaired = jsonStr;

  const lastBrace = repaired.lastIndexOf("}");
  if (lastBrace !== -1 && lastBrace < repaired.length - 1) {
    repaired = repaired.substring(0, lastBrace + 1);
  }

  let inString = false;
  let escaped = false;
  let result = "";

  for (let i = 0; i < repaired.length; i++) {
    const char = repaired[i];

    if (escaped) {
      escaped = false;
      result += char;
      continue;
    }

    if (char === "\\" && inString) {
      escaped = true;
      result += char;
      continue;
    }

    if (char === '"') {
      inString = !inString;
    }

    result += char;
  }

  if (inString) result += '"';
  repaired = result;

  repaired = repaired.replace(/"(\s*)(?=")/g, '",$1');
  repaired = repaired.replace(/,(\s*[\]}])/g, "$1");
  repaired = repaired.replace(/}(\s*){/g, "},$1{");

  let openBraces = 0;
  let openBrackets = 0;

  for (const ch of repaired) {
    if (ch === "{") openBraces++;
    if (ch === "}") openBraces--;
    if (ch === "[") openBrackets++;
    if (ch === "]") openBrackets--;
  }

  while (openBrackets > 0) {
    repaired += "]";
    openBrackets--;
  }
  while (openBraces > 0) {
    repaired += "}";
    openBraces--;
  }

  return repaired;
};

const extractJsonObject = (text: string): string | null => {
  const cleaned = escapeControlChars(cleanModelText(text));

  const firstBracket = cleaned.indexOf("[");
  const lastBracket = cleaned.lastIndexOf("]");
  if (firstBracket !== -1 && lastBracket !== -1 && lastBracket > firstBracket) {
    const firstBrace = cleaned.indexOf("{");
    if (firstBrace === -1 || firstBracket < firstBrace) {
      return cleaned.slice(firstBracket, lastBracket + 1);
    }
  }

  const first = cleaned.indexOf("{");
  const last = cleaned.lastIndexOf("}");
  if (first !== -1 && last !== -1 && last > first) {
    return cleaned.slice(first, last + 1);
  }

  const m = cleaned.match(/[\[{][\s\S]*[\]}]/);
  return m?.[0] ?? null;
};

const parseModelJson = <T,>(raw: string): T => {
  const candidate = extractJsonObject(raw);
  if (!candidate) {
    throw new Error("Failed to extract JSON from AI response");
  }

  try {
    return JSON.parse(candidate) as T;
  } catch {
    // continue
  }

  const repaired = repairJSON(candidate);
  try {
    return JSON.parse(repaired) as T;
  } catch {
    // continue
  }

  let working = candidate;
  for (let i = 0; i < 40; i++) {
    const lastBoundary = Math.max(working.lastIndexOf("}"), working.lastIndexOf("]"));
    if (lastBoundary <= 0) break;
    working = working.slice(0, lastBoundary + 1);

    try {
      return JSON.parse(repairJSON(working)) as T;
    } catch {
      // keep trying
    }
  }

  throw new Error("Failed to parse AI response as JSON. The AI response was truncated or malformed.");
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const {
      prompt,
      projectTitle,
      guideName,
      students,
      branch,
      projectType,
      mode = "full",
      existingChapters = [],
    } = await req.json();

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    console.log("Generating report content for:", projectTitle, "mode:", mode);

    const callGemini = async (
      messages: Array<{ role: string; content: string }>,
      _maxTokens: number,
      temperature: number = 0.3,
    ) => {
      const body = {
        model: "google/gemini-2.5-flash",
        messages,
        temperature,
      };

      const maxRetries = 4;
      for (let attempt = 0; attempt < maxRetries; attempt++) {
        const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${LOVABLE_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(body),
        });

        if (res.status === 429) {
          const retryAfter = res.headers.get("Retry-After");
          let parsedDelay = retryAfter ? parseInt(retryAfter, 10) * 1000 : NaN;
          if (Number.isNaN(parsedDelay) && retryAfter) {
            const retryDate = new Date(retryAfter);
            if (!isNaN(retryDate.getTime())) {
              parsedDelay = retryDate.getTime() - Date.now();
            }
          }
          const waitMs = parsedDelay > 0
            ? parsedDelay
            : Math.pow(2, attempt) * 2000 + Math.random() * 1500;
          console.warn(`Rate limited (attempt ${attempt + 1}/${maxRetries}), waiting ${Math.round(waitMs)}ms...`);
          await res.text();
          await new Promise((r) => setTimeout(r, waitMs));
          continue;
        }

        if (!res.ok) {
          const errorText = await res.text();
          console.error("Text generation error:", res.status, errorText);
          throw new AIHttpError(res.status, errorText);
        }

        const data = await res.json();
        const text = data.choices?.[0]?.message?.content || "";
        console.log("Raw AI response length:", text.length);
        return text;
      }

      throw new AIHttpError(429, "Rate limit exceeded after multiple retries");
    };

    const parseWithRepair = async <T,>(raw: string, schemaHint: string): Promise<T> => {
      try {
        return parseModelJson<T>(raw);
      } catch (firstError) {
        console.warn("Primary JSON parse failed. Attempting AI JSON repair...");

        const repairedRaw = await callGemini(
          [
            {
              role: "system",
              content:
                "You are a strict JSON repair assistant. Return ONLY valid JSON. No markdown, no commentary.",
            },
            {
              role: "user",
              content: `Convert this malformed/truncated JSON-like content into valid JSON matching this schema:\n${schemaHint}\n\nInput:\n${raw}`,
            },
          ],
          2600,
          0.1,
        );

        return parseModelJson<T>(repairedRaw);
      }
    };

    const shortTitle = (projectTitle || "Project").replace(/system|application|platform|software/gi, "").trim() || "Project";

    const fallbackBlueprints = (): ChapterBlueprint[] => [
      {
        number: 1,
        title: `Introduction to ${shortTitle}`,
        sections: [
          { number: "1.1", heading: "Project Overview" },
          { number: "1.2", heading: "Problem Statement" },
          { number: "1.3", heading: "Objectives" },
        ],
      },
      {
        number: 2,
        title: "Literature Survey",
        sections: [
          { number: "2.1", heading: "Existing Solutions" },
          { number: "2.2", heading: "Related Technologies" },
          { number: "2.3", heading: "Comparative Analysis" },
        ],
      },
      {
        number: 3,
        title: `${shortTitle} Requirements`,
        sections: [
          { number: "3.1", heading: "Functional Requirements" },
          { number: "3.2", heading: "Non-Functional Requirements" },
          { number: "3.3", heading: "Feasibility Study" },
        ],
      },
      {
        number: 4,
        title: `${shortTitle} Design`,
        sections: [
          { number: "4.1", heading: "Architecture Design" },
          { number: "4.2", heading: "Module Design" },
          { number: "4.3", heading: "Database Design" },
        ],
      },
      {
        number: 5,
        title: `${shortTitle} Implementation`,
        sections: [
          { number: "5.1", heading: "Development Environment" },
          { number: "5.2", heading: "Core Modules" },
          { number: "5.3", heading: "Integration" },
        ],
      },
      {
        number: 6,
        title: "Testing & Results",
        sections: [
          { number: "6.1", heading: "Test Strategy" },
          { number: "6.2", heading: "Test Cases" },
          { number: "6.3", heading: "Results & Analysis" },
        ],
      },
      {
        number: 7,
        title: "Conclusion & Future Scope",
        sections: [
          { number: "7.1", heading: "Conclusion" },
          { number: "7.2", heading: "Future Enhancements" },
        ],
      },
    ];

    const baseSystemPrompt = `You are an expert academic report writer for engineering college projects in India.

Rules:
- Output MUST be valid JSON only (no markdown, no code blocks).
- In ALL string values, represent new lines as \\n and do not include raw control characters.
- Do not use unescaped double quotes inside strings.
- Keep sections concise to avoid truncation.`;

    const projectContext = `Project Title: ${projectTitle}
Project Type: ${projectType}
Branch: ${branch}
Guide: ${guideName}
Students: ${students?.map((s: { name: string }) => s.name).join(", ") || "Not specified"}

Project Description:
${prompt}`;

    let abstractAck: { abstract: string; acknowledgement: string };

    if (mode === "remaining") {
      abstractAck = { abstract: "", acknowledgement: "" };
      console.log("Skipping abstract/ack for remaining mode");
    } else {
      const abstractAckRaw = await callGemini(
        [
          { role: "system", content: baseSystemPrompt },
          {
            role: "user",
            content: `${projectContext}

Generate ONLY the Abstract and Acknowledgement.
- Abstract: 120-160 words total, split into 2-3 short paragraphs. Use \\n\\n to separate each paragraph. Keep it concise - cover problem statement, approach, and outcome briefly.
- Acknowledgement: thank guide, HOD, Principal, department, and parents. Split into multiple paragraphs using \\n\\n.

Respond ONLY with JSON:
{
  "abstract": "paragraph1\\n\\nparagraph2\\n\\nparagraph3\\n\\nparagraph4",
  "acknowledgement": "paragraph1\\n\\nparagraph2\\n\\nparagraph3"
}`,
          },
        ],
        2200,
      );

      try {
        abstractAck = await parseWithRepair<{ abstract: string; acknowledgement: string }>(
          abstractAckRaw,
          `{"abstract":"string","acknowledgement":"string"}`,
        );
      } catch (e) {
        console.warn("Abstract/Acknowledgement parse failed, using fallback text.", e);
        abstractAck = {
          abstract:
            "This project report presents the problem definition, proposed solution, design approach, implementation details, testing outcomes, and future scope in a structured academic format. The work focuses on practical feasibility, reliability, and performance while following standard engineering documentation practices.",
          acknowledgement:
            "We sincerely express our gratitude to our project guide, Head of Department, Principal, faculty members, and parents for their constant guidance, encouragement, and support throughout the completion of this project.",
        };
      }
    }

    const promptHash = prompt ? prompt.split("").reduce((a: number, c: string) => ((a << 5) - a + c.charCodeAt(0)) | 0, 0) : Date.now();
    const variationSeed = Math.abs(promptHash % 1000);

    const existingContext = (mode === "remaining" && Array.isArray(existingChapters) && existingChapters.length > 0)
      ? `\n\nIMPORTANT — The user has already seen these EXACT Chapter 1-3 titles in the preview. You MUST keep them BIT-FOR-BIT identical in your output, and ONLY invent Chapters 4-7 that thematically continue from them:\n${existingChapters
          .map((c: ChapterBlueprint) => `Ch ${c.number}: ${c.title}\n${c.sections.map((s) => `  ${s.number} ${s.heading}`).join("\n")}`)
          .join("\n")}\n`
      : "";

    const blueprintsRaw = await callGemini(
      [
        { role: "system", content: `${baseSystemPrompt}

You generate UNIQUE, project-specific Indian engineering college report chapter structures. NEVER reuse the same titles across different projects — every title MUST reflect the actual domain, technology, and goal described in the user's prompt.` },
        {
          role: "user",
          content: `${projectContext}

Variation Seed: ${variationSeed}${existingContext}

Generate a 7-chapter structure for THIS specific project. The chapter and section titles must be derived from the user's prompt — NOT from a template.

HARD RULES:
- Output EXACTLY 7 chapters.
- Every chapter title MUST be 2-5 words and MUST contain a noun, module, or concept that is unique to "${projectTitle}" or the prompt content. Generic words alone ("System Design", "Implementation", "Testing & Results", "Conclusion & Future Scope", "Literature Survey") are FORBIDDEN as standalone titles.
- Do NOT simply prepend the project name to a generic word (e.g. "${shortTitle} Design" or "${shortTitle} Implementation" are BANNED — they look fake). Instead use the actual module/feature name from the prompt (e.g. "Booking Engine Design", "Recommendation Model", "Catalog Search API").
- Chapter 1 must introduce the specific domain (not a generic "Introduction").
- Chapter 2 must reference the specific tech/related-work area from the prompt (not just "Literature Survey").
- Chapter 7 must include the word "Conclusion" but should still hint at this project's scope.
- Each chapter: 2 to 4 short, project-specific section headings. Section numbering: 1.1, 1.2... etc.

Project-specific GOOD examples for a "Food Ordering App":
Ch1 "Food Delivery Landscape", Ch2 "Existing Ordering Apps", Ch3 "App Requirements", Ch4 "Order Flow Design", Ch5 "Payment Integration", Ch6 "Cart & Checkout Testing", Ch7 "Conclusion & Roadmap"

BANNED outputs (do NOT generate these):
"System Design", "Implementation", "Testing & Results", "Conclusion & Future Scope", "Literature Survey", "${shortTitle} Design", "${shortTitle} Implementation", "${shortTitle} Testing"

Respond ONLY with JSON array:
[
  { "number": 1, "title": "...", "sections": [{ "number": "1.1", "heading": "..." }] }
]`,
        },
      ],
      3500,
      0.9,
    );

    let allBlueprints: ChapterBlueprint[];
    try {
      allBlueprints = await parseWithRepair<ChapterBlueprint[]>(
        blueprintsRaw,
        `[{"number":1,"title":"string","sections":[{"number":"1.1","heading":"string"}]}]`,
      );
    } catch (e) {
      console.warn("Blueprint parse failed, using fallback blueprint structure.", e);
      allBlueprints = fallbackBlueprints();
    }

    if (!Array.isArray(allBlueprints) || allBlueprints.length === 0) {
      allBlueprints = fallbackBlueprints();
    }

    // In "remaining" mode, force Ch1-3 to match what the user already saw in preview
    if (mode === "remaining" && Array.isArray(existingChapters) && existingChapters.length > 0) {
      const merged: ChapterBlueprint[] = [];
      for (let n = 1; n <= 7; n++) {
        const fromExisting = existingChapters.find((c: ChapterBlueprint) => c.number === n);
        const fromAI = allBlueprints.find((c) => c.number === n);
        if (n <= 3 && fromExisting) {
          merged.push(fromExisting);
        } else if (fromAI) {
          merged.push(fromAI);
        } else if (fromExisting) {
          merged.push(fromExisting);
        }
      }
      if (merged.length > 0) allBlueprints = merged;
    }



    let blueprints: ChapterBlueprint[];
    if (mode === "preview") {
      blueprints = allBlueprints.filter((ch) => ch.number <= 3);
    } else if (mode === "remaining") {
      blueprints = allBlueprints.filter((ch) => ch.number >= 4);
    } else {
      blueprints = allBlueprints;
    }

    const chapterResults: Array<{
      number: number;
      title: string;
      sections: Array<{ number: string; heading: string; content: string }>;
    }> = [];

    for (let chIdx = 0; chIdx < blueprints.length; chIdx++) {
      const ch = blueprints[chIdx];
      console.log(`Generating chapter ${ch.number}: ${ch.title}`);

      const sectionList = ch.sections.map((s) => `- ${s.number} ${s.heading}`).join("\n");

      const promptForChapter = `${projectContext}

Generate Chapter ${ch.number}: ${ch.title}

Requirements:
- Write each section 180-260 words.
- Use formal academic tone.
- CRITICAL: NEVER write a section as one huge paragraph. Break EVERY section into 2-3 SHORT paragraphs separated by \\n\\n (double newline).
- CRITICAL: Each section MUST include at least one bulleted list using "• " prefix. List key features, objectives, components, advantages, etc.
- Structure each section as: opening paragraph (3-4 sentences) \\n\\n bullet list (4-8 items) \\n\\n closing paragraph (2-3 sentences).
- Use \\n for line breaks between bullet points within the list.
- Keep JSON valid exactly as requested.

Use EXACTLY these sections:
${sectionList}

Respond ONLY with JSON:
{
  "number": ${ch.number},
  "title": "${ch.title}",
  "sections": [
    { "number": "${ch.sections[0].number}", "heading": "${ch.sections[0].heading}", "content": "..." }
  ]
}`;

      const raw = await callGemini(
        [
          { role: "system", content: baseSystemPrompt },
          { role: "user", content: promptForChapter },
        ],
        5200,
      );

      try {
        const parsed = await parseWithRepair<{
          number: number;
          title: string;
          sections: Array<{ number: string; heading: string; content: string }>;
        }>(
          raw,
          `{"number":${ch.number},"title":"${ch.title}","sections":[{"number":"${ch.sections[0]?.number || `${ch.number}.1`}","heading":"string","content":"string"}]}`,
        );
        parsed.title = ch.title;
        chapterResults.push(parsed);
      } catch (e) {
        console.warn(`Chapter ${ch.number} parse failed; retrying with shorter output...`, e);

        const retryPrompt = promptForChapter.replace(
          "- Write each section 180-260 words.",
          "- Write each section 120-160 words.",
        );

        try {
          const retryRaw = await callGemini(
            [
              { role: "system", content: baseSystemPrompt },
              { role: "user", content: retryPrompt },
            ],
            3800,
          );

          const parsedRetry = await parseWithRepair<{
            number: number;
            title: string;
            sections: Array<{ number: string; heading: string; content: string }>;
          }>(
            retryRaw,
            `{"number":${ch.number},"title":"${ch.title}","sections":[{"number":"${ch.sections[0]?.number || `${ch.number}.1`}","heading":"string","content":"string"}]}`,
          );

          parsedRetry.title = ch.title;
          chapterResults.push(parsedRetry);
        } catch (retryError) {
          console.warn(`Chapter ${ch.number} retry also failed. Using deterministic fallback chapter content.`, retryError);

          chapterResults.push({
            number: ch.number,
            title: ch.title,
            sections: ch.sections.map((s) => ({
              number: s.number,
              heading: s.heading,
              content:
                `This section presents the core discussion for ${s.heading} in the context of ${projectTitle}.\n\n` +
                `• Problem context and requirement analysis\n` +
                `• Solution approach and design decisions\n` +
                `• Tools, technologies, and implementation choices\n` +
                `• Testing observations and key outcomes\n\n` +
                `Overall, the section highlights practical execution details and academic justification for the proposed work.`,
            })),
          });
        }
      }
    }

    const idBase = `ai-${Date.now()}`;

    const processedChapters: Chapter[] = chapterResults.map((chapter, chIdx) => ({
      id: `${idBase}-${chIdx}`,
      number: chapter.number,
      title: chapter.title,
      sections: (chapter.sections || []).map((section, secIdx) => ({
        id: `${idBase}-${chIdx}-${secIdx}`,
        number: section.number,
        heading: section.heading,
        content: section.content,
        images: [],
      })),
    }));

    const responsePayload: GeneratedContent = {
      abstract: abstractAck.abstract,
      acknowledgement: abstractAck.acknowledgement,
      chapters: processedChapters,
    };

    console.log("Successfully generated content with", processedChapters.length, "chapters");

    return new Response(JSON.stringify(responsePayload), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error in generate-report-content:", error);

    if (error instanceof AIHttpError) {
      if (error.status === 429) {
        return new Response(
          JSON.stringify({
            error: "Rate limit exceeded. Please try again in a moment.",
          }),
          {
            status: 429,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          },
        );
      }

      if (error.status === 402 || error.status === 403) {
        return new Response(
          JSON.stringify({
            error: "AI credits exhausted. Please add credits to continue.",
          }),
          {
            status: 402,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          },
        );
      }

      return new Response(
        JSON.stringify({
          error: "AI generation failed. Please try again with a slightly shorter project description.",
        }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : "Unknown error occurred",
      }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});
