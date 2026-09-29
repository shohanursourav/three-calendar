'use client';

import { Github, Linkedin, Sparkles } from 'lucide-react';
import { useLanguage } from '@/lib/i18n';
import { AUTHOR, SITE } from '@/lib/config';
import { HOLIDAY_DATASET_META } from '@/lib/holidays';
import { formatLongDate, fromKey } from '@/lib/date-utils';
import { localizeNumber } from '@/lib/utils';

export function AppFooter() {
  const { t, lang } = useLanguage();
  const updated = HOLIDAY_DATASET_META.latestUpdated;

  return (
    <footer className="mt-10 border-t border-line/70 bg-surface/40 backdrop-blur-sm">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-8 sm:px-6 lg:flex-row lg:items-start lg:justify-between">
        <div className="max-w-md space-y-2">
          <p className="flex items-center gap-2 text-sm font-semibold text-ink">
            <Sparkles className="h-4 w-4 text-brand" />
            {lang === 'bn' ? SITE.nameBn : SITE.name}
          </p>
          <p className="text-xs leading-relaxed text-muted">{SITE.description[lang]}</p>
          <p className="text-[0.7rem] leading-relaxed text-muted-soft">
            {t('footerNote')} {t('dataSource')}: {t('dataSourceValue')}
            {updated ? (
              <>
                {' · '}
                {t('updatedOn')} <span className="digit">{formatLongDate(fromKey(updated), lang)}</span>
              </>
            ) : null}
          </p>
        </div>

        <div className="flex flex-col gap-4 text-sm sm:flex-row sm:gap-10">
          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-soft">
              {t('developedBy')}
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <a
                href={AUTHOR.linkedin}
                target="_blank"
                rel="noreferrer"
                className="group inline-flex items-center gap-2 rounded-full border border-line bg-surface-2 px-3 py-2 text-xs font-semibold text-ink transition-all hover:-translate-y-0.5 hover:border-brand/40 hover:text-brand"
              >
                <Linkedin className="h-4 w-4 text-[#0A66C2]" aria-hidden />
                {AUTHOR.name}
                <span className="sr-only">LinkedIn</span>
              </a>
              <a
                href={AUTHOR.portfolio}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 rounded-full border border-line bg-surface-2 px-3 py-2 text-xs font-semibold text-ink transition-all hover:-translate-y-0.5 hover:border-brand/40 hover:text-brand"
              >
                {t('portfolio')}
                <span aria-hidden>↗</span>
              </a>
            </div>
          </div>

          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-soft">
              {t('openSource')}
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <a
                href={SITE.repo}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-line bg-surface-2 px-3 py-2 text-xs font-semibold text-ink transition-all hover:-translate-y-0.5 hover:border-brand/40 hover:text-brand"
              >
                <Github className="h-4 w-4" aria-hidden />
                {t('starOnGithub')}
              </a>
              <span className="digit text-[0.7rem] text-muted-soft" suppressHydrationWarning>
                {localizeNumber(new Date().getUTCFullYear(), lang)} © {SITE.name}
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
