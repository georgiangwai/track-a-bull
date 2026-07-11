import { useQuery } from '@tanstack/react-query';
import { MealPeriod, MenuItem } from '../types/models';
import { mockMenu } from '../data/mockMenu';

// Unofficial Dine On Campus API — the same one the dineoncampus.com site and
// mobile app use. It only accepts requests from real browser/app clients, so
// all fetches happen client-side (never from the edge function).
const API = 'https://api.dineoncampus.com/v1';
export const USF_TAMPA_SITE_ID = '67102500e45d43075d091d90';

export type DiningLocation = {
  id: string;
  name: string;
  group: string;
};

export type MenuPeriod = {
  id: string;
  name: string;
};

export type MenuStation = {
  name: string;
  items: MenuItem[];
};

export type LocationMenu = {
  periods: MenuPeriod[];
  activePeriodId: string | null;
  stations: MenuStation[];
};

const getJson = async (url: string) => {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 15000);
  try {
    const res = await fetch(url, { signal: controller.signal });
    if (!res.ok) {
      throw new Error(`Dine On Campus request failed (${res.status})`);
    }
    return await res.json();
  } finally {
    clearTimeout(timer);
  }
};

// Values arrive as numbers, "570", "570/1150" (size ranges), "12g", or null.
const parseAmount = (value: unknown): number => {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return Math.round(value);
  }
  if (typeof value !== 'string') {
    return 0;
  }
  const match = value.match(/\d+(\.\d+)?/);
  return match ? Math.round(parseFloat(match[0])) : 0;
};

const nutrient = (item: any, pattern: RegExp): number => {
  const found = (item.nutrients ?? []).find((n: any) => pattern.test(n.name ?? ''));
  return parseAmount(found?.value ?? found?.value_numeric);
};

const mapStations = (categories: any[]): MenuStation[] =>
  (categories ?? [])
    .map((category: any) => ({
      name: category.name ?? 'Menu',
      items: (category.items ?? []).map(
        (item: any): MenuItem => ({
          id: String(item.id),
          name: item.name ?? 'Menu item',
          calories:
            item.calories != null ? parseAmount(item.calories) : nutrient(item, /^calories$/i),
          protein_g: nutrient(item, /^protein/i),
          fat_g: nutrient(item, /^total fat/i),
          carbs_g: nutrient(item, /^total carbohydrate/i),
        })
      ),
    }))
    .filter((station) => station.items.length > 0);

const FALLBACK_LOCATIONS: DiningLocation[] = [
  { id: 'hub', name: 'The Hub', group: 'Sample data (offline)' },
  { id: 'juniper', name: 'Juniper Dining', group: 'Sample data (offline)' },
  { id: 'argos', name: 'Argos', group: 'Sample data (offline)' },
];

const isMockHall = (id: string): id is keyof typeof mockMenu => id in mockMenu;

const mockLocationMenu = (hallId: keyof typeof mockMenu, periodId?: string): LocationMenu => {
  const periods: MealPeriod[] = ['breakfast', 'lunch', 'dinner'];
  const active = periods.includes(periodId as MealPeriod) ? (periodId as MealPeriod) : 'breakfast';
  return {
    periods: periods.map((p) => ({ id: p, name: p.charAt(0).toUpperCase() + p.slice(1) })),
    activePeriodId: active,
    stations: [{ name: 'Menu', items: mockMenu[hallId][active] }],
  };
};

export const fetchLocations = async (): Promise<DiningLocation[]> => {
  try {
    // The all_locations endpoint returns ~6 MB and takes 40s; the status
    // endpoint returns the same locations in ~12 KB, plus open/closed state.
    const data = await getJson(`${API}/locations/status?site_id=${USF_TAMPA_SITE_ID}&platform=0`);
    const isOpen = (loc: any) => loc.open === true || loc.open === 'true';
    // Residential dining halls only for now; drop retail/coffee locations.
    const featured = /\b(hub|juniper|argos)\b/i;
    const locations = (data.locations ?? [])
      .filter((loc: any) => featured.test(loc.name ?? ''))
      .map(
        (loc: any): DiningLocation => ({
          id: String(loc.id),
          name: loc.name,
          group: isOpen(loc) ? 'Open now' : 'Currently closed',
        })
      )
      .sort((a: DiningLocation, b: DiningLocation) =>
        a.group === b.group ? a.name.localeCompare(b.name) : a.group === 'Open now' ? -1 : 1
      );
    return locations.length > 0 ? locations : FALLBACK_LOCATIONS;
  } catch {
    return FALLBACK_LOCATIONS;
  }
};

export const fetchLocationMenu = async (
  locationId: string,
  date: string,
  periodId?: string
): Promise<LocationMenu> => {
  if (isMockHall(locationId)) {
    return mockLocationMenu(locationId, periodId);
  }
  const suffix = periodId ? `/${periodId}` : '';
  const data = await getJson(`${API}/location/${locationId}/periods${suffix}?platform=0&date=${date}`);
  const menuPeriod = data.menu?.periods;
  return {
    periods: (data.periods ?? []).map((p: any): MenuPeriod => ({ id: String(p.id), name: p.name })),
    activePeriodId: menuPeriod?.id != null ? String(menuPeriod.id) : null,
    stations: mapStations(menuPeriod?.categories ?? []),
  };
};

export const useDiningLocations = () =>
  useQuery({
    queryKey: ['dineOnCampus', 'locations'],
    queryFn: fetchLocations,
    staleTime: 1000 * 60 * 60,
  });

export const useLocationMenu = (locationId: string, date: string, periodId?: string) =>
  useQuery({
    queryKey: ['dineOnCampus', 'menu', locationId, date, periodId ?? 'default'],
    queryFn: () => fetchLocationMenu(locationId, date, periodId),
    enabled: Boolean(locationId),
    staleTime: 1000 * 60 * 15,
    // Keep the previous period's data (and the tab bar) visible while the
    // newly selected period loads.
    placeholderData: (previous) => previous,
  });
