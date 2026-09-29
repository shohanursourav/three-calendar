'use client';

import { CalendarPlus, Leaf, MoonStar, Sparkles } from 'lucide-react';
import { useLanguage } from '@/lib/i18n';
import { cn, localizeNumber } from '@/lib/utils';
import { GREGORIAN_MONTHS, WEEKDAYS, formatLongDate, fromKey } from '@/lib/date-utils';
import { BANGLA_SEASONS, banglaMonthInfo } from '@/lib/bangla';
import { formatHijriDate, hijriLabel, islamicEventDescription, islamicEventName } from '@/lib/hijri';
import { holidayName } from '@/lib/holidays';
import { holidayGoogleCalendarUrl, islamicEventGoogleCalendarUrl } from '@/lib/sync';
import type { DayCell, Holiday } from '@/lib/types';

export function DayDetails({ cell }: { cell: DayCell }) {
  const { t, lang } = useLanguage();

  const banglaInfo = banglaMonthInfo(cell.bangla.month);
  const season = BANGLA_SEASONS[banglaInfo.season];

  const rows: { label: string; value: string; hint?: string }[] = [
    {
      label: t('gregorianLabel'),
      value: `${WEEKDAYS[lang][cell.date.getUTCDay()]}, ${formatLongDate(cell.date, lang)}`,
      hint: GREGORIAN_MONTHS[lang][cell.gregorian.month - 1],
    },
    {
      label: t('banglaLabel'),
      value: `${localizeNumber(cell.bangla.day, lang)} ${banglaInfo[lang]} ${localizeNumber(
        cell.bangla.year,
        lang,
      )}`,
      hint: `${season.emoji} ${season[lang]}`,
    },
    {
      label: t('hijriLabel'),
      value: formatHijriDate(cell.hijri, lang),
      hint: t('lunarNote'),
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-soft">{t('dayDetails')}</p>
          <p className="font-display text-xl font-semibold text-ink">
            {localizeNumber(cell.gregorian.day, lang)} {GREGORIAN_MONTHS[lang][cell.gregorian.month - 1]}{' '}
            {localizeNumber(cell.gregorian.year, lang)}
          </p>
        </div>
        <span
          className={cn(
            'chip',
            cell.holidays.length
              ? 'bg-holiday/12 text-holiday'
              : cell.events.length
                ? 'bg-event/12 text-event'
                : 'bg-surface-3 text-muted',
          )}
        >
          {cell.holidays.length
            ? t('publicHoliday')
            : cell.events.length
              ? t('islamicObservance')
              : cell.isFriday
                ? t('weeklyHoliday')
                : t('holidaysOf')}
        </span>
      </div>

      <dl className="divide-y divide-line overflow-hidden rounded-2xl border border-line bg-surface-2/60">
        {rows.map((row) => (
          <div key={row.label} className="flex items-center justify-between gap-3 px-3 py-2.5">
            <dt className="text-xs font-medium uppercase tracking-wide text-muted-soft">{row.label}</dt>
            <dd className="text-right">
              <span className="digit block text-sm font-medium text-ink">{row.value}</span>
              {row.hint ? <span className="block text-[0.68rem] text-muted">{row.hint}</span> : null}
            </dd>
          </div>
        ))}
      </dl>

      {cell.holidays.length ? (
        <ul className="space-y-2">
          {cell.holidays.map((holiday) => (
            <HolidayRow key={`${holiday.date}-${holiday.en}`} holiday={holiday} />
          ))}
        </ul>
      ) : null}

      {cell.events.length ? (
        <ul className="space-y-2">
          {cell.events.map((event) => (
            <li
              key={`${event.id}-${event.date}`}
              className="rounded-2xl border border-event/25 bg-event-soft p-3"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2">
                  <MoonStar className="h-4 w-4 shrink-0 text-event" />
                  <p className="text-sm font-semibold text-ink">{islamicEventName(event, lang)}</p>
                </div>
                <span className="chip bg-surface-2/70 text-event">{hijriLabel(event, lang)}</span>
              </div>
              <p className="mt-2 text-xs leading-relaxed text-muted">
                {islamicEventDescription(event, lang)}
              </p>
              <a
                href={islamicEventGoogleCalendarUrl(event, lang)}
                target="_blank"
                rel="noreferrer"
                className="mt-2.5 inline-flex items-center gap-1.5 text-xs font-semibold text-event hover:underline"
              >
                <CalendarPlus className="h-3.5 w-3.5" />
                {t('addToGoogle')}
              </a>
            </li>
          ))}
        </ul>
      ) : null}

      {!cell.holidays.length && !cell.events.length ? (
        <p className="flex items-center gap-2 rounded-2xl border border-line bg-surface-2/60 p-3 text-xs text-muted">
          <Leaf className="h-3.5 w-3.5 text-brand" />
          {t('noHolidaysThisMonth')}
        </p>
      ) : null}
    </div>
  );
}

export function HolidayRow({ holiday }: { holiday: Holiday }) {
  const { t, lang } = useLanguage();
  const date = formatLongDate(fromKey(holiday.date), lang);

  return (
    <li className="rounded-2xl border border-holiday/25 bg-holiday-soft p-3">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-ink">{holidayName(holiday, lang)}</p>
          <p className="mt-0.5 text-[0.68rem] text-muted">
            <span className="digit">{date}</span> ·{' '}
            {holiday.kind === 'general' ? t('kindGeneral') : t('kindExecutive')}
          </p>
        </div>
        <span className="chip bg-surface-2/70 text-holiday">
          {holiday.type === 'national'
            ? t('typeNational')
            : holiday.type === 'religious'
              ? t('typeReligious')
              : holiday.type === 'international'
                ? t('typeInternational')
                : t('typeCultural')}
        </span>
      </div>
      <div className="mt-2 flex flex-wrap items-center gap-3">
        <a
          href={holidayGoogleCalendarUrl(holiday, lang)}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-holiday hover:underline"
        >
          <CalendarPlus className="h-3.5 w-3.5" />
          {t('addToGoogle')}
        </a>
        {holiday.lunar ? (
          <span className="inline-flex items-center gap-1 text-[0.68rem] text-muted">
            <Sparkles className="h-3 w-3" />
            {t('lunarNote')}
          </span>
        ) : null}
      </div>
    </li>
  );
}
