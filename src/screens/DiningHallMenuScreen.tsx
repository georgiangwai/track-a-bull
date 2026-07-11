import React, { useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  SectionList,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Button, Screen } from '../components';
import { useLocationMenu } from '../services/dineOnCampus';
import { colors, radius, spacing, typography } from '../theme';
import { formatDate } from '../utils/date';
import { DiningStackParamList } from '../app/navigation';
import { MenuItemWithQty } from '../types/models';

type Props = NativeStackScreenProps<DiningStackParamList, 'DiningHallMenu'>;

export const DiningHallMenuScreen: React.FC<Props> = ({ navigation, route }) => {
  const { hallId, hallName } = route.params;
  const [periodId, setPeriodId] = useState<string | undefined>(undefined);
  const [selected, setSelected] = useState<Record<string, MenuItemWithQty>>({});

  const date = formatDate(new Date());
  const { data, isLoading, error, isPlaceholderData } = useLocationMenu(hallId, date, periodId);

  const activePeriodId = periodId ?? data?.activePeriodId ?? undefined;
  const activePeriodName = useMemo(
    () => data?.periods.find((p) => p.id === activePeriodId)?.name ?? 'Meal',
    [data, activePeriodId]
  );

  const sections = useMemo(
    () =>
      (data?.stations ?? []).map((station) => ({
        title: station.name,
        data: station.items,
      })),
    [data]
  );

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
  const selectedCount = selectedItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <Screen>
      <Text style={styles.title}>{hallName}</Text>
      {data && data.periods.length > 1 ? (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.tabs}
          contentContainerStyle={styles.tabsContent}
        >
          {data.periods.map((period) => (
            <Pressable
              key={period.id}
              onPress={() => setPeriodId(period.id)}
              style={[styles.tab, period.id === activePeriodId && styles.tabActive]}
            >
              <Text style={[styles.tabText, period.id === activePeriodId && styles.tabTextActive]}>
                {period.name}
              </Text>
            </Pressable>
          ))}
        </ScrollView>
      ) : null}
      {isLoading ? (
        <ActivityIndicator size="large" color={colors.primary} style={styles.loading} />
      ) : error ? (
        <Text style={styles.error}>
          Unable to load this menu right now. Pull down to retry or pick another location.
        </Text>
      ) : sections.length === 0 ? (
        <Text style={styles.empty}>No menu posted for {activePeriodName.toLowerCase()} today.</Text>
      ) : (
        <View style={styles.listWrap}>
          <SectionList
            style={[styles.listFill, isPlaceholderData && styles.listDimmed]}
            sections={sections}
            keyExtractor={(item) => item.id}
            stickySectionHeadersEnabled={false}
            contentContainerStyle={styles.list}
            renderSectionHeader={({ section }) => (
              <Text style={styles.sectionHeader}>{section.title}</Text>
            )}
            renderItem={({ item }) => {
              const qty = selected[item.id]?.quantity ?? 0;
              return (
                <View style={styles.row}>
                  <View style={styles.itemInfo}>
                    <Text style={styles.itemName}>{item.name}</Text>
                    <Text style={styles.itemCalories}>{item.calories} Calories</Text>
                  </View>
                  {qty > 0 && <Text style={styles.qty}>x{qty}</Text>}
                  <Pressable
                    style={[styles.addButton, qty > 0 && styles.addButtonActive]}
                    onPress={() => handleAdd({ ...item, quantity: 1 })}
                  >
                    <Text style={[styles.addText, qty > 0 && styles.addTextActive]}>+</Text>
                  </Pressable>
                </View>
              );
            }}
          />
          {isPlaceholderData && (
            <ActivityIndicator size="large" color={colors.primary} style={styles.listOverlay} />
          )}
        </View>
      )}
      <Button
        label={selectedCount > 0 ? `View meal (${selectedCount})` : 'View meal'}
        onPress={() =>
          navigation.navigate('MealDetail', {
            hallName,
            periodName: activePeriodName,
            items: selectedItems,
          })
        }
        disabled={selectedItems.length === 0}
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
    marginBottom: spacing.md,
  },
  tabs: {
    flexGrow: 0,
    marginBottom: spacing.md,
  },
  tabsContent: {
    gap: spacing.sm,
    paddingHorizontal: spacing.xs,
  },
  tab: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.border,
  },
  tabActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  tabText: {
    ...typography.body,
    color: colors.textMuted,
  },
  tabTextActive: {
    color: colors.background,
    fontWeight: '600',
  },
  list: {
    paddingBottom: spacing.xxl,
  },
  sectionHeader: {
    ...typography.caption,
    color: colors.accentDark,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginTop: spacing.lg,
    marginBottom: spacing.xs,
  },
  row: {
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    paddingVertical: spacing.md,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: spacing.sm,
  },
  itemInfo: {
    flex: 1,
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
  qty: {
    ...typography.body,
    color: colors.primary,
    fontWeight: '700',
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
  addButtonActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  addText: {
    color: colors.text,
    fontSize: 18,
  },
  addTextActive: {
    color: colors.background,
  },
  viewButton: {
    marginTop: spacing.md,
  },
  loading: {
    flex: 1,
  },
  error: {
    ...typography.body,
    color: colors.error,
  },
  empty: {
    ...typography.body,
    color: colors.textMuted,
    textAlign: 'center',
    marginTop: spacing.xl,
  },
  listWrap: {
    flex: 1,
    minHeight: 0,
  },
  listFill: {
    flex: 1,
  },
  listDimmed: {
    opacity: 0.4,
  },
  listOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
});
