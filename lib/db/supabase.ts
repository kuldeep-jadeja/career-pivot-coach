/**
 * Supabase Client
 * 
 * Purpose: Supabase client initialization for database and auth
 * Supports both browser and server-side contexts
 */

import { createBrowserClient } from '@supabase/ssr';
import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { cookies } from 'next/headers';
import type { Database } from './types';
import type { SupabaseClient } from '@supabase/supabase-js';

/**
 * Create a Supabase client for use in Client Components
 * 
 * SETUP REQUIRED:
 * 1. Create a Supabase project at https://supabase.com
 * 2. Go to Settings > API to get your credentials
 * 3. Add to .env.local:
 *    NEXT_PUBLIC_SUPABASE_URL=your_project_url
 *    NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
 */
export function createClient(): SupabaseClient<Database> {
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

/**
 * Create a Supabase client for use in Server Components and Server Actions
 * 
 * This version manages cookies properly for SSR and auth state
 */
export async function createServerSupabaseClient(): Promise<SupabaseClient<Database>> {
  const cookieStore = await cookies();

  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options as CookieOptions)
            );
          } catch {
            // The `setAll` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
    }
  );
}

/**
 * Create an admin Supabase client with service role key
 * 
 * USE WITH CAUTION: Bypasses Row Level Security
 * Only use in server-side code for admin operations
 * 
 * SETUP: Add SUPABASE_SERVICE_ROLE_KEY to .env.local
 */
export function createAdminClient(): SupabaseClient<Database> {
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error('SUPABASE_SERVICE_ROLE_KEY is not set');
  }

  // For admin operations, we use the service role key which bypasses RLS
  // Still use browser client since we don't need cookie handling for service role
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY,
    {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    }
  );
}

// Re-export types for convenience
export type { Database } from './types';
