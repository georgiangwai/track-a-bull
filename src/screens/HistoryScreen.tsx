import React, { useMemo } from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Screen } from '../components';
import { useAuth } from '../context/AuthContext';
import { useMealLogs } from '../services/logService';
import { colors, spacing, typography } from '../theme';
import { formatDisplayDate } from '../utils/date';
import { HistoryStackParamList } from '../app/navigation';

type Props = NativeStackScreenProps<HistoryStackParamList, 'History'>;

export const HistoryScreen: React.FC<Props> = ({ navigation }) => {
  const { session } = useAuth();
  const { data: logs } = useMealLogs(session?.user?.id);

  const grouped = useMemo(() => {
    const groups: Record<string, NonNullable<typeof logs>> = {};
    (logs ?? []).forEach((log) => {
      if (!groups[log.date]) {
        groups[log.date] = [];
      }
      groups[log.date]?.push(log);
    });
    return Object.entries(groups);
  }, [logs]);

  return (
    <Screen>
      <Text style={styles.title}>History</Text>
      <FlatList
        data={grouped}
        keyExtractor={([date]) => date}
        renderItem={({ item }) => {
          const [date, items] = item;
          return (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>{formatDisplayDate(date)}</Text>
              {items?.map((meal) => (
                <TouchableOpacity
                  key={meal.id}
                  style={styles.row}
                  onPress={() => navigation.navigate('HistoryDetail', { meal })}
                >
                  <Text style={styles.mealName}>{meal.meal_name}</Text>
                  <Text style={styles.mealCalories}>
                    {meal.items.reduce((sum, item) => sum + item.calories * item.quantity, 0)} Cal
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          );
        }}
        ListEmptyComponent={<Text style={styles.empty}>No meals logged yet.</Text>}
      />
    </Screen>
  );
};

const styles = StyleSheet.create({
  title: {
    ...typography.header,
    color: colors.text,
    marginBottom: spacing.lg,
  },
  section: {
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    ...typography.subheader,
    color: colors.text,
    marginBottom: spacing.sm,
  },
  row: {
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  mealName: {
    ...typography.body,
    color: colors.text,
  },
  mealCalories: {
    ...typography.body,
    color: colors.textMuted,
  },
  empty: {
    ...typography.body,
    color: colors.textMuted,
  },
});
