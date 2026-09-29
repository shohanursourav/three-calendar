/**
 * Bangladesh public holiday data access.
 *
 * The dataset is a hand-curated JSON file (data/bangladesh-holidays.json) transcribed from the
 * notifications of the Ministry of Public Administration. Nothing is generated for years that have
 * not been published: when a year is missing the UI shows an honest "not released yet" notice.
 */

import dataset from '@/data/bangladesh-holidays.json';
import type { Holiday, HolidayDataset, HolidayYearRecord, Language } from './types';
import { diffInDays, fromKey, toKey } from './date-utils';

const data = dataset as unknown as HolidayDataset;

export const HOLIDAY_DATA_YEARS: number[] = Object.keys(data.years)
  .map(Number)
  .sort((a, b) => a - b);

export const EARLIEST_HOLIDAY_YEAR = HOLIDAY_DATA_YEARS[0];
export const LATEST_HOLIDAY_YEAR = HOLIDAY_DATA_YEARS[HOLIDAY_DATA_YEARS.length - 1];

export function hasHolidayData(year: number): boolean {
  return HOLIDAY_DATA_YEARS.includes(year);
}

export function getHolidayYearRecord(year: number): HolidayYearRecord | null {
  return data.years[String(year)] ?? null;
}

export function getHolidaysForYear(year: number): Holiday[] {
  const record = getHolidayYearRecord(year);
  if (!record) return [];
  return [...record.holidays].sort((a, b) => a.date.localeCompare(b.date));
}

/** date key (YYYY-MM-DD) → holidays */
let holidayIndex: Map<string, Holiday[]> | null = null;

function getIndex(): Map<string, Holiday[]> {
  if (holidayIndex) return holidayIndex;
  const index = new Map<string, Holiday[]>();
  HOLIDAY_DATA_YEARS.forEach((year) => {
    getHolidaysForYear(year).forEach((holiday) => {
      const list = index.get(holiday.date) ?? [];
      list.push(holiday);
      index.set(holiday.date, list);
    });
  });
  holidayIndex = index;
  return index;
}

export function getHolidaysOn(key: string): Holiday[] {
  return getIndex().get(key) ?? [];
}

export function getHolidaysOnDate(date: Date): Holiday[] {
  return getHolidaysOn(toKey(date));
}

export function getHolidaysInRange(from: Date, to: Date): Holiday[] {
  const results: Holiday[] = [];
  HOLIDAY_DATA_YEARS.forEach((year) => {
    getHolidaysForYear(year).forEach((holiday) => {
      const date = fromKey(holiday.date);
      if (diffInDays(date, from) >= 0 && diffInDays(date, to) <= 0) results.push(holiday);
    });
  });
  return results;
}

export function getUpcomingHolidays(from: Date, limit = 4): Holiday[] {
  const results: Holiday[] = [];
  HOLIDAY_DATA_YEARS.forEach((year) => {
    getHolidaysForYear(year).forEach((holiday) => {
      if (diffInDays(fromKey(holiday.date), from) >= 0) results.push(holiday);
    });
  });
  return results.slice(0, limit);
}

export function totalHolidaysForYear(year: number): number {
  return getHolidaysForYear(year).length;
}

export function generalHolidayCount(year: number): number {
  return getHolidaysForYear(year).filter((holiday) => holiday.kind === 'general').length;
}

export function executiveHolidayCount(year: number): number {
  return getHolidaysForYear(year).filter((holiday) => holiday.kind === 'executive').length;
}

export function holidayName(holiday: Holiday, lang: Language): string {
  return lang === 'bn' ? holiday.bn : holiday.en;
}

export function holidayDateRange(year: number): { from: Date; to: Date } | null {
  const holidays = getHolidaysForYear(year);
  if (!holidays.length) return null;
  return {
    from: fromKey(holidays[0].date),
    to: fromKey(holidays[holidays.length - 1].date),
  };
}

export const HOLIDAY_DATASET_META = {
  country: data.country,
  timezone: data.timezone,
  years: HOLIDAY_DATA_YEARS,
  latestUpdated: HOLIDAY_DATA_YEARS.map((year) => data.years[String(year)].updated).sort().at(-1) ?? null,
  sources: HOLIDAY_DATA_YEARS.flatMap((year) =>
    data.years[String(year)].sources.map((source) => ({ ...source, year })),
  ),
};
