/**
 * Shared domain types for the Three Calendar app.
 */

export type Language = 'bn' | 'en';

export type CalendarView = 'gregorian' | 'bengali' | 'hijri';

export type HolidayType = 'national' | 'religious' | 'international' | 'cultural';

/** সাধারণ ছুটি (general) | নির্বাহী আদেশে ছুটি (executive) */
export type HolidayKind = 'general' | 'executive';

export type Religion = 'muslim' | 'hindu' | 'buddhist' | 'christian' | 'all';

export interface Holiday {
  /** ISO civil date, YYYY-MM-DD */
  date: string;
  /** Bengali name */
  bn: string;
  /** English name */
  en: string;
  type: HolidayType;
  kind: HolidayKind;
  religion?: Religion;
  /** Depends on moon sighting, so it can move by ±1 day. */
  lunar?: boolean;
  note?: string;
}

export interface HolidayYearRecord {
  updated: string;
  title: { bn: string; en: string };
  sources: { label: string; url: string }[];
  holidays: Holiday[];
}

export interface HolidayDataset {
  country: string;
  timezone: string;
  years: Record<string, HolidayYearRecord>;
}

export interface BanglaDate {
  year: number;
  /** 1 = Boishakh … 12 = Chaitra */
  month: number;
  day: number;
  monthId: string;
}

export interface HijriDate {
  year: number;
  /** 1 = Muharram … 12 = Dhu al-Hijjah */
  month: number;
  day: number;
}

export interface IslamicEventDefinition {
  id: string;
  hijri?: { month: number; day: number };
  rule?: 'lastFridayOfRamadan' | 'lastWednesdayOfSafar';
  bn: string;
  en: string;
  hijriLabelBn: string;
  hijriLabelEn: string;
  descBn: string;
  descEn: string;
}

export interface IslamicEventInstance extends IslamicEventDefinition {
  /** Gregorian start (inclusive) */
  start: Date;
  /** Gregorian end (inclusive) — equals start for single-day events */
  end: Date;
  /** ISO civil date of the start */
  date: string;
}

export interface GregorianParts {
  year: number;
  /** 1-12 */
  month: number;
  day: number;
}

export interface DayCell {
  /** UTC-midnight Date so the whole app is timezone independent */
  date: Date;
  /** YYYY-MM-DD */
  key: string;
  gregorian: GregorianParts;
  bangla: BanglaDate;
  hijri: HijriDate;
  inMonth: boolean;
  isToday: boolean;
  isWeekend: boolean;
  isFriday: boolean;
  holidays: Holiday[];
  events: IslamicEventInstance[];
}

export interface MonthModel {
  view: CalendarView;
  /** Year in the active calendar system */
  year: number;
  /** Month number in the active calendar system (1-based) */
  month: number;
  firstDay: Date;
  lastDay: Date;
  daysInMonth: number;
  weeks: DayCell[][];
  /** Gregorian holidays that fall inside this month view */
  holidaysInView: Holiday[];
}
