import React from 'react';
import type { Booking } from '../../types';
import { DAY_END, DAY_START, TIME_SLOTS, toMinutes } from '../../utils/time';

interface Props {
  bookings: Booking[];
  /** Slots the user is currently selecting, shown as a highlighted range. */
  selection?: {start: string;end: string;} | null;
  disabled?: boolean;
  onSlotClick?: (slot: string) => void;
}

const TOTAL = toMinutes(DAY_END) - toMinutes(DAY_START);

export function AvailabilityTimeline({ bookings, selection, disabled = false, onSlotClick }: Props) {
  const bookedSlots = new Set<string>();
  bookings.forEach((b) => {
    TIME_SLOTS.forEach((slot) => {
      const m = toMinutes(slot);
      if (m >= toMinutes(b.startTime) && m < toMinutes(b.endTime)) bookedSlots.add(slot);
    });
  });

  return (
    <div className="space-y-3">
      <div className="relative h-14 w-full overflow-hidden rounded-lg border border-border bg-secondary">
        {TIME_SLOTS.map((slot, i) =>
        <div
          key={slot}
          className="absolute top-0 h-full border-r border-border/60"
          style={{ left: `${i / TIME_SLOTS.length * 100}%`, width: `${100 / TIME_SLOTS.length}%` }}
          aria-hidden="true" />

        )}
        {bookings.map((b) => {
          const left = (toMinutes(b.startTime) - toMinutes(DAY_START)) / TOTAL * 100;
          const width = (toMinutes(b.endTime) - toMinutes(b.startTime)) / TOTAL * 100;
          return (
            <div
              key={b.id}
              className="absolute top-1 bottom-1 overflow-hidden rounded-md bg-primary px-2 py-1 text-primary-foreground"
              style={{ left: `${left}%`, width: `${width}%` }}
              title={`${b.title} · ${b.startTime}–${b.endTime}`}>
              
              <p className="truncate text-[11px] font-medium leading-tight">{b.title}</p>
              <p className="truncate text-[10px] opacity-80">{b.startTime}–{b.endTime}</p>
            </div>);

        })}
        {selection && toMinutes(selection.end) > toMinutes(selection.start) &&
        <div
          className="absolute top-1 bottom-1 rounded-md border-2 border-dashed border-emerald-500 bg-emerald-500/15"
          style={{
            left: `${(toMinutes(selection.start) - toMinutes(DAY_START)) / TOTAL * 100}%`,
            width: `${(toMinutes(selection.end) - toMinutes(selection.start)) / TOTAL * 100}%`
          }}
          aria-hidden="true" />

        }
      </div>

      <div className="flex justify-between text-[11px] text-muted-foreground">
        {['08:00', '11:00', '14:00', '17:00', '20:00'].map((t) =>
        <span key={t}>{t}</span>
        )}
      </div>

      {onSlotClick &&
      <div className="grid grid-cols-6 gap-1.5 sm:grid-cols-8 lg:grid-cols-12">
          {TIME_SLOTS.map((slot) => {
          const isBooked = bookedSlots.has(slot);
          const inSelection =
          selection && toMinutes(slot) >= toMinutes(selection.start) && toMinutes(slot) < toMinutes(selection.end);
          return (
            <button
              key={slot}
              type="button"
              disabled={disabled || isBooked}
              onClick={() => onSlotClick(slot)}
              aria-pressed={Boolean(inSelection)}
              className={[
              'rounded-md border px-1 py-1.5 text-[11px] font-medium transition-colors',
              isBooked ?
              'cursor-not-allowed border-border bg-muted text-muted-foreground line-through' :
              inSelection ?
              'border-primary bg-primary text-primary-foreground' :
              'border-border bg-background hover:bg-accent hover:text-accent-foreground',
              disabled ? 'cursor-not-allowed opacity-50' : ''].
              join(' ')}>
              
                {slot}
              </button>);

        })}
        </div>
      }

      <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
        <span className="inline-flex items-center gap-1.5">
          <span className="size-2.5 rounded-sm bg-primary" aria-hidden="true" /> ถูกจองแล้ว
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="size-2.5 rounded-sm border border-border bg-background" aria-hidden="true" /> ว่าง
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="size-2.5 rounded-sm border-2 border-dashed border-emerald-500" aria-hidden="true" /> ช่วงที่เลือก
        </span>
      </div>
    </div>);

}