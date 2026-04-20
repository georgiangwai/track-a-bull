import React from 'react';
import { StyleSheet, Text } from 'react-native';
import { Screen } from '../components';
import { colors, spacing, typography } from '../theme';

export const AboutScreen: React.FC = () => {
  return (
    <Screen>
      <Text style={styles.title}>About app</Text>
      <Text style={styles.body}>
        Track-A-Bull helps USF students log dining hall meals, track macros, and stay on top of
        daily calorie goals.
      </Text>
      <Text style={styles.caption}>Version 0.1.0</Text>
    </Screen>
  );
};

const styles = StyleSheet.create({
  title: {
    ...typography.header,
    color: colors.text,
    marginBottom: spacing.md,
  },
  body: {
    ...typography.body,
    color: colors.textMuted,
  },
  caption: {
    ...typography.caption,
    color: colors.textMuted,
    marginTop: spacing.xl,
  },
});
