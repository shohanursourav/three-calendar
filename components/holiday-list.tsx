'use client';

import { CalendarDays, CalendarPlus, Info } from 'lucide-react';
import { useLanguage } from '@/lib/i18n';
import { localizeNumber } from '@/lib/utils';
import { formatShortDate, fromKey } from '@/lib/date-utils';
import { holidayName } from '@/lib/holidays';
import { holidayGoogleCalendarUrl } from '@/lib/sync';
import type { Holiday } from '@/lib/types';

/** List of the public holidays inside the visible month, clickable to jump to that day. */
export function HolidayList({
  holidays,
  onSelectDate,
  selectedKey,
  emptyLabel,
}: {
  holidays: Holiday[];
  onSelectDate: (key: string) => void;
  selectedKey: string;
  emptyLabel: string;
}) {
  const { t, lang } = useLanguage();

  if (!holidays.length) {
    return (
      <p className="rounded-2xl border border-dashed border-line bg-surface-2/50 p-3 text-xs text-muted">
        {emptyLabel}
      </p>
    );
  }

  return (
    <ul className="space-y-1.5">
      {holidays.map((holiday) => {
        const date = fromKey(holiday.date);
        const selected = date.toISOString().slice(0, 10) === selectedKey;
        return (
          <li key={`${holiday.date}-${holiday.en}`}>
            <div
              className={`group flex items-center gap-2 rounded-2xl border p-2 transition-colors ${
                selected
                  ? 'border-brand/40 bg-brand-soft'
                  : 'border-line bg-surface-2/60 hover:border-line-strong hover:bg-surface-2'
              }`}
            >
              <button
                type="button"
                onClick={() => onSelectDate(holiday.date)}
                className="flex flex-1 items-center gap-2.5 text-left"
              >
                <span className="flex h-10 w-10 shrink-0 flex-col items-center justify-center rounded-xl bg-holiday-soft text-holiday">
                  <span className="digit text-sm font-bold leading-none">
                    {localizeNumber(date.getUTCDate(), lang)}
                  </span>
                  <span className="text-[0.55rem] uppercase leading-tight">
                    {formatShortDate(date, lang).split(' ').slice(-1)[0]}
                  </span>
                </span>
                <span className="min-w-0">
                  <span className="block truncate text-sm font-medium text-ink">
                    {holidayName(holiday, lang)}
                  </span>
                  <span className="block text-[0.68rem] text-muted">
                    {holiday.kind === 'general' ? t('kindGeneral') : t('kindExecutive')}
                    {holiday.lunar ? ` · ${t('lunarNote')}` : ''}
                  </span>
                </span>
              </button>
              <a
                href={holidayGoogleCalendarUrl(holiday, lang)}
                target="_blank"
                rel="noreferrer"
                title={t('addToGoogle')}
                className="rounded-full p-1.5 text-muted opacity-0 transition-opacity hover:bg-surface-3 hover:text-brand group-hover:opacity-100 focus-visible:opacity-100"
              >
                <CalendarPlus className="h-3.5 w-3.5" />
              </a>
            </div>
          </li>
        );
      })}
    </ul>
  );
}

/** Year-level summary card, including the honest "data not published" notice. */
export function YearSummary({
  year,
  general,
  executive,
  hasData,
  updated,
  missingNotice,
  onOpenSync,
}: {
  year: number;
  general: number;
  executive: number;
  hasData: boolean;
  updated: string | null;
  missingNotice: string;
  onOpenSync: () => void;
}) {
  const { t, lang } = useLanguage();

  return (
    <div className="glass-card space-y-3 rounded-card p-4">
      <div className="flex items-center justify-between gap-3">
        <p className="flex items-center gap-2 text-sm font-semibold text-ink">
          <CalendarDays className="h-4 w-4 text-brand" />
          {t('holidaysThisYear', { year })}
        </p>
        {hasData ? (
          <button
            type="button"
            onClick={onOpenSync}
            className="chip bg-brand-soft text-brand transition-colors hover:bg-brand/20"
          >
            {t('downloadIcs')}
          </button>
        ) : null}
      </div>

      {hasData ? (
        <div className="grid grid-cols-2 gap-2">
          <div className="rounded-2xl border border-line bg-surface-2/60 p-3">
            <p className="digit text-xl font-semibold text-ink">{t('publicHolidaysCount', { count: general + executive })}</p>
            <p className="mt-1 text-[0.68rem] text-muted">{t('dataSourceValue')}</p>
          </div>
          <div className="space-y-1.5 rounded-2xl border border-line bg-surface-2/60 p-3 text-[0.7rem] text-muted">
            <p className="digit">{t('generalCount', { count: general })}</p>
            <p className="digit">{t('executiveCount', { count: executive })}</p>
            {updated ? (
              <p className="pt-0.5 text-muted-soft">
                {t('updatedOn')}: <span className="digit">{updated}</span>
              </p>
            ) : null}
          </div>
        </div>
      ) : (
        <p className="flex items-start gap-2 rounded-2xl border border-dashed border-holiday/40 bg-holiday-soft/60 p-3 text-xs leading-relaxed text-muted">
          <Info className="mt-0.5 h-3.5 w-3.5 shrink-0 text-holiday" />
          {missingNotice}
        </p>
      )}
    </div>
  );
}
