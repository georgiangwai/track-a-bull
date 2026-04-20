import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { OnboardingProvider } from '../../context/OnboardingContext';
import { GoalScreen } from './GoalScreen';
import { SexScreen } from './SexScreen';
import { HeightScreen } from './HeightScreen';
import { WeightScreen } from './WeightScreen';
import { AgeScreen } from './AgeScreen';
import { LifestyleScreen } from './LifestyleScreen';
import { CalorieTargetScreen } from './CalorieTargetScreen';

export type OnboardingStackParamList = {
  Goal: undefined;
  Sex: undefined;
  Height: undefined;
  Weight: undefined;
  Age: undefined;
  Lifestyle: undefined;
  CalorieTarget: undefined;
};

const Stack = createNativeStackNavigator<OnboardingStackParamList>();

export const OnboardingNavigator: React.FC = () => {
  return (
    <OnboardingProvider>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Goal" component={GoalScreen} />
        <Stack.Screen name="Sex" component={SexScreen} />
        <Stack.Screen name="Height" component={HeightScreen} />
        <Stack.Screen name="Weight" component={WeightScreen} />
        <Stack.Screen name="Age" component={AgeScreen} />
        <Stack.Screen name="Lifestyle" component={LifestyleScreen} />
        <Stack.Screen name="CalorieTarget" component={CalorieTargetScreen} />
      </Stack.Navigator>
    </OnboardingProvider>
  );
};
