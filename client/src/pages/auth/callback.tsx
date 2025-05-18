import { useEffect, useState } from 'react';
import { useLocation } from 'wouter';
import { auth } from '@/firebase';
import { Loader2 } from 'lucide-react';
import { getRedirectResult } from 'firebase/auth';

export default function AuthCallback() {
  const [, setLocation] = useLocation();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Handle Firebase auth redirect result
    const handleAuthCallback = async () => {
      try {
        // Process the auth callback
        const result = await getRedirectResult(auth);
        
        if (!result) {
          // No redirect result, might mean manual navigation to this page
          // or an authentication error
          setLocation('/login');
          return;
        }
        
        // Redirect to the dashboard after successful authentication
        setLocation('/dashboard');
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
