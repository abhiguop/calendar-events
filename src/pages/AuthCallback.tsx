import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';

export default function AuthCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        // Get the user session which includes provider token
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        if (sessionError) throw sessionError;
        if (!session) throw new Error('No session found');

        const { provider_token, user } = session;
        if (!provider_token || !user) throw new Error('No provider token found');

        // Store the tokens in the user_tokens table
        const { error: insertError } = await supabase
          .from('user_tokens')
          .upsert({
            user_id: user.id,
            access_token: provider_token,
            refresh_token: session.provider_refresh_token || '',
            expires_at: new Date(Date.now() + 3600 * 1000).toISOString(), // 1 hour from now
          }, {
            onConflict: 'user_id'
          });

        if (insertError) throw insertError;

        // Redirect to calendar page
        navigate('/calendar');
      } catch (error) {
        console.error('Error in auth callback:', error);
        navigate('/login');
      }
    };

    handleAuthCallback();
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
    </div>
  );
}