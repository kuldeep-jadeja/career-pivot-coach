/**
 * Health Check Endpoint
 * 
 * Purpose: Simple health check for deployment verification and monitoring
 * Returns 200 OK with status message
 */

import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json(
    { 
      status: 'ok',
      timestamp: new Date().toISOString(),
      service: 'career-pivot-coach'
    },
    { status: 200 }
  );
}
