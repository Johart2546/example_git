import React, { useMemo, useState } from 'react';
import { Search } from 'lucide-react';
import { useBooking } from '../../contexts/BookingContext';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/Select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow } from
'../../components/ui/Table';
import { BOOKING_STATUS_META } from '../../utils/room';
import { durationLabel, formatDateTH, isFuture, todayISO } from '../../utils/time';

export function AdminBookingsPage() {
  const { bookings, rooms, getRoom, cancelBooking } = useBooking();
  const [query, setQuery] = useState('');
  const [roomFilter, setRoomFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return bookings.
    filter((b) => {
      if (q && !`${b.id} ${b.title} ${b.userName}`.toLowerCase().includes(q)) return false;
      if (roomFilter !== 'ALL' && b.roomId !== roomFilter) return false;
      if (statusFilter !== 'ALL' && b.status !== statusFilter) return false;
      return true;
    }).
    sort((a, b) => `${b.date}${b.startTime}`.localeCompare(`${a.date}${a.startTime}`));
  }, [bookings, query, roomFilter, statusFilter]);

  const today = todayISO();
  const stats = [
  { label: 'การจองทั้งหมด', value: bookings.length },
  { label: 'วันนี้', value: bookings.filter((b) => b.date === today && b.status === 'CONFIRMED').length },
  {
    label: 'กำลังจะถึง',
    value: bookings.filter((b) => b.status === 'CONFIRMED' && isFuture(b.date, b.endTime)).length
  },
  { label: 'ยกเลิกแล้ว', value: bookings.filter((b) => b.status === 'CANCELLED').length }];


  return (
    <div className="space-y-6">
      <header className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight">รายการจองทั้งหมด</h1>
        <p className="text-sm text-muted-foreground">
          ตรวจสอบสถานะการใช้งานห้อง และยกเลิกการจองในกรณีจำเป็น
        </p>
      </header>

      <section aria-label="สรุปการจอง" className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map(({ label, value }) =>
        <div key={label} className="rounded-xl border border-border bg-card p-4">
            <p className="text-sm text-muted-foreground">{label}</p>
            <p className="mt-2 text-2xl font-semibold tabular-nums">{value}</p>
          </div>
        )}
      </section>

      <div className="flex flex-wrap items-center gap-3">
        <div className="relative min-w-[240px] flex-1">
          <Search
            className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
            aria-hidden="true" />
          
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="ค้นหารหัสการจอง หัวข้อ หรือผู้จอง"
            className="pl-9"
            aria-label="ค้นหาการจอง" />
          
        </div>
        <Select value={roomFilter} onValueChange={setRoomFilter}>
          <SelectTrigger className="w-[200px]" aria-label="กรองตามห้อง">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">ทุกห้อง</SelectItem>
            {rooms.map((r) =>
            <SelectItem key={r.id} value={r.id}>
                {r.name}
              </SelectItem>
            )}
          </SelectContent>
        </Select>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[170px]" aria-label="กรองตามสถานะ">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">ทุกสถานะ</SelectItem>
            <SelectItem value="CONFIRMED">ยืนยันแล้ว</SelectItem>
            <SelectItem value="COMPLETED">เสร็จสิ้น</SelectItem>
            <SelectItem value="CANCELLED">ยกเลิกแล้ว</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="overflow-hidden rounded-xl border border-border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>รหัส</TableHead>
              <TableHead>หัวข้อ</TableHead>
              <TableHead>ห้อง</TableHead>
              <TableHead>วันที่</TableHead>
              <TableHead>เวลา</TableHead>
              <TableHead className="text-right">ผู้เข้าร่วม</TableHead>
              <TableHead>ผู้จอง</TableHead>
              <TableHead>สถานะ</TableHead>
              <TableHead className="text-right">จัดการ</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 &&
            <TableRow>
                <TableCell colSpan={9} className="py-12 text-center text-sm text-muted-foreground">
                  ไม่พบรายการจองที่ตรงกับเงื่อนไข
                </TableCell>
              </TableRow>
            }
            {filtered.map((b) => {
              const room = getRoom(b.roomId);
              const meta = BOOKING_STATUS_META[b.status];
              const cancellable = b.status === 'CONFIRMED' && isFuture(b.date, b.endTime);
              return (
                <TableRow key={b.id}>
                  <TableCell className="font-mono text-xs">{b.id}</TableCell>
                  <TableCell className="text-sm font-medium">{b.title}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {room ? `${room.name}` : `${b.roomId} (ถูกลบแล้ว)`}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">{formatDateTH(b.date, false)}</TableCell>
                  <TableCell className="text-sm tabular-nums">
                    {b.startTime}–{b.endTime}
                    <span className="ml-1 text-xs text-muted-foreground">
                      ({durationLabel(b.startTime, b.endTime)})
                    </span>
                  </TableCell>
                  <TableCell className="text-right tabular-nums">{b.attendees}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{b.userName}</TableCell>
                  <TableCell>
                    <span className={`rounded-full border px-2 py-0.5 text-[11px] font-medium ${meta.className}`}>
                      {meta.label}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-destructive"
                      disabled={!cancellable}
                      onClick={() => cancelBooking(b.id)}>
                      
                      ยกเลิก
                    </Button>
                  </TableCell>
                </TableRow>);

            })}
          </TableBody>
        </Table>
      </div>
    </div>);

}