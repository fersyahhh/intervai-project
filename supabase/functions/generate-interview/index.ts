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

CRITICAL REQUIREMENT: You MUST generate EXACTLY 5 DIFFERENT interview questions. Each question must be unique and assess different aspects of the candidate's skills, experience, and competencies.

Instructions:
1. Analyze the candidate's CV thoroughly
2. Consider the target position and job description
3. Generate 5 DISTINCT questions that cover:
   - Question 1: Career background and motivation
   - Question 2: Technical/domain-specific competency
   - Question 3: Problem-solving and critical thinking
   - Question 4: Teamwork and collaboration
   - Question 5: Leadership or future vision

Requirements:
- All questions MUST be in Indonesian language
- Each question must be unique and non-repetitive
- Questions should be challenging but fair
- Questions must be relevant to the position and CV
- Mix behavioral and technical questions appropriately

OUTPUT FORMAT (STRICT):
Return ONLY a valid JSON object with this exact structure:
{
  "questions": [
    "Question 1 text here",
    "Question 2 text here",
    "Question 3 text here",
    "Question 4 text here",
    "Question 5 text here"
  ]
}

DO NOT include any markdown formatting, explanations, or additional text. ONLY the JSON object.`

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
