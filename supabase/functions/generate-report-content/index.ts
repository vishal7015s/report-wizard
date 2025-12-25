import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
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

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { prompt, projectTitle, guideName, students, branch, projectType } = await req.json();
    
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    console.log("Generating report content for:", projectTitle);

    const systemPrompt = `You are an expert academic report writer for engineering college projects in India. 
Generate comprehensive technical project report content in a professional academic style.

Important guidelines:
- Use formal academic language
- Include technical details, methodologies, and implementations
- Use bullet points (•) for lists
- Include specific technical terms relevant to the project domain
- Format content to be suitable for a college project report
- Abstract should be 200-300 words
- Acknowledgement should thank the guide, HOD, Principal, and college
- Each chapter section should be detailed (300-500 words)

The content should be for a ${projectType} project in ${branch} branch.
Project Title: ${projectTitle}
Guide: ${guideName}
Students: ${students?.map((s: {name: string}) => s.name).join(', ') || 'Not specified'}

Generate content for the following structure:
1. Abstract - Brief summary of the project
2. Acknowledgement - Thank guide, HOD, Principal, department, and parents
3. Chapter 1: INTRODUCTION - Project overview, objectives, scope, motivation
4. Chapter 2: LITERATURE SURVEY - Related work, existing systems, comparison
5. Chapter 3: SYSTEM ANALYSIS - Requirements, feasibility, use cases
6. Chapter 4: SYSTEM DESIGN & METHODOLOGY - Architecture, ER diagram description, flowcharts, algorithms
7. Chapter 5: IMPLEMENTATION - Technologies used, modules, code explanations
8. Chapter 6: RESULTS & DISCUSSION - Screenshots descriptions, output analysis
9. Chapter 7: CONCLUSION & FUTURE SCOPE - Summary, future enhancements`;

    const userPrompt = `Generate complete report content for this project:

${prompt}

Respond ONLY with valid JSON in this exact format (no markdown, no code blocks):
{
  "abstract": "complete abstract text here",
  "acknowledgement": "complete acknowledgement text here",
  "chapters": [
    {
      "number": 1,
      "title": "INTRODUCTION",
      "sections": [
        {
          "number": "1.1",
          "heading": "Introduction",
          "content": "detailed content here"
        },
        {
          "number": "1.2",
          "heading": "Problem Statement",
          "content": "detailed content here"
        },
        {
          "number": "1.3",
          "heading": "Objectives",
          "content": "detailed content here with bullet points"
        },
        {
          "number": "1.4",
          "heading": "Scope of Project",
          "content": "detailed content here"
        }
      ]
    },
    {
      "number": 2,
      "title": "LITERATURE SURVEY",
      "sections": [
        {
          "number": "2.1",
          "heading": "Literature Review",
          "content": "detailed content here"
        },
        {
          "number": "2.2",
          "heading": "Existing System",
          "content": "detailed content here"
        },
        {
          "number": "2.3",
          "heading": "Proposed System",
          "content": "detailed content here"
        }
      ]
    },
    {
      "number": 3,
      "title": "SYSTEM ANALYSIS",
      "sections": [
        {
          "number": "3.1",
          "heading": "Requirement Analysis",
          "content": "hardware and software requirements"
        },
        {
          "number": "3.2",
          "heading": "Feasibility Study",
          "content": "technical, economic, operational feasibility"
        }
      ]
    },
    {
      "number": 4,
      "title": "SYSTEM DESIGN & METHODOLOGY",
      "sections": [
        {
          "number": "4.1",
          "heading": "System Architecture",
          "content": "detailed architecture description"
        },
        {
          "number": "4.2",
          "heading": "Data Flow Diagram",
          "content": "describe DFD levels"
        },
        {
          "number": "4.3",
          "heading": "ER Diagram",
          "content": "describe entities and relationships"
        },
        {
          "number": "4.4",
          "heading": "Database Design",
          "content": "table structures and relationships"
        }
      ]
    },
    {
      "number": 5,
      "title": "IMPLEMENTATION",
      "sections": [
        {
          "number": "5.1",
          "heading": "Technologies Used",
          "content": "list all technologies with descriptions"
        },
        {
          "number": "5.2",
          "heading": "Module Description",
          "content": "describe each module"
        }
      ]
    },
    {
      "number": 6,
      "title": "RESULTS & DISCUSSION",
      "sections": [
        {
          "number": "6.1",
          "heading": "Testing",
          "content": "testing methodologies and test cases"
        },
        {
          "number": "6.2",
          "heading": "Results",
          "content": "describe expected outputs and screenshots"
        }
      ]
    },
    {
      "number": 7,
      "title": "CONCLUSION & FUTURE SCOPE",
      "sections": [
        {
          "number": "7.1",
          "heading": "Conclusion",
          "content": "project summary and achievements"
        },
        {
          "number": "7.2",
          "heading": "Future Scope",
          "content": "possible enhancements and improvements"
        }
      ]
    }
  ]
}`;

    console.log("Calling Lovable AI for text generation...");
    
    const textResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt }
        ],
      }),
    });

    if (!textResponse.ok) {
      const errorText = await textResponse.text();
      console.error("Text generation error:", textResponse.status, errorText);
      
      if (textResponse.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (textResponse.status === 402) {
        return new Response(
          JSON.stringify({ error: "AI credits exhausted. Please add credits to continue." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      throw new Error(`AI generation failed: ${errorText}`);
    }

    const textData = await textResponse.json();
    let generatedText = textData.choices?.[0]?.message?.content || "";
    
    console.log("Raw AI response length:", generatedText.length);

    // Clean the response - remove markdown code blocks if present
    generatedText = generatedText
      .replace(/```json\n?/g, '')
      .replace(/```\n?/g, '')
      .trim();

    // Function to escape control characters in JSON strings
    const escapeControlChars = (str: string): string => {
      let result = '';
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
        
        if (char === '\\' && inString) {
          escaped = true;
          result += char;
          continue;
        }
        
        if (char === '"') {
          inString = !inString;
          result += char;
          continue;
        }
        
        // If inside a string, escape control characters
        if (inString && charCode < 32) {
          if (char === '\n') {
            result += '\\n';
          } else if (char === '\r') {
            result += '\\r';
          } else if (char === '\t') {
            result += '\\t';
          } else {
            // Other control characters - use unicode escape
            result += '\\u' + charCode.toString(16).padStart(4, '0');
          }
        } else {
          result += char;
        }
      }
      
      return result;
    };

    // Pre-process to escape control characters
    generatedText = escapeControlChars(generatedText);

    // Function to repair common JSON issues
    const repairJSON = (jsonStr: string): string => {
      let repaired = jsonStr;
      
      // Remove any trailing content after the last closing brace
      const lastBrace = repaired.lastIndexOf('}');
      if (lastBrace !== -1 && lastBrace < repaired.length - 1) {
        repaired = repaired.substring(0, lastBrace + 1);
      }
      
      // Fix unclosed strings - find unmatched quotes
      let inString = false;
      let escaped = false;
      let result = '';
      
      for (let i = 0; i < repaired.length; i++) {
        const char = repaired[i];
        
        if (escaped) {
          escaped = false;
          result += char;
          continue;
        }
        
        if (char === '\\' && inString) {
          escaped = true;
          result += char;
          continue;
        }
        
        if (char === '"') {
          inString = !inString;
        }
        
        result += char;
      }
      
      // If we ended inside a string, close it
      if (inString) {
        result += '"';
      }
      
      repaired = result;
      
      // Fix trailing commas before closing brackets
      repaired = repaired.replace(/,(\s*[\]}])/g, '$1');
      
      // Fix missing commas between array elements
      repaired = repaired.replace(/}(\s*){/g, '},$1{');
      
      // Fix unclosed arrays and objects by counting brackets
      let openBraces = 0;
      let openBrackets = 0;
      
      for (const char of repaired) {
        if (char === '{') openBraces++;
        if (char === '}') openBraces--;
        if (char === '[') openBrackets++;
        if (char === ']') openBrackets--;
      }
      
      // Add missing closing brackets
      while (openBrackets > 0) {
        repaired += ']';
        openBrackets--;
      }
      while (openBraces > 0) {
        repaired += '}';
        openBraces--;
      }
      
      return repaired;
    };

    let content: GeneratedContent;
    try {
      content = JSON.parse(generatedText);
    } catch (parseError) {
      console.error("JSON parse error:", parseError);
      console.log("Attempting to repair and extract JSON from response...");
      
      // Try to find JSON in the response
      const jsonMatch = generatedText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        let jsonStr = jsonMatch[0];
        
        // Try direct parse first
        try {
          content = JSON.parse(jsonStr);
        } catch {
          // Attempt repair
          console.log("Attempting JSON repair...");
          const repairedJSON = repairJSON(jsonStr);
          
          try {
            content = JSON.parse(repairedJSON);
            console.log("JSON repair successful");
          } catch (repairError) {
            console.error("JSON repair failed:", repairError);
            throw new Error("Failed to parse AI response as JSON. The AI response was truncated or malformed.");
          }
        }
      } else {
        throw new Error("Failed to parse AI response as JSON");
      }
    }

    // Add IDs to chapters and sections
    const processedChapters: Chapter[] = content.chapters.map((chapter, chIdx) => ({
      id: `ai-${Date.now()}-${chIdx}`,
      number: chapter.number,
      title: chapter.title,
      sections: chapter.sections.map((section, secIdx) => ({
        id: `ai-${Date.now()}-${chIdx}-${secIdx}`,
        number: section.number,
        heading: section.heading,
        content: section.content,
        images: []
      }))
    }));

    console.log("Successfully generated content with", processedChapters.length, "chapters");

    return new Response(
      JSON.stringify({
        abstract: content.abstract,
        acknowledgement: content.acknowledgement,
        chapters: processedChapters
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("Error in generate-report-content:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error occurred" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
