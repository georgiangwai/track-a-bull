import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { OnboardingStep, Screen } from '../../components';
import { useOnboarding } from '../../context/OnboardingContext';
import { colors, radius, spacing, typography } from '../../theme';
import { Sex } from '../../types/models';
import { OnboardingStackParamList } from './OnboardingNavigator';

type Props = NativeStackScreenProps<OnboardingStackParamList, 'Sex'>;

const sexOptions: { label: string; value: Sex }[] = [
  { label: 'Female', value: 'female' },
  { label: 'Male', value: 'male' },
];

export const SexScreen: React.FC<Props> = ({ navigation }) => {
  const { state, update } = useOnboarding();

  return (
    <Screen>
      <OnboardingStep
        title="What’s your gender?"
        subtitle="Male bodies need more calories"
        onBack={() => navigation.goBack()}
        onNext={() => navigation.navigate('Height')}
        nextDisabled={!state.sex}
      >
        <View style={styles.options}>
          {sexOptions.map((option) => {
            const selected = state.sex === option.value;
            return (
              <TouchableOpacity
                key={option.value}
                style={[styles.option, selected && styles.optionSelected]}
                onPress={() => update({ sex: option.value })}
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
