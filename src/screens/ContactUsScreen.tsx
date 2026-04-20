import React, { useState } from 'react';
import { Alert, StyleSheet, Text, TextInput, View } from 'react-native';
import { Button, Screen } from '../components';
import { colors, radius, spacing, typography } from '../theme';

export const ContactUsScreen: React.FC = () => {
  const [message, setMessage] = useState('');

  return (
    <Screen>
      <Text style={styles.title}>Contact us</Text>
      <Text style={styles.subtitle}>
        Don’t hesitate to contact us if you find a bug or have a suggestion.
      </Text>
      <View style={styles.card}>
        <Text style={styles.label}>Message</Text>
        <TextInput
          multiline
          value={message}
          onChangeText={setMessage}
          placeholder="I found a bug..."
          placeholderTextColor={colors.textMuted}
          style={styles.input}
        />
        <Button
          label="Send"
          onPress={() => {
            setMessage('');
            Alert.alert('Thanks for the feedback!');
          }}
        />
      </View>
    </Screen>
  );
};

const styles = StyleSheet.create({
  title: {
    ...typography.header,
    color: colors.text,
    marginBottom: spacing.sm,
  },
  subtitle: {
    ...typography.body,
    color: colors.textMuted,
    marginBottom: spacing.lg,
  },
  card: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.lg,
    padding: spacing.lg,
    gap: spacing.md,
  },
  label: {
    ...typography.caption,
    color: colors.textMuted,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.lg,
    padding: spacing.md,
    minHeight: 120,
    color: colors.text,
  },
});
