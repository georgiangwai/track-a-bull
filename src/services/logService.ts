import { useQuery } from '@tanstack/react-query';
import { supabase } from './supabase';
import { MenuItemWithQty, MealLog } from '../types/models';

export const saveMealLog = async (
  userId: string,
  date: string,
  mealName: string,
  items: MenuItemWithQty[]
) => {
  const { error: menuError } = await supabase.from('menu_items').upsert(
    items.map((item) => ({
      id: item.id,
      name: item.name,
      calories: item.calories,
      protein_g: item.protein_g,
      fat_g: item.fat_g,
      carbs_g: item.carbs_g,
    })),
    { onConflict: 'id' }
  );

  if (menuError) {
    return { error: menuError };
  }

  const { data: log, error: logError } = await supabase
    .from('meal_logs')
    .insert({ user_id: userId, date, meal_name: mealName })
    .select()
    .single();

  if (logError || !log) {
    return { error: logError };
  }

  const logItems = items.map((item) => ({
    meal_log_id: log.id,
    menu_item_id: item.id,
    quantity: item.quantity,
  }));

  const { error: itemsError } = await supabase.from('meal_log_items').insert(logItems);
  return { data: log, error: itemsError };
};

const mapLog = (row: any): MealLog => {
  const items =
    row.meal_log_items?.map((entry: any) => ({
      id: entry.menu_items?.id ?? entry.menu_item_id,
      name: entry.menu_items?.name ?? 'Menu item',
      calories: entry.menu_items?.calories ?? 0,
      protein_g: entry.menu_items?.protein_g ?? 0,
      fat_g: entry.menu_items?.fat_g ?? 0,
      carbs_g: entry.menu_items?.carbs_g ?? 0,
      quantity: entry.quantity,
    })) ?? [];

  return {
    id: row.id,
    user_id: row.user_id,
    date: row.date,
    meal_name: row.meal_name,
    created_at: row.created_at,
    items,
  };
};

export const fetchMealLogs = async (userId: string) => {
  const { data, error } = await supabase
    .from('meal_logs')
    .select('*, meal_log_items(*, menu_items(*))')
    .eq('user_id', userId)
    .order('date', { ascending: false });
  if (error) {
    throw error;
  }
  return (data ?? []).map(mapLog);
};

export const useMealLogs = (userId?: string) => {
  return useQuery({
    queryKey: ['mealLogs', userId],
    queryFn: () => fetchMealLogs(userId as string),
    enabled: Boolean(userId),
  });
};
