/**
 * Unified LLM Client with Fallback Chain
 * 
 * Purpose: Orchestrate LLM requests with automatic fallback
 * Fallback Chain: Gemini → Groq → Queue for retry
 */

import { generateNarrativeGemini } from './gemini';
import { generateNarrativeGroq } from './groq';
import { queueForRetry } from './queue';
import type { LLMResponse, LLMError, NarrativeRequest } from './types';

export interface GenerateNarrativeResult {
  success: boolean;
  response?: LLMResponse;
  queued?: boolean;
  queueId?: string;
  errors?: LLMError[];
}

/**
 * Generate narrative with fallback chain:
 * 1. Try Gemini (primary)
 * 2. If fails, try Groq (fallback)
 * 3. If both fail, queue for retry and return queued status
 */
export async function generateNarrative(
  request: NarrativeRequest,
  userId?: string
): Promise<GenerateNarrativeResult> {
  const errors: LLMError[] = [];
  
  // Try Gemini first
  try {
    const response = await generateNarrativeGemini(request);
    return { success: true, response };
  } catch (error) {
    errors.push(error as LLMError);
    console.warn('Gemini failed, trying Groq:', (error as LLMError).error);
  }
  
  // Fallback to Groq
  try {
    const response = await generateNarrativeGroq(request);
    return { success: true, response };
  } catch (error) {
    errors.push(error as LLMError);
    console.warn('Groq also failed, queueing for retry:', (error as LLMError).error);
  }
  
  // Both failed - queue for later
  const queueId = await queueForRetry({
    request,
    userId,
    errors,
    attemptCount: 2,
  });
  
  return {
    success: false,
    queued: true,
    queueId,
    errors,
  };
}
