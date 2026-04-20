import React, { useEffect, useState } from 'react';
import { Alert, StyleSheet, Text, TextInput, View } from 'react-native';
import { Button, Screen } from '../components';
import { useAuth } from '../context/AuthContext';
import { updateProfile } from '../services/profile';
import { colors, radius, spacing, typography } from '../theme';
import { calculateMacros } from '../utils/calculations';

export const CalorieIntakeScreen: React.FC = () => {
  const { profile, session, refreshProfile } = useAuth();
  const [calories, setCalories] = useState('2000');

  useEffect(() => {
    if (profile?.calorie_target) {
      setCalories(String(profile.calorie_target));
    }
  }, [profile]);

  const handleSave = async () => {
    if (!session?.user) return;
    const value = Number(calories);
    const macros = profile?.weight_kg && profile?.lifestyle
      ? calculateMacros(value, profile.weight_kg, profile.lifestyle)
      : null;
    const { error } = await updateProfile(session.user.id, {
      calorie_target: value,
      protein_target_g: macros?.protein ?? profile?.protein_target_g ?? null,
      fat_target_g: macros?.fat ?? profile?.fat_target_g ?? null,
      carbs_target_g: macros?.carbs ?? profile?.carbs_target_g ?? null,
    });
    if (error) {
      Alert.alert('Unable to save', error.message);
      return;
    }
    await refreshProfile();
    Alert.alert('Saved');
  };

  return (
    <Screen>
      <Text style={styles.title}>Daily calorie intake</Text>
      <View style={styles.card}>
        <Text style={styles.label}>Calories</Text>
        <TextInput
          keyboardType="numeric"
          value={calories}
          onChangeText={setCalories}
          style={styles.input}
        />
      </View>
      <Button label="Done" onPress={handleSave} />
    </Screen>
  );
};

const styles = StyleSheet.create({
  title: {
    ...typography.header,
    color: colors.text,
    marginBottom: spacing.lg,
  },
  card: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.lg,
    padding: spacing.lg,
    marginBottom: spacing.lg,
  },
  label: {
    ...typography.caption,
    color: colors.textMuted,
  },
  input: {
    borderBottomWidth: 1,
    borderBottomColor: colors.primary,
    marginTop: spacing.sm,
    paddingVertical: spacing.xs,
    fontSize: 18,
    color: colors.text,
  },
});
