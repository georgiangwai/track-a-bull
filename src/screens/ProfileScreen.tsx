import React, { useCallback, useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useFocusEffect } from '@react-navigation/native';
import { Button, ListRow, Screen } from '../components';
import { useAuth } from '../context/AuthContext';
import { signOut } from '../services/auth';
import { colors, spacing, typography } from '../theme';
import { ProfileStackParamList } from '../app/navigation';

type Props = NativeStackScreenProps<ProfileStackParamList, 'Profile'>;

export const ProfileScreen: React.FC<Props> = ({ navigation }) => {
  const { profile } = useAuth();
  const [weightUnit, setWeightUnit] = useState<'lb' | 'kg'>('lb');

  const loadUnit = useCallback(async () => {
    const saved = await AsyncStorage.getItem('weight_unit');
    if (saved === 'lb' || saved === 'kg') {
      setWeightUnit(saved);
    }
  }, []);

  useEffect(() => {
    loadUnit();
  }, [loadUnit]);

  useFocusEffect(
    useCallback(() => {
      loadUnit();
    }, [loadUnit])
  );

  return (
    <Screen>
      <View style={styles.header}>
        <Text style={styles.title}>{profile?.name ?? 'Profile'}</Text>
        <Text style={styles.subtitle}>{profile?.email ?? ''}</Text>
      </View>
      <View style={styles.section}>
        <ListRow title="Me" rightText=">" onPress={() => navigation.navigate('Me')} />
        <ListRow
          title="Calorie Intake"
          rightText={profile?.calorie_target ? `${profile.calorie_target} Cal` : 'Set'}
          onPress={() => navigation.navigate('CalorieIntake')}
        />
        <ListRow
          title="Weight Unit"
          rightText={weightUnit === 'lb' ? 'Pounds' : 'Kilograms'}
          onPress={() => navigation.navigate('WeightUnit')}
        />
      </View>
      <View style={styles.section}>
        <ListRow title="Contact us" onPress={() => navigation.navigate('ContactUs')} />
        <ListRow title="About app" onPress={() => navigation.navigate('About')} />
      </View>
      <Button label="Logout" variant="ghost" onPress={() => signOut()} />
    </Screen>
  );
};

const styles = StyleSheet.create({
  header: {
    marginBottom: spacing.lg,
  },
  title: {
    ...typography.header,
    color: colors.text,
  },
  subtitle: {
    ...typography.body,
    color: colors.textMuted,
    marginTop: spacing.xs,
  },
  section: {
    borderTopWidth: 1,
    borderTopColor: colors.border,
    marginBottom: spacing.lg,
  },
});
