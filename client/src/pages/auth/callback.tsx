import { useEffect, useState } from 'react';
import { useLocation } from 'wouter';
import { supabase } from '@/lib/supabaseClient';
import { Loader2 } from 'lucide-react';

export default function AuthCallback() {
  const [, setLocation] = useLocation();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Try to get the access token from the URL
    const handleAuthCallback = async () => {
      try {
        // Process the auth callback
        const { error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Error in auth callback:', error);
          setError(error.message);
          return;
        }
        
        // Redirect to the dashboard or home page after successful authentication
        setLocation('/');
      } catch (err) {
        console.error('Exception in auth callback:', err);
        setError(err instanceof Error ? err.message : 'Authentication error');
      }
    };

    handleAuthCallback();
  }, [setLocation]);

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-md">
          <h2 className="text-2xl font-bold mb-4 text-red-600">Authentication Error</h2>
          <p className="text-gray-700">{error}</p>
          <button
            onClick={() => setLocation('/login')}
            className="mt-4 w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
          >
            Return to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
      <p className="mt-4 text-lg">Completing authentication...</p>
    </div>
  );
}
