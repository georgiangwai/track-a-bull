export type Goal = 'lose_weight' | 'keep_weight' | 'gain_weight' | 'eat_healthier';
export type Sex = 'female' | 'male';
export type Lifestyle = 'sedentary' | 'light' | 'moderate' | 'active';
export type DiningHall = 'hub' | 'juniper' | 'argos';
export type MealPeriod = 'breakfast' | 'lunch' | 'dinner';

export type Profile = {
  user_id: string;
  name: string | null;
  email: string | null;
  goal: Goal | null;
  sex: Sex | null;
  height_cm: number | null;
  weight_kg: number | null;
  age: number | null;
  lifestyle: Lifestyle | null;
  calorie_target: number | null;
  protein_target_g: number | null;
  fat_target_g: number | null;
  carbs_target_g: number | null;
};

export type MenuItem = {
  id: string;
  name: string;
  calories: number;
  protein_g: number;
  fat_g: number;
  carbs_g: number;
};

export type MenuItemWithQty = MenuItem & { quantity: number };

export type MealLog = {
  id: string;
  user_id: string;
  date: string;
  meal_name: string;
  created_at: string | null;
  items: MenuItemWithQty[];
};
