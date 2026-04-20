import React, { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Button, CalorieRing, ProgressBar, Screen } from '../components';
import { useAuth } from '../context/AuthContext';
import { useMealLogs } from '../services/logService';
import { colors, spacing, typography } from '../theme';
import { formatDate } from '../utils/date';
import { DiningStackParamList } from '../app/navigation';

type Props = NativeStackScreenProps<DiningStackParamList, 'Dashboard'>;

export const DashboardScreen: React.FC<Props> = ({ navigation }) => {
  const { profile, session } = useAuth();
  const { data: logs } = useMealLogs(session?.user?.id);
  const today = formatDate(new Date());

  const totals = useMemo(() => {
    const todayLogs = logs?.filter((log) => log.date === today) ?? [];
    return todayLogs.reduce(
      (acc, log) => {
        log.items.forEach((item) => {
          acc.calories += item.calories * item.quantity;
          acc.protein += item.protein_g * item.quantity;
          acc.fat += item.fat_g * item.quantity;
          acc.carbs += item.carbs_g * item.quantity;
        });
        return acc;
      },
      { calories: 0, protein: 0, fat: 0, carbs: 0 }
    );
  }, [logs, today]);

  return (
    <Screen>
      <View style={styles.header}>
        <Text style={styles.name}>Welcome{profile?.name ? `, ${profile.name}` : ''}</Text>
        <Text style={styles.date}>{new Date().toLocaleDateString()}</Text>
      </View>
      <Button
        label="Pick Your Dining Hall"
        onPress={() => navigation.navigate('SelectDiningHall')}
        variant="outline"
      />
      <View style={styles.ringContainer}>
        <CalorieRing value={totals.calories} max={profile?.calorie_target ?? 2000} />
      </View>
      <View style={styles.macros}>
        <ProgressBar
          label="Protein"
          value={totals.protein}
          max={profile?.protein_target_g ?? 130}
          color="#0EA5A8"
        />
        <ProgressBar
          label="Fats"
          value={totals.fat}
          max={profile?.fat_target_g ?? 70}
          color="#F59E0B"
        />
        <ProgressBar
          label="Carbs"
          value={totals.carbs}
          max={profile?.carbs_target_g ?? 300}
          color="#EC4899"
        />
      </View>
      <View style={styles.meals}>
        <Text style={styles.sectionTitle}>Meals</Text>
        {(logs ?? [])
          .filter((log) => log.date === today)
          .map((log) => (
            <View key={log.id} style={styles.mealRow}>
              <Text style={styles.mealName}>{log.meal_name}</Text>
              <Text style={styles.mealCalories}>
                {log.items.reduce((sum, item) => sum + item.calories * item.quantity, 0)} Cal
              </Text>
            </View>
          ))}
        {!logs?.some((log) => log.date === today) && (
          <Text style={styles.empty}>No meals logged yet.</Text>
        )}
      </View>
    </Screen>
  );
};

const styles = StyleSheet.create({
  header: {
    marginBottom: spacing.lg,
  },
  name: {
    ...typography.header,
    color: colors.text,
  },
  date: {
    ...typography.body,
    color: colors.textMuted,
    marginTop: spacing.xs,
  },
  ringContainer: {
    alignItems: 'center',
    marginVertical: spacing.lg,
  },
  macros: {
    gap: spacing.md,
    marginBottom: spacing.lg,
  },
  meals: {
    gap: spacing.sm,
  },
  sectionTitle: {
    ...typography.subheader,
    color: colors.text,
  },
  mealRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
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
