/**
 * The single source of truth for what the month grid shows.
 *
 * The user can look at the same days through three different lenses:
 *   • gregorian → January, February, … (localised, the default view)
 *   • bengali   → বৈশাখ / Boishakh 1431 …, the official Bangladeshi calendar
 *   • hijri     → রমজান / Ramadan 1446 …, with Islamic events bound to their Hijri dates
 *
 * A "month" therefore always belongs to the active system, and each cell of the grid carries
 * all three date representations at once, so overlays never need a second conversion.
 */

import type { CalendarView, DayCell, MonthModel } from './types';
import {
  addDays,
  dayOfWeek,
  daysInGregorianMonth,
  diffInDays,
  isSameDay,
  makeDate,
  startOfWeek,
  toKey,
} from './date-utils';
import { banglaMonthLength, banglaMonthStart, banglaYearsInRange, toBanglaDate } from './bangla';
import { getIslamicEventsOn, hijriMonthLength, hijriMonthStart, hijriYearsInRange, toHijri } from './hijri';
import { getHolidaysOn } from './holidays';

export const MIN_YEAR = 2025;
export const MAX_YEAR = 2050;

/** The app intentionally supports 2025 – 2050 (as requested). */
export const SUPPORTED_RANGE = {
  from: makeDate(MIN_YEAR, 1, 1),
  to: makeDate(MAX_YEAR, 12, 31),
};

export const CALENDAR_VIEWS: CalendarView[] = ['gregorian', 'bengali', 'hijri'];

export interface SystemMonth {
  year: number;
  month: number;
  firstDay: Date;
  lastDay: Date;
  daysInMonth: number;
}

function gregorianMonthOf(date: Date): SystemMonth {
  const year = date.getUTCFullYear();
  const month = date.getUTCMonth() + 1;
  return {
    year,
    month,
    firstDay: makeDate(year, month, 1),
    lastDay: makeDate(year, month, daysInGregorianMonth(year, month)),
    daysInMonth: daysInGregorianMonth(year, month),
  };
}

function bengaliMonthOf(date: Date): SystemMonth {
  const bangla = toBanglaDate(date);
  const firstDay = banglaMonthStart(bangla.year, bangla.month);
  return {
    year: bangla.year,
    month: bangla.month,
    firstDay,
    lastDay: addDays(firstDay, banglaMonthLength(bangla.year, bangla.month) - 1),
    daysInMonth: banglaMonthLength(bangla.year, bangla.month),
  };
}

function hijriMonthOf(date: Date): SystemMonth {
  const hijri = toHijri(date);
  const firstDay = hijriMonthStart(hijri.year, hijri.month);
  const daysInMonth = hijriMonthLength(hijri.year, hijri.month);
  return {
    year: hijri.year,
    month: hijri.month,
    firstDay,
    lastDay: addDays(firstDay, daysInMonth - 1),
    daysInMonth,
  };
}

export function systemMonthFor(view: CalendarView, anchor: Date): SystemMonth {
  switch (view) {
    case 'bengali':
      return bengaliMonthOf(anchor);
    case 'hijri':
      return hijriMonthOf(anchor);
    default:
      return gregorianMonthOf(anchor);
  }
}

export function yearOfView(view: CalendarView, date: Date): number {
  if (view === 'bengali') return toBanglaDate(date).year;
  if (view === 'hijri') return toHijri(date).year;
  return date.getUTCFullYear();
}

export function monthOfView(view: CalendarView, date: Date): number {
  if (view === 'bengali') return toBanglaDate(date).month;
  if (view === 'hijri') return toHijri(date).month;
  return date.getUTCMonth() + 1;
}

/** Years of the active era that overlap the supported 2025 – 2050 range. */
export function viewYears(view: CalendarView): number[] {
  switch (view) {
    case 'bengali':
      return banglaYearsInRange(SUPPORTED_RANGE.from, SUPPORTED_RANGE.to);
    case 'hijri':
      return hijriYearsInRange(SUPPORTED_RANGE.from, SUPPORTED_RANGE.to);
    default:
      return Array.from({ length: MAX_YEAR - MIN_YEAR + 1 }, (_, index) => MIN_YEAR + index);
  }
}

/** Gregorian anchor date for a (year, month) pair in the active system. */
export function anchorFor(view: CalendarView, year: number, month: number): Date {
  switch (view) {
    case 'bengali':
      return banglaMonthStart(year, month);
    case 'hijri':
      return hijriMonthStart(year, month);
    default:
      return makeDate(year, month, 1);
  }
}

function clampAnchor(date: Date): Date {
  if (diffInDays(date, SUPPORTED_RANGE.from) < 0) return SUPPORTED_RANGE.from;
  if (diffInDays(date, SUPPORTED_RANGE.to) > 0) return SUPPORTED_RANGE.to;
  return date;
}

/** Move one month forward/backward inside the active calendar system, clamped to the range. */
export function shiftMonth(view: CalendarView, anchor: Date, delta: number): Date {
  const current = systemMonthFor(view, anchor);
  let year = current.year;
  let month = current.month + delta;

  while (month > 12) {
    month -= 12;
    year += 1;
  }
  while (month < 1) {
    month += 12;
    year -= 1;
  }

  const candidate = anchorFor(view, year, month);
  return clampAnchor(candidate);
}

export function shiftYear(view: CalendarView, anchor: Date, delta: number): Date {
  const current = systemMonthFor(view, anchor);
  const candidate = anchorFor(view, current.year + delta, current.month);
  return clampAnchor(candidate);
}

/** Is the given direction still navigable (used to disable the arrow buttons)? */
export function canNavigate(view: CalendarView, anchor: Date, direction: -1 | 1): boolean {
  const next = shiftMonth(view, anchor, direction);
  const current = systemMonthFor(view, anchor);
  const nextMonth = systemMonthFor(view, next);
  return !(current.year === nextMonth.year && current.month === nextMonth.month);
}

export function buildDayCell(date: Date, month: SystemMonth, todayDate: Date): DayCell {
  const weekday = dayOfWeek(date);
  return {
    date,
    key: toKey(date),
    gregorian: {
      year: date.getUTCFullYear(),
      month: date.getUTCMonth() + 1,
      day: date.getUTCDate(),
    },
    bangla: toBanglaDate(date),
    hijri: toHijri(date),
    inMonth: diffInDays(date, month.firstDay) >= 0 && diffInDays(date, month.lastDay) <= 0,
    isToday: isSameDay(date, todayDate),
    isWeekend: weekday === 5 || weekday === 6,
    isFriday: weekday === 5,
    holidays: getHolidaysOn(toKey(date)),
    events: getIslamicEventsOn(date),
  };
}

export function buildMonth(
  view: CalendarView,
  anchor: Date,
  weekStartsOn: number,
  todayDate: Date,
): MonthModel {
  const month = systemMonthFor(view, anchor);
  const gridStart = startOfWeek(month.firstDay, weekStartsOn);
  const leading = diffInDays(month.firstDay, gridStart);
  const totalCells = Math.ceil((leading + month.daysInMonth) / 7) * 7;

  const cells: DayCell[] = [];
  for (let index = 0; index < totalCells; index += 1) {
    cells.push(buildDayCell(addDays(gridStart, index), month, todayDate));
  }

  const weeks: DayCell[][] = [];
  for (let index = 0; index < cells.length; index += 7) {
    weeks.push(cells.slice(index, index + 7));
  }

  const holidaysInView = cells
    .filter((cell) => cell.inMonth)
    .flatMap((cell) => cell.holidays)
    .sort((a, b) => a.date.localeCompare(b.date));

  return {
    view,
    year: month.year,
    month: month.month,
    firstDay: month.firstDay,
    lastDay: month.lastDay,
    daysInMonth: month.daysInMonth,
    weeks,
    holidaysInView,
  };
}
