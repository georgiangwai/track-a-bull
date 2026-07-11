import React, { useMemo, useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useQueryClient } from '@tanstack/react-query';
import { AppModal, Button, Screen } from '../components';
import { useAuth } from '../context/AuthContext';
import { saveMealLog } from '../services/logService';
import { colors, spacing, typography } from '../theme';
import { formatDate } from '../utils/date';
import { DiningStackParamList } from '../app/navigation';

type Props = NativeStackScreenProps<DiningStackParamList, 'MealDetail'>;

export const MealDetailScreen: React.FC<Props> = ({ navigation, route }) => {
  const { items, periodName, hallName } = route.params;
  const { session } = useAuth();
  const queryClient = useQueryClient();
  const [saving, setSaving] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const totals = useMemo(() => {
    return items.reduce(
      (acc, item) => ({
        calories: acc.calories + item.calories * item.quantity,
        protein: acc.protein + item.protein_g * item.quantity,
        fat: acc.fat + item.fat_g * item.quantity,
        carbs: acc.carbs + item.carbs_g * item.quantity,
      }),
      { calories: 0, protein: 0, fat: 0, carbs: 0 }
    );
  }, [items]);

  const handleSave = async () => {
    if (!session?.user) return;
    setSaving(true);
    setError(null);
    const date = formatDate(new Date());
    const mealName = `${periodName} · ${hallName}`;
    const { error: saveError } = await saveMealLog(session.user.id, date, mealName, items);
    setSaving(false);
    if (saveError) {
      setError(saveError.message ?? 'Could not save your meal. Please try again.');
    } else {
      await queryClient.invalidateQueries({ queryKey: ['mealLogs'] });
      setShowModal(true);
    }
  };

  return (
    <Screen>
      <Text style={styles.title}>{periodName}</Text>
      <Text style={styles.subtitle}>{hallName}</Text>
      <View style={styles.summary}>
        <View>
          <Text style={styles.summaryValue}>{Math.round(totals.calories)}</Text>
          <Text style={styles.summaryLabel}>Calories</Text>
        </View>
        <View>
          <Text style={styles.summaryValue}>{Math.round(totals.protein)}g</Text>
          <Text style={styles.summaryLabel}>Proteins</Text>
        </View>
        <View>
          <Text style={styles.summaryValue}>{Math.round(totals.fat)}g</Text>
          <Text style={styles.summaryLabel}>Fats</Text>
        </View>
        <View>
          <Text style={styles.summaryValue}>{Math.round(totals.carbs)}g</Text>
          <Text style={styles.summaryLabel}>Carbs</Text>
        </View>
      </View>
      <FlatList
        style={styles.listFill}
        data={items}
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
      {error ? <Text style={styles.error}>{error}</Text> : null}
      <Button label="Save" onPress={handleSave} disabled={saving} />
      {saving && <ActivityIndicator color={colors.primary} style={styles.loading} />}
      <AppModal
        visible={showModal}
        title="Meal Logged"
        message="Your meal has been successfully logged."
        onClose={() => {
          setShowModal(false);
          navigation.popToTop();
        }}
      />
    </Screen>
  );
};

const styles = StyleSheet.create({
  title: {
    ...typography.header,
    color: colors.text,
    textAlign: 'center',
  },
  subtitle: {
    ...typography.body,
    color: colors.textMuted,
    textAlign: 'center',
    marginBottom: spacing.lg,
  },
  summary: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.lg,
  },
  summaryValue: {
    ...typography.subheader,
    color: colors.text,
    textAlign: 'center',
  },
  summaryLabel: {
    ...typography.caption,
    color: colors.textMuted,
    textAlign: 'center',
  },
  listFill: {
    flex: 1,
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
  loading: {
    marginTop: spacing.sm,
  },
  error: {
    ...typography.caption,
    color: colors.error,
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
});
