'use client';

import { useEffect, useState } from 'react';
import { useTheme } from 'next-themes';
import { CalendarHeart, CloudDownload, Languages, Moon, Settings2, Sun } from 'lucide-react';
import { Segmented } from '@/components/ui/segmented';
import { IconButton, Popover } from '@/components/ui/primitives';
import { useLanguage } from '@/lib/i18n';
import { cn } from '@/lib/utils';
import { SITE } from '@/lib/config';
import type { CalendarView, Language } from '@/lib/types';
import { HOLIDAY_DATASET_META } from '@/lib/holidays';
import { formatLongDate, fromKey } from '@/lib/date-utils';

interface AppHeaderProps {
  view: CalendarView;
  onViewChange: (view: CalendarView) => void;
  weekStartsOn: number;
  onWeekStartsChange: (value: number) => void;
  onOpenSync: () => void;
}

export function AppHeader({
  view,
  onViewChange,
  weekStartsOn,
  onWeekStartsChange,
  onOpenSync,
}: AppHeaderProps) {
  const { t, lang, setLang } = useLanguage();
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const isDark = mounted ? (theme === 'system' ? resolvedTheme === 'dark' : theme === 'dark') : false;

  const viewOptions: { value: CalendarView; label: string }[] = [
    { value: 'gregorian', label: t('viewGregorian') },
    { value: 'bengali', label: t('viewBengali') },
    { value: 'hijri', label: t('viewHijri') },
  ];

  const languageOptions: { value: Language; label: string }[] = [
    { value: 'bn', label: 'বাংলা' },
    { value: 'en', label: 'English' },
  ];

  const lastUpdated = HOLIDAY_DATASET_META.latestUpdated
    ? formatLongDate(fromKey(HOLIDAY_DATASET_META.latestUpdated), lang)
    : '—';

  return (
    <header className="sticky top-0 z-50 border-b border-line/70 bg-canvas/70 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-3 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:gap-6">
        {/* Brand */}
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="relative flex h-11 w-11 items-center justify-center rounded-2xl bg-brand text-white shadow-[0_10px_30px_-12px_var(--brand-ring)]">
              <CalendarHeart className="h-5 w-5" />
              <span className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full bg-holiday ring-2 ring-canvas" />
            </span>
            <div className="leading-tight">
              <p className="font-display text-[1.05rem] font-semibold tracking-tight text-ink">
                {lang === 'bn' ? SITE.nameBn : SITE.name}
              </p>
              <p className="text-[0.7rem] text-muted">{t('appTagline')}</p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 lg:hidden">
            <IconButton
              label={t('syncAria')}
              variant="solid"
              size="sm"
              onClick={onOpenSync}
              className="h-9 w-9"
            >
              <CloudDownload className="h-4 w-4" />
            </IconButton>
            <SettingsMenu
              theme={mounted ? theme ?? 'system' : 'system'}
              onThemeChange={setTheme}
              weekStartsOn={weekStartsOn}
              onWeekStartsChange={onWeekStartsChange}
              lastUpdated={lastUpdated}
            />
          </div>
        </div>

        {/* Controls */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          <div className="min-w-[13.5rem] flex-1 sm:max-w-[17rem]">
            <Segmented
              ariaLabel={t('viewLabel')}
              value={view}
              options={viewOptions}
              onChange={onViewChange}
              size="sm"
            />
          </div>

          <div className="flex items-center gap-2">
            <span className="hidden h-6 w-px bg-line sm:block" aria-hidden />
            <span className="hidden text-muted sm:block" aria-hidden>
              <Languages className="h-4 w-4" />
            </span>
            <div className="w-[8.5rem]">
              <Segmented
                ariaLabel={t('languageToggleAria')}
                value={lang}
                options={languageOptions}
                onChange={(next) => setLang(next)}
                size="sm"
              />
            </div>
            <IconButton
              label={t('themeToggleAria')}
              size="sm"
              onClick={() => setTheme(isDark ? 'light' : 'dark')}
              className="hidden sm:inline-flex"
            >
              {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </IconButton>
            <span className="hidden lg:block">
              <SettingsMenu
                theme={mounted ? theme ?? 'system' : 'system'}
                onThemeChange={setTheme}
                weekStartsOn={weekStartsOn}
                onWeekStartsChange={onWeekStartsChange}
                lastUpdated={lastUpdated}
              />
            </span>
            <button
              type="button"
              onClick={onOpenSync}
              className={cn(
                'hidden items-center gap-2 rounded-full bg-brand px-4 py-2.5 text-sm font-semibold text-white shadow-[0_12px_30px_-14px_var(--brand-ring)] transition-all duration-200',
                'hover:-translate-y-0.5 hover:bg-brand-strong active:translate-y-0 lg:inline-flex',
              )}
            >
              <CloudDownload className="h-4 w-4" />
              {t('syncTitle')}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}

function SettingsMenu({
  theme,
  onThemeChange,
  weekStartsOn,
  onWeekStartsChange,
  lastUpdated,
}: {
  theme: string;
  onThemeChange: (value: string) => void;
  weekStartsOn: number;
  onWeekStartsChange: (value: number) => void;
  lastUpdated: string;
}) {
  const { t, lang } = useLanguage();

  const themeOptions = [
    { value: 'light', label: t('themeLight'), icon: <Sun className="h-3.5 w-3.5" /> },
    { value: 'dark', label: t('themeDark'), icon: <Moon className="h-3.5 w-3.5" /> },
    { value: 'system', label: t('themeSystem') },
  ];

  const weekOptions = [
    { value: 6, label: t('weekStartSaturday') },
    { value: 0, label: t('weekStartSunday') },
    { value: 1, label: t('weekStartMonday') },
  ];

  return (
    <Popover
      align="end"
      panelClassName="w-80 max-w-[calc(100vw-2rem)]"
      trigger={({ open, toggle }) => (
        <IconButton
          label={t('settings')}
          size="sm"
          onClick={toggle}
          className={cn('h-9 w-9', open && 'bg-surface-3 text-ink')}
        >
          <Settings2 className="h-4 w-4" />
        </IconButton>
      )}
    >
      {() => (
        <div className="space-y-4">
          <div>
            <p className="px-1 pb-2 text-xs font-semibold uppercase tracking-wide text-muted-soft">
              {t('themeLabel')}
            </p>
            <Segmented
              ariaLabel={t('themeLabel')}
              value={theme}
              options={themeOptions}
              onChange={onThemeChange}
              size="sm"
            />
          </div>

          <div>
            <p className="px-1 pb-2 text-xs font-semibold uppercase tracking-wide text-muted-soft">
              {t('weekStartLabel')}
            </p>
            <Segmented
              ariaLabel={t('weekStartLabel')}
              value={weekStartsOn}
              options={weekOptions}
              onChange={onWeekStartsChange}
              size="sm"
            />
          </div>

          <div className="rounded-2xl border border-line bg-surface-3/50 p-3 text-xs leading-relaxed text-muted">
            <p className="font-medium text-ink">{t('dataSource')}</p>
            <p className="mt-0.5">{t('dataSourceValue')}</p>
            <p className="mt-1">
              {t('updatedOn')}: <span className="digit">{lastUpdated}</span>
            </p>
            <a
              href={SITE.repo}
              target="_blank"
              rel="noreferrer"
              className="mt-2 inline-flex items-center gap-1 font-medium text-brand hover:underline"
            >
              {t('starOnGithub')}
              <span aria-hidden>↗</span>
            </a>
          </div>
        </div>
      )}
    </Popover>
  );
}
