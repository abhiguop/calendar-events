import { supabase } from './supabase';

export async function refreshGoogleToken(refresh_token: string) {
  try {
    const { data: functionData, error: functionError } = await supabase.functions.invoke(
      'refresh-token',
      {
        body: JSON.stringify({ refresh_token }),
      }
    );

    if (functionError) throw functionError;

    // Update the token in your database
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('No user found');

    const { error: updateError } = await supabase
      .from('user_tokens')
      .update({
        access_token: functionData.access_token,
        expires_at: new Date(Date.now() + functionData.expires_in * 1000).toISOString(),
      })
      .eq('user_id', user.id);

    if (updateError) throw updateError;

    return functionData.access_token;
  } catch (error) {
    console.error('Error refreshing token:', error);
    throw error;
  }
}