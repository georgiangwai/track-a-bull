import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Feather } from '@expo/vector-icons';
import {
  AboutScreen,
  ContactUsScreen,
  DashboardScreen,
  DiningHallMenuScreen,
  ForgotPasswordScreen,
  HistoryScreen,
  HistoryDetailScreen,
  LoginScreen,
  MealDetailScreen,
  MeScreen,
  ProfileScreen,
  SelectDiningHallScreen,
  SignUpScreen,
  CalorieIntakeScreen,
  WeightUnitScreen,
  WelcomeScreen,
} from '../screens';
import { OnboardingNavigator } from '../screens/onboarding/OnboardingNavigator';
import { colors } from '../theme';

export type AuthStackParamList = {
  Welcome: undefined;
  Login: undefined;
  SignUp: undefined;
  ForgotPassword: undefined;
};

export type MainTabParamList = {
  Dashboard: undefined;
  History: undefined;
  Profile: undefined;
};

const AuthStack = createNativeStackNavigator<AuthStackParamList>();
const Tab = createBottomTabNavigator<MainTabParamList>();
const DiningStack = createNativeStackNavigator<DiningStackParamList>();
const HistoryStack = createNativeStackNavigator<HistoryStackParamList>();
const ProfileStack = createNativeStackNavigator<ProfileStackParamList>();

export type DiningStackParamList = {
  Dashboard: undefined;
  SelectDiningHall: undefined;
  DiningHallMenu: { hall: 'hub' | 'juniper' | 'argos' };
  MealDetail: {
    hall: 'hub' | 'juniper' | 'argos';
    period: 'breakfast' | 'lunch' | 'dinner';
    items: { id: string; name: string; calories: number; protein_g: number; fat_g: number; carbs_g: number; quantity: number }[];
  };
};

export type HistoryStackParamList = {
  History: undefined;
  HistoryDetail: {
    meal: {
      id: string;
      meal_name: string;
      date: string;
      items: { id: string; name: string; calories: number; quantity: number }[];
    };
  };
};

export type ProfileStackParamList = {
  Profile: undefined;
  Me: undefined;
  CalorieIntake: undefined;
  WeightUnit: undefined;
  ContactUs: undefined;
  About: undefined;
};

const AuthStackNavigator = () => (
  <AuthStack.Navigator screenOptions={{ headerShown: false }}>
    <AuthStack.Screen name="Welcome" component={WelcomeScreen} />
    <AuthStack.Screen name="Login" component={LoginScreen} />
    <AuthStack.Screen name="SignUp" component={SignUpScreen} />
    <AuthStack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
  </AuthStack.Navigator>
);

const DiningStackNavigator = () => (
  <DiningStack.Navigator screenOptions={{ headerShown: false }}>
    <DiningStack.Screen name="Dashboard" component={DashboardScreen} />
    <DiningStack.Screen name="SelectDiningHall" component={SelectDiningHallScreen} />
    <DiningStack.Screen name="DiningHallMenu" component={DiningHallMenuScreen} />
    <DiningStack.Screen name="MealDetail" component={MealDetailScreen} />
  </DiningStack.Navigator>
);

const HistoryStackNavigator = () => (
  <HistoryStack.Navigator screenOptions={{ headerShown: false }}>
    <HistoryStack.Screen name="History" component={HistoryScreen} />
    <HistoryStack.Screen name="HistoryDetail" component={HistoryDetailScreen} />
  </HistoryStack.Navigator>
);

const ProfileStackNavigator = () => (
  <ProfileStack.Navigator screenOptions={{ headerShown: false }}>
    <ProfileStack.Screen name="Profile" component={ProfileScreen} />
    <ProfileStack.Screen name="Me" component={MeScreen} />
    <ProfileStack.Screen name="CalorieIntake" component={CalorieIntakeScreen} />
    <ProfileStack.Screen name="WeightUnit" component={WeightUnitScreen} />
    <ProfileStack.Screen name="ContactUs" component={ContactUsScreen} />
    <ProfileStack.Screen name="About" component={AboutScreen} />
  </ProfileStack.Navigator>
);

const MainTabsNavigator = () => (
  <Tab.Navigator
    screenOptions={{
      headerShown: false,
      tabBarActiveTintColor: colors.primary,
      tabBarInactiveTintColor: colors.textMuted,
    }}
  >
    <Tab.Screen
      name="Dashboard"
      component={DiningStackNavigator}
      options={{
        tabBarIcon: ({ color, size }) => <Feather name="home" size={size} color={color} />,
      }}
    />
    <Tab.Screen
      name="History"
      component={HistoryStackNavigator}
      options={{
        tabBarIcon: ({ color, size }) => <Feather name="clock" size={size} color={color} />,
      }}
    />
    <Tab.Screen
      name="Profile"
      component={ProfileStackNavigator}
      options={{
        tabBarIcon: ({ color, size }) => <Feather name="user" size={size} color={color} />,
      }}
    />
  </Tab.Navigator>
);

type AppNavigationProps = {
  isAuthenticated: boolean;
  needsOnboarding: boolean;
};

export const AppNavigation: React.FC<AppNavigationProps> = ({
  isAuthenticated,
  needsOnboarding,
}) => {
  return (
    <NavigationContainer>
      {!isAuthenticated && <AuthStackNavigator />}
      {isAuthenticated && needsOnboarding && <OnboardingNavigator />}
      {isAuthenticated && !needsOnboarding && <MainTabsNavigator />}
    </NavigationContainer>
  );
};
