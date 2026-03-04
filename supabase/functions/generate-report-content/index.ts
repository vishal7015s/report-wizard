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

// Escapes ASCII control chars that can break JSON parsing when the model outputs them inside strings.
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

  // Remove any trailing content after the last closing brace.
  const lastBrace = repaired.lastIndexOf("}");
  if (lastBrace !== -1 && lastBrace < repaired.length - 1) {
    repaired = repaired.substring(0, lastBrace + 1);
  }

  // Close an unterminated string if the response was cut off.
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

  // Fix missing commas between adjacent string tokens (common: "..."\n"nextKey": ...)
  repaired = repaired.replace(/"(\s*)(?=")/g, '",$1');

  // Fix trailing commas before closing brackets.
  repaired = repaired.replace(/,(\s*[\]}])/g, "$1");

  // Fix missing commas between object literals in arrays.
  repaired = repaired.replace(/}(\s*){/g, "},$1{");

  // Close unbalanced braces/brackets.
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

  // Try to find a JSON array first [...]
  const firstBracket = cleaned.indexOf("[");
  const lastBracket = cleaned.lastIndexOf("]");
  if (firstBracket !== -1 && lastBracket !== -1 && lastBracket > firstBracket) {
    const firstBrace = cleaned.indexOf("{");
    if (firstBrace === -1 || firstBracket < firstBrace) {
      return cleaned.slice(firstBracket, lastBracket + 1);
    }
  }

  // Then try JSON object {...}
  const first = cleaned.indexOf("{");
  const last = cleaned.lastIndexOf("}");
  if (first !== -1 && last !== -1 && last > first) {
    return cleaned.slice(first, last + 1);
  }

  // Fallback: regex extraction.
  const m = cleaned.match(/[\[{][\s\S]*[\]}]/);
  return m?.[0] ?? null;
};

const parseModelJson = <T,>(raw: string): T => {
  const candidate = extractJsonObject(raw);
  if (!candidate) {
    throw new Error("Failed to extract JSON from AI response");
  }

  // 1) Direct parse
  try {
    return JSON.parse(candidate) as T;
  } catch {
    // continue
  }

  // 2) Repair and parse
  const repaired = repairJSON(candidate);
  try {
    return JSON.parse(repaired) as T;
  } catch {
    // continue
  }

  // 3) Progressive truncation to the last plausible boundary (handles hard truncation mid-output)
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

    const callLovableChat = async (
      messages: Array<{ role: string; content: string }>,
      maxTokens: number,
      temperature: number = 0.3,
    ) => {
      const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${LOVABLE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemini-2.5-flash",
          temperature,
          max_tokens: maxTokens,
          messages,
        }),
      });

      if (!res.ok) {
        const errorText = await res.text();
        console.error("Text generation error:", res.status, errorText);
        throw new AIHttpError(res.status, errorText);
      }

      const data = await res.json();
      const text = data.choices?.[0]?.message?.content || "";
      const finishReason = data.choices?.[0]?.finish_reason;
      console.log("Raw AI response length:", text.length, "finish_reason:", finishReason);
      return text;
    };

    const parseWithRepair = async <T,>(raw: string, schemaHint: string): Promise<T> => {
      try {
        return parseModelJson<T>(raw);
      } catch (firstError) {
        console.warn("Primary JSON parse failed. Attempting AI JSON repair...");

        const repairedRaw = await callLovableChat(
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

    const fallbackBlueprints = (): ChapterBlueprint[] => [
      {
        number: 1,
        title: "Introduction",
        sections: [
          { number: "1.1", heading: "Project Overview" },
          { number: "1.2", heading: "Problem Statement" },
          { number: "1.3", heading: "Objectives" },
        ],
      },
      {
        number: 2,
        title: "Existing System",
        sections: [
          { number: "2.1", heading: "Current Workflow" },
          { number: "2.2", heading: "Limitations" },
          { number: "2.3", heading: "Need of Solution" },
        ],
      },
      {
        number: 3,
        title: "Proposed System",
        sections: [
          { number: "3.1", heading: "Solution Overview" },
          { number: "3.2", heading: "Key Features" },
          { number: "3.3", heading: "Advantages" },
        ],
      },
      {
        number: 4,
        title: "Technology Stack",
        sections: [
          { number: "4.1", heading: "Frontend Tools" },
          { number: "4.2", heading: "Backend Tools" },
          { number: "4.3", heading: "Database and APIs" },
        ],
      },
      {
        number: 5,
        title: "System Design",
        sections: [
          { number: "5.1", heading: "Architecture" },
          { number: "5.2", heading: "Module Design" },
          { number: "5.3", heading: "Data Flow" },
        ],
      },
      {
        number: 6,
        title: "Implementation and Testing",
        sections: [
          { number: "6.1", heading: "Implementation Steps" },
          { number: "6.2", heading: "Test Cases" },
          { number: "6.3", heading: "Results" },
        ],
      },
      {
        number: 7,
        title: "Conclusion and Future Scope",
        sections: [
          { number: "7.1", heading: "Conclusion" },
          { number: "7.2", heading: "Future Scope" },
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

    // For "remaining" mode, skip abstract/ack generation - reuse existing
    let abstractAck: { abstract: string; acknowledgement: string };

    if (mode === "remaining") {
      abstractAck = { abstract: "", acknowledgement: "" };
      console.log("Skipping abstract/ack for remaining mode");
    } else {
      // 1) Generate abstract + acknowledgement (small payload)
      const abstractAckRaw = await callLovableChat(
        [
          { role: "system", content: baseSystemPrompt },
          {
            role: "user",
            content: `${projectContext}

Generate ONLY the Abstract and Acknowledgement.
- Abstract: 200-260 words.
- Acknowledgement: thank guide, HOD, Principal, department, and parents.

Respond ONLY with JSON:
{
  "abstract": "...",
  "acknowledgement": "..."
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

    // 2) Generate custom chapter blueprints based on the project description
    // Generate a unique seed from the prompt to force variation across similar topics
    const promptHash = prompt ? prompt.split("").reduce((a: number, c: string) => ((a << 5) - a + c.charCodeAt(0)) | 0, 0) : Date.now();
    const variationSeed = Math.abs(promptHash % 1000);

    const blueprintsRaw = await callLovableChat(
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
- Use practical, standard academic phrasing that actual students use.

GOOD examples of chapter titles:
"Introduction", "Problem Statement & Objectives", "Technology Stack", "System Design", "Implementation", "Testing & Results", "Conclusion & Future Scope"

GOOD examples of section titles:
"Background", "Problem Definition", "Objectives", "Scope of Project", "Frontend Development", "Backend Architecture", "Database Design", "Unit Testing", "Performance Analysis", "Future Enhancements"

BAD examples (TOO LONG - NEVER do this):
"Natural Language Understanding Pipeline for Medical Queries" ❌
"Secure Payment Gateway Integration & Transaction Flow" ❌
"Real-Time Availability Dashboard with WebSocket Communication" ❌

Rules:
- Exactly 7 chapters.
- Chapter 1: Introduction (can add domain context, e.g. "Introduction to ${projectTitle}" but keep it short).
- Chapter 7: Conclusion & Future Scope.
- Chapters 2-6: Cover problem statement, tech stack, design, implementation, testing etc. relevant to the project.
- Each chapter: 2 to 4 sections with short headings.
- Section numbering: 1.1, 1.2... 2.1, 2.2... etc.
- Make chapter names SPECIFIC to this project but still SHORT.

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
      0.7,
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

    // Filter blueprints based on mode
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

      const raw = await callLovableChat(
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
        chapterResults.push(parsed);
      } catch (e) {
        console.warn(`Chapter ${ch.number} parse failed; retrying with shorter output...`, e);

        const retryPrompt = promptForChapter.replace(
          "- Write each section 180-260 words.",
          "- Write each section 120-160 words.",
        );

        try {
          const retryRaw = await callLovableChat(
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

      if (error.status === 402) {
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
