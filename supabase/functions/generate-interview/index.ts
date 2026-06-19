import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { position, jobDescription, cvText } = await req.json()
    const apiKey = Deno.env.get('GROQ_API_KEY')

    if (!apiKey) {
      throw new Error('GROQ_API_KEY is not set')
    }

    const systemPrompt = `You are an expert HR Technical Recruiter and Senior Engineering Manager. 
Your task is to generate exactly 5 interview questions based on the candidate's CV, the target position, and the job description.
The questions must be highly relevant, challenging but fair, and assess both behavioral and technical competencies (if applicable).
Ensure the questions are in Indonesian language.

Return the response STRICTLY as a JSON object with a single key "questions" containing an array of 5 strings. No other text, markdown formatting, or explanations.
Example format:
{
  "questions": [
    "Ceritakan pengalaman Anda saat menangani...",
    "Bagaimana pendekatan Anda dalam..."
  ]
}`

    const userMessage = `Position: ${position}\nJob Description: ${jobDescription || 'N/A'}\nCV Text: ${cvText}`

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile', // Fast and highly capable model
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userMessage }
        ],
        temperature: 0.7,
        response_format: { type: "json_object" }
      }),
    })

    if (!response.ok) {
      const errText = await response.text()
      console.error('Groq API Error:', errText)
      throw new Error(`Groq API returned ${response.status}: ${errText}`)
    }

    const data = await response.json()
    const content = data.choices[0].message.content
    
    let parsedData;
    try {
      // Try parsing directly
      parsedData = JSON.parse(content);
    } catch (e) {
      // Fallback if LLM wraps in markdown
      const jsonMatch = content.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
      if (jsonMatch && jsonMatch[1]) {
        parsedData = JSON.parse(jsonMatch[1]);
      } else {
        throw new Error("Gagal mem-parsing JSON: " + content);
      }
    }

    return new Response(JSON.stringify(parsedData), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })

  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    })
  }
})
