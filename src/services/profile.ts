import { supabase } from './supabase';
import { Profile } from '../types/models';

export const getProfile = async (userId: string) => {
  return supabase.from('profiles').select('*').eq('user_id', userId).maybeSingle();
};

export const upsertProfile = async (profile: Profile) => {
  return supabase.from('profiles').upsert(profile, { onConflict: 'user_id' }).select().single();
};

export const updateProfile = async (userId: string, updates: Partial<Profile>) => {
  return supabase.from('profiles').update(updates).eq('user_id', userId).select().single();
};

export const isProfileComplete = (profile: Profile | null) => {
  if (!profile) return false;
  return Boolean(
    profile.goal &&
      profile.sex &&
      profile.height_cm &&
      profile.weight_kg &&
      profile.age &&
      profile.lifestyle &&
      profile.calorie_target
  );
};
