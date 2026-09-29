'use client';

import { CalendarCheck2, MoonStar, Sparkles } from 'lucide-react';
import { TooltipBubble } from '@/components/ui/primitives';
import { useLanguage } from '@/lib/i18n';
import { cn, localizeNumber } from '@/lib/utils';
import { hijriMonthName } from '@/lib/hijri';
import { banglaMonthInfo } from '@/lib/bangla';
import { holidayName } from '@/lib/holidays';
import { formatHijriDate } from '@/lib/hijri';
import { formatLongDate } from '@/lib/date-utils';
import type { CalendarView, DayCell as DayCellType } from '@/lib/types';

interface DayCellProps {
  cell: DayCellType;
  view: CalendarView;
  selected: boolean;
  /** First row of the grid opens its tooltip downwards so it is never clipped by the card. */
  tooltipSide?: 'top' | 'bottom';
  /** Near-edge columns anchor the tooltip so it stays inside the clipped calendar card. */
  tooltipAlign?: 'center' | 'start' | 'end';
  onSelect: (cell: DayCellType) => void;
}

/** The three "faces" of a day: one primary (the active system) + two quiet overlays. */
function labels(cell: DayCellType, view: CalendarView, lang: 'bn' | 'en') {
  const gregorian = localizeNumber(cell.gregorian.day, lang);
  const bangla = `${localizeNumber(cell.bangla.day, lang)} ${banglaMonthInfo(cell.bangla.month)[lang]}`;
  const hijri = `${localizeNumber(cell.hijri.day, lang)} ${hijriMonthName(cell.hijri.month, lang)}`;

  switch (view) {
    case 'bengali':
      return { primary: localizeNumber(cell.bangla.day, lang), secondary: [`${gregorian}`, hijri] };
    case 'hijri':
      return { primary: localizeNumber(cell.hijri.day, lang), secondary: [gregorian, bangla] };
    default:
      return { primary: gregorian, secondary: [bangla, hijri] };
  }
}

export function DayCell({
  cell,
  view,
  selected,
  tooltipSide = 'top',
  tooltipAlign = 'center',
  onSelect,
}: DayCellProps) {
  const { lang, t } = useLanguage();
  const { primary, secondary } = labels(cell, view, lang);

  const holiday = cell.holidays[0];
  const event = cell.events[0];
  const hasHoliday = Boolean(holiday);
  const hasEvent = Boolean(event);
  const tooltipContent = (
    <span className="block space-y-1.5">
      <span className="block text-[0.7rem] font-medium text-muted">
        {formatLongDate(cell.date, lang)}
        <span className="block text-[0.65rem] text-muted-soft">
          {localizeNumber(cell.bangla.day, lang)} {banglaMonthInfo(cell.bangla.month)[lang]}{' '}
          {localizeNumber(cell.bangla.year, lang)} · {formatHijriDate(cell.hijri, lang)}
        </span>
      </span>
      {cell.holidays.map((item) => (
        <span key={`${item.date}-${item.en}`} className="flex items-start gap-1.5">
          <span className="mt-0.5 h-1.5 w-1.5 shrink-0 rounded-full bg-holiday" />
          <span>
            <span className="block text-xs font-semibold text-ink">{holidayName(item, lang)}</span>
            <span className="block text-[0.65rem] text-muted">
              {t('publicHoliday')} · {item.kind === 'general' ? t('kindGeneral') : t('kindExecutive')}
            </span>
          </span>
        </span>
      ))}
      {cell.events.map((item) => (
        <span key={`${item.id}-${item.date}`} className="flex items-start gap-1.5">
          <MoonStar className="mt-0.5 h-3 w-3 shrink-0 text-event" />
          <span className="text-xs text-ink">{lang === 'bn' ? item.bn : item.en}</span>
        </span>
      ))}
      {!cell.holidays.length && !cell.events.length ? (
        <span className="block text-xs text-muted">
          {localizeNumber(cell.gregorian.day, lang)} · {banglaMonthInfo(cell.bangla.month)[lang]}
        </span>
      ) : null}
    </span>
  );

  return (
    <div className="group/cell relative transition-[z-index] hover:z-30 focus-within:z-30">
      <button
        type="button"
        onClick={() => onSelect(cell)}
        aria-current={cell.isToday ? 'date' : undefined}
        aria-pressed={selected}
        className={cn(
          'relative flex h-full min-h-[4.4rem] w-full flex-col gap-1 overflow-hidden rounded-cell border p-1.5 text-left transition-all duration-300 sm:min-h-[5.75rem] sm:p-2.5',
          'focus-visible:outline-none',
          cell.inMonth
            ? 'border-line bg-surface-2/70 hover:-translate-y-0.5 hover:border-line-strong hover:bg-surface-2 hover:shadow-[0_14px_30px_-18px_rgba(0,0,0,0.45)]'
            : 'border-transparent bg-transparent text-muted-soft opacity-60 hover:opacity-100',
          hasHoliday && cell.inMonth && 'border-holiday/25 bg-holiday-soft hover:bg-holiday-soft',
          hasEvent && !hasHoliday && cell.inMonth && 'border-event/25 bg-event-soft',
          cell.isWeekend && cell.inMonth && !hasHoliday && 'bg-surface-3/50',
          selected && 'border-transparent ring-2 ring-brand ring-offset-1 ring-offset-canvas',
        )}
      >
        <div className="flex items-start justify-between gap-1">
          <span
            className={cn(
              'digit font-semibold leading-none tracking-tight',
              'text-[1.15rem] sm:text-[1.55rem]',
              cell.isToday && cell.inMonth ? 'text-brand' : 'text-ink',
              !cell.inMonth && 'text-muted-soft',
            )}
          >
            {primary}
          </span>

          <span className="flex items-center gap-1 pt-0.5">
            {hasHoliday ? <span className="h-2 w-2 rounded-full bg-holiday shadow-sm" /> : null}
            {hasEvent ? <MoonStar className="h-3.5 w-3.5 text-event" /> : null}
            {cell.isToday && cell.inMonth ? (
              <span className="hidden rounded-full bg-brand px-1.5 py-0.5 text-[0.55rem] font-semibold uppercase text-white sm:inline-block">
                {t('today')}
              </span>
            ) : null}
          </span>
        </div>

        <span className="mt-auto flex flex-col gap-0.5">
          {secondary.map((line, index) => (
            <span
              key={line}
              className={cn(
                'digit truncate text-[0.6rem] leading-tight sm:text-[0.68rem]',
                index === 0 ? 'text-muted' : 'text-muted-soft',
                !cell.inMonth && 'text-muted-soft',
              )}
            >
              {line}
            </span>
          ))}

          {hasHoliday || hasEvent ? (
            <span className="mt-0.5 hidden w-full items-center gap-1 sm:flex">
              <span
                className={cn(
                  'chip w-full justify-start truncate px-1.5 text-[0.62rem]',
                  hasHoliday ? 'bg-holiday/12 text-holiday' : 'bg-event/12 text-event',
                )}
              >
                {hasHoliday ? (
                  <CalendarCheck2 className="h-2.5 w-2.5 shrink-0" />
                ) : (
                  <Sparkles className="h-2.5 w-2.5 shrink-0" />
                )}
                <span className="truncate">{holiday ? holidayName(holiday, lang) : lang === 'bn' ? event!.bn : event!.en}</span>
              </span>
            </span>
          ) : null}
        </span>

      </button>

      <TooltipBubble content={tooltipContent} side={tooltipSide} align={tooltipAlign} />
    </div>
  );
}
