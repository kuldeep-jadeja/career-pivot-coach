/**
 * Groq LLM Client
 * 
 * Purpose: Fallback LLM provider for career pivot narratives using Groq
 * Model: llama-3.3-70b-versatile (fast, free tier available)
 */

import Groq from 'groq-sdk';
import type { LLMResponse, LLMError, NarrativeRequest } from './types';

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

/**
 * Generate a personalized career pivot narrative using Groq
 */
export async function generateNarrativeGroq(
  request: NarrativeRequest
): Promise<LLMResponse> {
  const startTime = Date.now();
  
  const prompt = buildNarrativePrompt(request);
  
  try {
    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: 'You are a career transition coach writing personalized pivot plan narratives. Be specific, encouraging, and realistic.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      model: 'llama-3.3-70b-versatile', // Fast, free tier
      temperature: 0.7,
      max_tokens: 1024,
    });
    
    const content = completion.choices[0]?.message?.content || '';
    
    return {
      content,
      provider: 'groq',
      model: 'llama-3.3-70b-versatile',
      tokensUsed: completion.usage?.total_tokens,
      latencyMs: Date.now() - startTime,
    };
  } catch (error: any) {
    throw {
      provider: 'groq',
      error: error.message,
      code: error.code,
      retryable: isRetryableError(error),
    } as LLMError;
  }
}

/**
 * Build the narrative prompt from request context
 * Same prompt as Gemini for consistency
 */
function buildNarrativePrompt(request: NarrativeRequest): string {
  return `
Current Role: ${request.pivotPath.currentRole}
Target Role: ${request.pivotPath.targetRole}
Fit Score: ${request.pivotPath.fitScore}%

Transferable Skills:
${request.pivotPath.transferableSkills.map(s => `- ${s}`).join('\n')}

Skill Gaps to Address:
${request.pivotPath.skillGaps.map(s => `- ${s}`).join('\n')}

User Context:
- Years of experience: ${request.userContext.yearsExperience}
- Hours available per week: ${request.userContext.timeAvailable}
${request.userContext.constraints ? `- Constraints: ${request.userContext.constraints.join(', ')}` : ''}

Write a motivating, personalized 2-3 paragraph narrative explaining:
1. Why this pivot makes sense given their background
2. How their transferable skills give them an advantage
3. A realistic but encouraging timeline based on their availability

Be specific, reference their actual skills and constraints. Avoid generic advice.
`;
}

/**
 * Determine if an error is retryable
 */
function isRetryableError(error: any): boolean {
  const retryableCodes = ['rate_limit_exceeded', 'service_unavailable'];
  return retryableCodes.some(code => 
    error.message?.toLowerCase().includes(code) || 
    error.code === code
  );
}
