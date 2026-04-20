import React, { useMemo, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Button, Screen } from '../components';
import { useMenu } from '../services/menuService';
import { colors, radius, spacing, typography } from '../theme';
import { formatDate } from '../utils/date';
import { DiningStackParamList } from '../app/navigation';
import { MealPeriod, MenuItemWithQty } from '../types/models';

type Props = NativeStackScreenProps<DiningStackParamList, 'DiningHallMenu'>;

const periodTabs: MealPeriod[] = ['breakfast', 'lunch', 'dinner'];

export const DiningHallMenuScreen: React.FC<Props> = ({ navigation, route }) => {
  const { hall } = route.params;
  const [period, setPeriod] = useState<MealPeriod>('breakfast');
  const [selected, setSelected] = useState<Record<string, MenuItemWithQty>>({});

  const date = formatDate(new Date());
  const { data, isLoading, error } = useMenu(hall, date, period);

  const items = useMemo(() => data ?? [], [data]);

  const handleAdd = (item: MenuItemWithQty) => {
    setSelected((prev) => {
      const existing = prev[item.id];
      return {
        ...prev,
        [item.id]: { ...item, quantity: (existing?.quantity ?? 0) + 1 },
      };
    });
  };

  const selectedItems = Object.values(selected);
  const hasItems = selectedItems.length > 0;

  return (
    <Screen>
      <Text style={styles.title}>{hall === 'hub' ? 'The Hub' : hall === 'juniper' ? 'Juniper Dining' : 'Argos'}</Text>
      <View style={styles.tabs}>
        {periodTabs.map((tab) => (
          <Pressable
            key={tab}
            onPress={() => setPeriod(tab)}
            style={[styles.tab, period === tab && styles.tabActive]}
          >
            <Text style={[styles.tabText, period === tab && styles.tabTextActive]}>
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </Text>
          </Pressable>
        ))}
      </View>
      {isLoading ? (
        <ActivityIndicator size="large" color={colors.primary} />
      ) : error ? (
        <Text style={styles.error}>Unable to load menu.</Text>
      ) : (
        <FlatList
          data={items}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => (
            <View style={styles.row}>
              <View>
                <Text style={styles.itemName}>{item.name}</Text>
                <Text style={styles.itemCalories}>{item.calories} Calories</Text>
              </View>
              <Pressable style={styles.addButton} onPress={() => handleAdd({ ...item, quantity: 1 })}>
                <Text style={styles.addText}>+</Text>
              </Pressable>
            </View>
          )}
        />
      )}
      <Button
        label="View meal"
        onPress={() =>
          navigation.navigate('MealDetail', {
            hall,
            period,
            items: selectedItems,
          })
        }
        disabled={!hasItems}
        style={styles.viewButton}
      />
    </Screen>
  );
};

const styles = StyleSheet.create({
  title: {
    ...typography.header,
    color: colors.text,
    textAlign: 'center',
    marginBottom: spacing.lg,
  },
  tabs: {
    flexDirection: 'row',
    gap: spacing.md,
    justifyContent: 'center',
    marginBottom: spacing.lg,
  },
  tab: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
  },
  tabActive: {
    borderBottomWidth: 2,
    borderBottomColor: colors.primary,
  },
  tabText: {
    ...typography.body,
    color: colors.textMuted,
  },
  tabTextActive: {
    color: colors.primary,
    fontWeight: '600',
  },
  list: {
    paddingBottom: spacing.xxl,
  },
  row: {
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    paddingVertical: spacing.md,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  itemName: {
    ...typography.body,
    color: colors.text,
  },
  itemCalories: {
    ...typography.caption,
    color: colors.textMuted,
    marginTop: spacing.xs,
  },
  addButton: {
    width: 28,
    height: 28,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.textMuted,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addText: {
    color: colors.text,
    fontSize: 18,
  },
  viewButton: {
    marginTop: spacing.md,
  },
  error: {
    ...typography.body,
    color: colors.error,
  },
});
