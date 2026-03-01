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

  // Prefer a JSON object wrapped in {...}. If the model printed extra text, try to isolate it.
  const first = cleaned.indexOf("{");
  const last = cleaned.lastIndexOf("}");
  if (first !== -1 && last !== -1 && last > first) {
    return cleaned.slice(first, last + 1);
  }

  // Fallback: regex extraction.
  const m = cleaned.match(/\{[\s\S]*\}/);
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
      console.log("Raw AI response length:", text.length);
      return text;
    };

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

      abstractAck = parseModelJson<{ abstract: string; acknowledgement: string }>(abstractAckRaw);
    }

    // 2) Generate custom chapter blueprints based on the project description
    const blueprintsRaw = await callLovableChat(
      [
        { role: "system", content: baseSystemPrompt },
        {
          role: "user",
          content: `${projectContext}

CRITICAL: Generate a HIGHLY UNIQUE 7-chapter structure specifically tailored EXACTLY to the provided Project Description. 
Do NOT use generic templates. Every time you generate a structure, it must strictly reflect the unique nuances of the prompt. If multiple students submit similar topics, emphasize different angles (architecture, unique algorithms, specific use-cases, advanced features) so no two reports are identical.

Rules:
- MUST be exactly 7 chapters.
- Chapter 1 is an Introduction but must be tailored to the exact domain of the project description.
- Chapter 7 is Conclusion & Future Scope.
- Chapters 2-6 MUST be highly creative, uniquely named, and deeply technical based entirely on the user's prompt (e.g., instead of "System Design", use "Microservices Architecture for Hospital Management" or "Data Flow Pipeline for Stock Prediction").
- DO NOT use the exact same section titles that are typically generated. Be highly specific to the technologies, features, and methodologies mentioned in the Project Description.
- Each chapter must have 2 to 4 sections.
- Ensure the numbering is sequential (e.g., Chapter 1 has sections 1.1, 1.2; Chapter 2 has 2.1, 2.2).

Respond ONLY with this JSON format:
[
  {
    "number": 1,
    "title": "CUSTOM CHAPTER TITLE",
    "sections": [
      { "number": "1.1", "heading": "Custom Section Heading" },
      { "number": "1.2", "heading": "Custom Section Heading" }
    ]
  }
]`,
        },
      ],
      1500,
      0.7,
    );

    const allBlueprints = parseModelJson<ChapterBlueprint[]>(blueprintsRaw);

    if (!Array.isArray(allBlueprints) || allBlueprints.length === 0) {
      throw new Error("Failed to generate valid custom blueprints array from AI.");
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
- CRITICAL FORMATTING COMMAND: NEVER write a section as one single huge block of text. You MUST break every section into at least 2 or 3 distinct, short paragraphs by explicitly inserting the literal HTML tags <br><br> between them.
- CRITICAL FORMATTING COMMAND: For the very first section (e.g. 1.1 Introduction), ensure it contains at least 3 distinct paragraphs separated by <br><br>, and include a bulleted list (using "• ") to visually fill the first page.
- Liberally use bullet points (starting with "• ") when listing features, objectives, or key points.
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
        4200,
      );

      try {
        const parsed = parseModelJson<{
          number: number;
          title: string;
          sections: Array<{ number: string; heading: string; content: string }>;
        }>(raw);
        chapterResults.push(parsed);
      } catch (e) {
        console.warn(`Chapter ${ch.number} parse failed; retrying with shorter output...`, e);

        const retryPrompt = promptForChapter.replace(
          "- Write each section 180-260 words.",
          "- Write each section 120-160 words.",
        );

        const retryRaw = await callLovableChat(
          [
            { role: "system", content: baseSystemPrompt },
            { role: "user", content: retryPrompt },
          ],
          3200,
        );

        const parsedRetry = parseModelJson<{
          number: number;
          title: string;
          sections: Array<{ number: string; heading: string; content: string }>;
        }>(retryRaw);

        chapterResults.push(parsedRetry);
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
