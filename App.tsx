import React, { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AppNavigation } from './src/app/navigation';
import { LoadingScreen } from './src/screens';
import { isProfileComplete } from './src/services/profile';
import { AuthProvider, useAuth } from './src/context/AuthContext';
import { supabase } from './src/services/supabase';

const queryClient = new QueryClient();

const AppRoot = () => {
  const { session, profile, loading } = useAuth();

  useEffect(() => {
    const runHealthCheck = async () => {
      if (!process.env.EXPO_PUBLIC_SUPABASE_URL) {
        console.warn('Supabase URL missing; check .env setup.');
        return;
      }
      const { error } = await supabase.from('dining_halls').select('id').limit(1);
      if (error) {
        console.warn('Supabase health check failed:', error.message);
      } else {
        console.log('Supabase health check OK');
      }
    };
    runHealthCheck();
  }, []);

  if (loading) {
    return <LoadingScreen />;
  }

  const isAuthenticated = Boolean(session?.user);
  const needsOnboarding = isAuthenticated && !isProfileComplete(profile);

  return <AppNavigation isAuthenticated={isAuthenticated} needsOnboarding={needsOnboarding} />;
};

export default function App() {
  return (
    <SafeAreaProvider>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <StatusBar style="dark" />
          <AppRoot />
        </AuthProvider>
      </QueryClientProvider>
    </SafeAreaProvider>
  );
}
