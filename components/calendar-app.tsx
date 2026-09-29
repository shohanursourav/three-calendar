'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { AppHeader } from '@/components/app-header';
import { MonthCard } from '@/components/month-card';
import { DayDetails } from '@/components/day-details';
import { HolidayList, YearSummary } from '@/components/holiday-list';
import { CalendarNotices } from '@/components/notices';
import { SyncDialog } from '@/components/sync-dialog';
import { AppFooter } from '@/components/app-footer';
import { TodayStrip } from '@/components/today-strip';
import { Panel } from '@/components/ui/primitives';
import { useLanguage } from '@/lib/i18n';
import { HOLIDAY_DATA_YEARS, getHolidayYearRecord, getHolidaysForYear, hasHolidayData } from '@/lib/holidays';
import { isHijriSightingVerified } from '@/lib/hijri';
import { anchorFor, buildDayCell, buildMonth, shiftMonth, systemMonthFor } from '@/lib/calendar';
import { addDays, fromKey, toKey, today, todayUTC } from '@/lib/date-utils';
import { DEFAULT_WEEK_START, STORAGE_KEYS } from '@/lib/config';
import type { CalendarView, DayCell } from '@/lib/types';

/**
 * Deterministic "today" for the very first render.
 *
 * The value is computed from the *server's* clock, so server HTML and the first client render
 * always agree (no hydration mismatch). Right after hydration the real local date takes over.
 */
function initialDate(): Date {
  return todayUTC();
}

export function CalendarApp() {
  const { t, lang } = useLanguage();

  const [view, setView] = useState<CalendarView>('gregorian');
  const [weekStartsOn, setWeekStartsOn] = useState<number>(DEFAULT_WEEK_START);
  const [todayDate, setTodayDate] = useState<Date>(() => initialDate());
  const [anchor, setAnchor] = useState<Date>(() => initialDate());
  const [selectedKey, setSelectedKey] = useState<string>(() => toKey(initialDate()));
  const [syncOpen, setSyncOpen] = useState(false);

  /** Restore preferences and re-sync with the visitor's real local date after hydration. */
  useEffect(() => {
    const storedView = window.localStorage.getItem(STORAGE_KEYS.view) as CalendarView | null;
    if (storedView && ['gregorian', 'bengali', 'hijri'].includes(storedView)) setView(storedView);

    const storedWeekStart = window.localStorage.getItem(STORAGE_KEYS.weekStart);
    if (storedWeekStart !== null && !Number.isNaN(Number(storedWeekStart))) {
      setWeekStartsOn(Number(storedWeekStart));
    }

    const real = today();
    setTodayDate(real);
    setAnchor((current) => (toKey(current) === toKey(initialDate()) ? real : current));
    setSelectedKey((current) => (current === toKey(initialDate()) ? toKey(real) : current));
  }, []);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEYS.view, view);
  }, [view]);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEYS.weekStart, String(weekStartsOn));
  }, [weekStartsOn]);

  const model = useMemo(
    () => buildMonth(view, anchor, weekStartsOn, todayDate),
    [view, anchor, weekStartsOn, todayDate],
  );

  /** The selected day may sit outside the visible grid (e.g. after changing month). */
  const selectedCell = useMemo<DayCell>(() => {
    const inGrid = model.weeks.flat().find((cell) => cell.key === selectedKey);
    if (inGrid) return inGrid;
    return buildDayCell(fromKey(selectedKey), systemMonthFor(view, anchor), todayDate);
  }, [model, selectedKey, view, anchor, todayDate]);

  /** Gregorian year that the visible month is centred on. */
  const focusYear = useMemo(() => {
    const middle = addDays(model.firstDay, Math.floor(model.daysInMonth / 2));
    return middle.getUTCFullYear();
  }, [model]);

  const holidayDataMissing = !hasHolidayData(focusYear);
  const hijriApproximate = !isHijriSightingVerified(model.lastDay);

  const yearRecord = getHolidayYearRecord(focusYear);
  const holidaysForYear = getHolidaysForYear(focusYear);

  const handleNavigate = useCallback(
    (delta: number) => {
      setAnchor((current) => shiftMonth(view, current, delta));
    },
    [view],
  );

  const handleJump = useCallback((targetView: CalendarView, year: number, month: number) => {
    setAnchor(anchorFor(targetView, year, month));
  }, []);

  const handleSelect = useCallback((cell: DayCell) => {
    setSelectedKey(cell.key);
  }, []);

  const handleSelectDate = useCallback(
    (key: string) => {
      setSelectedKey(key);
      const parsed = fromKey(key);
      const target = systemMonthFor(view, parsed);
      const current = systemMonthFor(view, anchor);
      if (target.year !== current.year || target.month !== current.month) {
        setAnchor(parsed);
      }
    },
    [view, anchor],
  );

  const handleToday = useCallback(() => {
    setAnchor(todayDate);
    setSelectedKey(toKey(todayDate));
  }, [todayDate]);

  /** ← / → step through months when the user is not typing in a field. */
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      if (target && ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName)) return;
      if (event.key === 'ArrowLeft') handleNavigate(lang === 'bn' ? 1 : -1);
      if (event.key === 'ArrowRight') handleNavigate(lang === 'bn' ? -1 : 1);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [handleNavigate, lang]);

  const scopeLabel =
    HOLIDAY_DATA_YEARS.length > 1
      ? `${HOLIDAY_DATA_YEARS[0]}–${HOLIDAY_DATA_YEARS[HOLIDAY_DATA_YEARS.length - 1]}`
      : String(HOLIDAY_DATA_YEARS[0] ?? '');

  return (
    <div className="flex min-h-screen flex-col">
      <AppHeader
        view={view}
        onViewChange={setView}
        weekStartsOn={weekStartsOn}
        onWeekStartsChange={setWeekStartsOn}
        onOpenSync={() => setSyncOpen(true)}
      />

      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-6 sm:px-6">
        <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_21rem] xl:grid-cols-[minmax(0,1fr)_23rem]">
          <div className="space-y-4">
            <TodayStrip todayDate={todayDate} onSelectToday={handleToday} />
            <MonthCard
              model={model}
              view={view}
              weekStartsOn={weekStartsOn}
              selectedKey={selectedKey}
              onSelect={handleSelect}
              onNavigate={handleNavigate}
              onJump={handleJump}
              onToday={handleToday}
              onOpenSync={() => setSyncOpen(true)}
            />
            <CalendarNotices
              holidayDataMissing={holidayDataMissing}
              year={focusYear}
              hijriApproximate={hijriApproximate}
            />
          </div>

          <aside className="space-y-4 lg:sticky lg:top-[7.5rem] lg:self-start">
            <Panel className="p-4">
              <DayDetails cell={selectedCell} />
            </Panel>

            <Panel className="space-y-3 p-4">
              <div className="flex items-center justify-between gap-2">
                <p className="text-sm font-semibold text-ink">{t('holidaysThisMonth')}</p>
                <span className="digit chip bg-surface-3 text-muted">
                  {t('holidayCount', { count: model.holidaysInView.length })}
                </span>
              </div>
              <HolidayList
                holidays={model.holidaysInView}
                onSelectDate={handleSelectDate}
                selectedKey={selectedKey}
                emptyLabel={t('noHolidaysThisMonth')}
              />
            </Panel>

            <YearSummary
              year={focusYear}
              general={holidaysForYear.filter((holiday) => holiday.kind === 'general').length}
              executive={holidaysForYear.filter((holiday) => holiday.kind === 'executive').length}
              hasData={!holidayDataMissing}
              updated={yearRecord?.updated ?? null}
              missingNotice={t('noticeHolidayDataMissing')}
              onOpenSync={() => setSyncOpen(true)}
            />

            <p className="px-1 text-[0.68rem] leading-relaxed text-muted-soft">
              {t('footerNote')} <span className="digit">({scopeLabel})</span>
            </p>
          </aside>
        </div>
      </main>

      <AppFooter />

      <SyncDialog open={syncOpen} onClose={() => setSyncOpen(false)} year={focusYear} />
    </div>
  );
}
