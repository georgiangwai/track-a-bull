export type Json = string | number | boolean | null | { [key: string]: Json } | Json[];

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          user_id: string;
          name: string | null;
          email: string | null;
          goal: string | null;
          sex: string | null;
          height_cm: number | null;
          weight_kg: number | null;
          age: number | null;
          lifestyle: string | null;
          calorie_target: number | null;
          protein_target_g: number | null;
          fat_target_g: number | null;
          carbs_target_g: number | null;
          created_at: string | null;
          updated_at: string | null;
        };
        Insert: Partial<Database['public']['Tables']['profiles']['Row']> & {
          user_id: string;
        };
        Update: Partial<Database['public']['Tables']['profiles']['Row']>;
      };
      dining_halls: {
        Row: {
          id: string;
          name: string;
        };
        Insert: {
          id: string;
          name: string;
        };
        Update: Partial<Database['public']['Tables']['dining_halls']['Row']>;
      };
      menu_items: {
        Row: {
          id: string;
          name: string;
          calories: number;
          protein_g: number;
          fat_g: number;
          carbs_g: number;
          updated_at: string | null;
        };
        Insert: Database['public']['Tables']['menu_items']['Row'];
        Update: Partial<Database['public']['Tables']['menu_items']['Row']>;
      };
      menu_entries: {
        Row: {
          id: string;
          dining_hall_id: string;
          date: string;
          period: string;
          menu_item_id: string;
        };
        Insert: Database['public']['Tables']['menu_entries']['Row'];
        Update: Partial<Database['public']['Tables']['menu_entries']['Row']>;
      };
      meal_logs: {
        Row: {
          id: string;
          user_id: string;
          date: string;
          meal_name: string;
          created_at: string | null;
        };
        Insert: Database['public']['Tables']['meal_logs']['Row'];
        Update: Partial<Database['public']['Tables']['meal_logs']['Row']>;
      };
      meal_log_items: {
        Row: {
          id: string;
          meal_log_id: string;
          menu_item_id: string;
          quantity: number;
        };
        Insert: Database['public']['Tables']['meal_log_items']['Row'];
        Update: Partial<Database['public']['Tables']['meal_log_items']['Row']>;
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};
