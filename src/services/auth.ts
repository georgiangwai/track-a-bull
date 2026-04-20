import { supabase } from './supabase';

export const signUpWithEmail = async (email: string, password: string, name: string) => {
  return supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        name,
      },
    },
  });
};

export const signInWithEmail = async (email: string, password: string) => {
  return supabase.auth.signInWithPassword({ email, password });
};

export const resetPassword = async (email: string) => {
  return supabase.auth.resetPasswordForEmail(email);
};

export const signOut = async () => {
  return supabase.auth.signOut();
};
