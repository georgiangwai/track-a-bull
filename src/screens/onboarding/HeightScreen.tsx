import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { OnboardingStep, Screen } from '../../components';
import { useOnboarding } from '../../context/OnboardingContext';
import { colors, radius, spacing, typography } from '../../theme';
import { cmFromFeetInches, feetInchesFromCm } from '../../utils/units';
import { OnboardingStackParamList } from './OnboardingNavigator';

type Props = NativeStackScreenProps<OnboardingStackParamList, 'Height'>;

const cmValues = Array.from({ length: 121 }, (_, i) => i + 120);
const feetValues = [4, 5, 6, 7];
const inchValues = Array.from({ length: 12 }, (_, i) => i);

export const HeightScreen: React.FC<Props> = ({ navigation }) => {
  const { state, update } = useOnboarding();
  const [unit, setUnit] = useState<'cm' | 'ft'>('cm');
  const [cm, setCm] = useState(170);
  const [feet, setFeet] = useState(5);
  const [inches, setInches] = useState(7);

  useEffect(() => {
    if (state.heightCm) {
      setCm(Math.round(state.heightCm));
      const converted = feetInchesFromCm(state.heightCm);
      setFeet(converted.feet);
      setInches(converted.inches);
    }
  }, [state.heightCm]);

  useEffect(() => {
    if (unit === 'cm') {
      update({ heightCm: cm });
    } else {
      update({ heightCm: Math.round(cmFromFeetInches(feet, inches)) });
    }
  }, [unit, cm, feet, inches, update]);

  return (
    <Screen>
      <OnboardingStep
        title="How tall are you?"
        subtitle="The taller you are, the more calories your body needs"
        onBack={() => navigation.goBack()}
        onNext={() => navigation.navigate('Weight')}
        nextDisabled={!state.heightCm}
      >
        <View style={styles.card}>
          <View style={styles.unitToggle}>
            <TouchableOpacity onPress={() => setUnit('cm')}>
              <Text style={[styles.unitText, unit === 'cm' && styles.unitSelected]}>cm</Text>
            </TouchableOpacity>
            <Text style={styles.unitDivider}>|</Text>
            <TouchableOpacity onPress={() => setUnit('ft')}>
              <Text style={[styles.unitText, unit === 'ft' && styles.unitSelected]}>ft/in</Text>
            </TouchableOpacity>
          </View>
          {unit === 'cm' ? (
            <Picker selectedValue={cm} onValueChange={(value) => setCm(Number(value))}>
              {cmValues.map((value) => (
                <Picker.Item key={value} label={`${value}`} value={value} />
              ))}
            </Picker>
          ) : (
            <View style={styles.rowPickers}>
              <Picker
                style={styles.flexPicker}
                selectedValue={feet}
                onValueChange={(value) => setFeet(Number(value))}
              >
                {feetValues.map((value) => (
                  <Picker.Item key={value} label={`${value} ft`} value={value} />
                ))}
              </Picker>
              <Picker
                style={styles.flexPicker}
                selectedValue={inches}
                onValueChange={(value) => setInches(Number(value))}
              >
                {inchValues.map((value) => (
                  <Picker.Item key={value} label={`${value} in`} value={value} />
                ))}
              </Picker>
            </View>
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
  rowPickers: {
    flexDirection: 'row',
  },
  flexPicker: {
    flex: 1,
  },
});
