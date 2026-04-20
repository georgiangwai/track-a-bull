import React, { createContext, useContext, useMemo, useState } from 'react';
import { Goal, Lifestyle, Sex } from '../types/models';

export type OnboardingState = {
  goal: Goal | null;
  sex: Sex | null;
  heightCm: number | null;
  weightKg: number | null;
  age: number | null;
  lifestyle: Lifestyle | null;
  calorieTarget: number | null;
};

type OnboardingContextValue = {
  state: OnboardingState;
  update: (updates: Partial<OnboardingState>) => void;
  reset: () => void;
};

const defaultState: OnboardingState = {
  goal: null,
  sex: null,
  heightCm: null,
  weightKg: null,
  age: null,
  lifestyle: null,
  calorieTarget: null,
};

const OnboardingContext = createContext<OnboardingContextValue | undefined>(undefined);

export const OnboardingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<OnboardingState>(defaultState);

  const value = useMemo(
    () => ({
      state,
      update: (updates: Partial<OnboardingState>) =>
        setState((prev) => ({
          ...prev,
          ...updates,
        })),
      reset: () => setState(defaultState),
    }),
    [state]
  );

  return <OnboardingContext.Provider value={value}>{children}</OnboardingContext.Provider>;
};

export const useOnboarding = () => {
  const context = useContext(OnboardingContext);
  if (!context) {
    throw new Error('useOnboarding must be used within OnboardingProvider');
  }
  return context;
};
