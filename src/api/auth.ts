import { supabase } from '../lib/supabase';
import type { Session } from '../types/model';

// Google Authentication
export const signInWithGoogle = async () => {
  try {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      }
    });
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error signing in with Google:', error);
    throw error;
  }
};

// Sign out
export const signOut = async () => {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  } catch (error) {
    console.error('Error signing out:', error);
    throw error;
  }
};

// Get current session
export const getSession = async (): Promise<Session | null> => {
  try {
    const { data, error } = await supabase.auth.getSession();
    if (error) throw error;
    if (!data.session) return null;

    const createdAt = (new Date(data.session.user.created_at).getTime() / 1000) | 0
    let updatedAt = createdAt;
    if (data.session.user.updated_at) {
      updatedAt = (new Date(data.session.user.updated_at).getTime() / 1000) | 0
    }

    return {
      access_token: data.session.access_token,
      refresh_token: data.session.refresh_token,
      expires_in: data.session.expires_in,
      expires_at: data.session.expires_at,
      token_type: data.session.token_type,
      user: {
        id: data.session.user.id,
        email: data.session.user.email || '',
        fullname: data.session.user.user_metadata.full_name,
        nickname: data.session.user.user_metadata.name,
        whatsapp_number: data.session.user.phone || '',
        profile_picture: data.session.user.user_metadata.avatar_url,
        preferences_tags: [],
        current_job: "",
        created_at: createdAt,
        updated_at: updatedAt,
      }
    }
  } catch (error) {
    console.error('Error getting session:', error);
    return null;
  }
};


// Complete user profile after OAuth sign-in
export const completeUserProfile = async (
  userId: string,
  profileData: {
    fullname: string;
    nickname: string;
    whatsapp_number: string;
    current_job: string;
  }
) => {
  try {
    // Check if user profile already exists
    const { data: existingProfile } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', userId)
      .single();
    
    if (existingProfile) {
      // Update existing profile
      const { data, error } = await supabase
        .from('user_profiles')
        .update({
          ...profileData,
          updated_at: new Date().toISOString()
        })
        .eq('id', userId)
        .select();
      
      if (error) throw error;
      return data;
    } else {
      // Insert new profile
      const { data, error } = await supabase
        .from('user_profiles')
        .insert({
          id: userId,
          ...profileData,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select();
      
      if (error) throw error;
      return data;
    }
  } catch (error) {
    console.error('Error completing user profile:', error);
    throw error;
  }
};