import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { diagramType, projectContext } = await req.json();

    const GEMINI_API_KEY = Deno.env.get("GEMINI_API_KEY");
    if (!GEMINI_API_KEY) {
      throw new Error("GEMINI_API_KEY is not configured");
    }

    console.log("Generating diagram:", diagramType);

    const diagramPrompts: Record<string, string> = {
      "er-diagram": `Create a clean, professional ER diagram for a "${projectContext}" system. Show entities as rectangles, attributes as ovals connected to entities, and relationships as diamonds between entities. Underline primary key attributes. Use black lines on white background. Include at least 4-5 main entities with their key attributes and relationships clearly labeled.`,
      "flowchart": `Create a clean, professional flowchart for "${projectContext}". Use oval shapes for start/end, rectangles for processes, and diamonds for decisions. Draw arrows showing flow direction. Black on white background. Show the complete workflow from start to end with at least 8-10 steps.`,
      "architecture": `Create a clean system architecture diagram for "${projectContext}". Show components as labeled boxes, databases as cylinders, and use arrows to show data flow. Use black on white background. Include frontend, backend, database layers clearly separated and labeled.`,
      "dfd": `Create a clean Data Flow Diagram (Level 1) for "${projectContext}". Use circles for processes, rectangles for external entities, open-ended rectangles for data stores, and arrows for data flows. Label all elements clearly. Black on white background.`,
      "use-case": `Create a clean UML Use Case Diagram for "${projectContext}". Show actors as stick figures on the left, use cases as ovals inside a system boundary rectangle. Draw association lines between actors and use cases. Label all elements. Black on white background. Show at least 2 actors and 6-8 use cases.`,
    };

    const prompt = diagramPrompts[diagramType] || `Create a clean technical diagram for "${projectContext}". Professional style, black on white background, clearly labeled.`;

    console.log("Calling Gemini Imagen API for image generation...");

    // Use Imagen 3 for diagram generation
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/imagen-3.0-generate-002:predict?key=${GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          instances: [{ prompt }],
          parameters: {
            sampleCount: 1,
            aspectRatio: "1:1",
            safetyFilterLevel: "block_few",
            personGeneration: "dont_allow",
          },
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Imagen generation error:", response.status, errorText);

      // Fallback to gemini-2.0-flash-exp for image generation
      console.log("Falling back to Gemini 2.0 Flash image generation...");
      return await generateWithGeminiFlash(prompt, diagramType, GEMINI_API_KEY, corsHeaders);
    }

    const data = await response.json();
    const base64Image = data.predictions?.[0]?.bytesBase64Encoded;

    if (!base64Image) {
      console.error("No image in Imagen response:", JSON.stringify(data));
      // Fallback
      return await generateWithGeminiFlash(prompt, diagramType, GEMINI_API_KEY, corsHeaders);
    }

    const imageUrl = `data:image/png;base64,${base64Image}`;

    console.log("Successfully generated diagram with Imagen 3");

    return new Response(
      JSON.stringify({
        imageUrl,
        caption: `${diagramType.replace(/-/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase())} Diagram`
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("Error in generate-diagram:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error occurred" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});

async function generateWithGeminiFlash(
  prompt: string,
  diagramType: string,
  apiKey: string,
  corsHeaders: Record<string, string>
): Promise<Response> {
  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${apiKey}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{
          parts: [{ text: prompt }]
        }],
        generationConfig: {
          responseModalities: ["IMAGE", "TEXT"],
          responseMimeType: "text/plain",
        },
      }),
    }
  );

  if (!response.ok) {
    const errorText = await response.text();
    console.error("Gemini Flash image generation error:", response.status, errorText);

    if (response.status === 429) {
      return new Response(
        JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }),
        { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    throw new Error(`Image generation failed: ${errorText}`);
  }

  const data = await response.json();

  // Look for inline image data
  const parts = data.candidates?.[0]?.content?.parts || [];
  const imagePart = parts.find((p: { inlineData?: { mimeType: string; data: string } }) => p.inlineData);

  if (!imagePart?.inlineData) {
    console.error("No image in Gemini Flash response:", JSON.stringify(data));
    throw new Error("No image generated");
  }

  const imageUrl = `data:${imagePart.inlineData.mimeType};base64,${imagePart.inlineData.data}`;

  return new Response(
    JSON.stringify({
      imageUrl,
      caption: `${diagramType.replace(/-/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase())} Diagram`
    }),
    { headers: { ...corsHeaders, "Content-Type": "application/json" } }
  );
}
