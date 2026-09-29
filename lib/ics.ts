/**
 * A tiny, dependency-free RFC 5545 (.ics) writer.
 *
 * Everything happens in the browser — no server, no paid API. The generated file can be
 * imported into Google Calendar, Apple Calendar, Outlook or any other calendar app, or the
 * static feed shipped in /public can be subscribed to with webcal.
 */

import { toCompact } from './date-utils';

export interface IcsEventInput {
  uid: string;
  /** Inclusive start day (civil date) */
  start: Date;
  /** Inclusive end day (civil date) — DTEND is written as the exclusive next day */
  end: Date;
  summary: string;
  description?: string;
  categories?: string[];
  /** Minutes before start for a pop-up reminder. */
  reminderMinutes?: number;
}

export interface IcsCalendarOptions {
  name: string;
  description?: string;
  timezone?: string;
  events: IcsEventInput[];
  /** Produced-by id, must look like an email-ish token per spec. */
  prodId?: string;
}

const CRLF = '\r\n';

function escapeText(value: string): string {
  return value
    .replace(/\\/g, '\\\\')
    .replace(/;/g, '\\;')
    .replace(/,/g, '\\,')
    .replace(/\r?\n/g, '\\n');
}

/** Fold a content line at 75 octets without breaking multi-byte UTF-8 characters. */
function foldLine(line: string): string {
  const encoder = new TextEncoder();
  if (encoder.encode(line).length <= 75) return line;

  const chunks: string[] = [];
  let current = '';
  let bytes = 0;

  for (const char of line) {
    const charBytes = encoder.encode(char).length;
    if (bytes + charBytes > 75) {
      chunks.push(current);
      current = ' ';
      bytes = 1;
    }
    current += char;
    bytes += charBytes;
  }
  chunks.push(current);
  return chunks.join(CRLF);
}

function addDays(date: Date, amount: number): Date {
  return new Date(date.getTime() + amount * 86_400_000);
}

function timestamp(date = new Date()): string {
  return `${date.toISOString().replace(/[-:]/g, '').split('.')[0]}Z`;
}

function eventBlock(event: IcsEventInput): string[] {
  const lines = [
    'BEGIN:VEVENT',
    `UID:${event.uid}`,
    `DTSTAMP:${timestamp()}`,
    `DTSTART;VALUE=DATE:${toCompact(event.start)}`,
    `DTEND;VALUE=DATE:${toCompact(addDays(event.end, 1))}`,
    `SUMMARY:${escapeText(event.summary)}`,
  ];

  if (event.description) lines.push(`DESCRIPTION:${escapeText(event.description)}`);
  if (event.categories?.length) lines.push(`CATEGORIES:${event.categories.map(escapeText).join(',')}`);
  lines.push('TRANSP:TRANSPARENT');

  if (event.reminderMinutes) {
    lines.push(
      'BEGIN:VALARM',
      'ACTION:DISPLAY',
      `DESCRIPTION:${escapeText(event.summary)}`,
      `TRIGGER:-PT${event.reminderMinutes}M`,
      'END:VALARM',
    );
  }

  lines.push('END:VEVENT');
  return lines;
}

export function buildIcs(options: IcsCalendarOptions): string {
  const {
    name,
    description,
    timezone = 'Asia/Dhaka',
    events,
    prodId = '-//three-calendar//Bangladesh Public Holidays//EN',
  } = options;

  const lines: string[] = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    `PRODID:${prodId}`,
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    `X-WR-CALNAME:${escapeText(name)}`,
  ];

  if (description) lines.push(`X-WR-CALDESC:${escapeText(description)}`);
  lines.push(`X-WR-TIMEZONE:${timezone}`);

  events.forEach((event) => lines.push(...eventBlock(event)));
  lines.push('END:VCALENDAR');

  return lines.map(foldLine).join(CRLF) + CRLF;
}

/** Trigger a client-side download of the generated calendar file. */
export function downloadIcs(filename: string, content: string): void {
  const blob = new Blob([content], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  URL.revokeObjectURL(url);
}

/** "Add to Google Calendar" template link — completely free, no API key. */
export function googleCalendarUrl(event: {
  title: string;
  description?: string;
  start: Date;
  end: Date;
  location?: string;
}): string {
  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: event.title,
    dates: `${toCompact(event.start)}/${toCompact(addDays(event.end, 1))}`,
  });
  if (event.description) params.set('details', event.description);
  if (event.location) params.set('location', event.location);
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

/** webcal:// link so a Mac/iPhone/Outlook user can subscribe to the static feed. */
export function webcalUrl(feedUrl: string): string {
  return feedUrl.replace(/^https?:\/\//, 'webcal://');
}
