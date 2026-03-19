import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { question } = await req.json();
    if (!question || typeof question !== "string") {
      return new Response(JSON.stringify({ error: "Missing question" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const systemPrompt = `You are a Life Decision Simulator — a counterfactual reasoning engine. Given a "What if..." question about a life decision, generate three possible future scenarios.

You MUST respond using the "generate_scenarios" tool.

For each scenario, provide:
- A clear summary (2-3 sentences)
- A probability percentage (all three must sum to 100)
- A timeframe for when outcomes would materialize
- 4 reasoning steps showing the causal chain
- 4 key outcomes

Be specific, realistic, and nuanced. Use real-world data patterns and behavioral psychology insights. Avoid generic platitudes.`;

    const response = await fetch(
      "https://ai.gateway.lovable.dev/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${LOVABLE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: question },
          ],
          tools: [
            {
              type: "function",
              function: {
                name: "generate_scenarios",
                description:
                  "Generate three life decision scenarios: best case, worst case, and most likely.",
                parameters: {
                  type: "object",
                  properties: {
                    scenarios: {
                      type: "array",
                      items: {
                        type: "object",
                        properties: {
                          type: {
                            type: "string",
                            enum: ["best", "worst", "likely"],
                          },
                          title: { type: "string" },
                          summary: { type: "string" },
                          probability: { type: "number" },
                          timeframe: { type: "string" },
                          reasoning: {
                            type: "array",
                            items: {
                              type: "object",
                              properties: {
                                step: { type: "number" },
                                text: { type: "string" },
                              },
                              required: ["step", "text"],
                              additionalProperties: false,
                            },
                          },
                          keyOutcomes: {
                            type: "array",
                            items: { type: "string" },
                          },
                        },
                        required: [
                          "type",
                          "title",
                          "summary",
                          "probability",
                          "timeframe",
                          "reasoning",
                          "keyOutcomes",
                        ],
                        additionalProperties: false,
                      },
                    },
                  },
                  required: ["scenarios"],
                  additionalProperties: false,
                },
              },
            },
          ],
          tool_choice: {
            type: "function",
            function: { name: "generate_scenarios" },
          },
        }),
      }
    );

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "AI credits exhausted. Please add credits in your workspace settings." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const text = await response.text();
      console.error("AI gateway error:", response.status, text);
      throw new Error(`AI gateway error: ${response.status}`);
    }

    const data = await response.json();
    const toolCall = data.choices?.[0]?.message?.tool_calls?.[0];

    if (!toolCall?.function?.arguments) {
      throw new Error("No tool call in AI response");
    }

    const parsed = JSON.parse(toolCall.function.arguments);

    return new Response(
      JSON.stringify({ question, scenarios: parsed.scenarios }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (e) {
    console.error("simulate-decision error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
