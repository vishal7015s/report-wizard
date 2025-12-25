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
    
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    console.log("Generating diagram:", diagramType);

    const diagramPrompts: Record<string, string> = {
      "er-diagram": `Create a professional Entity Relationship (ER) diagram for: ${projectContext}. 
        Show entities as rectangles, attributes as ovals, relationships as diamonds. 
        Use clear lines connecting entities. Include primary keys marked with underlines.
        Professional technical diagram style, clean white background, black lines and text.`,
      
      "flowchart": `Create a professional flowchart diagram for: ${projectContext}. 
        Use standard flowchart symbols: oval for start/end, rectangle for process, diamond for decision.
        Show clear flow arrows. Professional technical diagram style, clean white background.`,
      
      "architecture": `Create a professional system architecture diagram for: ${projectContext}. 
        Show components, modules, databases, APIs, and their connections.
        Use boxes for components, cylinders for databases, arrows for data flow.
        Professional technical diagram style, clean white background.`,
      
      "dfd": `Create a professional Data Flow Diagram (DFD) for: ${projectContext}. 
        Show processes as circles, external entities as rectangles, data stores as open-ended rectangles.
        Use arrows to show data flow between components.
        Professional technical diagram style, clean white background.`,
      
      "use-case": `Create a professional Use Case Diagram for: ${projectContext}. 
        Show actors as stick figures, use cases as ovals inside a system boundary rectangle.
        Use lines to connect actors to their use cases.
        Professional technical diagram style, clean white background.`,
    };

    const prompt = diagramPrompts[diagramType] || 
      `Create a professional technical diagram for: ${projectContext}. Professional style, clean white background.`;

    console.log("Calling Lovable AI for image generation...");

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash-image-preview",
        messages: [
          {
            role: "user",
            content: prompt
          }
        ],
        modalities: ["image", "text"]
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Image generation error:", response.status, errorText);
      
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "AI credits exhausted. Please add credits to continue." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      throw new Error(`Image generation failed: ${errorText}`);
    }

    const data = await response.json();
    const imageUrl = data.choices?.[0]?.message?.images?.[0]?.image_url?.url;
    
    if (!imageUrl) {
      console.error("No image in response:", JSON.stringify(data));
      throw new Error("No image generated");
    }

    console.log("Successfully generated diagram");

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
