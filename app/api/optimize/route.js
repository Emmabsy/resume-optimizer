import Anthropic from '@anthropic-ai/sdk';
import { supabase } from '@/lib/supabase';

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function POST(request) {
  try {
    const { resume, jobDescription, licenseKey } = await request.json();

    // Validate license key and check credits
    const { data: keyData, error: keyError } = await supabase
      .from('license_keys')
      .select('*')
      .eq('license_key', licenseKey.trim().toUpperCase())
      .single();

    if (keyError || !keyData) {
      return Response.json(
        { error: 'Invalid license key' },
        { status: 401 }
      );
    }

    if (keyData.credits_remaining <= 0) {
      return Response.json(
        { error: 'No credits remaining. Please purchase more credits.' },
        { status: 403 }
      );
    }

    // Validate inputs
    if (!resume || resume.length < 100) {
      return Response.json(
        { error: 'Resume must be at least 100 characters.' },
        { status: 400 }
      );
    }
    if (!jobDescription || jobDescription.length < 50) {
      return Response.json(
        { error: 'Job description must be at least 50 characters.' },
        { status: 400 }
      );
    }

    const prompt = `You are an expert resume writer and ATS specialist.

Your task: Rewrite the provided resume to be optimally matched for the provided job description.

RULES:
1. Keep ALL factual information accurate — do NOT invent experience
2. Naturally incorporate keywords from the job description where truthful
3. Reorder bullet points to highlight most relevant experience first
4. Use strong action verbs and quantify achievements
5. Match the seniority tone of the job posting
6. Keep the same structure but optimize the language

RESUME:
${resume}

JOB DESCRIPTION:
${jobDescription}

Respond with a JSON object in this EXACT format:
{
  "optimizedResume": "...(the full rewritten resume text)...",
  "keywordsAdded": ["keyword1", "keyword2", "keyword3"],
  "keywordsFound": ["keyword4", "keyword5"],
  "matchScore": 78,
  "improvements": [
    "Added 'cross-functional' from job requirements",
    "Moved project management experience to top"
  ],
  "suggestions": [
    "Consider adding a certification in...",
    "Your summary could mention..."
  ]
}
Respond ONLY with the JSON. No other text.`;

    // Call Claude
    const message = await client.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 4096,
      messages: [{ role: 'user', content: prompt }],
    });

    const responseText = message.content[0].text;
    const cleanedText = responseText
      .replace(/```json/g, '')
      .replace(/```/g, '')
      .trim();
    
    const result = JSON.parse(cleanedText);

    // Deduct credit AFTER successful optimization
    const { error: updateError } = await supabase
      .from('license_keys')
      .update({ 
        credits_remaining: keyData.credits_remaining - 1,
        last_used_at: new Date().toISOString()
      })
      .eq('license_key', licenseKey.trim().toUpperCase());

    if (updateError) {
      console.error('Failed to update credits:', updateError);
      // Still return result - don't punish user for DB error
    }

    return Response.json({ 
      success: true, 
      ...result,
      creditsRemaining: keyData.credits_remaining - 1
    });

  } catch (error) {
    console.error('Optimization error:', error);
    return Response.json(
      { error: 'Failed to optimize resume. Please try again.' },
      { status: 500 }
    );
  }
}