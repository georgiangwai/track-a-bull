import { useQuery } from '@tanstack/react-query';
import { DiningHall, MealPeriod, MenuItem } from '../types/models';
import { mockMenu } from '../data/mockMenu';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL ?? '';

export const fetchMenu = async (hall: DiningHall, date: string, period: MealPeriod) => {
  if (!supabaseUrl) {
    return mockMenu[hall][period];
  }
  try {
    const response = await fetch(
      `${supabaseUrl}/functions/v1/menu?hall=${hall}&date=${date}&period=${period}`
    );
    if (!response.ok) {
      throw new Error('Menu fetch failed');
    }
    const data: MenuItem[] = await response.json();
    return data;
  } catch (error) {
    return mockMenu[hall][period];
  }
};

export const useMenu = (hall: DiningHall, date: string, period: MealPeriod) => {
  return useQuery({
    queryKey: ['menu', hall, date, period],
    queryFn: () => fetchMenu(hall, date, period),
  });
};
