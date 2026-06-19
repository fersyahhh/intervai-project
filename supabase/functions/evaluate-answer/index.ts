import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { position, question, answer } = await req.json()
    const apiKey = Deno.env.get('GROQ_API_KEY')

    if (!apiKey) {
      throw new Error('GROQ_API_KEY is not set')
    }

    const systemPrompt = `You are an expert HR Assessor evaluating a candidate's interview answer.
The candidate is applying for: ${position}

Evaluate the candidate's answer based on the question asked. 
Return the evaluation STRICTLY as a JSON object with the following keys and value types:
{
  "score": <number 0-100>,
  "feedback": "<string: concise constructive feedback>",
  "corrections": ["<string: list of things to correct, if any>"],
  "strengths": ["<string: list of strong points in the answer>"],
  "improvements": ["<string: actionable advice to improve>"]
}

Ensure the feedback and all lists are in Indonesian language. Do not output any other text or markdown.`

    const userMessage = `Question: ${question}\nCandidate's Answer: ${answer || '(No answer provided)'}`

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userMessage }
        ],
        temperature: 0.5,
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
    const parsedData = JSON.parse(content)

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
