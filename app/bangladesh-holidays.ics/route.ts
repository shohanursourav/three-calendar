/**
 * Static .ics subscription feed (Bengali).
 *
 * `dynamic = 'force-static'` makes Next.js generate this file at build time, so on Vercel it is
 * served straight from the CDN: no serverless invocation, no cost, and it stays perfectly
 * cacheable. Subscribe with webcal://… or paste the https URL into
 * Google Calendar → Other calendars → From URL.
 */
import { buildFeedIcs } from '@/lib/sync';

export const dynamic = 'force-static';

export function GET() {
  const body = buildFeedIcs('bn', true);

  return new Response(body, {
    headers: {
      'Content-Type': 'text/calendar; charset=utf-8',
      'Content-Disposition': 'inline; filename="bangladesh-holidays.ics"',
      'Cache-Control': 'public, max-age=3600, s-maxage=86400',
    },
  });
}
