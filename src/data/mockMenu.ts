import { DiningHall, MealPeriod, MenuItem } from '../types/models';

type MockMenu = Record<DiningHall, Record<MealPeriod, MenuItem[]>>;

export const mockMenu: MockMenu = {
  hub: {
    breakfast: [
      { id: 'hub-bfast-sausage', name: 'Pork Sausage Links', calories: 230, protein_g: 12, fat_g: 18, carbs_g: 2 },
      { id: 'hub-bfast-biscuit', name: 'Southern Biscuit', calories: 190, protein_g: 4, fat_g: 7, carbs_g: 28 },
      { id: 'hub-bfast-grits', name: 'Grits (6 fl oz)', calories: 90, protein_g: 2, fat_g: 1, carbs_g: 18 },
      { id: 'hub-bfast-oatmeal', name: 'Old Fashioned Oatmeal (6 fl oz)', calories: 110, protein_g: 4, fat_g: 2, carbs_g: 19 },
      { id: 'hub-bfast-egg', name: 'Scrambled Egg', calories: 140, protein_g: 12, fat_g: 9, carbs_g: 1 },
      { id: 'hub-bfast-tots', name: 'Crispy Tater Tots', calories: 90, protein_g: 1, fat_g: 4, carbs_g: 12 },
      { id: 'hub-bfast-hash', name: 'Tofu-Potato Hash', calories: 140, protein_g: 8, fat_g: 6, carbs_g: 16 },
    ],
    lunch: [
      { id: 'hub-lunch-sweetpotato', name: 'Roasted Sweet Potatoes', calories: 110, protein_g: 2, fat_g: 2, carbs_g: 22 },
      { id: 'hub-lunch-ham', name: 'Grilled Ham Steak', calories: 70, protein_g: 12, fat_g: 2, carbs_g: 1 },
      { id: 'hub-lunch-soup', name: 'Vegetable Soup (6 fl oz)', calories: 80, protein_g: 3, fat_g: 2, carbs_g: 12 },
      { id: 'hub-lunch-salad', name: 'Black-Eyed Pea Salad', calories: 60, protein_g: 4, fat_g: 1, carbs_g: 10 },
      { id: 'hub-lunch-veg', name: 'Zucchini & Tomatoes', calories: 45, protein_g: 2, fat_g: 1, carbs_g: 7 },
      { id: 'hub-lunch-quinoa', name: 'Quinoa', calories: 130, protein_g: 4, fat_g: 2, carbs_g: 24 },
      { id: 'hub-lunch-burger', name: 'Grilled Black Bean Burger', calories: 260, protein_g: 14, fat_g: 8, carbs_g: 32 },
    ],
    dinner: [
      { id: 'hub-dinner-salmon', name: 'Baked Salmon', calories: 280, protein_g: 26, fat_g: 18, carbs_g: 0 },
      { id: 'hub-dinner-rice', name: 'Brown Rice', calories: 160, protein_g: 4, fat_g: 1, carbs_g: 34 },
      { id: 'hub-dinner-broccoli', name: 'Steamed Broccoli', calories: 55, protein_g: 4, fat_g: 1, carbs_g: 10 },
    ],
  },
  juniper: {
    breakfast: [
      { id: 'juniper-bfast-pancakes', name: 'Buttermilk Pancakes', calories: 210, protein_g: 6, fat_g: 6, carbs_g: 32 },
      { id: 'juniper-bfast-eggs', name: 'Cage-Free Eggs', calories: 140, protein_g: 12, fat_g: 9, carbs_g: 1 },
      { id: 'juniper-bfast-fruit', name: 'Seasonal Fruit Cup', calories: 80, protein_g: 1, fat_g: 0, carbs_g: 19 },
    ],
    lunch: [
      { id: 'juniper-lunch-chicken', name: 'Grilled Chicken Breast', calories: 220, protein_g: 32, fat_g: 6, carbs_g: 2 },
      { id: 'juniper-lunch-pasta', name: 'Penne Primavera', calories: 260, protein_g: 9, fat_g: 6, carbs_g: 42 },
      { id: 'juniper-lunch-salad', name: 'Garden Salad', calories: 70, protein_g: 2, fat_g: 3, carbs_g: 9 },
    ],
    dinner: [
      { id: 'juniper-dinner-steak', name: 'Roast Sirloin', calories: 300, protein_g: 28, fat_g: 18, carbs_g: 2 },
      { id: 'juniper-dinner-potato', name: 'Mashed Potatoes', calories: 190, protein_g: 4, fat_g: 7, carbs_g: 30 },
      { id: 'juniper-dinner-greenbeans', name: 'Garlic Green Beans', calories: 60, protein_g: 2, fat_g: 3, carbs_g: 6 },
    ],
  },
  argos: {
    breakfast: [
      { id: 'argos-bfast-parfait', name: 'Greek Yogurt Parfait', calories: 180, protein_g: 15, fat_g: 4, carbs_g: 22 },
      { id: 'argos-bfast-bagel', name: 'Toasted Bagel', calories: 210, protein_g: 7, fat_g: 2, carbs_g: 38 },
    ],
    lunch: [
      { id: 'argos-lunch-wrap', name: 'Turkey Avocado Wrap', calories: 320, protein_g: 20, fat_g: 12, carbs_g: 34 },
      { id: 'argos-lunch-chips', name: 'Baked Chips', calories: 140, protein_g: 2, fat_g: 5, carbs_g: 22 },
    ],
    dinner: [
      { id: 'argos-dinner-tacos', name: 'Beef Street Tacos', calories: 360, protein_g: 18, fat_g: 16, carbs_g: 36 },
      { id: 'argos-dinner-rice', name: 'Spanish Rice', calories: 170, protein_g: 4, fat_g: 3, carbs_g: 31 },
    ],
  },
};
