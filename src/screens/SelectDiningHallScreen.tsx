import React, { useMemo } from 'react';
import { ActivityIndicator, SectionList, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Screen } from '../components';
import { useDiningLocations } from '../services/dineOnCampus';
import { colors, radius, spacing, typography } from '../theme';
import { DiningStackParamList } from '../app/navigation';

type Props = NativeStackScreenProps<DiningStackParamList, 'SelectDiningHall'>;

export const SelectDiningHallScreen: React.FC<Props> = ({ navigation }) => {
  const { data: locations, isLoading } = useDiningLocations();

  const sections = useMemo(() => {
    const byGroup = new Map<string, { id: string; name: string }[]>();
    (locations ?? []).forEach((loc) => {
      const group = byGroup.get(loc.group) ?? [];
      group.push({ id: loc.id, name: loc.name });
      byGroup.set(loc.group, group);
    });
    return Array.from(byGroup, ([title, data]) => ({ title, data }));
  }, [locations]);

  return (
    <Screen>
      <Text style={styles.title}>Where are you eating?</Text>
      {isLoading ? (
        <ActivityIndicator size="large" color={colors.primary} />
      ) : (
        <SectionList
          style={styles.listFill}
          sections={sections}
          keyExtractor={(item) => item.id}
          stickySectionHeadersEnabled={false}
          contentContainerStyle={styles.list}
          renderSectionHeader={({ section }) => (
            <Text style={styles.sectionHeader}>{section.title}</Text>
          )}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.card}
              onPress={() =>
                navigation.navigate('DiningHallMenu', { hallId: item.id, hallName: item.name })
              }
            >
              <Text style={styles.cardText}>{item.name}</Text>
            </TouchableOpacity>
          )}
        />
      )}
    </Screen>
  );
};

const styles = StyleSheet.create({
  title: {
    ...typography.header,
    color: colors.primary,
    textAlign: 'center',
    marginBottom: spacing.lg,
  },
  list: {
    paddingBottom: spacing.xxl,
  },
  listFill: {
    flex: 1,
  },
  sectionHeader: {
    ...typography.caption,
    color: colors.accentDark,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginTop: spacing.lg,
    marginBottom: spacing.sm,
  },
  card: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.lg,
    padding: spacing.md,
    marginBottom: spacing.sm,
    backgroundColor: colors.surface,
  },
  cardText: {
    ...typography.body,
    color: colors.text,
    fontWeight: '600',
  },
});
