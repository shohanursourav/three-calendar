'use client';

import { CalendarCheck2, CalendarHeart, MoonStar, PartyPopper } from 'lucide-react';
import { useLanguage } from '@/lib/i18n';
import { localizeNumber } from '@/lib/utils';
import { WEEKDAYS, diffInDays, formatLongDate, fromKey } from '@/lib/date-utils';
import { BANGLA_SEASONS, banglaMonthInfo, toBanglaDate } from '@/lib/bangla';
import { formatHijriDate, toHijri } from '@/lib/hijri';
import { getUpcomingHolidays, holidayName } from '@/lib/holidays';

/** A slim "today at a glance" strip: all three dates plus the next public holiday. */
export function TodayStrip({ todayDate, onSelectToday }: { todayDate: Date; onSelectToday: () => void }) {
  const { t, lang } = useLanguage();

  const bangla = toBanglaDate(todayDate);
  const hijri = toHijri(todayDate);
  const banglaInfo = banglaMonthInfo(bangla.month);
  const season = BANGLA_SEASONS[banglaInfo.season];
  const nextHoliday = getUpcomingHolidays(todayDate, 1)[0];
  const daysLeft = nextHoliday ? diffInDays(fromKey(nextHoliday.date), todayDate) : null;

  return (
    <section className="glass-card animate-rise overflow-hidden rounded-card">
      <div className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
        <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
          <div className="flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-brand-soft text-brand">
              <CalendarHeart className="h-5 w-5" />
            </span>
            <div>
              <p className="text-[0.68rem] font-semibold uppercase tracking-wide text-muted-soft">
                {t('today')} · {WEEKDAYS[lang][todayDate.getUTCDay()]}
              </p>
              <p className="font-display text-base font-semibold text-ink">
                {formatLongDate(todayDate, lang)}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-event-soft text-event">
              <CalendarCheck2 className="h-5 w-5" />
            </span>
            <div>
              <p className="text-[0.68rem] font-semibold uppercase tracking-wide text-muted-soft">
                {t('banglaLabel')}
              </p>
              <p className="digit text-sm font-semibold text-ink">
                {localizeNumber(bangla.day, lang)} {banglaInfo[lang]} {localizeNumber(bangla.year, lang)}
                <span className="ml-1.5 text-[0.68rem] font-normal text-muted">
                  {season.emoji} {season[lang]}
                </span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-holiday-soft text-holiday">
              <MoonStar className="h-5 w-5" />
            </span>
            <div>
              <p className="text-[0.68rem] font-semibold uppercase tracking-wide text-muted-soft">
                {t('hijriLabel')}
              </p>
              <p className="digit text-sm font-semibold text-ink">{formatHijriDate(hijri, lang)}</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 sm:max-w-[18rem] sm:justify-end">
          {nextHoliday ? (
            <button
              type="button"
              onClick={() => onSelectToday()}
              className="group flex w-full items-center gap-3 rounded-2xl border border-holiday/25 bg-holiday-soft/70 px-3 py-2.5 text-left transition-colors hover:border-holiday/50"
            >
              <PartyPopper className="h-4 w-4 shrink-0 text-holiday" />
              <span className="min-w-0">
                <span className="block text-[0.66rem] font-semibold uppercase tracking-wide text-muted-soft">
                  {t('upcomingHolidays')}
                </span>
                <span className="block truncate text-sm font-semibold text-ink">
                  {holidayName(nextHoliday, lang)}
                </span>
              </span>
              {daysLeft !== null ? (
                <span className="digit ml-auto shrink-0 rounded-full bg-surface-2 px-2 py-1 text-[0.68rem] font-semibold text-holiday">
                  {daysLeft === 0
                    ? t('today')
                    : `${localizeNumber(daysLeft, lang)} ${lang === 'bn' ? 'দিন পর' : 'days'}`}
                </span>
              ) : null}
            </button>
          ) : null}
        </div>
      </div>
    </section>
  );
}
