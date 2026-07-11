import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { BullMark, Button, Screen } from '../components';
import { colors, spacing, typography } from '../theme';
import { AuthStackParamList } from '../app/navigation';

type Props = NativeStackScreenProps<AuthStackParamList, 'Welcome'>;

export const WelcomeScreen: React.FC<Props> = ({ navigation }) => {
  return (
    <Screen style={styles.container}>
      <View style={styles.center}>
        <BullMark size={120} />
        <Text style={styles.title}>
          Track-A-<Text style={styles.titleAccent}>Bull</Text>
        </Text>
        <Text style={styles.subtitle}>Fuel up, Bulls. Know what’s on your plate.</Text>
      </View>
      <View style={styles.actions}>
        <Button label="Start" onPress={() => navigation.navigate('SignUp')} />
        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
          <Text style={styles.signInText}>
            Already have an account? <Text style={styles.signInLink}>Sign In</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </Screen>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'space-between',
    paddingBottom: spacing.xl,
  },
  center: {
    alignItems: 'center',
    marginTop: spacing.xl * 2,
    gap: spacing.sm,
  },
  title: {
    ...typography.header,
    color: colors.primary,
    marginTop: spacing.lg,
  },
  titleAccent: {
    color: colors.accentDark,
  },
  subtitle: {
    ...typography.body,
    color: colors.textMuted,
    textAlign: 'center',
  },
  actions: {
    gap: spacing.md,
    alignItems: 'center',
  },
  signInText: {
    ...typography.body,
    color: colors.textMuted,
  },
  signInLink: {
    color: colors.primary,
    fontWeight: '600',
  },
});
