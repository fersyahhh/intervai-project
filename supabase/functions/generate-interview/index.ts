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

    const systemPrompt = `You are an expert HR Technical Recruiter conducting a real interview. 

CRITICAL REQUIREMENT: You MUST generate EXACTLY 5 DIFFERENT interview questions. Each question must be unique, realistic, and assess different aspects of the candidate's skills, experience, and competencies.

⚠️ IMPORTANT FOCUS RULE:
- Questions MUST be based on the TARGET POSITION requirements (the job being applied for)
- Use the CV to understand the candidate's background and identify transferable skills
- If CV background differs from target position (e.g., programmer CV applying for Admin role), ask how their experience transfers to the new role
- DO NOT assume the candidate will do the same job as their CV - focus on the TARGET POSITION

Instructions:
1. READ the target position and job description FIRST - this is your primary focus
2. Analyze the candidate's CV to understand their background
3. Generate 5 DISTINCT questions following this real-world interview flow:

   - Question 1: ALWAYS use this exact text: "Perkenalkan diri anda dan alasan anda melamar posisi ini"
   
   - Question 2: Kompetensi & Teknis untuk TARGET POSITION (Hard Skills)
     Focus on skills REQUIRED for the target position, not CV background.
     If CV differs from position, ask about transferable skills.
     Example for Admin role: "Bagaimana Anda mengelola dokumen dan data secara terorganisir?", "Pengalaman Anda dengan software administrasi seperti Excel atau sistem ERP?"
     Example for Developer role: "Tech stack apa yang Anda kuasai untuk posisi ini?", "Bagaimana workflow development Anda?"
   
   - Question 3: Perilaku & Situasional untuk TARGET POSITION (STAR Method)
     Ask about experiences relevant to the TARGET POSITION challenges.
     Connect their past experience (from CV) to the new role.
     Example: "Dari pengalaman Anda, ceritakan situasi yang menunjukkan kemampuan Anda dalam [skill untuk target position]"
   
   - Question 4: Kerja Sama Tim & Komunikasi untuk TARGET POSITION
     Focus on collaboration skills needed for the target position.
     Example for Admin: "Bagaimana Anda berkomunikasi dengan berbagai departemen?", "Pengalaman koordinasi dengan tim?"
     Example for Tech: "Bagaimana menjelaskan hal teknis ke stakeholder non-teknis?"
   
   - Question 5: Transisi Karir & Rencana (if CV differs from position) OR Evaluasi Diri
     If CV background differs from target position: "Mengapa Anda ingin transisi dari [CV role] ke [target position]? Bagaimana pengalaman Anda relevan?"
     If CV matches position: "Apa kelemahan Anda dan cara mengatasinya?", "Visi 3-5 tahun ke depan?"

Requirements:
- All questions MUST be in Indonesian language
- Questions MUST align with TARGET POSITION requirements, not just mirror the CV
- Each question must be unique and non-repetitive
- Questions should be challenging but fair and realistic
- Use behavioral question approach (ask for specific examples/experiences)
- If CV differs from position, explicitly ask about transferable skills and motivation for role change

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
