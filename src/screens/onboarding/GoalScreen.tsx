import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { OnboardingStep, Screen } from '../../components';
import { useOnboarding } from '../../context/OnboardingContext';
import { colors, radius, spacing, typography } from '../../theme';
import { Goal } from '../../types/models';
import { OnboardingStackParamList } from './OnboardingNavigator';

type Props = NativeStackScreenProps<OnboardingStackParamList, 'Goal'>;

const goalOptions: { label: string; value: Goal }[] = [
  { label: 'Lose weight', value: 'lose_weight' },
  { label: 'Keep weight', value: 'keep_weight' },
  { label: 'Gain weight', value: 'gain_weight' },
  { label: 'Eat healthier', value: 'eat_healthier' },
];

export const GoalScreen: React.FC<Props> = ({ navigation }) => {
  const { state, update } = useOnboarding();

  return (
    <Screen>
      <OnboardingStep
        title="What’s your goal?"
        subtitle="We will calculate daily calories according to your goal"
        onNext={() => navigation.navigate('Sex')}
        nextDisabled={!state.goal}
      >
        <View style={styles.options}>
          {goalOptions.map((option) => {
            const selected = state.goal === option.value;
            return (
              <TouchableOpacity
                key={option.value}
                style={[styles.option, selected && styles.optionSelected]}
                onPress={() => update({ goal: option.value })}
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
