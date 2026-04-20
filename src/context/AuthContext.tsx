import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { Session } from '@supabase/supabase-js';
import { supabase } from '../services/supabase';
import { getProfile, upsertProfile } from '../services/profile';
import { Profile } from '../types/models';

type AuthContextValue = {
  session: Session | null;
  profile: Profile | null;
  loading: boolean;
  refreshProfile: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshProfile = useCallback(async () => {
    if (!session?.user) {
      setProfile(null);
      return;
    }
    const { data, error } = await getProfile(session.user.id);
    if (error) {
      console.warn('Profile fetch failed', error.message);
      return;
    }
    if (!data) {
      const { data: created } = await upsertProfile({
        user_id: session.user.id,
        email: session.user.email ?? null,
        name: (session.user.user_metadata?.name as string) ?? null,
        goal: null,
        sex: null,
        height_cm: null,
        weight_kg: null,
        age: null,
        lifestyle: null,
        calorie_target: null,
        protein_target_g: null,
        fat_target_g: null,
        carbs_target_g: null,
      });
      setProfile(created ?? null);
      return;
    }
    setProfile(data as Profile);
  }, [session?.user]);

  useEffect(() => {
    let isMounted = true;

    const loadSession = async () => {
      const { data } = await supabase.auth.getSession();
      if (!isMounted) return;
      setSession(data.session ?? null);
    };

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
    });

    loadSession().finally(() => {
      if (isMounted) setLoading(false);
    });

    return () => {
      isMounted = false;
      authListener.subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    refreshProfile();
  }, [refreshProfile]);

  return (
    <AuthContext.Provider value={{ session, profile, loading, refreshProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
