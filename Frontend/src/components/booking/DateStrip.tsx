import React from 'react';
import { addDaysISO, shortDayTH, todayISO } from '../../utils/time';

interface Props {
  value: string;
  onChange: (date: string) => void;
  days?: number;
}

export function DateStrip({ value, onChange, days = 10 }: Props) {
  const start = todayISO();
  const dates = Array.from({ length: days }, (_, i) => addDaysISO(start, i));

  return (
    <div className="flex gap-2 overflow-x-auto pb-1" role="group" aria-label="เลือกวันที่">
      {dates.map((iso) => {
        const { day, date } = shortDayTH(iso);
        const selected = iso === value;
        return (
          <button
            key={iso}
            type="button"
            onClick={() => onChange(iso)}
            aria-pressed={selected}
            className={[
            'flex min-w-[58px] flex-col items-center gap-0.5 rounded-lg border px-3 py-2 text-sm transition-colors',
            selected ?
            'border-primary bg-primary text-primary-foreground' :
            'border-border bg-background hover:bg-accent hover:text-accent-foreground'].
            join(' ')}>
            
            <span className="text-[11px] opacity-80">{iso === start ? 'วันนี้' : day}</span>
            <span className="text-base font-semibold leading-none">{date}</span>
          </button>);

      })}
    </div>);

}