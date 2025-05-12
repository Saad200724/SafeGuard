import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Get the current domain for redirect URLs
const domain = window.location.origin;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Supabase URL and Anon Key must be provided in environment variables');
}

// Initialize Supabase client with site URL configuration
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    flowType: 'pkce'
  }
});

// Configure auth redirect URL
supabase.auth.signUp({
  email: '',
  password: '',
  options: {
    emailRedirectTo: `${domain}/auth/callback`
  }
}).then(() => {
  // This is just to set the redirect URL configuration, we don't care about the result
  // The empty email/password won't actually create an account
}).catch(() => {
  // Ignore errors as this is just for configuration
});

// Set the site URL for email confirmation redirects
supabase.auth.setSession({
  access_token: '',
  refresh_token: ''
}).then(() => {
  // This is just to initialize the session, we don't care about the result
});

// Update redirect URLs in the project dashboard: 
// https://app.supabase.com/project/_/auth/url-configuration
