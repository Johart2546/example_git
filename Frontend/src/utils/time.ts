/** Working hours shown on every availability timeline. */
export const DAY_START = '08:00';
export const DAY_END = '20:00';
export const SLOT_MINUTES = 30;

export function toMinutes(time: string): number {
  const [h, m] = time.split(':').map(Number);
  return h * 60 + m;
}

export function toTime(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
}

export function buildSlots(): string[] {
  const slots: string[] = [];
  for (let m = toMinutes(DAY_START); m < toMinutes(DAY_END); m += SLOT_MINUTES) {
    slots.push(toTime(m));
  }
  return slots;
}

export const TIME_SLOTS = buildSlots();

export function overlaps(aStart: string, aEnd: string, bStart: string, bEnd: string): boolean {
  return toMinutes(aStart) < toMinutes(bEnd) && toMinutes(bStart) < toMinutes(aEnd);
}

export function durationLabel(start: string, end: string): string {
  const mins = toMinutes(end) - toMinutes(start);
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  if (h && m) return `${h} ชม. ${m} นาที`;
  if (h) return `${h} ชม.`;
  return `${m} นาที`;
}

export function todayISO(): string {
  return new Date().toISOString().slice(0, 10);
}

export function addDaysISO(iso: string, days: number): string {
  const d = new Date(`${iso}T00:00:00`);
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}

const TH_DAYS = ['อาทิตย์', 'จันทร์', 'อังคาร', 'พุธ', 'พฤหัสบดี', 'ศุกร์', 'เสาร์'];
const TH_MONTHS = [
'ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.',
'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'];


export function formatDateTH(iso: string, withDay = true): string {
  const d = new Date(`${iso}T00:00:00`);
  const base = `${d.getDate()} ${TH_MONTHS[d.getMonth()]} ${d.getFullYear() + 543}`;
  return withDay ? `${TH_DAYS[d.getDay()]}ที่ ${base}` : base;
}

export function shortDayTH(iso: string): {day: string;date: string;} {
  const d = new Date(`${iso}T00:00:00`);
  return { day: TH_DAYS[d.getDay()].slice(0, 2), date: String(d.getDate()) };
}

/** A booking is "active" while it has not been cancelled and has not finished yet. */
export function isFuture(date: string, endTime: string, now = new Date()): boolean {
  return new Date(`${date}T${endTime}:00`).getTime() > now.getTime();
}