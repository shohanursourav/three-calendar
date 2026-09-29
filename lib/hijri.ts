/**
 * Hijri (হিজরি) calendar for Bangladesh.
 *
 * Islamic months begin with the local sighting of the new moon, so Bangladeshi dates are
 * *not* identical to the Saudi (Umm al-Qura) civil calendar — in 2025 and 2026 the whole
 * country ran exactly one day behind Umm al-Qura. Every gazetted date of the official
 * 2025 and 2026 holiday notifications matches that +1 day shift, e.g.
 *
 *   Eid-ul-Fitr 2025 → 31 Mar 2025 = 1 Shawwal 1446      (Umm al-Qura: 30 Mar)
 *   Shab-e-Barat 2026 → 4 Feb 2026 = 15 Sha'ban 1447     (Umm al-Qura: 3 Feb)
 *   Eid-ul-Adha 2026 → 28 May 2026 = 10 Dhu al-Hijjah 1447 (Umm al-Qura: 27 May)
 *   Ashura      2026 → 26 Jun 2026 = 10 Muharram 1448    (Umm al-Qura: 25 Jun)
 *
 * So the conversion is: Umm al-Qura (via Intl `islamic-umalqura`) shifted by one day.
 *
 * The one-day shift was verified against **every** date of the official 2025 and 2026 notifications
 * (see HIJRI_SIGHTING_VALIDATED_UNTIL). It is applied uniformly — a shift that changed halfway
 * would skip or duplicate a Hijri day — and the UI clearly flags that dates after the validated
 * window are indicative, because the government announces them only after the moon is sighted.
 */

import hijriCalendarData from '@/data/hijri-calendar.json';
import type { HijriDate, IslamicEventDefinition, IslamicEventInstance, Language } from './types';
import { addDays, dayOfWeek, diffInDays, fromKey, toKey } from './date-utils';
import { localizeNumber } from './utils';

/** Bangladesh observes each Hijri month one day after the Umm al-Qura (Saudi) civil calendar. */
export const BANGLADESH_HIJRI_SHIFT_DAYS: number = 1;

/**
 * Last Gregorian date whose Hijri date is backed by an official announcement.
 * (Every gazetted lunar date of 2025 and 2026 lands on the expected Hijri day with this model.)
 */
export const HIJRI_SIGHTING_VALIDATED_UNTIL = new Date(Date.UTC(2026, 11, 31));

export interface HijriMonthInfo {
  index: number;
  bn: string;
  en: string;
  ar: string;
}

export const HIJRI_MONTHS: HijriMonthInfo[] = hijriCalendarData.months.map((month, index) => ({
  index: index + 1,
  ...month,
}));

export function hijriMonthInfo(month: number): HijriMonthInfo {
  return HIJRI_MONTHS[(month - 1 + 12) % 12];
}

export function hijriMonthName(month: number, lang: Language): string {
  const info = hijriMonthInfo(month);
  return lang === 'bn' ? info.bn : info.en;
}

const umalquraFormatter = new Intl.DateTimeFormat('en-u-ca-islamic-umalqura', {
  day: 'numeric',
  month: 'numeric',
  year: 'numeric',
  timeZone: 'UTC',
});

const umalquraCache = new Map<string, HijriDate>();

function umalqura(date: Date): HijriDate {
  const key = toKey(date);
  const cached = umalquraCache.get(key);
  if (cached) return cached;

  const parts = umalquraFormatter.formatToParts(date);
  const read = (type: string) =>
    Number((parts.find((part) => part.type === type)?.value ?? '0').replace(/[^\d]/g, '') || 0);

  const value: HijriDate = { year: read('year'), month: read('month'), day: read('day') };
  umalquraCache.set(key, value);
  return value;
}

/** Gregorian civil date → Hijri date as observed in Bangladesh. */
export function toHijri(date: Date): HijriDate {
  if (BANGLADESH_HIJRI_SHIFT_DAYS === 0) return umalqura(date);
  return umalqura(addDays(date, -BANGLADESH_HIJRI_SHIFT_DAYS));
}

/** True while the Hijri date is covered by an official moon-sighting announcement. */
export function isHijriSightingVerified(date: Date): boolean {
  return date.getTime() <= HIJRI_SIGHTING_VALIDATED_UNTIL.getTime();
}

const monthStartCache = new Map<string, Date>();

/** First Gregorian day of a Hijri month. */
export function hijriMonthStart(year: number, month: number): Date {
  const cacheKey = `${year}-${month}`;
  const cached = monthStartCache.get(cacheKey);
  if (cached) return cached;

  // 1 Muharram 1 AH = 16 July 622 CE, mean synodic month = 29.530588 days.
  const monthsSinceEpoch = (year - 1) * 12 + (month - 1);
  const approximate = Math.floor(Date.UTC(622, 6, 16) / 86_400_000 + monthsSinceEpoch * 29.530588);
  const guess = new Date(approximate * 86_400_000);

  const targetKey = year * 12 + month;
  let start: Date | undefined;

  // Search a generous ±45 day window around the mean-motion estimate.
  for (let offset = -45; offset <= 45 && !start; offset += 1) {
    const probe = addDays(guess, offset);
    const value = toHijri(probe);
    if (value.day === 1 && value.year * 12 + value.month === targetKey) {
      start = probe;
    }
  }

  const resolved = start ?? guess;
  monthStartCache.set(cacheKey, resolved);
  return resolved;
}

export function hijriMonthEnd(year: number, month: number): Date {
  return addDays(hijriMonthStart(year, month), hijriMonthLength(year, month) - 1);
}

export function hijriMonthLength(year: number, month: number): number {
  const start = hijriMonthStart(year, month);
  const nextMonth = month === 12 ? 1 : month + 1;
  const nextYear = month === 12 ? year + 1 : year;
  return diffInDays(hijriMonthStart(nextYear, nextMonth), start);
}

export function hijriYearsInRange(from: Date, to: Date): number[] {
  const first = toHijri(from).year;
  const last = toHijri(to).year;
  const years: number[] = [];
  for (let year = first; year <= last; year += 1) years.push(year);
  return years;
}

export function formatHijriDate(value: HijriDate, lang: Language): string {
  return `${localizeNumber(value.day, lang)} ${hijriMonthName(value.month, lang)} ${localizeNumber(
    value.year,
    lang,
  )}`;
}

/* -------------------------------------------------------------------------- */
/*  Islamic events                                                            */
/* -------------------------------------------------------------------------- */

const EVENT_DEFINITIONS = hijriCalendarData.events as IslamicEventDefinition[];

/** Eid is celebrated over three days in Bangladesh (1–3 Shawwal / 10–12 Dhu al-Hijjah). */
const MULTI_DAY_EVENTS: Record<string, number> = {
  'eid-ul-fitr': 3,
  'eid-ul-adha': 3,
};

function instanceFor(definition: IslamicEventDefinition, date: Date): IslamicEventInstance {
  const length = MULTI_DAY_EVENTS[definition.id] ?? 1;
  return {
    ...definition,
    start: date,
    end: addDays(date, length - 1),
    date: toKey(date),
  };
}

function matchesRule(definition: IslamicEventDefinition, date: Date): boolean {
  const hijri = toHijri(date);
  switch (definition.rule) {
    case 'lastFridayOfRamadan':
      // জুমাতুল বিদা — the final Friday of Ramadan.
      return dayOfWeek(date) === 5 && hijri.month === 9 && toHijri(addDays(date, 7)).month !== 9;
    case 'lastWednesdayOfSafar':
      // আখেরি চাহার সোম্বা — the last Wednesday of Safar.
      return dayOfWeek(date) === 3 && hijri.month === 2 && toHijri(addDays(date, 7)).month !== 2;
    default:
      return false;
  }
}

const eventCache = new Map<string, IslamicEventInstance[]>();

/** All Islamic events that fall on the given Gregorian day. */
export function getIslamicEventsOn(date: Date): IslamicEventInstance[] {
  const key = toKey(date);
  const cached = eventCache.get(key);
  if (cached) return cached;

  const hijri = toHijri(date);
  const matches = EVENT_DEFINITIONS.filter((definition) =>
    definition.hijri
      ? definition.hijri.month === hijri.month && definition.hijri.day === hijri.day
      : matchesRule(definition, date),
  ).map((definition) => instanceFor(definition, date));

  eventCache.set(key, matches);
  return matches;
}

export function getIslamicEventsInRange(from: Date, to: Date): IslamicEventInstance[] {
  const results: IslamicEventInstance[] = [];
  const total = diffInDays(to, from);
  for (let index = 0; index <= total; index += 1) {
    results.push(...getIslamicEventsOn(addDays(from, index)));
  }
  return results;
}

export function getIslamicEventsForDateKey(key: string): IslamicEventInstance[] {
  return getIslamicEventsOn(fromKey(key));
}

export function islamicEventName(event: IslamicEventDefinition, lang: Language): string {
  return lang === 'bn' ? event.bn : event.en;
}

export function islamicEventDescription(event: IslamicEventDefinition, lang: Language): string {
  return lang === 'bn' ? event.descBn : event.descEn;
}

export function hijriLabel(event: IslamicEventDefinition, lang: Language): string {
  return lang === 'bn' ? event.hijriLabelBn : event.hijriLabelEn;
}

/** All event definitions (used by the UI legends / settings). */
export const ISLAMIC_EVENTS = EVENT_DEFINITIONS;
