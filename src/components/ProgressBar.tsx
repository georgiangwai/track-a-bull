import React from 'react';
import { StyleSheet, Text, View, ViewStyle } from 'react-native';
import { colors, spacing, typography } from '../theme';

type ProgressBarProps = {
  label: string;
  value: number;
  max: number;
  color?: string;
  style?: ViewStyle;
};

export const ProgressBar: React.FC<ProgressBarProps> = ({
  label,
  value,
  max,
  color = colors.primary,
  style,
}) => {
  const progress = Math.min(value / max, 1);

  return (
    <View style={[styles.container, style]}>
      <View style={styles.header}>
        <Text style={styles.label}>{label}</Text>
        <Text style={styles.value}>{Math.round(value)}/{Math.round(max)}g</Text>
      </View>
      <View style={styles.track}>
        <View style={[styles.fill, { width: `${progress * 100}%`, backgroundColor: color }]} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: spacing.xs,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  label: {
    ...typography.body,
    color: colors.textMuted,
  },
  value: {
    ...typography.body,
    color: colors.text,
  },
  track: {
    height: 8,
    borderRadius: 8,
    backgroundColor: colors.border,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
  },
});
