import { Goal, Lifestyle, Sex } from '../types/models';

const activityFactors: Record<Lifestyle, number> = {
  sedentary: 1.2,
  light: 1.375,
  moderate: 1.55,
  active: 1.725,
};

const goalAdjustments: Record<Goal, number> = {
  lose_weight: -400,
  gain_weight: 400,
  keep_weight: 0,
  eat_healthier: 0,
};

export const calculateBmr = (weightKg: number, heightCm: number, age: number, sex: Sex) => {
  const base = 10 * weightKg + 6.25 * heightCm - 5 * age;
  return sex === 'male' ? base + 5 : base - 161;
};

export const calculateRecommendedCalories = (
  weightKg: number,
  heightCm: number,
  age: number,
  sex: Sex,
  lifestyle: Lifestyle,
  goal: Goal
) => {
  const bmr = calculateBmr(weightKg, heightCm, age, sex);
  const adjusted = bmr * activityFactors[lifestyle];
  return Math.round(adjusted + goalAdjustments[goal]);
};

export const calculateMacros = (calories: number, weightKg: number, lifestyle: Lifestyle) => {
  const proteinPerKg = lifestyle === 'active' || lifestyle === 'moderate' ? 1.2 : 0.8;
  const protein = Math.round(weightKg * proteinPerKg);
  const fat = Math.round((0.25 * calories) / 9);
  const carbs = Math.round((calories - protein * 4 - fat * 9) / 4);
  return { protein, fat, carbs };
};
