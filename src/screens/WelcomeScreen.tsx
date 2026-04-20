import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Button, Screen } from '../components';
import { colors, spacing, typography } from '../theme';
import { AuthStackParamList } from '../app/navigation';

type Props = NativeStackScreenProps<AuthStackParamList, 'Welcome'>;

export const WelcomeScreen: React.FC<Props> = ({ navigation }) => {
  return (
    <Screen style={styles.container}>
      <View style={styles.center}>
        <Image source={require('../../assets/icon.png')} style={styles.logo} />
        <Text style={styles.title}>Welcome</Text>
        <Text style={styles.subtitle}>Start or sign in to your account</Text>
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
    marginTop: spacing.xl,
  },
  logo: {
    width: 96,
    height: 96,
    marginBottom: spacing.lg,
    resizeMode: 'contain',
  },
  title: {
    ...typography.header,
    color: colors.text,
  },
  subtitle: {
    ...typography.body,
    color: colors.textMuted,
    marginTop: spacing.sm,
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
