import type { Language } from './types';

/** Tiny classname joiner (keeps the bundle dependency free). */
export function cn(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(' ');
}

const BENGALI_DIGITS = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];

/** 2025 → ২০২৫ */
export function toBengaliDigits(value: string | number): string {
  return String(value).replace(/[0-9]/g, (digit) => BENGALI_DIGITS[Number(digit)]);
}

/** Digits follow the active language: Bangla script by default, Latin in English mode. */
export function localizeNumber(value: string | number, lang: Language): string {
  const text = String(value);
  return lang === 'bn' ? toBengaliDigits(text) : text;
}

export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

/** 0 → 1st, 1 → 2nd … */
export function ordinal(n: number): string {
  const rem100 = n % 100;
  if (rem100 >= 11 && rem100 <= 13) return `${n}th`;
  switch (n % 10) {
    case 1:
      return `${n}st`;
    case 2:
      return `${n}nd`;
    case 3:
      return `${n}rd`;
    default:
      return `${n}th`;
  }
}
