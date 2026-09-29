'use client';

import { ChevronLeft, ChevronRight, CloudDownload, LocateFixed } from 'lucide-react';
import { DayCell } from '@/components/day-cell';
import { IconButton } from '@/components/ui/primitives';
import { useLanguage } from '@/lib/i18n';
import { cn, localizeNumber } from '@/lib/utils';
import { GREGORIAN_MONTHS, WEEKDAYS, WEEKDAYS_SHORT, formatShortDate, weekOrder } from '@/lib/date-utils';
import { banglaMonthInfo } from '@/lib/bangla';
import { hijriMonthName } from '@/lib/hijri';
import { canNavigate, MAX_YEAR, MIN_YEAR, shiftMonth, viewYears } from '@/lib/calendar';
import type { CalendarView, DayCell as DayCellType, MonthModel } from '@/lib/types';

interface MonthCardProps {
  model: MonthModel;
  view: CalendarView;
  weekStartsOn: number;
  selectedKey: string;
  onSelect: (cell: DayCellType) => void;
  onNavigate: (delta: number) => void;
  onJump: (view: CalendarView, year: number, month: number) => void;
  onToday: () => void;
  onOpenSync: () => void;
}

export function MonthCard({
  model,
  view,
  weekStartsOn,
  selectedKey,
  onSelect,
  onNavigate,
  onJump,
  onToday,
  onOpenSync,
}: MonthCardProps) {
  const { t, lang } = useLanguage();

  const title = (() => {
    if (view === 'bengali') return `${banglaMonthInfo(model.month)[lang]} ${localizeNumber(model.year, lang)}`;
    if (view === 'hijri') return `${hijriMonthName(model.month, lang)} ${localizeNumber(model.year, lang)}`;
    return `${GREGORIAN_MONTHS[lang][model.month - 1]} ${localizeNumber(model.year, lang)}`;
  })();

  const subtitle = (() => {
    const from = formatShortDate(model.firstDay, lang);
    const to = formatShortDate(model.lastDay, lang);
    const yearFrom = localizeNumber(model.firstDay.getUTCFullYear(), lang);
    const yearTo = localizeNumber(model.lastDay.getUTCFullYear(), lang);
    const sameYear = yearFrom === yearTo;
    if (view === 'gregorian') {
      return `${t('monthDaysLabel', { count: model.daysInMonth })} · ${formatShortDate(
        model.firstDay,
        lang,
      )} – ${formatShortDate(model.lastDay, lang)}`;
    }
    return sameYear
      ? `${from} – ${to} ${yearFrom}`
      : `${from} ${yearFrom} – ${to} ${yearTo}`;
  })();

  const eraLabel =
    view === 'bengali' ? t('banglaShort') : view === 'hijri' ? t('hijriShort') : t('gregorianShort');

  const years = viewYears(view);
  const prevDisabled = !canNavigate(view, model.firstDay, -1);
  const nextDisabled = !canNavigate(view, model.firstDay, 1);

  return (
    <section className="glass-card overflow-hidden rounded-card">
      {/* Card header */}
      <div className="flex flex-col gap-4 border-b border-line/80 p-4 sm:p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <IconButton
              label={t('prevMonth')}
              variant="outline"
              onClick={() => onNavigate(-1)}
              disabled={prevDisabled}
            >
              <ChevronLeft className="h-4 w-4" />
            </IconButton>
            <IconButton
              label={t('nextMonth')}
              variant="outline"
              onClick={() => onNavigate(1)}
              disabled={nextDisabled}
            >
              <ChevronRight className="h-4 w-4" />
            </IconButton>
            <button
              type="button"
              onClick={onToday}
              title={t('backToToday')}
              className="ml-1 inline-flex items-center gap-1.5 rounded-full border border-line bg-surface-2 px-3 py-2 text-xs font-medium text-muted transition-colors hover:border-line-strong hover:text-ink"
            >
              <LocateFixed className="h-3.5 w-3.5" />
              {t('today')}
            </button>
          </div>

          <div className="flex items-center gap-2">
            <label className="sr-only" htmlFor="year-select">
              {t('yearLabel')}
            </label>
            <select
              id="year-select"
              value={model.year}
              onChange={(event) => onJump(view, Number(event.target.value), model.month)}
              className="digit rounded-full border border-line bg-surface-2 px-3 py-2 text-xs font-medium text-ink transition-colors hover:border-line-strong focus:outline-none"
            >
              {years.map((year) => (
                <option key={year} value={year}>
                  {localizeNumber(year, lang)}
                </option>
              ))}
            </select>
            <label className="sr-only" htmlFor="month-select">
              {t('monthLabel')}
            </label>
            <select
              id="month-select"
              value={model.month}
              onChange={(event) => onJump(view, model.year, Number(event.target.value))}
              className="rounded-full border border-line bg-surface-2 px-3 py-2 text-xs font-medium text-ink transition-colors hover:border-line-strong focus:outline-none"
            >
              {(view === 'gregorian'
                ? GREGORIAN_MONTHS[lang]
                : view === 'bengali'
                  ? Array.from({ length: 12 }, (_, index) => banglaMonthInfo(index + 1)[lang])
                  : Array.from({ length: 12 }, (_, index) => hijriMonthName(index + 1, lang))
              ).map((name, index) => (
                <option key={name + index} value={index + 1}>
                  {name}
                </option>
              ))}
            </select>
            <button
              type="button"
              onClick={onOpenSync}
              className="inline-flex items-center gap-1.5 rounded-full bg-brand-soft px-3 py-2 text-xs font-semibold text-brand transition-colors hover:bg-brand/20 lg:hidden"
            >
              <CloudDownload className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">{t('syncTitle')}</span>
            </button>
          </div>
        </div>

        <div className="flex flex-wrap items-end justify-between gap-2">
          <div>
            <h2 className="font-display text-2xl font-semibold tracking-tight text-ink sm:text-3xl">
              {title}
              <span className="ml-2 align-middle text-[0.7rem] font-medium uppercase tracking-wide text-muted-soft">
                {eraLabel}
              </span>
            </h2>
            <p className="mt-1 text-xs text-muted sm:text-sm">{subtitle}</p>
          </div>
          <p className="digit text-xs text-muted-soft">
            {t('viewRange')}: {localizeNumber(MIN_YEAR, lang)} – {localizeNumber(MAX_YEAR, lang)}
          </p>
        </div>
      </div>

      {/* Weekday header */}
      <div className="grid grid-cols-7 gap-1 px-2 pt-3 sm:gap-1.5 sm:px-4">
        {weekOrder(weekStartsOn).map((weekday) => (
          <div
            key={weekday}
            className={cn(
              'pb-1 text-center text-[0.62rem] font-semibold uppercase tracking-wide sm:text-[0.7rem]',
              weekday === 5 ? 'text-holiday' : weekday === 6 ? 'text-muted' : 'text-muted-soft',
            )}
          >
            <span className="hidden sm:inline">{WEEKDAYS[lang][weekday]}</span>
            <span className="sm:hidden">{WEEKDAYS_SHORT[lang][weekday]}</span>
          </div>
        ))}
      </div>

      {/* Grid */}
      <div key={`${view}-${model.year}-${model.month}`} className="animate-fade-in px-2 pb-2 sm:px-4">
        <div
          role="group"
          aria-label={title}
          className="grid grid-cols-7 auto-rows-fr gap-1 sm:gap-1.5"
        >
          {model.weeks.map((week, weekIndex) =>
            week.map((cell, dayIndex) => (
              <DayCell
                key={cell.key}
                cell={cell}
                view={view}
                selected={cell.key === selectedKey}
                tooltipSide={weekIndex === 0 ? 'bottom' : 'top'}
                tooltipAlign={dayIndex === 0 ? 'start' : dayIndex === 6 ? 'end' : 'center'}
                onSelect={onSelect}
              />
            )),
          )}
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-line/80 px-4 py-3 text-[0.7rem] text-muted sm:px-5">
        <span className="inline-flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-holiday" />
          {t('holidayLegend')}
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-event" />
          {t('eventLegend')}
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full ring-2 ring-brand ring-offset-1 ring-offset-canvas" />
          {t('todayLegend')}
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-surface-3 outline outline-1 outline-line" />
          {t('weekendLegend')}
        </span>
      </div>
    </section>
  );
}
