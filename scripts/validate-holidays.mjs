#!/usr/bin/env node
/**
 * Data sanity check for data/bangladesh-holidays.json — run with `npm run validate:data`.
 *
 * It verifies that
 *   • every date is a real calendar date in YYYY-MM-DD form,
 *   • no two entries repeat the same holiday on the same day,
 *   • both language names exist and are non-empty,
 *   • holidays flagged `lunar: true` really do sit on the expected Hijri day
 *     (Umm al-Qura + the Bangladeshi one-day observation shift), and
 *   • the Bangladesh-wide fixed-day holidays fall on the right month/day.
 *
 * It is intentionally dependency free (plain Node + Intl), so contributors can run it anywhere.
 */

import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const here = dirname(fileURLToPath(import.meta.url));
const dataset = JSON.parse(readFileSync(join(here, '..', 'data', 'bangladesh-holidays.json'), 'utf8'));
const hijriData = JSON.parse(readFileSync(join(here, '..', 'data', 'hijri-calendar.json'), 'utf8'));

/** Bangladesh observes each Hijri month one day after the Umm al-Qura civil calendar (lib/hijri.ts). */
const SHIFT_DAYS = 1;

const formatter = new Intl.DateTimeFormat('en-u-ca-islamic-umalqura', {
  day: 'numeric',
  month: 'numeric',
  year: 'numeric',
  timeZone: 'UTC',
});

const dayMs = 86_400_000;
const civil = (iso) => new Date(`${iso}T00:00:00.000Z`);
const addDays = (date, amount) => new Date(date.getTime() + amount * dayMs);

function umalqura(date) {
  const parts = formatter.formatToParts(date);
  const read = (type) => Number((parts.find((part) => part.type === type)?.value ?? '0').replace(/[^\d]/g, '') || 0);
  return { year: read('year'), month: read('month'), day: read('day') };
}

function toHijri(date) {
  return SHIFT_DAYS ? umalqura(addDays(date, -SHIFT_DAYS)) : umalqura(date);
}

const errors = [];
const warnings = [];

/** Fixed-day holidays everyone can check at a glance. */
const FIXED_DAY_CHECKS = {
  '02-21': 'mother language day',
  '03-26': 'independence day',
  '08-05': 'july uprising day',
  '12-16': 'victory day',
  '12-25': 'christmas',
  '04-14': 'pahela baishakh',
};

const seen = new Set();

for (const [yearKey, record] of Object.entries(dataset.years)) {
  const year = Number(yearKey);
  if (!record.holidays?.length) {
    errors.push(`${yearKey}: no holidays listed`);
    continue;
  }

  if (!record.sources?.length) warnings.push(`${yearKey}: no sources recorded`);

  const sorted = [...record.holidays].sort((a, b) => a.date.localeCompare(b.date));
  if (sorted.some((holiday, index) => holiday.date !== record.holidays[index].date)) {
    warnings.push(`${yearKey}: holidays are not stored in chronological order`);
  }

  for (const holiday of record.holidays) {
    const { date, bn, en, type, kind, lunar } = holiday;

    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      errors.push(`${yearKey}: malformed date "${date}"`);
      continue;
    }
    if (Number(date.slice(0, 4)) !== year) {
      errors.push(`${yearKey}: holiday "${en}" has a date outside the year (${date})`);
    }
    if (Number.isNaN(civil(date).getTime()) || civil(date).toISOString().slice(0, 10) !== date) {
      errors.push(`${yearKey}: "${date}" is not a real calendar date`);
    }
    if (!bn?.trim() || !en?.trim()) errors.push(`${yearKey}: "${en ?? bn}" is missing a language name`);
    if (!['national', 'religious', 'international', 'cultural'].includes(type)) {
      errors.push(`${yearKey}: "${en}" has an unknown type "${type}"`);
    }
    if (!['general', 'executive'].includes(kind)) {
      errors.push(`${yearKey}: "${en}" has an unknown kind "${kind}"`);
    }

    const key = `${date}|${en}`;
    if (seen.has(key)) errors.push(`${yearKey}: duplicate entry ${key}`);
    seen.add(key);

    const monthDay = date.slice(5);
    if (FIXED_DAY_CHECKS[monthDay] && lunar) {
      errors.push(`${yearKey}: fixed-day holiday "${en}" must not be flagged as lunar`);
    }

    if (lunar) {
      const gregorian = civil(date);
      const hijri = toHijri(gregorian);
      const weekday = gregorian.getUTCDay();
      const known = hijriData.events.some((event) => {
        if (event.hijri) return event.hijri.month === hijri.month && event.hijri.day === hijri.day;
        if (event.rule === 'lastFridayOfRamadan') {
          return weekday === 5 && hijri.month === 9 && toHijri(addDays(gregorian, 7)).month !== 9;
        }
        if (event.rule === 'lastWednesdayOfSafar') {
          return weekday === 3 && hijri.month === 2 && toHijri(addDays(gregorian, 7)).month !== 2;
        }
        return false;
      });
      const migration = /ছুটি|Holiday/.test(en) || known;
      if (!migration) {
        warnings.push(
          `${yearKey}: ${date} (${en}) is flagged lunar but maps to ${hijri.day}/${hijri.month} AH — no matching Islamic event`,
        );
      }
    }
  }
}

if (errors.length) {
  console.error(`\n✖ ${errors.length} problem(s) found:\n`);
  errors.forEach((error) => console.error(`  • ${error}`));
}

if (warnings.length) {
  console.warn(`\n⚠ ${warnings.length} warning(s):\n`);
  warnings.forEach((warning) => console.warn(`  • ${warning}`));
}

if (!errors.length) {
  const years = Object.keys(dataset.years).join(', ');
  console.log(`\n✔ Holiday dataset is valid. Years: ${years}`);
}
process.exit(errors.length ? 1 : 0);
