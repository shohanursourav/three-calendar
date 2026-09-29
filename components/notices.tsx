'use client';

import { CalendarClock, Info, MoonStar } from 'lucide-react';
import { useLanguage } from '@/lib/i18n';
import { cn } from '@/lib/utils';

/**
 * Honest, small notices below the calendar:
 *  • the requested "holiday data for this year is not published yet" message, and
 *  • a moon-sighting caveat for Hijri dates.
 */
export function CalendarNotices({
  holidayDataMissing,
  year,
  hijriApproximate,
  className,
}: {
  holidayDataMissing: boolean;
  year: number;
  hijriApproximate: boolean;
  className?: string;
}) {
  const { t } = useLanguage();

  if (!holidayDataMissing && !hijriApproximate) return null;

  return (
    <div className={cn('space-y-2', className)}>
      {holidayDataMissing ? (
        <p className="flex items-start gap-2.5 rounded-2xl border border-dashed border-holiday/40 bg-holiday-soft/70 px-3.5 py-3 text-xs leading-relaxed text-muted sm:text-[0.8rem]">
          <CalendarClock className="mt-0.5 h-4 w-4 shrink-0 text-holiday" />
          <span>
            <span className="block font-semibold text-ink">{t('noticeHolidayDataMissingTitle')}</span>
            {t('noticeHolidayDataMissing')}
          </span>
        </p>
      ) : null}

      <p className="flex items-start gap-2.5 rounded-2xl border border-line bg-surface-2/60 px-3.5 py-3 text-xs leading-relaxed text-muted sm:text-[0.8rem]">
        {hijriApproximate ? (
          <Info className="mt-0.5 h-4 w-4 shrink-0 text-event" />
        ) : (
          <MoonStar className="mt-0.5 h-4 w-4 shrink-0 text-event" />
        )}
        <span>{hijriApproximate ? t('noticeHijriApprox', { year }) : t('noticeHijriSighting')}</span>
      </p>
    </div>
  );
}
