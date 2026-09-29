<div align="center">

# 🗓️ Three Calendar

**গ্রেগরিয়ান • বঙ্গাব্দ • হিজরি — বাংলাদেশের সরকারি ছুটি সহ**

A beautiful, fast and completely **free** web calendar built for Bangladesh.
Switch between the Gregorian, **Bangla (বঙ্গাব্দ)** and **Hijri** calendars, browse the official
public holidays and sync everything to your phone or Google Calendar — as a static site, with no
backend and no paid API.

[![Next.js](https://img.shields.io/badge/Next.js-15-black?logo=next.js)](https://nextjs.org)
[![React](https://img.shields.io/badge/React-19-087ea4?logo=react)](https://react.dev)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38bdf8?logo=tailwindcss)](https://tailwindcss.com)
[![TypeScript](https://img.shields.io/badge/TypeScript-strict-3178c6?logo=typescript)](https://www.typescriptlang.org)
[![License: MIT](https://img.shields.io/badge/License-MIT-22c55e)](./LICENSE)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fshohanursourav%2Fthree-calendar&project-name=three-calendar&repository-name=three-calendar)

</div>

---

## বাংলায় সংক্ষেপে

বাংলাদেশের জন্য তৈরি একটি সম্পূর্ণ ফ্রি ক্যালেন্ডার অ্যাপ —

- **তিন ক্যালেন্ডার একসাথে:** গ্রেগরিয়ান, **বঙ্গাব্দ** ও **হিজরি** (এক ক্লিকে দৃশ্য বদলানো যায়)
- **ডিফল্ট ভাষা বাংলা:** মাস, বার, তারিখ সবই বাংলা লিপি ও বাংলা সংখ্যায় (০১২৩…), এক ক্লিকে ইংরেজি
- **সরকারি ছুটি:** ২০২৫ ও ২০২৬ সালের প্রজ্ঞাপন অনুসারে হাতে যাচাই করা সঠিক তালিকা (কোনো ডামি ডেটা নেই)
- **২০২৭+ সালের জন্য সৎ বার্তা:** “এই বছরের সরকারি ছুটির তালিকা এখনো প্রকাশিত হয়নি…”
- **ইসলামিক দিবস:** ঈদুল ফিতর, ঈদুল আজহা, শবে বরাত, শবে কদর, শবে মেরাজ, আশুরা, ঈদে মিলাদুন্নবী —
  প্রতিটি সঠিক হিজরি তারিখের সাথে বাঁধা
- **ক্যালেন্ডার সিংক:** `.ics` ডাউনলোড করে Google/Apple/Outlook Calendar-এ ইমপোর্ট করুন বা একবার
  সাবস্ক্রাইব করে রাখুন (সবই ব্রাউজারে, কোনো সার্ভার খরচ ছাড়াই)
- **ডার্ক/লাইট/সিস্টেম থিম**, সপ্তাহ শুরুর দিন বদলানোর সুবিধা, ২০২৫–২০৫০ পর্যন্ত নেভিগেশন

---

## ✨ Features

| | |
|---|---|
| **Three calendars, one grid** | The same day shown three ways — pick the lens with the segmented control. Each day cell still carries all three dates, so overlays are always in sync. |
| **Bengali-first** | Bengali is the default language: month names (`বৈশাখ`, `জানুয়ারি`), weekday names, holiday names and **Bengali numerals (০১২৩৪৫৬৭৮৯)**. One tap switches the whole UI to English (`Baishakh`, `January`, `12`). |
| **Official holiday data only** | Hand-curated JSON from the notifications of the **Ministry of Public Administration** for **2025** and **2026**. No dummy, guessed or placeholder years. |
| **Honest missing-data notice** | Navigating to 2027+ shows an elegant notice in the active language: *“Public holiday data for this year is not yet available and will be updated once released.”* |
| **Islamic events on their Hijri dates** | Eid-ul-Fitr, Eid-ul-Adha, Shab-e-Barat, Shab-e-Qadr, Shab-e-Meraj, Ashura, Eid-e-Miladunnabi, Jumatul Wida, Akhiri Chahar Somba, Arafah and more — each with a short description in Bengali/English. |
| **Calendar syncing (100% free)** | Client-side `.ics` generation (no libraries, no server), per-event “Add to Google Calendar” links, plus a build-time static feed you can subscribe to via `webcal://` or Google Calendar → *From URL*. |
| **Delightful UI** | Spacious month grid, glassmorphism header, spring-y hover lifts, tooltips on every date, ambient page wash, and a “today at a glance” strip showing all three dates plus the next holiday countdown. |
| **Dark / Light / System** | `next-themes` with a three-way switch in the settings menu. |
| **2025 → 2050** | Year selector and arrow navigation are hard-clamped to the supported range in every calendar system (Gregorian 2025–2050, Bangla 1431–1457, Hijri 1446–1473). |
| **Static & free to host** | Every route is prerendered (`○ Static`). No database, no API keys, no environment variables. Deploys to Vercel's free tier in one click. |

---

## 🚀 Easy Setup Guide (run it on your PC)

Follow these steps and you will have the app running locally in about two minutes.

### 1. Prerequisites

- **Node.js 18.18 or newer** (Node 20+ recommended) — check with `node -v`
- **npm** (comes with Node) — check with `npm -v`
- A code editor such as VS Code (optional)

> No API keys, no database and no `.env` file are required. The whole app is client-side.

### 2. Clone the repository

```bash
git clone https://github.com/shohanursourav/three-calendar.git
cd three-calendar
```

### 3. Install dependencies

```bash
npm install
```

### 4. Start the development server

```bash
npm run dev
```

Now open **<http://localhost:3000>** in your browser. 🎉

### 5. Build for production (optional but recommended before deploying)

```bash
npm run build   # creates an optimised production build
npm run start   # serves the production build on http://localhost:3000
```

### Available scripts

| Command | What it does |
|---|---|
| `npm run dev` | Starts the dev server with hot reload on `http://localhost:3000` |
| `npm run build` | Production build (also prerenders the `.ics` feeds) |
| `npm run start` | Runs the production build locally |
| `npm run typecheck` | Full TypeScript type check (`tsc --noEmit`) |
| `npm run validate:data` | Validates the holiday dataset (dates, duplicates, Hijri mapping) |
| `npm run lint` | ESLint via `next lint` |

---

## ▲ Deploy to Vercel (free)

### One-click deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fshohanursourav%2Fthree-calendar&project-name=three-calendar&repository-name=three-calendar)

### Or deploy manually

1. Push this repository to your own GitHub account.
2. Go to <https://vercel.com/new> and **Import** the repository.
3. Keep the default settings — Vercel auto-detects Next.js. Framework preset: **Next.js**, Build command: `npm run build`, Output: default.
4. Click **Deploy**. You get a free `*.vercel.app` URL (add a custom domain later for free too).
5. After the first deploy, open `lib/config.ts` and set `SITE.url` to your real domain so that the
   subscription feed link and the SEO metadata point at the right place.

> No environment variables are needed. The `.ics` subscription feed is generated at build time and
> served from the CDN, so it costs nothing at runtime.

---

## 🗂️ Project structure

```
three-calendar/
├── app/
│   ├── layout.tsx                       # Fonts, metadata, providers
│   ├── page.tsx                         # Home page (renders <CalendarApp />)
│   ├── globals.css                      # Tailwind v4 theme tokens, light/dark palettes
│   ├── icon.svg                         # Favicon / app icon
│   ├── manifest.ts, robots.ts           # PWA manifest + robots
│   ├── bangladesh-holidays.ics/
│   │   └── route.ts                     # Static .ics feed (Bengali) — prerendered at build
│   └── bangladesh-holidays-en.ics/
│       └── route.ts                     # Static .ics feed (English)
├── components/
│   ├── calendar-app.tsx                 # Client shell: state, layout, keyboard shortcuts
│   ├── app-header.tsx                   # Brand, view switcher, language/theme/settings
│   ├── today-strip.tsx                  # “Today at a glance” + next-holiday countdown
│   ├── month-card.tsx                   # Month grid card: nav, month/year selectors, legend
│   ├── day-cell.tsx                     # A single date cell (3 date labels + badges)
│   ├── day-details.tsx                  # Selected-day panel with holiday/event details
│   ├── holiday-list.tsx                 # This month's holidays + year summary
│   ├── notices.tsx                      # Missing-data and moon-sighting notices
│   ├── sync-dialog.tsx                  # .ics download / subscribe modal
│   ├── app-footer.tsx                   # Developed-by (LinkedIn) + Portfolio + repo links
│   ├── providers.tsx                    # next-themes + language providers
│   └── ui/                              # Segmented control, modal, popover, tooltip, switch
├── data/
│   ├── bangladesh-holidays.json         # ⭐ Official public holidays (2025, 2026)
│   ├── bengali-calendar.json            # Bangla month lengths, seasons, reform rules
│   └── hijri-calendar.json              # Hijri months + Islamic events (Hijri dates)
├── lib/
│   ├── calendar.ts                      # Month model builder for all three systems
│   ├── bangla.ts                        # বঙ্গাব্দ ⇄ Gregorian conversion
│   ├── hijri.ts                         # Hijri conversion (Bangladesh moon-sighting aware)
│   ├── holidays.ts                      # Holiday lookups + availability checks
│   ├── sync.ts                          # .ics / Google Calendar / subscribe feed builders
│   ├── ics.ts                           # Tiny dependency-free RFC 5545 writer
│   ├── i18n.tsx · translations.ts        # Language state + bilingual copy
│   ├── date-utils.ts                    # Timezone-safe civil-date helpers
│   └── config.ts                        # Site metadata, author links, deploy URLs
└── scripts/
    └── validate-holidays.mjs            # `npm run validate:data`
```

---

## 📅 How the three calendars are computed

All dates are handled as **timezone-independent civil dates** (UTC-midnight `Date` values), so a user
in Dhaka and a user in Toronto always see the same grid, and server/client rendering can never drift.

### Gregorian view (default)

Localised months and weekdays — `জানুয়ারি … ডিসেম্বর` in Bengali, `January … December` in English —
with the Bangla and Hijri dates shown as quiet overlays inside every cell.

### Bangla (বঙ্গাব্দ) view

Implements the **official Bangladeshi calendar** as reformed in 2019 (বাংলা একাডেমি / শামসুজ্জামান খান কমিটি):

- বৈশাখ – আশ্বিন (months 1–6): **31 days** each
- কার্তিক – মাঘ (7–10) and চৈত্র (12): **30 days** each
- ফাল্গুন (11): **29 days**, and **30 days** when the Gregorian year it falls in is a leap year
- ১ বৈশাখ = **14 April**, ১ পৌষ = **16 December**, ১ মাঘ = **15 January**, ১ ফাল্গুন = **14 February**

Verified anchors used in the app: `২১ ফেব্রুয়ারি = ৮ ফাল্গুন`, `১৭ মার্চ = ৩ চৈত্র`,
`২৬ মার্চ = ১২ চৈত্র`, `১৪ এপ্রিল = ১ বৈশাখ`.

### Hijri (হিজরি) view

Islamic months in Bangladesh begin with the **local moon sighting**, which in 2025 and 2026 ran exactly
one day behind the Saudi (Umm al-Qura) civil calendar. The app converts with `Intl`'s
`islamic-umalqura` calendar and applies that one-day difference
(`lib/hijri.ts → BANGLADESH_HIJRI_SHIFT_DAYS = 1`), which reproduces **every** gazetted date of the
2025 and 2026 notifications:

| Gazetted holiday | Gregorian | Hijri (this app) |
|---|---|---|
| Eid-ul-Fitr 2025 | 31 Mar 2025 | ১ শাওয়াল ১৪৪৬ |
| Shab-e-Barat 2026 | 4 Feb 2026 | ১৫ শাবান ১৪৪৭ |
| Shab-e-Qadr 2026 | 17 Mar 2026 | ২৭ রমজান ১৪৪৭ |
| Eid-ul-Fitr 2026 | 21 Mar 2026 | ১ শাওয়াল ১৪৪৭ |
| Eid-ul-Adha 2026 | 28 May 2026 | ১০ জিলহজ ১৪৪৭ |
| Ashura 2026 | 26 Jun 2026 | ১০ মুহাররম ১৪৪৮ |

The shift is applied uniformly (a shift that changed halfway would skip or duplicate a Hijri day) and
every month in the supported range is guaranteed to be 29 or 30 days long. After the validated window
the app still shows the calculated date, but also tells the user in a notice that the official date is
announced only after the moon is sighted. 🌙

---

## 📊 Holiday data rules (no dummy data, ever)

`data/bangladesh-holidays.json` is the single source of truth and follows three rules:

1. **Only officially notified years exist in the file.** 2025 (Ministry of Public Administration
   notification of 21 October 2024, plus 5 August 2025 added later) and 2026 (notification of
   January 2026) are present. Nothing is invented for 2027+.
2. **Every entry is a real gazetted holiday** with both a Bengali and an English name, its type
   (`national` / `religious` / `international` / `cultural`) and its kind — **সাধারণ ছুটি** (general
   holiday) or **নির্বাহী আদেশে ছুটি** (holiday under executive order), exactly as the notification
   separates them.
3. **Moon-dependent holidays are flagged** (`"lunar": true`) and highlighted in the UI with the
   *“চাঁদ দেখার উপর নির্ভরশীল”* / *“Moon-sighting dependent”* hint.

When a year has no data, the UI never fakes it: `lib/holidays.ts → hasHolidayData(year)` returns
`false` and the calendar displays the respectful notice in the active language.

### Adding a new year (e.g. 2027)

1. Wait for (or look up) the official notification from the **জনপ্রশাসন মন্ত্রণালয়**.
2. Add a new `"2027"` key in `data/bangladesh-holidays.json` following the same shape, and put the
   notification link in its `sources` array.
3. Run `npm run validate:data` — it checks that dates are real, that nothing is duplicated, and that
   every `lunar` holiday lands on the correct Hijri day.
4. If the government publishes new moon-sighting dates, extend `BANGLADESH_HIJRI_SHIFT` in
   `lib/hijri.ts` for the corresponding Hijri year.

> ⚠️ Please keep this file honest. A wrong holiday date is worse than a missing one.

---

## 🎨 Customisation

| What | Where |
|---|---|
| Site name, tagline, URL, repo/deploy links | `lib/config.ts` |
| Footer links (LinkedIn, portfolio) | `lib/config.ts → AUTHOR` |
| Colour palette, shadows, radii, animations | `app/globals.css` (`:root` + `.dark`, `@theme` blocks) |
| Fonts | `app/layout.tsx` (`FONT_HREF`) + `--font-bengali`, `--font-latin`, `--font-display` tokens |
| Default language / week start | `components/providers.tsx`, `lib/config.ts → DEFAULT_WEEK_START` |
| Supported year range | `lib/calendar.ts → MIN_YEAR / MAX_YEAR` |

### Using `next/font` (self-hosted fonts) instead of the Google Fonts link

The project loads the fonts over the Google Fonts CDN so that `npm install && npm run build` works
even without network access to Google during the build. If you prefer self-hosted, zero-CDN fonts on
Vercel, replace the `<link>` in `app/layout.tsx` with:

```tsx
import { Hind_Siliguri, Inter, Noto_Serif_Bengali } from 'next/font/google';

const bengali = Hind_Siliguri({ subsets: ['bengali', 'latin'], weight: ['300','400','500','600','700'], variable: '--font-bengali', display: 'swap' });
const display = Noto_Serif_Bengali({ subsets: ['bengali', 'latin'], weight: ['500','600','700'], variable: '--font-display', display: 'swap' });
const latin   = Inter({ subsets: ['latin'], variable: '--font-latin', display: 'swap' });
```

…then add `${bengali.variable} ${display.variable} ${latin.variable}` to the `<body>` class list.

---

## 🔄 Calendar sync, explained

Everything is generated in the browser — nothing to sign up for.

1. **Download an .ics file** — click **ক্যালেন্ডারে যোগ করুন / Add to your calendar** in the header,
   pick “this year” or “all years”, optionally include Islamic observances, and import the file into
   Google Calendar, Apple Calendar or Outlook.
2. **Add a single event** — every holiday and Islamic observance in the side panel has an
   *Add to Google Calendar* link (a plain template URL, no API key).
3. **Subscribe to the live feed** — `/bangladesh-holidays.ics` (Bengali) and
   `/bangladesh-holidays-en.ics` (English) are prerendered at build time. Paste the URL into
   *Google Calendar → Other calendars → From URL*, or use the `webcal://` link on iPhone/Mac to
   subscribe. Update the JSON data, redeploy, and subscribers get the new holidays automatically.

`lib/ics.ts` is a small, dependency-free RFC 5545 writer (correct text escaping and 75-octet
UTF-8-safe line folding), so no third-party calendar package is shipped to the browser.

---

## 🧪 Testing & accuracy

```bash
npm run validate:data   # dataset: real dates, no duplicates, correct Hijri mapping
npm run typecheck       # strict TypeScript, no errors
npm run build           # production build + prerendered .ics feeds
```

The date engines were cross-checked against the gazette and known anchors, including:

- Bangla round-trip conversion for **every day from 2025 to 2050** (no drift),
- month lengths for common and leap years (ফাল্গুন ২৯ / ৩০ দিন),
- all Hijri dates of the official 2025 and 2026 holiday notifications,
- **all 336 Hijri months** from 1446 to 1473 (every month exactly 29 or 30 days, with correct rollover),
- navigation clamping at both ends of the 2025–2050 range in all three calendar systems.

---

## 🛠️ Tech stack

- **Next.js 15** (App Router, static prerendering) + **React 19** + **TypeScript** (strict)
- **Tailwind CSS v4** (CSS-first `@theme` tokens, no config file needed)
- **next-themes** for dark / light / system
- **lucide-react** icons
- **Intl API** for Hijri conversion — no date libraries, no runtime dependencies beyond the above

---

## 🤝 Contributing

Pull requests are very welcome — especially:

- 📅 Adding **officially notified** holiday data for new years (`data/bangladesh-holidays.json`)
- 🕌 More Islamic observances or Ramadan-related dates
- 🌏 Additional languages (the copy lives in `lib/translations.ts`)
- 🐛 Bug reports about any date that doesn't match your local calendar

Please run `npm run validate:data` and `npm run typecheck` before opening a PR.

---

## 👨‍💻 Author

**Shohanur Sourav**

- LinkedIn: <https://www.linkedin.com/in/shohanursourav/>
- Portfolio: <https://shohanursourav.com>

If this project helped you, a ⭐ on GitHub means a lot!

---

## 📄 License

Released under the [MIT License](./LICENSE). The holiday dataset is compiled from public government
notifications; please verify official dates with the **জনপ্রশাসন মন্ত্রণালয়** before relying on them
for legal or administrative purposes.
