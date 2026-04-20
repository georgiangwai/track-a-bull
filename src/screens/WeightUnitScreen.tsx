import React, { useEffect, useState } from 'react';
import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Button, Screen } from '../components';
import { colors, radius, spacing, typography } from '../theme';

const STORAGE_KEY = 'weight_unit';

export const WeightUnitScreen: React.FC = () => {
  const [unit, setUnit] = useState<'lb' | 'kg'>('lb');

  useEffect(() => {
    const loadUnit = async () => {
      const saved = await AsyncStorage.getItem(STORAGE_KEY);
      if (saved === 'kg' || saved === 'lb') {
        setUnit(saved);
      }
    };
    loadUnit();
  }, []);

  const handleSave = async () => {
    await AsyncStorage.setItem(STORAGE_KEY, unit);
    Alert.alert('Saved');
  };

  return (
    <Screen>
      <Text style={styles.title}>Weight Unit</Text>
      <View style={styles.options}>
        {(['lb', 'kg'] as const).map((option) => (
          <TouchableOpacity
            key={option}
            style={[styles.option, unit === option && styles.optionSelected]}
            onPress={() => setUnit(option)}
          >
            <Text style={[styles.optionText, unit === option && styles.optionTextSelected]}>
              {option === 'lb' ? 'Pounds (lb)' : 'Kilograms (kg)'}
            </Text>
          </TouchableOpacity>
        ))}
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
  options: {
    gap: spacing.md,
    marginBottom: spacing.lg,
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
