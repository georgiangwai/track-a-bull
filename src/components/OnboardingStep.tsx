import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { colors, radius, spacing, typography } from '../theme';

type OnboardingStepProps = {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  onBack?: () => void;
  onNext?: () => void;
  nextDisabled?: boolean;
};

export const OnboardingStep: React.FC<OnboardingStepProps> = ({
  title,
  subtitle,
  children,
  onBack,
  onNext,
  nextDisabled = false,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{title}</Text>
        {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
      </View>
      <View style={styles.content}>{children}</View>
      <View style={styles.footer}>
        <Pressable onPress={onBack} disabled={!onBack} style={styles.backButton}>
          <Text style={[styles.backText, !onBack && styles.backDisabled]}>Back</Text>
        </Pressable>
        <Pressable
          accessibilityRole="button"
          onPress={onNext}
          disabled={nextDisabled}
          style={({ pressed }) => [
            styles.nextButton,
            nextDisabled && styles.nextDisabled,
            pressed && !nextDisabled && styles.nextPressed,
          ]}
        >
          <Feather name="chevron-right" size={24} color={colors.background} />
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
  },
  header: {
    alignItems: 'center',
    marginTop: spacing.lg,
    gap: spacing.sm,
  },
  title: {
    ...typography.header,
    color: colors.text,
  },
  subtitle: {
    ...typography.body,
    color: colors.textMuted,
    textAlign: 'center',
  },
  content: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: spacing.lg,
  },
  backButton: {
    padding: spacing.sm,
  },
  backText: {
    ...typography.body,
    color: colors.textMuted,
  },
  backDisabled: {
    opacity: 0.4,
  },
  nextButton: {
    backgroundColor: colors.primary,
    width: 54,
    height: 54,
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
    elevation: 3,
  },
  nextDisabled: {
    backgroundColor: colors.border,
  },
  nextPressed: {
    opacity: 0.9,
  },
});
