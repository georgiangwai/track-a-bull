import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

type MenuItem = {
  id: string;
  name: string;
  calories: number;
  protein_g: number;
  fat_g: number;
  carbs_g: number;
};

const mockMenu: Record<string, Record<string, MenuItem[]>> = {
  hub: {
    breakfast: [
      { id: 'hub-bfast-sausage', name: 'Pork Sausage Links', calories: 230, protein_g: 12, fat_g: 18, carbs_g: 2 },
      { id: 'hub-bfast-egg', name: 'Scrambled Egg', calories: 140, protein_g: 12, fat_g: 9, carbs_g: 1 },
    ],
    lunch: [
      { id: 'hub-lunch-quinoa', name: 'Quinoa', calories: 130, protein_g: 4, fat_g: 2, carbs_g: 24 },
      { id: 'hub-lunch-burger', name: 'Grilled Black Bean Burger', calories: 260, protein_g: 14, fat_g: 8, carbs_g: 32 },
    ],
    dinner: [
      { id: 'hub-dinner-salmon', name: 'Baked Salmon', calories: 280, protein_g: 26, fat_g: 18, carbs_g: 0 },
    ],
  },
  juniper: {
    breakfast: [
      { id: 'juniper-bfast-pancakes', name: 'Buttermilk Pancakes', calories: 210, protein_g: 6, fat_g: 6, carbs_g: 32 },
    ],
    lunch: [
      { id: 'juniper-lunch-chicken', name: 'Grilled Chicken Breast', calories: 220, protein_g: 32, fat_g: 6, carbs_g: 2 },
    ],
    dinner: [
      { id: 'juniper-dinner-steak', name: 'Roast Sirloin', calories: 300, protein_g: 28, fat_g: 18, carbs_g: 2 },
    ],
  },
  argos: {
    breakfast: [
      { id: 'argos-bfast-parfait', name: 'Greek Yogurt Parfait', calories: 180, protein_g: 15, fat_g: 4, carbs_g: 22 },
    ],
    lunch: [
      { id: 'argos-lunch-wrap', name: 'Turkey Avocado Wrap', calories: 320, protein_g: 20, fat_g: 12, carbs_g: 34 },
    ],
    dinner: [
      { id: 'argos-dinner-tacos', name: 'Beef Street Tacos', calories: 360, protein_g: 18, fat_g: 16, carbs_g: 36 },
    ],
  },
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
      },
    });
  }

  const url = new URL(req.url);
  const hall = url.searchParams.get('hall') ?? '';
  const date = url.searchParams.get('date') ?? '';
  const period = url.searchParams.get('period') ?? '';

  if (!hall || !date || !period) {
    return new Response(JSON.stringify({ error: 'Missing hall/date/period' }), {
      status: 400,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    });
  }

  const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
  const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';

  const supabase = createClient(supabaseUrl, supabaseServiceKey);

  const { data: cachedEntries } = await supabase
    .from('menu_entries')
    .select('menu_items(*)')
    .eq('dining_hall_id', hall)
    .eq('date', date)
    .eq('period', period);

  const cachedItems =
    cachedEntries?.map((entry: any) => entry.menu_items as MenuItem).filter(Boolean) ?? [];

  if (cachedItems.length > 0) {
    return new Response(JSON.stringify(cachedItems), {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    });
  }

  const fallback = mockMenu[hall]?.[period] ?? [];

  if (fallback.length === 0) {
    return new Response(JSON.stringify([]), {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    });
  }

  await supabase.from('menu_items').upsert(fallback, { onConflict: 'id' });
  await supabase
    .from('menu_entries')
    .delete()
    .eq('dining_hall_id', hall)
    .eq('date', date)
    .eq('period', period);
  await supabase.from('menu_entries').insert(
    fallback.map((item) => ({
      dining_hall_id: hall,
      date,
      period,
      menu_item_id: item.id,
    }))
  );

  return new Response(JSON.stringify(fallback), {
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
    },
  });
});
