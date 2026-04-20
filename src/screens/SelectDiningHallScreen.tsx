import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Screen } from '../components';
import { colors, radius, spacing, typography } from '../theme';
import { DiningStackParamList } from '../app/navigation';

type Props = NativeStackScreenProps<DiningStackParamList, 'SelectDiningHall'>;

const halls = [
  { id: 'hub', label: 'The Hub' },
  { id: 'juniper', label: 'Juniper Dining' },
  { id: 'argos', label: 'Argos' },
];

export const SelectDiningHallScreen: React.FC<Props> = ({ navigation }) => {
  return (
    <Screen>
      <Text style={styles.title}>Select Dining Hall</Text>
      <View style={styles.list}>
        {halls.map((hall) => (
          <TouchableOpacity
            key={hall.id}
            style={styles.card}
            onPress={() => navigation.navigate('DiningHallMenu', { hall: hall.id })}
          >
            <Text style={styles.cardText}>{hall.label}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </Screen>
  );
};

const styles = StyleSheet.create({
  title: {
    ...typography.header,
    color: colors.primary,
    textAlign: 'center',
    marginBottom: spacing.xl,
  },
  list: {
    gap: spacing.lg,
    alignItems: 'center',
  },
  card: {
    width: '100%',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.lg,
    padding: spacing.lg,
    alignItems: 'center',
    backgroundColor: colors.surface,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  cardText: {
    ...typography.subheader,
    color: colors.primary,
  },
});
