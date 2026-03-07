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
      "er-diagram": `ER diagram for "${projectContext}". Entities as rectangles, attributes as ovals, relationships as diamonds. Underline primary keys. Black on white, clean technical style.`,
      "flowchart": `Flowchart for "${projectContext}". Oval=start/end, rectangle=process, diamond=decision. Clear arrows. Black on white.`,
      "architecture": `System architecture diagram for "${projectContext}". Boxes=components, cylinders=databases, arrows=data flow. Black on white.`,
      "dfd": `Data Flow Diagram for "${projectContext}". Circles=processes, rectangles=entities, open rectangles=data stores. Arrows for flow. Black on white.`,
      "use-case": `Use Case Diagram for "${projectContext}". Stick figures=actors, ovals=use cases inside system boundary. Black on white.`,
    };

    const prompt = diagramPrompts[diagramType] || `Technical diagram for "${projectContext}". Clean black on white.`;

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
