import React, { useEffect, useState } from 'react';
import { Alert, StyleSheet, Text, TextInput, View } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { Button, Screen } from '../components';
import { useAuth } from '../context/AuthContext';
import { updateProfile } from '../services/profile';
import { colors, radius, spacing, typography } from '../theme';
import { Goal, Lifestyle, Sex } from '../types/models';

const goals: { label: string; value: Goal }[] = [
  { label: 'Lose weight', value: 'lose_weight' },
  { label: 'Keep weight', value: 'keep_weight' },
  { label: 'Gain weight', value: 'gain_weight' },
  { label: 'Eat healthier', value: 'eat_healthier' },
];

const lifestyles: { label: string; value: Lifestyle }[] = [
  { label: 'Sedentary', value: 'sedentary' },
  { label: 'Light', value: 'light' },
  { label: 'Moderate', value: 'moderate' },
  { label: 'Active', value: 'active' },
];

const sexes: { label: string; value: Sex }[] = [
  { label: 'Female', value: 'female' },
  { label: 'Male', value: 'male' },
];

export const MeScreen: React.FC = () => {
  const { profile, refreshProfile, session } = useAuth();
  const [goal, setGoal] = useState<Goal>('keep_weight');
  const [sex, setSex] = useState<Sex>('female');
  const [heightCm, setHeightCm] = useState('170');
  const [weightKg, setWeightKg] = useState('70');
  const [age, setAge] = useState('22');
  const [lifestyle, setLifestyle] = useState<Lifestyle>('moderate');

  useEffect(() => {
    if (!profile) return;
    if (profile.goal) setGoal(profile.goal);
    if (profile.sex) setSex(profile.sex);
    if (profile.height_cm) setHeightCm(String(Math.round(profile.height_cm)));
    if (profile.weight_kg) setWeightKg(String(Math.round(profile.weight_kg)));
    if (profile.age) setAge(String(profile.age));
    if (profile.lifestyle) setLifestyle(profile.lifestyle);
  }, [profile]);

  const handleSave = async () => {
    if (!session?.user) return;
    const { error } = await updateProfile(session.user.id, {
      goal,
      sex,
      height_cm: Number(heightCm),
      weight_kg: Number(weightKg),
      age: Number(age),
      lifestyle,
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
      <Text style={styles.title}>Me</Text>
      <View style={styles.card}>
        <Text style={styles.label}>Goal</Text>
        <Picker selectedValue={goal} onValueChange={(value) => setGoal(value)}>
          {goals.map((item) => (
            <Picker.Item key={item.value} label={item.label} value={item.value} />
          ))}
        </Picker>
      </View>
      <View style={styles.card}>
        <Text style={styles.label}>Sex</Text>
        <Picker selectedValue={sex} onValueChange={(value) => setSex(value)}>
          {sexes.map((item) => (
            <Picker.Item key={item.value} label={item.label} value={item.value} />
          ))}
        </Picker>
      </View>
      <View style={styles.row}>
        <View style={[styles.card, styles.flex]}>
          <Text style={styles.label}>Height (cm)</Text>
          <TextInput
            keyboardType="numeric"
            value={heightCm}
            onChangeText={setHeightCm}
            style={styles.input}
          />
        </View>
        <View style={[styles.card, styles.flex]}>
          <Text style={styles.label}>Weight (kg)</Text>
          <TextInput
            keyboardType="numeric"
            value={weightKg}
            onChangeText={setWeightKg}
            style={styles.input}
          />
        </View>
      </View>
      <View style={styles.card}>
        <Text style={styles.label}>Age</Text>
        <TextInput keyboardType="numeric" value={age} onChangeText={setAge} style={styles.input} />
      </View>
      <View style={styles.card}>
        <Text style={styles.label}>Lifestyle</Text>
        <Picker selectedValue={lifestyle} onValueChange={(value) => setLifestyle(value)}>
          {lifestyles.map((item) => (
            <Picker.Item key={item.value} label={item.label} value={item.value} />
          ))}
        </Picker>
      </View>
      <Button label="Save" onPress={handleSave} />
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
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  label: {
    ...typography.caption,
    color: colors.textMuted,
  },
  input: {
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    marginTop: spacing.sm,
    paddingVertical: spacing.xs,
    color: colors.text,
  },
  row: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  flex: {
    flex: 1,
  },
});
