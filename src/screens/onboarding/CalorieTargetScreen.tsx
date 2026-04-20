import React, { useEffect, useMemo, useState } from 'react';
import { Alert, StyleSheet, Text, TextInput, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { OnboardingStep, Screen } from '../../components';
import { useOnboarding } from '../../context/OnboardingContext';
import { updateProfile } from '../../services/profile';
import { supabase } from '../../services/supabase';
import { useAuth } from '../../context/AuthContext';
import { colors, radius, spacing, typography } from '../../theme';
import { calculateMacros, calculateRecommendedCalories } from '../../utils/calculations';
import { OnboardingStackParamList } from './OnboardingNavigator';

type Props = NativeStackScreenProps<OnboardingStackParamList, 'CalorieTarget'>;

export const CalorieTargetScreen: React.FC<Props> = ({ navigation }) => {
  const { state, update } = useOnboarding();
  const { refreshProfile } = useAuth();
  const recommended = useMemo(() => {
    if (
      !state.goal ||
      !state.sex ||
      !state.heightCm ||
      !state.weightKg ||
      !state.age ||
      !state.lifestyle
    ) {
      return 0;
    }
    return calculateRecommendedCalories(
      state.weightKg,
      state.heightCm,
      state.age,
      state.sex,
      state.lifestyle,
      state.goal
    );
  }, [state]);

  const [calorieTarget, setCalorieTarget] = useState<number>(recommended || 2000);
  const canSave = recommended > 0;

  useEffect(() => {
    if (recommended && !state.calorieTarget) {
      setCalorieTarget(recommended);
      update({ calorieTarget: recommended });
    }
  }, [recommended, state.calorieTarget, update]);

  const handleSave = async () => {
    const { data } = await supabase.auth.getSession();
    const userId = data.session?.user?.id;
    if (!userId) {
      Alert.alert('Please sign in again.');
      return;
    }
    if (
      !state.goal ||
      !state.sex ||
      !state.heightCm ||
      !state.weightKg ||
      !state.age ||
      !state.lifestyle
    ) {
      Alert.alert('Missing onboarding details.');
      return;
    }

    const macros = calculateMacros(calorieTarget, state.weightKg, state.lifestyle);
    const { error } = await updateProfile(userId, {
      goal: state.goal,
      sex: state.sex,
      height_cm: state.heightCm,
      weight_kg: state.weightKg,
      age: state.age,
      lifestyle: state.lifestyle,
      calorie_target: calorieTarget,
      protein_target_g: macros.protein,
      fat_target_g: macros.fat,
      carbs_target_g: macros.carbs,
    });

    if (error) {
      Alert.alert('Unable to save profile', error.message);
      return;
    }
    await refreshProfile();
  };

  return (
    <Screen>
      <OnboardingStep
        title="Daily calorie intake"
        subtitle="Review or edit your target"
        onBack={() => navigation.goBack()}
        onNext={handleSave}
        nextDisabled={!canSave}
      >
        <View style={styles.card}>
          <Text style={styles.label}>Calories</Text>
          <TextInput
            keyboardType="numeric"
            value={String(calorieTarget)}
            onChangeText={(value) => {
              const parsed = Number(value.replace(/[^0-9]/g, '')) || 0;
              setCalorieTarget(parsed);
              update({ calorieTarget: parsed });
            }}
            style={styles.input}
          />
          <Text style={styles.recommended}>Recommended: {recommended} cal</Text>
        </View>
      </OnboardingStep>
    </Screen>
  );
};

const styles = StyleSheet.create({
  card: {
    width: '100%',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.lg,
    padding: spacing.lg,
  },
  label: {
    ...typography.caption,
    color: colors.textMuted,
  },
  input: {
    borderBottomWidth: 1,
    borderBottomColor: colors.primary,
    paddingVertical: spacing.sm,
    fontSize: 20,
    color: colors.text,
    marginTop: spacing.sm,
  },
  recommended: {
    ...typography.body,
    color: colors.primary,
    marginTop: spacing.md,
  },
});
