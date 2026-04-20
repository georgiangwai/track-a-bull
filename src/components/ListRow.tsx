import React from 'react';
import { Pressable, StyleSheet, Text, View, ViewStyle } from 'react-native';
import { colors, spacing, typography } from '../theme';

type ListRowProps = {
  title: string;
  subtitle?: string;
  rightText?: string;
  onPress?: () => void;
  style?: ViewStyle;
};

export const ListRow: React.FC<ListRowProps> = ({
  title,
  subtitle,
  rightText,
  onPress,
  style,
}) => {
  const Container = onPress ? Pressable : View;

  return (
    <Container
      style={[styles.row, style]}
      {...(onPress ? { onPress } : undefined)}
    >
      <View style={styles.textBlock}>
        <Text style={styles.title}>{title}</Text>
        {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
      </View>
      {rightText ? <Text style={styles.right}>{rightText}</Text> : null}
    </Container>
  );
};

const styles = StyleSheet.create({
  row: {
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  textBlock: {
    flex: 1,
    paddingRight: spacing.md,
  },
  title: {
    ...typography.body,
    color: colors.text,
  },
  subtitle: {
    ...typography.caption,
    color: colors.textMuted,
    marginTop: spacing.xs,
  },
  right: {
    ...typography.body,
    color: colors.primary,
  },
});
