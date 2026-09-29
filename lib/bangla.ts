/**
 * Bangla calendar (বঙ্গাব্দ) — the official Bangladeshi version.
 *
 * Reform in force since ১৪২৬ বঙ্গাব্দ (2019, বাংলা একাডেমি / শামসুজ্জামান খান কমিটি):
 *   ১–৬  (বৈশাখ … আশ্বিন)  → 31 days
 *   ৭–১০ (কার্তিক … মাঘ)   → 30 days
 *   ১১   (ফাল্গুন)         → 29 days, 30 when the Gregorian year it falls in is a leap year
 *   ১২   (চৈত্র)           → 30 days
 *
 * Anchors: ১ বৈশাখ = 14 April, ১ পৌষ = 16 December, ১ মাঘ = 15 January, ১ ফাল্গুন = 14 February,
 * ১ চৈত্র = 15 March (in a common year). Verified against the official 2025 holiday gazette.
 */

import banglaCalendarData from '@/data/bengali-calendar.json';
import type { BanglaDate } from './types';
import { addDays, diffInDays, isLeapYear, makeDate } from './date-utils';

export interface BanglaMonthInfo {
  index: number;
  id: string;
  bn: string;
  en: string;
  translit: string;
  season: keyof typeof banglaCalendarData.seasons;
}

export const BANGLA_EPOCH_OFFSET = banglaCalendarData.epochOffset; // 593
export const BANGLA_NEW_YEAR = banglaCalendarData.newYear; // { month: 4, day: 14 }
export const BANGLA_SEASONS = banglaCalendarData.seasons;

export const BANGLA_MONTHS: BanglaMonthInfo[] = banglaCalendarData.months.map((month, index) => ({
  index: index + 1,
  ...month,
  season: month.season as keyof typeof banglaCalendarData.seasons,
}));

export function banglaMonthInfo(month: number): BanglaMonthInfo {
  return BANGLA_MONTHS[(month - 1 + 12) % 12];
}

/** The Gregorian year in which the Falgun month of `banglaYear` falls (Falgun 1431 → 2025). */
function falgunGregorianYear(banglaYear: number): number {
  return banglaYear + BANGLA_EPOCH_OFFSET + 1;
}

export function banglaMonthLength(banglaYear: number, month: number): number {
  const { fixed, falgunIndex, falgunInLeapYear } = banglaCalendarData.monthLengths;
  if (month - 1 === falgunIndex) {
    return isLeapYear(falgunGregorianYear(banglaYear)) ? falgunInLeapYear : fixed[falgunIndex];
  }
  return fixed[(month - 1 + 12) % 12];
}

export function banglaYearLength(banglaYear: number): number {
  return Array.from({ length: 12 }, (_, i) => banglaMonthLength(banglaYear, i + 1)).reduce(
    (sum, days) => sum + days,
    0,
  );
}

/** ১ বৈশাখ of the given Bangla year, as a Gregorian civil date. */
export function banglaNewYearDate(banglaYear: number): Date {
  return makeDate(banglaYear + BANGLA_EPOCH_OFFSET, BANGLA_NEW_YEAR.month, BANGLA_NEW_YEAR.day);
}

/** First Gregorian day of a Bangla month. */
export function banglaMonthStart(banglaYear: number, month: number): Date {
  let start = banglaNewYearDate(banglaYear);
  for (let m = 1; m < month; m += 1) {
    start = addDays(start, banglaMonthLength(banglaYear, m));
  }
  return start;
}

export function banglaMonthEnd(banglaYear: number, month: number): Date {
  return addDays(banglaMonthStart(banglaYear, month), banglaMonthLength(banglaYear, month) - 1);
}

/** Gregorian civil date → Bangla date. */
export function toBanglaDate(date: Date): BanglaDate {
  const gregorianYear = date.getUTCFullYear();
  const newYearThisYear = makeDate(gregorianYear, BANGLA_NEW_YEAR.month, BANGLA_NEW_YEAR.day);
  const isAfterNewYear = diffInDays(date, newYearThisYear) >= 0;

  const year = isAfterNewYear ? gregorianYear - BANGLA_EPOCH_OFFSET : gregorianYear - BANGLA_EPOCH_OFFSET - 1;
  const epochStart = banglaNewYearDate(year);
  let remaining = diffInDays(date, epochStart);

  let month = 1;
  for (let m = 1; m <= 12; m += 1) {
    const length = banglaMonthLength(year, m);
    if (remaining < length) {
      month = m;
      break;
    }
    remaining -= length;
    if (m === 12) month = 12;
  }

  const info = banglaMonthInfo(month);
  return { year, month, day: remaining + 1, monthId: info.id };
}

export function fromBanglaDate(banglaYear: number, month: number, day: number): Date {
  return addDays(banglaMonthStart(banglaYear, month), day - 1);
}

/** Era year list whose months intersect the supported Gregorian range. */
export function banglaYearsInRange(from: Date, to: Date): number[] {
  const first = toBanglaDate(from).year;
  const last = toBanglaDate(to).year;
  const years: number[] = [];
  for (let y = first; y <= last; y += 1) years.push(y);
  return years;
}
