import type { Booking, Room, RoomLayout, RoomStatus } from '../types';
import { isFuture, overlaps, toMinutes } from './time';

export const STATUS_META: Record<RoomStatus, {label: string;className: string;dot: string;}> = {
  ACTIVE: {
    label: 'พร้อมใช้งาน',
    className: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    dot: 'bg-emerald-500'
  },
  MAINTENANCE: {
    label: 'ปิดซ่อมบำรุง',
    className: 'bg-amber-50 text-amber-700 border-amber-200',
    dot: 'bg-amber-500'
  },
  DISABLED: {
    label: 'ปิดใช้งาน',
    className: 'bg-muted text-muted-foreground border-border',
    dot: 'bg-muted-foreground'
  }
};

export const LAYOUT_LABEL: Record<RoomLayout, string> = {
  BOARDROOM: 'Boardroom',
  U_SHAPE: 'U-Shape',
  THEATER: 'Theater',
  CLASSROOM: 'Classroom',
  ROUND: 'Round Table'
};

export const BOOKING_STATUS_META = {
  CONFIRMED: { label: 'ยืนยันแล้ว', className: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  COMPLETED: { label: 'เสร็จสิ้น', className: 'bg-muted text-muted-foreground border-border' },
  CANCELLED: { label: 'ยกเลิกแล้ว', className: 'bg-red-50 text-red-700 border-red-200' }
} as const;

export function isRoomBookable(room: Room): boolean {
  return room.status === 'ACTIVE';
}

/** Bookings that still block a room from being deleted. */
export function activeBookingsForRoom(bookings: Booking[], roomId: string, now = new Date()): Booking[] {
  return bookings.filter(
    (b) => b.roomId === roomId && b.status === 'CONFIRMED' && isFuture(b.date, b.endTime, now)
  );
}

export function bookingsForRoomOnDate(bookings: Booking[], roomId: string, date: string): Booking[] {
  return bookings.
  filter((b) => b.roomId === roomId && b.date === date && b.status === 'CONFIRMED').
  sort((a, b) => toMinutes(a.startTime) - toMinutes(b.startTime));
}

export function hasConflict(
bookings: Booking[],
roomId: string,
date: string,
start: string,
end: string,
ignoreId?: string)
: Booking | undefined {
  return bookingsForRoomOnDate(bookings, roomId, date).find(
    (b) => b.id !== ignoreId && overlaps(start, end, b.startTime, b.endTime)
  );
}

export function nextFreeSlotLabel(bookings: Booking[], room: Room, date: string): string {
  if (!isRoomBookable(room)) return STATUS_META[room.status].label;
  const booked = bookingsForRoomOnDate(bookings, room.id, date);
  if (booked.length === 0) return 'ว่างทั้งวัน';
  const totalBooked = booked.reduce((sum, b) => sum + (toMinutes(b.endTime) - toMinutes(b.startTime)), 0);
  const hours = Math.round(totalBooked / 60 * 10) / 10;
  return `มีจองแล้ว ${booked.length} รายการ · ${hours} ชม.`;
}