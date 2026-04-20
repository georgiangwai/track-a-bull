import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { OnboardingStep, Screen } from '../../components';
import { useOnboarding } from '../../context/OnboardingContext';
import { colors, radius, spacing, typography } from '../../theme';
import { Lifestyle } from '../../types/models';
import { OnboardingStackParamList } from './OnboardingNavigator';

type Props = NativeStackScreenProps<OnboardingStackParamList, 'Lifestyle'>;

const lifestyleOptions: { label: string; value: Lifestyle }[] = [
  { label: 'Sedentary', value: 'sedentary' },
  { label: 'Light', value: 'light' },
  { label: 'Moderate', value: 'moderate' },
  { label: 'Active', value: 'active' },
];

export const LifestyleScreen: React.FC<Props> = ({ navigation }) => {
  const { state, update } = useOnboarding();

  return (
    <Screen>
      <OnboardingStep
        title="What’s your lifestyle?"
        subtitle="This helps us estimate your daily needs"
        onBack={() => navigation.goBack()}
        onNext={() => navigation.navigate('CalorieTarget')}
        nextDisabled={!state.lifestyle}
      >
        <View style={styles.options}>
          {lifestyleOptions.map((option) => {
            const selected = state.lifestyle === option.value;
            return (
              <TouchableOpacity
                key={option.value}
                style={[styles.option, selected && styles.optionSelected]}
                onPress={() => update({ lifestyle: option.value })}
              >
                <Text style={[styles.optionText, selected && styles.optionTextSelected]}>
                  {option.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </OnboardingStep>
    </Screen>
  );
};

const styles = StyleSheet.create({
  options: {
    width: '100%',
    gap: spacing.md,
  },
  option: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.lg,
    paddingVertical: spacing.md,
    alignItems: 'center',
  },
  optionSelected: {
    borderColor: colors.primary,
    backgroundColor: 'rgba(0, 103, 71, 0.08)',
  },
  optionText: {
    ...typography.subheader,
    color: colors.text,
  },
  optionTextSelected: {
    color: colors.primary,
    fontWeight: '600',
  },
});
