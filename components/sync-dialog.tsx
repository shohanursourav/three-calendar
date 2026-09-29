'use client';

import { useState } from 'react';
import { Check, CloudDownload, Copy, ExternalLink, Link2, Smartphone } from 'lucide-react';
import { Modal, Switch } from '@/components/ui/primitives';
import { Segmented } from '@/components/ui/segmented';
import { useLanguage } from '@/lib/i18n';
import { localizeNumber } from '@/lib/utils';
import { HOLIDAY_DATA_YEARS } from '@/lib/holidays';
import { downloadHolidayIcs, feedUrl, feedWebcalUrl } from '@/lib/sync';

/**
 * Sync hub: download an .ics file (works with Google / Apple / Outlook) or copy the
 * subscription link of the static feed. Everything is generated in the browser — no API keys,
 * no server, no cost.
 */
export function SyncDialog({
  open,
  onClose,
  year,
}: {
  open: boolean;
  onClose: () => void;
  year: number;
}) {
  const { t, lang } = useLanguage();
  const [scope, setScope] = useState<'year' | 'all'>('year');
  const [includeIslamicEvents, setIncludeIslamicEvents] = useState(true);
  const [copied, setCopied] = useState(false);

  const years = scope === 'year' && HOLIDAY_DATA_YEARS.includes(year) ? [year] : HOLIDAY_DATA_YEARS;
  const options = { years, lang, includeIslamicEvents };

  const handleCopy = async () => {
    const url = feedUrl();
    try {
      await navigator.clipboard.writeText(url);
    } catch {
      // Older browsers: fall back to a temporary textarea.
      const textarea = document.createElement('textarea');
      textarea.value = url;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
    }
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2200);
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={t('syncTitle')}
      subtitle={t('syncSubtitle')}
      maxWidth="max-w-2xl"
    >
      <div className="space-y-5">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-3 rounded-3xl border border-line bg-surface-2/60 p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-soft">
              {t('downloadIcs')}
            </p>
            <Segmented
              ariaLabel={t('downloadIcs')}
              size="sm"
              value={scope}
              onChange={(value) => setScope(value)}
              options={[
                {
                  value: 'year' as const,
                  label: t('scopeThisYear', { year: HOLIDAY_DATA_YEARS.includes(year) ? year : HOLIDAY_DATA_YEARS[0] }),
                },
                {
                  value: 'all' as const,
                  label: t('scopeAllYears', {
                    years: `${localizeNumber(HOLIDAY_DATA_YEARS[0], lang)}–${localizeNumber(
                      HOLIDAY_DATA_YEARS[HOLIDAY_DATA_YEARS.length - 1],
                      lang,
                    )}`,
                  }),
                },
              ]}
            />
            <Switch
              label={t('includeIslamicEvents')}
              checked={includeIslamicEvents}
              onChange={setIncludeIslamicEvents}
              description={t('subscribeHint')}
            />
            <button
              type="button"
              onClick={() => downloadHolidayIcs(options)}
              className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-brand px-4 py-3 text-sm font-semibold text-white shadow-[0_14px_30px_-16px_var(--brand-ring)] transition-transform hover:-translate-y-0.5 active:translate-y-0"
            >
              <CloudDownload className="h-4 w-4" />
              {t('downloadIcs')}
            </button>
            <p className="text-[0.7rem] leading-relaxed text-muted">{t('downloadIcsHint')}</p>
          </div>

          <div className="space-y-3 rounded-3xl border border-line bg-surface-2/60 p-4">
            <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-muted-soft">
              <Link2 className="h-3.5 w-3.5" />
              {t('subscribeFeed')}
            </p>
            <code className="block truncate rounded-2xl border border-line bg-surface-3/70 px-3 py-2 text-[0.7rem] text-muted">
              {feedUrl()}
            </code>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={handleCopy}
                className="inline-flex items-center gap-1.5 rounded-full border border-line bg-surface-2 px-3 py-2 text-xs font-semibold text-ink transition-colors hover:border-line-strong"
              >
                {copied ? <Check className="h-3.5 w-3.5 text-brand" /> : <Copy className="h-3.5 w-3.5" />}
                {copied ? t('copied') : t('copyLink')}
              </button>
              <a
                href={feedWebcalUrl()}
                className="inline-flex items-center gap-1.5 rounded-full border border-line bg-surface-2 px-3 py-2 text-xs font-semibold text-ink transition-colors hover:border-line-strong"
              >
                <Smartphone className="h-3.5 w-3.5" />
                webcal
              </a>
            </div>
            <p className="text-[0.7rem] leading-relaxed text-muted">{t('subscribeHint')}</p>
            <ol className="space-y-1.5 text-[0.7rem] leading-relaxed text-muted">
              <li>
                <span className="font-semibold text-ink">1.</span>{' '}
                {lang === 'bn'
                  ? 'Google Calendar → Other calendars → From URL'
                  : 'Google Calendar → Other calendars → From URL'}
              </li>
              <li>
                <span className="font-semibold text-ink">2.</span>{' '}
                {lang === 'bn' ? 'উপরের লিংকটি পেস্ট করুন' : 'Paste the link above'}
              </li>
              <li>
                <span className="font-semibold text-ink">3.</span>{' '}
                {lang === 'bn' ? 'Apple Calendar হলে webcal লিংক ব্যবহার করুন' : 'On Apple Calendar use the webcal link'}
              </li>
            </ol>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 rounded-3xl border border-line bg-surface-3/40 p-4">
          <p className="text-[0.72rem] leading-relaxed text-muted">
            {lang === 'bn'
              ? 'সব ইভেন্ট ব্রাউজারেই তৈরি হয় — কোনো সার্ভার, অ্যাকাউন্ট বা পেইড API লাগে না।'
              : 'Every event is generated in your browser — no server, account or paid API involved.'}
          </p>
          <a
            href={feedUrl()}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand hover:underline"
          >
            <ExternalLink className="h-3.5 w-3.5" />
            {lang === 'bn' ? '.ics ফিড দেখুন' : 'Open the .ics feed'}
          </a>
        </div>
      </div>
    </Modal>
  );
}
