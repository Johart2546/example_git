import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CalendarX2, Clock, MapPin, Users } from 'lucide-react';
import { useBooking } from '../contexts/BookingContext';
import { Button } from '../components/ui/Button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/Tabs';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle } from
'../components/ui/AlertDialog';
import { BOOKING_STATUS_META } from '../utils/room';
import { durationLabel, formatDateTH, isFuture } from '../utils/time';
import type { Booking } from '../types';

function BookingRow({
  booking,
  onCancel



}: {booking: Booking;onCancel?: (booking: Booking) => void;}) {
  const { getRoom } = useBooking();
  const navigate = useNavigate();
  const room = getRoom(booking.roomId);
  const meta = BOOKING_STATUS_META[booking.status];

  return (
    <li className="flex flex-wrap items-center gap-4 rounded-xl border border-border bg-card p-4">
      <div className="flex w-24 shrink-0 flex-col items-center rounded-lg bg-secondary py-2">
        <span className="text-xs text-muted-foreground">{formatDateTH(booking.date, false).slice(0, -5)}</span>
        <span className="text-lg font-semibold tabular-nums">{booking.startTime}</span>
      </div>

      <div className="min-w-0 flex-1 space-y-1">
        <div className="flex flex-wrap items-center gap-2">
          <h3 className="truncate text-sm font-semibold">{booking.title}</h3>
          <span className={`rounded-full border px-2 py-0.5 text-[11px] font-medium ${meta.className}`}>
            {meta.label}
          </span>
          <span className="font-mono text-[11px] text-muted-foreground">{booking.id}</span>
        </div>
        <p className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1">
            <MapPin className="size-3.5" aria-hidden="true" />
            {room ? `${room.name} · ${room.building} ชั้น ${room.floor}` : 'ห้องถูกลบออกจากระบบแล้ว'}
          </span>
          <span className="inline-flex items-center gap-1">
            <Clock className="size-3.5" aria-hidden="true" />
            {booking.startTime}–{booking.endTime} ({durationLabel(booking.startTime, booking.endTime)})
          </span>
          <span className="inline-flex items-center gap-1">
            <Users className="size-3.5" aria-hidden="true" />
            {booking.attendees} คน
          </span>
        </p>
        {booking.note && <p className="text-xs text-muted-foreground">หมายเหตุ: {booking.note}</p>}
      </div>

      <div className="flex items-center gap-2">
        {room &&
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate(`/rooms/${room.id}?date=${booking.date}`)}>
          
            ดูห้อง
          </Button>
        }
        {onCancel &&
        <Button variant="ghost" size="sm" className="text-destructive" onClick={() => onCancel(booking)}>
            ยกเลิกการจอง
          </Button>
        }
      </div>
    </li>);

}

function EmptyState({ message }: {message: string;}) {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed border-border bg-card py-16 text-center">
      <CalendarX2 className="size-8 text-muted-foreground" aria-hidden="true" />
      <p className="text-sm text-muted-foreground">{message}</p>
      <Button variant="outline" onClick={() => navigate('/rooms')}>
        ค้นหาห้องประชุม
      </Button>
    </div>);

}

export function MyBookingsPage() {
  const { bookings, currentUser, cancelBooking } = useBooking();
  const [pendingCancel, setPendingCancel] = useState<Booking | null>(null);

  const mine = useMemo(
    () => bookings.filter((b) => b.userId === currentUser.id),
    [bookings, currentUser.id]
  );

  const upcoming = mine.
  filter((b) => b.status === 'CONFIRMED' && isFuture(b.date, b.endTime)).
  sort((a, b) => `${a.date}${a.startTime}`.localeCompare(`${b.date}${b.startTime}`));

  const history = mine.
  filter((b) => !(b.status === 'CONFIRMED' && isFuture(b.date, b.endTime))).
  sort((a, b) => `${b.date}${b.startTime}`.localeCompare(`${a.date}${a.startTime}`));

  return (
    <div className="space-y-6">
      <header className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight">การจองของฉัน</h1>
        <p className="text-sm text-muted-foreground">
          ดูการจองที่กำลังจะถึง ยกเลิกการจอง และย้อนดูประวัติการใช้ห้องประชุม
        </p>
      </header>

      <Tabs defaultValue="upcoming" className="space-y-4">
        <TabsList>
          <TabsTrigger value="upcoming">กำลังจะถึง ({upcoming.length})</TabsTrigger>
          <TabsTrigger value="history">ประวัติการจอง ({history.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="upcoming">
          {upcoming.length === 0 ?
          <EmptyState message="ยังไม่มีการจองที่กำลังจะถึง" /> :

          <ul className="space-y-3">
              {upcoming.map((b) =>
            <BookingRow key={b.id} booking={b} onCancel={setPendingCancel} />
            )}
            </ul>
          }
        </TabsContent>

        <TabsContent value="history">
          {history.length === 0 ?
          <EmptyState message="ยังไม่มีประวัติการจอง" /> :

          <ul className="space-y-3">
              {history.map((b) =>
            <BookingRow key={b.id} booking={b} />
            )}
            </ul>
          }
        </TabsContent>
      </Tabs>

      <AlertDialog open={Boolean(pendingCancel)} onOpenChange={(open) => !open && setPendingCancel(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>ยกเลิกการจองนี้?</AlertDialogTitle>
            <AlertDialogDescription>
              {pendingCancel ?
              `${pendingCancel.title} · ${formatDateTH(pendingCancel.date, false)} ${pendingCancel.startTime}–${pendingCancel.endTime}` :
              ''}
              {' '}เมื่อยกเลิกแล้ว ช่วงเวลานี้จะถูกปล่อยให้ผู้อื่นจองได้ทันที
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>ไม่ใช่ตอนนี้</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-white hover:bg-destructive/90"
              onClick={() => {
                if (pendingCancel) cancelBooking(pendingCancel.id);
                setPendingCancel(null);
              }}>
              
              ยืนยันการยกเลิก
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>);

}