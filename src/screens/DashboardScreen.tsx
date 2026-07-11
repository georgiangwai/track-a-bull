import React, { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useQueryClient } from '@tanstack/react-query';
import { Feather } from '@expo/vector-icons';
import { Button, CalorieRing, ProgressBar, Screen } from '../components';
import { useAuth } from '../context/AuthContext';
import { deleteMealLog, useMealLogs } from '../services/logService';
import { colors, spacing, typography } from '../theme';
import { formatDate } from '../utils/date';
import { DiningStackParamList } from '../app/navigation';
import { MealLog } from '../types/models';

type Props = NativeStackScreenProps<DiningStackParamList, 'Dashboard'>;

const PERIOD_SECTIONS = ['Breakfast', 'Lunch', 'Dinner'];

const periodOf = (log: MealLog) => {
  const prefix = log.meal_name.split(' · ')[0];
  return PERIOD_SECTIONS.includes(prefix) ? prefix : 'Other';
};

const hallOf = (log: MealLog) => log.meal_name.split(' · ')[1] ?? log.meal_name;

const logCalories = (log: MealLog) =>
  log.items.reduce((sum, item) => sum + item.calories * item.quantity, 0);

export const DashboardScreen: React.FC<Props> = ({ navigation }) => {
  const { profile, session } = useAuth();
  const { data: logs } = useMealLogs(session?.user?.id);
  const queryClient = useQueryClient();
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const today = formatDate(new Date());

  const todayLogs = useMemo(() => logs?.filter((log) => log.date === today) ?? [], [logs, today]);

  const totals = useMemo(() => {
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
  }, [todayLogs]);

  const sections = useMemo(() => {
    const names = [...PERIOD_SECTIONS];
    if (todayLogs.some((log) => periodOf(log) === 'Other')) {
      names.push('Other');
    }
    return names.map((name) => ({
      name,
      logs: todayLogs.filter((log) => periodOf(log) === name),
    }));
  }, [todayLogs]);

  const handleDelete = async (logId: string) => {
    setDeletingId(logId);
    setDeleteError(null);
    const { error } = await deleteMealLog(logId);
    setDeletingId(null);
    if (error) {
      setDeleteError(error.message ?? 'Could not delete that meal.');
    } else {
      await queryClient.invalidateQueries({ queryKey: ['mealLogs'] });
    }
  };

  return (
    <Screen>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
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
          <Text style={styles.sectionTitle}>Today’s Meals</Text>
          {deleteError ? <Text style={styles.error}>{deleteError}</Text> : null}
          {sections.map((section) => (
            <View key={section.name} style={styles.periodSection}>
              <Text style={styles.periodTitle}>{section.name}</Text>
              {section.logs.length === 0 ? (
                <Text style={styles.empty}>Nothing logged.</Text>
              ) : (
                section.logs.map((log) => (
                  <View key={log.id} style={styles.mealRow}>
                    <View style={styles.mealInfo}>
                      <Text style={styles.mealName}>{hallOf(log)}</Text>
                      <Text style={styles.mealItems} numberOfLines={1}>
                        {log.items.map((item) => item.name).join(', ')}
                      </Text>
                    </View>
                    <Text style={styles.mealCalories}>{logCalories(log)} Cal</Text>
                    <Pressable
                      style={styles.deleteButton}
                      disabled={deletingId === log.id}
                      onPress={() => handleDelete(log.id)}
                      hitSlop={8}
                    >
                      <Feather
                        name="trash-2"
                        size={18}
                        color={deletingId === log.id ? colors.textMuted : colors.error}
                      />
                    </Pressable>
                  </View>
                ))
              )}
            </View>
          ))}
        </View>
      </ScrollView>
    </Screen>
  );
};

const styles = StyleSheet.create({
  scroll: {
    paddingBottom: spacing.xxl,
  },
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
  periodSection: {
    marginTop: spacing.sm,
  },
  periodTitle: {
    ...typography.caption,
    color: colors.accentDark,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: spacing.xs,
  },
  mealRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  mealInfo: {
    flex: 1,
  },
  mealName: {
    ...typography.body,
    color: colors.text,
  },
  mealItems: {
    ...typography.caption,
    color: colors.textMuted,
    marginTop: 2,
  },
  mealCalories: {
    ...typography.body,
    color: colors.textMuted,
  },
  deleteButton: {
    padding: spacing.xs,
  },
  empty: {
    ...typography.caption,
    color: colors.textMuted,
    marginBottom: spacing.xs,
  },
  error: {
    ...typography.caption,
    color: colors.error,
  },
});
