/** Static .ics subscription feed (English). */
import { buildFeedIcs } from '@/lib/sync';

export const dynamic = 'force-static';

export function GET() {
  const body = buildFeedIcs('en', true);

  return new Response(body, {
    headers: {
      'Content-Type': 'text/calendar; charset=utf-8',
      'Content-Disposition': 'inline; filename="bangladesh-holidays-en.ics"',
      'Cache-Control': 'public, max-age=3600, s-maxage=86400',
    },
  });
}
