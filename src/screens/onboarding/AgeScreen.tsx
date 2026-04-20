import React, { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { OnboardingStep, Screen } from '../../components';
import { useOnboarding } from '../../context/OnboardingContext';
import { colors, radius, spacing } from '../../theme';
import { OnboardingStackParamList } from './OnboardingNavigator';

type Props = NativeStackScreenProps<OnboardingStackParamList, 'Age'>;

const ageValues = Array.from({ length: 68 }, (_, i) => i + 13);

export const AgeScreen: React.FC<Props> = ({ navigation }) => {
  const { state, update } = useOnboarding();
  const [age, setAge] = useState(22);

  useEffect(() => {
    if (state.age) {
      setAge(state.age);
    }
  }, [state.age]);

  useEffect(() => {
    update({ age });
  }, [age, update]);

  return (
    <Screen>
      <OnboardingStep
        title="What’s your age?"
        subtitle="Required number of calories varies with age"
        onBack={() => navigation.goBack()}
        onNext={() => navigation.navigate('Lifestyle')}
        nextDisabled={!state.age}
      >
        <View style={styles.card}>
          <Picker selectedValue={age} onValueChange={(value) => setAge(Number(value))}>
            {ageValues.map((value) => (
              <Picker.Item key={value} label={`${value} years`} value={value} />
            ))}
          </Picker>
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
});
