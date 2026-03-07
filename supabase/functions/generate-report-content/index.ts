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

    const GEMINI_API_KEY = Deno.env.get("GEMINI_API_KEY");
    if (!GEMINI_API_KEY) {
      throw new Error("GEMINI_API_KEY is not configured");
    }

    console.log("Generating report content for:", projectTitle, "mode:", mode);

    const callGemini = async (
      messages: Array<{ role: string; content: string }>,
      _maxTokens: number,
      temperature: number = 0.3,
    ) => {
      // Convert messages to Gemini format
      const systemMessage = messages.find(m => m.role === "system");
      const userMessages = messages.filter(m => m.role !== "system");

      const contents = userMessages.map(m => ({
        role: m.role === "assistant" ? "model" : "user",
        parts: [{ text: m.content }],
      }));

      const body: Record<string, unknown> = {
        contents,
        generationConfig: {
          temperature,
          maxOutputTokens: _maxTokens,
        },
      };

      if (systemMessage) {
        body.systemInstruction = { parts: [{ text: systemMessage.content }] };
      }

      const maxRetries = 4;
      for (let attempt = 0; attempt < maxRetries; attempt++) {
        const res = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
          },
        );

        if (res.status === 429) {
          const retryAfter = res.headers.get("Retry-After");
          const waitMs = retryAfter
            ? parseInt(retryAfter, 10) * 1000
            : Math.pow(2, attempt) * 2000 + Math.random() * 1000;
          console.warn(`Rate limited (attempt ${attempt + 1}/${maxRetries}), waiting ${Math.round(waitMs)}ms...`);
          await res.text(); // consume body
          await new Promise((r) => setTimeout(r, waitMs));
          continue;
        }

        if (!res.ok) {
          const errorText = await res.text();
          console.error("Text generation error:", res.status, errorText);
          throw new AIHttpError(res.status, errorText);
        }

        const data = await res.json();
        const text = data.candidates?.[0]?.content?.parts?.[0]?.text || "";
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

    const blueprintsRaw = await callGemini(
      [
        { role: "system", content: `${baseSystemPrompt}

You generate realistic Indian engineering college project report chapter structures. Titles must be SHORT (2-5 words max), practical, and similar to what real students write in actual submitted reports.` },
        {
          role: "user",
          content: `${projectContext}

Variation Seed: ${variationSeed}

Generate a 7-chapter structure for this project report. 

CRITICAL RULES FOR TITLES:
- Chapter and section titles must be SHORT (2-5 words). No long sentences.
- Titles must sound like REAL Indian engineering college reports, not AI-generated.
- EVERY chapter title (including Ch 4-7) MUST be SPECIFIC to "${projectTitle}". 
- Do NOT use generic titles like "System Design", "Implementation", "Testing & Results". Instead use project-specific ones.

GOOD examples for a "Library Management System":
Ch4: "Library Module Design", Ch5: "Catalog Implementation", Ch6: "Search Testing", Ch7: "Conclusion & Scope"

GOOD examples for a "Food Ordering App":
Ch4: "Order System Design", Ch5: "Payment Integration", Ch6: "Order Flow Testing", Ch7: "Conclusion & Scope"

BAD examples (TOO GENERIC - NEVER do this for Ch 4-6):
"System Design" ❌, "Implementation" ❌, "Testing & Results" ❌

BAD examples (TOO LONG - NEVER do this):
"Natural Language Understanding Pipeline for Medical Queries" ❌

Rules:
- Exactly 7 chapters.
- Chapter 1: Introduction (can add domain context, keep short).
- Chapter 7: Must include "Conclusion" but can be project-specific.
- Chapters 2-6: Cover literature, requirements, design, implementation, testing — ALL with project-specific naming.
- Each chapter: 2 to 4 sections with short, project-specific headings.
- Section numbering: 1.1, 1.2... 2.1, 2.2... etc.

Respond ONLY with JSON array:
[
  {
    "number": 1,
    "title": "INTRODUCTION",
    "sections": [
      { "number": "1.1", "heading": "Background" },
      { "number": "1.2", "heading": "Problem Statement" }
    ]
  }
]`,
        },
      ],
      3500,
      0.85,
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

    const genericWords = [
      "system design", "implementation", "testing", "results",
      "conclusion", "future scope", "development", "coding",
    ];

    const projectKeyword = shortTitle.split(/\s+/).slice(0, 3).join(" ");
    console.log("Post-processing blueprints. Project keyword:", projectKeyword);

    allBlueprints = allBlueprints.map((ch) => {
      const titleLower = ch.title.toLowerCase().trim();
      const projectWords = projectKeyword.toLowerCase().split(/\s+/);
      const hasProjectWord = projectWords.some((pw: string) => pw.length > 2 && titleLower.includes(pw));
      const hasGenericWord = genericWords.some(g => titleLower.includes(g));

      console.log(`Ch ${ch.number}: "${ch.title}" hasProject=${hasProjectWord} hasGeneric=${hasGenericWord}`);

      if (!hasProjectWord && hasGenericWord && ch.number >= 4 && ch.number <= 6) {
        const newTitle = `${projectKeyword} ${ch.title}`;
        console.log(`Renamed: "${ch.title}" -> "${newTitle}"`);
        return { ...ch, title: newTitle };
      }
      return ch;
    });

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

    for (const ch of blueprints) {
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
