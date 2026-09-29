/**
 * Timezone-safe civil-date helpers.
 *
 * Every date in this app is a *civil date* (a day on the calendar, not an instant),
 * represented as a `Date` pinned to UTC midnight. Because of that, the app renders
 * exactly the same grid for a user in Dhaka and a user in Toronto, and server render
 * and client render can never disagree.
 */

import type { Language } from './types';
import { localizeNumber } from './utils';

export const MS_PER_DAY = 86_400_000;

export const WEEKDAYS = {
  bn: ['রবিবার', 'সোমবার', 'মঙ্গলবার', 'বুধবার', 'বৃহস্পতিবার', 'শুক্রবার', 'শনিবার'],
  en: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
} as const;

export const WEEKDAYS_SHORT = {
  bn: ['রবি', 'সোম', 'মঙ্গল', 'বুধ', 'বৃহঃ', 'শুক্র', 'শনি'],
  en: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
} as const;

export const GREGORIAN_MONTHS = {
  bn: [
    'জানুয়ারি',
    'ফেব্রুয়ারি',
    'মার্চ',
    'এপ্রিল',
    'মে',
    'জুন',
    'জুলাই',
    'আগস্ট',
    'সেপ্টেম্বর',
    'অক্টোবর',
    'নভেম্বর',
    'ডিসেম্বর',
  ],
  en: [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ],
} as const;

export const GREGORIAN_MONTHS_SHORT = {
  bn: [
    'জানু',
    'ফেব',
    'মার্চ',
    'এপ্রিল',
    'মে',
    'জুন',
    'জুলাই',
    'আগস্ট',
    'সেপ্টে',
    'অক্টো',
    'নভে',
    'ডিসে',
  ],
  en: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
} as const;

/** Build a UTC-midnight date (months are 1-based, like everywhere else in the app). */
export function makeDate(year: number, month: number, day: number): Date {
  return new Date(Date.UTC(year, month - 1, day));
}

/** The visitor's local civil date (used after hydration). */
export function today(): Date {
  const now = new Date();
  return makeDate(now.getFullYear(), now.getMonth() + 1, now.getDate());
}

/** The UTC civil date — deterministic on server and client, so the first paint never mismatches. */
export function todayUTC(): Date {
  const now = new Date();
  return makeDate(now.getUTCFullYear(), now.getUTCMonth() + 1, now.getUTCDate());
}

/** YYYY-MM-DD (civil date key) */
export function toKey(date: Date): string {
  return date.toISOString().slice(0, 10);
}

export function fromKey(key: string): Date {
  const [y, m, d] = key.split('-').map(Number);
  return makeDate(y, m, d);
}

export function addDays(date: Date, amount: number): Date {
  return new Date(date.getTime() + amount * MS_PER_DAY);
}

export function addMonths(date: Date, amount: number): Date {
  const year = date.getUTCFullYear();
  const month = date.getUTCMonth() + amount;
  const day = date.getUTCDate();
  const target = new Date(Date.UTC(year, month, 1));
  const daysInTarget = new Date(Date.UTC(target.getUTCFullYear(), target.getUTCMonth() + 1, 0)).getUTCDate();
  return makeDate(target.getUTCFullYear(), target.getUTCMonth() + 1, Math.min(day, daysInTarget));
}

export function diffInDays(a: Date, b: Date): number {
  return Math.round((a.getTime() - b.getTime()) / MS_PER_DAY);
}

/** 0 = Sunday … 6 = Saturday */
export function dayOfWeek(date: Date): number {
  return date.getUTCDay();
}

export function isSameDay(a: Date, b: Date): boolean {
  return a.getTime() === b.getTime();
}

export function startOfWeek(date: Date, weekStartsOn: number): Date {
  const shift = (dayOfWeek(date) - weekStartsOn + 7) % 7;
  return addDays(date, -shift);
}

export function isLeapYear(year: number): boolean {
  return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
}

export function daysInGregorianMonth(year: number, month: number): number {
  return new Date(Date.UTC(year, month, 0)).getUTCDate();
}

export function weekOrder(weekStartsOn: number): number[] {
  return Array.from({ length: 7 }, (_, i) => (weekStartsOn + i) % 7);
}

/** "১৪ এপ্রিল ২০২৫" / "14 April 2025" */
export function formatLongDate(date: Date, lang: Language): string {
  const day = localizeNumber(date.getUTCDate(), lang);
  const monthName = GREGORIAN_MONTHS[lang][date.getUTCMonth()];
  const year = localizeNumber(date.getUTCFullYear(), lang);
  return `${day} ${monthName} ${year}`;
}

/** "১৪ এপ্রিল" / "14 April" */
export function formatShortDate(date: Date, lang: Language): string {
  const day = localizeNumber(date.getUTCDate(), lang);
  const monthName = GREGORIAN_MONTHS_SHORT[lang][date.getUTCMonth()];
  return `${day} ${monthName}`;
}

/** "2025-02-21" → "20250221" (for Google Calendar & .ics) */
export function toCompact(date: Date): string {
  return toKey(date).replace(/-/g, '');
}
