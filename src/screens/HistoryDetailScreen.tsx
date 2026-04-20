import React from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Screen } from '../components';
import { colors, spacing, typography } from '../theme';
import { formatDisplayDate } from '../utils/date';
import { HistoryStackParamList } from '../app/navigation';

type Props = NativeStackScreenProps<HistoryStackParamList, 'HistoryDetail'>;

export const HistoryDetailScreen: React.FC<Props> = ({ route }) => {
  const { meal } = route.params;

  return (
    <Screen>
      <Text style={styles.title}>{meal.meal_name}</Text>
      <Text style={styles.subtitle}>{formatDisplayDate(meal.date)}</Text>
      <FlatList
        data={meal.items}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.row}>
            <Text style={styles.itemName}>
              {item.name} {item.quantity > 1 ? `x${item.quantity}` : ''}
            </Text>
            <Text style={styles.itemCalories}>{item.calories * item.quantity} Cal</Text>
          </View>
        )}
      />
    </Screen>
  );
};

const styles = StyleSheet.create({
  title: {
    ...typography.header,
    color: colors.text,
  },
  subtitle: {
    ...typography.caption,
    color: colors.textMuted,
    marginBottom: spacing.lg,
  },
  row: {
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    paddingVertical: spacing.md,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  itemName: {
    ...typography.body,
    color: colors.text,
  },
  itemCalories: {
    ...typography.body,
    color: colors.textMuted,
  },
});
