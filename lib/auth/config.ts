/**
 * Auth Configuration
 * 
 * Purpose: Centralized authentication configuration
 */

export const authConfig = {
  // Auth provider settings
  providers: {
    email: true,
    google: false, // Enable in Supabase dashboard when ready
  },

  // Session settings
  session: {
    // How long until session expires (in seconds)
    maxAge: 60 * 60 * 24 * 7, // 7 days
  },

  // Redirect URLs
  redirects: {
    afterSignIn: '/dashboard',
    afterSignUp: '/onboarding',
    afterSignOut: '/',
    afterPasswordReset: '/auth/signin',
  },

  // Email settings
  email: {
    confirmEmail: true,
    // Email templates configured in Supabase dashboard
  },
} as const;

/**
 * Setup Instructions:
 * 
 * 1. Go to Supabase Dashboard > Authentication > Providers
 * 2. Enable Email provider (already enabled by default)
 * 3. (Optional) Configure Google OAuth:
 *    - Get OAuth credentials from Google Cloud Console
 *    - Add redirect URL: {SUPABASE_URL}/auth/v1/callback
 *    - Add Client ID and Secret to Supabase
 * 4. Configure email templates in Authentication > Email Templates
 * 5. Set redirect URLs in Authentication > URL Configuration
 */
