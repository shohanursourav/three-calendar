/** App-wide configuration: identity, links and deploy targets. */

export const SITE = {
  name: 'Three Calendar',
  nameBn: 'থ্রি ক্যালেন্ডার',
  tagline: {
    bn: 'গ্রেগরিয়ান • বঙ্গাব্দ • হিজরি — বাংলাদেশের ছুটি সহ',
    en: 'Gregorian • Bengali • Hijri — with Bangladesh holidays',
  },
  description: {
    bn: 'বাংলাদেশের জন্য তৈরি সুন্দর, দ্রুত ও সম্পূর্ণ ফ্রি ক্যালেন্ডার অ্যাপ — ইংরেজি, বঙ্গাব্দ ও হিজরি ক্যালেন্ডার, সরকারি ছুটির তালিকা এবং .ics সিংক সহ।',
    en: 'A beautiful, fast and completely free calendar for Bangladesh — Gregorian, Bengali and Hijri views, official public holidays and .ics sync.',
  },
  /** Canonical site URL (update after your first Vercel deploy). */
  url: 'https://three-calendar.vercel.app',
  repo: 'https://github.com/shohanursourav/three-calendar',
  deployUrl:
    'https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fshohanursourav%2Fthree-calendar&project-name=three-calendar&repository-name=three-calendar',
  /** Static .ics feed generated at build time — ready for webcal / Google Calendar "From URL". */
  icsFeedPath: '/bangladesh-holidays.ics',
} as const;

export const AUTHOR = {
  name: 'Shohanur Sourav',
  linkedin: 'https://www.linkedin.com/in/shohanursourav/',
  portfolio: 'https://shohanursourav.com',
} as const;

export const WEEK_START_OPTIONS = [6, 0, 1] as const; // Saturday, Sunday, Monday
export const DEFAULT_WEEK_START = 0;

export const STORAGE_KEYS = {
  language: 'three-calendar:language',
  weekStart: 'three-calendar:week-start',
  view: 'three-calendar:view',
} as const;
