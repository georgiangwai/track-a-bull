import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { OnboardingStep, Screen } from '../../components';
import { useOnboarding } from '../../context/OnboardingContext';
import { colors, radius, spacing, typography } from '../../theme';
import { kgFromLbs, lbsFromKg } from '../../utils/units';
import { OnboardingStackParamList } from './OnboardingNavigator';

type Props = NativeStackScreenProps<OnboardingStackParamList, 'Weight'>;

const kgValues = Array.from({ length: 161 }, (_, i) => i + 40);
const lbValues = Array.from({ length: 211 }, (_, i) => i + 90);

export const WeightScreen: React.FC<Props> = ({ navigation }) => {
  const { state, update } = useOnboarding();
  const [unit, setUnit] = useState<'kg' | 'lb'>('lb');
  const [kg, setKg] = useState(70);
  const [lb, setLb] = useState(150);

  useEffect(() => {
    if (state.weightKg) {
      setKg(Math.round(state.weightKg));
      setLb(Math.round(lbsFromKg(state.weightKg)));
    }
  }, [state.weightKg]);

  useEffect(() => {
    if (unit === 'kg') {
      update({ weightKg: kg });
    } else {
      update({ weightKg: Math.round(kgFromLbs(lb)) });
    }
  }, [unit, kg, lb, update]);

  return (
    <Screen>
      <OnboardingStep
        title="What’s your weight?"
        subtitle="The more you weigh, the more calories your body burns"
        onBack={() => navigation.goBack()}
        onNext={() => navigation.navigate('Age')}
        nextDisabled={!state.weightKg}
      >
        <View style={styles.card}>
          <View style={styles.unitToggle}>
            <TouchableOpacity onPress={() => setUnit('lb')}>
              <Text style={[styles.unitText, unit === 'lb' && styles.unitSelected]}>lb</Text>
            </TouchableOpacity>
            <Text style={styles.unitDivider}>|</Text>
            <TouchableOpacity onPress={() => setUnit('kg')}>
              <Text style={[styles.unitText, unit === 'kg' && styles.unitSelected]}>kg</Text>
            </TouchableOpacity>
          </View>
          {unit === 'kg' ? (
            <Picker selectedValue={kg} onValueChange={(value) => setKg(Number(value))}>
              {kgValues.map((value) => (
                <Picker.Item key={value} label={`${value}`} value={value} />
              ))}
            </Picker>
          ) : (
            <Picker selectedValue={lb} onValueChange={(value) => setLb(Number(value))}>
              {lbValues.map((value) => (
                <Picker.Item key={value} label={`${value}`} value={value} />
              ))}
            </Picker>
          )}
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
    padding: spacing.md,
  },
  unitToggle: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
  unitText: {
    ...typography.body,
    color: colors.textMuted,
  },
  unitSelected: {
    color: colors.primary,
    fontWeight: '600',
  },
  unitDivider: {
    color: colors.textMuted,
  },
});
