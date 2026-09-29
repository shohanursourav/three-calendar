/**
 * Calendar syncing, 100% client side and 100% free.
 *
 *  • Download an .ics file for one year, several years, or everything we have.
 *  • "Add to Google Calendar" deep links for a single holiday or Islamic observance.
 *  • Subscribe by URL to the static feed in /public (Google Calendar → "From URL", Apple
 *    Calendar → subscribe to webcal://…) — imported events then stay up to date.
 */

import type { Holiday, IslamicEventInstance, Language } from './types';
import { buildIcs, downloadIcs, googleCalendarUrl, webcalUrl, type IcsEventInput } from './ics';
import { fromKey, toKey } from './date-utils';
import { getHolidaysForYear, holidayName, HOLIDAY_DATA_YEARS, getHolidayYearRecord } from './holidays';
import {
  getIslamicEventsOn,
  hijriLabel,
  islamicEventDescription,
  islamicEventName,
} from './hijri';
import { translate } from './translations';
import { SITE } from './config';

export interface SyncOptions {
  years: number[];
  lang: Language;
  includeIslamicEvents: boolean;
}

function holidayDescription(holiday: Holiday, lang: Language): string {
  const lines = [
    lang === 'bn' ? holiday.en : holiday.bn,
    translate(lang, holiday.kind === 'general' ? 'kindGeneral' : 'kindExecutive'),
    translate(lang, 'dataSourceValue'),
  ];
  if (holiday.lunar) lines.push(translate(lang, 'lunarNote'));
  return lines.join('\n');
}

export function holidayToIcsEvent(holiday: Holiday, lang: Language): IcsEventInput {
  const date = fromKey(holiday.date);
  return {
    uid: `holiday-${holiday.date}@three-calendar`,
    start: date,
    end: date,
    summary: holidayName(holiday, lang),
    description: holidayDescription(holiday, lang),
    categories: ['Holiday', 'Bangladesh'],
  };
}

export function islamicEventToIcsEvent(event: IslamicEventInstance, lang: Language): IcsEventInput {
  return {
    uid: `islamic-${event.id}-${event.date}@three-calendar`,
    start: event.start,
    end: event.end,
    summary: islamicEventName(event, lang),
    description: [hijriLabel(event, lang), islamicEventDescription(event, lang)].join('\n'),
    categories: ['Islamic', 'Bangladesh'],
  };
}

/** Every Islamic observance inside the given Gregorian years. */
export function islamicEventsForYears(years: number[]): IslamicEventInstance[] {
  const results: IslamicEventInstance[] = [];
  const seen = new Set<string>();
  years.forEach((year) => {
    const from = new Date(Date.UTC(year, 0, 1));
    const to = new Date(Date.UTC(year, 11, 31));
    for (let cursor = from; cursor.getTime() <= to.getTime(); cursor = new Date(cursor.getTime() + 86_400_000)) {
      getIslamicEventsOn(cursor).forEach((event) => {
        const key = `${event.id}-${event.date}`;
        if (seen.has(key)) return;
        seen.add(key);
        results.push(event);
      });
    }
  });
  return results.sort((a, b) => a.date.localeCompare(b.date));
}

/** "ঈদে মিলাদুন্নবী (সা.)" → "ঈদে মিলাদুন্নবী" so the gazetted holiday and its observance can be compared. */
function normalizeName(value: string): string {
  return value
    .replace(/\([^)]*\)/g, '')
    .replace(/[\s—–-]+/g, ' ')
    .trim()
    .toLowerCase();
}

/**
 * A day can be both a public holiday and an Islamic observance (Eid, Ashura, Shab-e-Barat …).
 * The gazetted holiday is the authoritative entry, so the matching observance is skipped to keep
 * the exported calendar free of duplicates.
 */
function isCoveredByHoliday(event: IslamicEventInstance, holidays: Holiday[]): boolean {
  const start = toKey(event.start);
  const names = [normalizeName(event.bn), normalizeName(event.en)].filter(Boolean);

  return holidays.some((holiday) => {
    if (holiday.date !== start) return false;
    const holidayNames = [normalizeName(holiday.bn), normalizeName(holiday.en)];
    // "জুমাতুল বিদা ও শবে কদর" covers both "জুমাতুল বিদা" and "শবে কদর".
    return holidayNames.some((holidayName) =>
      names.some((name) => holidayName === name || holidayName.includes(name) || name.includes(holidayName)),
    );
  });
}

export function buildHolidayIcsEvents(options: SyncOptions): IcsEventInput[] {
  const { years, lang, includeIslamicEvents } = options;
  const events: IcsEventInput[] = [];
  const holidays = years.flatMap((year) => getHolidaysForYear(year));

  holidays.forEach((holiday) => events.push(holidayToIcsEvent(holiday, lang)));

  if (includeIslamicEvents) {
    islamicEventsForYears(years)
      .filter((event) => !isCoveredByHoliday(event, holidays))
      .forEach((event) => events.push(islamicEventToIcsEvent(event, lang)));
  }

  return events;
}

export function buildHolidayIcs(options: SyncOptions): string {
  const { years, lang } = options;
  const yearLabel = years.length > 1 ? `${years[0]}–${years[years.length - 1]}` : String(years[0]);
  return buildIcs({
    name:
      lang === 'bn'
        ? `বাংলাদেশের সরকারি ছুটি (${yearLabel})`
        : `Bangladesh Public Holidays (${yearLabel})`,
    description:
      lang === 'bn'
        ? 'জনপ্রশাসন মন্ত্রণালয়ের প্রজ্ঞাপন অনুসারে সংকলিত — Three Calendar'
        : 'Curated from the notifications of the Ministry of Public Administration — Three Calendar',
    events: buildHolidayIcsEvents(options),
  });
}

export function holidayIcsFileName(options: SyncOptions): string {
  const scope = options.years.length === 1 ? String(options.years[0]) : 'all';
  return `bangladesh-holidays-${scope}-${options.lang}.ics`;
}

export function downloadHolidayIcs(options: SyncOptions): void {
  downloadIcs(holidayIcsFileName(options), buildHolidayIcs(options));
}

export function buildFeedIcs(lang: Language, includeIslamicEvents = true): string {
  return buildHolidayIcs({
    years: HOLIDAY_DATA_YEARS,
    lang,
    includeIslamicEvents,
  });
}

/** Public URL of the static feed (used for the "subscribe" card in the UI). */
export function feedUrl(): string {
  return `${SITE.url}${SITE.icsFeedPath}`;
}

export function feedWebcalUrl(): string {
  return webcalUrl(feedUrl());
}

export function holidayGoogleCalendarUrl(holiday: Holiday, lang: Language): string {
  const date = fromKey(holiday.date);
  return googleCalendarUrl({
    title: holidayName(holiday, lang),
    description: holidayDescription(holiday, lang),
    start: date,
    end: date,
    location: 'Bangladesh',
  });
}

export function islamicEventGoogleCalendarUrl(event: IslamicEventInstance, lang: Language): string {
  return googleCalendarUrl({
    title: islamicEventName(event, lang),
    description: [hijriLabel(event, lang), islamicEventDescription(event, lang)].join('\n'),
    start: event.start,
    end: event.end,
    location: 'Bangladesh',
  });
}

/** Data provenance string for the footer / notices. */
export function datasetProvenance(year: number): { updated: string | null; sources: { label: string; url: string }[] } {
  const record = getHolidayYearRecord(year);
  if (!record) return { updated: null, sources: [] };
  return { updated: record.updated, sources: record.sources };
}

export function toIcsDateKey(date: Date): string {
  return toKey(date);
}
