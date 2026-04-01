/**
 * LLM Request Queue
 * 
 * Purpose: Queue failed LLM requests for retry
 * MVP Implementation: In-memory queue (upgrade to database in production)
 */

import type { NarrativeRequest, LLMError } from './types';

export interface QueuedRequest {
  id: string;
  request: NarrativeRequest;
  userId?: string;
  errors: LLMError[];
  attemptCount: number;
  createdAt: Date;
  nextRetryAt: Date;
  status: 'pending' | 'processing' | 'completed' | 'failed';
}

// In-memory queue for MVP (upgrade to database in production)
const queue: Map<string, QueuedRequest> = new Map();

/**
 * Queue a request for retry after both LLM providers fail
 */
export async function queueForRetry(params: {
  request: NarrativeRequest;
  userId?: string;
  errors: LLMError[];
  attemptCount: number;
}): Promise<string> {
  const id = `llm_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  
  const queuedRequest: QueuedRequest = {
    id,
    request: params.request,
    userId: params.userId,
    errors: params.errors,
    attemptCount: params.attemptCount,
    createdAt: new Date(),
    nextRetryAt: new Date(Date.now() + 5 * 60 * 1000), // 5 minutes
    status: 'pending',
  };
  
  queue.set(id, queuedRequest);
  
  // In production: save to database, trigger background job
  console.log(`Queued LLM request ${id} for retry at ${queuedRequest.nextRetryAt}`);
  
  return id;
}

/**
 * Get a queued request by ID
 */
export function getQueuedRequest(id: string): QueuedRequest | undefined {
  return queue.get(id);
}

/**
 * Get all pending requests
 */
export function getPendingRequests(): QueuedRequest[] {
  return Array.from(queue.values()).filter(r => r.status === 'pending');
}

/**
 * Process the queue (background job)
 * Implementation depends on deployment (Vercel cron, external worker, etc.)
 */
export async function processQueue(): Promise<void> {
  // Background job to process queued requests
  // TODO: Implement when background job infrastructure is ready
}
