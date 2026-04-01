/**
 * Gemini LLM Client
 * 
 * Purpose: Generate personalized career pivot narratives using Google Gemini
 * Model: gemini-1.5-flash (fast, free tier friendly)
 */

import { GoogleGenerativeAI } from '@google/generative-ai';
import type { LLMResponse, LLMError, NarrativeRequest } from './types';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

/**
 * Generate a personalized career pivot narrative using Gemini
 */
export async function generateNarrativeGemini(
  request: NarrativeRequest
): Promise<LLMResponse> {
  const startTime = Date.now();
  
  const model = genAI.getGenerativeModel({ 
    model: 'gemini-1.5-flash' // Fast, free tier friendly
  });
  
  const prompt = buildNarrativePrompt(request);
  
  try {
    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();
    
    return {
      content: text,
      provider: 'gemini',
      model: 'gemini-1.5-flash',
      latencyMs: Date.now() - startTime,
    };
  } catch (error: any) {
    throw {
      provider: 'gemini',
      error: error.message,
      code: error.code,
      retryable: isRetryableError(error),
    } as LLMError;
  }
}

/**
 * Build the narrative prompt from request context
 */
function buildNarrativePrompt(request: NarrativeRequest): string {
  return `
You are a career transition coach writing a personalized pivot plan narrative.

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
  // Rate limits, temporary failures
  const retryableCodes = ['RATE_LIMIT', 'RESOURCE_EXHAUSTED', 'UNAVAILABLE'];
  return retryableCodes.includes(error.code);
}
