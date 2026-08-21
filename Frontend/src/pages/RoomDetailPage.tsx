import React, { useMemo, useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import {
  ArrowLeft,
  Users,
  MapPin,
  Monitor,
  Mic,
  Tv,
  Plug,
  Camera,
  LayoutPanelTop,
  AlertTriangle } from
'lucide-react';
import { useBooking } from '../contexts/BookingContext';
import { StatusBadge } from '../components/rooms/StatusBadge';
import { AvailabilityTimeline } from '../components/booking/AvailabilityTimeline';
import { DateStrip } from '../components/booking/DateStrip';
import { BookingDialog } from '../components/booking/BookingDialog';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { bookingsForRoomOnDate, isRoomBookable, LAYOUT_LABEL } from '../utils/room';
import { durationLabel, formatDateTH, toMinutes, toTime, todayISO } from '../utils/time';

export function RoomDetailPage() {
  const { roomId = '' } = useParams();
  const [searchParams] = useSearchParams();
  const { rooms, bookings } = useBooking();
  const navigate = useNavigate();
  const [date, setDate] = useState(searchParams.get('date') ?? todayISO());
  const [selection, setSelection] = useState<{start: string;end: string;} | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const room = rooms.find((r) => r.id === roomId);
  const dayBookings = useMemo(
    () => room ? bookingsForRoomOnDate(bookings, room.id, date) : [],
    [bookings, room, date]
  );

  if (!room) {
    return (
      <div className="flex flex-col items-center gap-3 py-24 text-center">
        <p className="text-lg font-medium">ไม่พบห้องประชุมนี้</p>
        <Button variant="outline" onClick={() => navigate('/rooms')}>
          กลับไปหน้าค้นหาห้อง
        </Button>
      </div>);

  }

  const bookable = isRoomBookable(room);

  function handleSlotClick(slot: string) {
    setSelection((prev) => {
      if (!prev || toMinutes(slot) < toMinutes(prev.start) || prev.end !== toTime(toMinutes(prev.start) + 30)) {
        return { start: slot, end: toTime(toMinutes(slot) + 30) };
      }
      if (toMinutes(slot) < toMinutes(prev.end)) return { start: slot, end: toTime(toMinutes(slot) + 30) };
      return { start: prev.start, end: toTime(toMinutes(slot) + 30) };
    });
  }

  const specs = [
  { icon: Users, label: 'จำนวนที่นั่ง', value: room.capacity },
  { icon: Monitor, label: 'จำนวนจอ', value: room.monitors },
  { icon: Tv, label: 'จำนวนทีวี', value: room.tvs },
  { icon: Mic, label: 'จำนวนไมโครโฟน', value: room.microphones },
  { icon: Camera, label: 'จำนวนกล้อง', value: room.cameras },
  { icon: Plug, label: 'จำนวนปลั๊ก', value: room.powerOutlets }];


  return (
    <div className="space-y-6">
      <Button variant="ghost" size="sm" className="-ml-2 w-fit" onClick={() => navigate('/rooms')}>
        <ArrowLeft className="size-4" aria-hidden="true" />
        กลับไปหน้าค้นหาห้อง
      </Button>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]">
        <div className="space-y-6">
          <div className="overflow-hidden rounded-xl border border-border bg-card">
            <img
              src={room.image}
              alt={`ภาพห้องประชุม ${room.name}`}
              className="aspect-[16/7] w-full object-cover" />
            
            <div className="flex flex-wrap items-start justify-between gap-4 p-5">
              <div className="space-y-1">
                <h1 className="text-2xl font-semibold tracking-tight">{room.name}</h1>
                <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
                  <MapPin className="size-4" aria-hidden="true" />
                  {room.building} · ชั้น {room.floor} · รหัสห้อง {room.id}
                </p>
              </div>
              <StatusBadge status={room.status} />
            </div>

            {!bookable &&
            <div
              role="alert"
              className="mx-5 mb-5 flex gap-2 rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">
              
                <AlertTriangle className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
                <span>
                  ห้องนี้อยู่ในสถานะ {room.status} จึงไม่สามารถจองได้
                  {room.statusNote ? ` — ${room.statusNote}` : ''}
                </span>
              </div>
            }
          </div>

          <section aria-label="ตารางการใช้งานห้อง" className="space-y-4 rounded-xl border border-border bg-card p-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="text-base font-semibold">ตารางการใช้งาน</h2>
                <p className="text-sm text-muted-foreground">{formatDateTH(date)}</p>
              </div>
              {selection && bookable &&
              <p className="text-sm">
                  เลือกไว้{' '}
                  <span className="font-medium">
                    {selection.start}–{selection.end}
                  </span>{' '}
                  ({durationLabel(selection.start, selection.end)})
                </p>
              }
            </div>

            <DateStrip value={date} onChange={(d) => {setDate(d);setSelection(null);}} />

            <AvailabilityTimeline
              bookings={dayBookings}
              selection={selection}
              disabled={!bookable}
              onSlotClick={handleSlotClick} />
            

            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border pt-4">
              <p className="text-sm text-muted-foreground">
                {dayBookings.length === 0 ?
                'ยังไม่มีการจองในวันนี้' :
                `มีการจองแล้ว ${dayBookings.length} รายการ`}
              </p>
              <Button
                disabled={!bookable || !selection}
                onClick={() => setDialogOpen(true)}>
                
                {bookable ? 'จองห้องประชุม' : 'ไม่เปิดให้จอง'}
              </Button>
            </div>
          </section>

          {dayBookings.length > 0 &&
          <section aria-label="รายการจองของวันนี้" className="space-y-2 rounded-xl border border-border bg-card p-5">
              <h2 className="text-base font-semibold">รายการจองในวันที่เลือก</h2>
              <ul className="divide-y divide-border">
                {dayBookings.map((b) =>
              <li key={b.id} className="flex items-center justify-between gap-4 py-3">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium">{b.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {b.userName} · {b.attendees} คน
                      </p>
                    </div>
                    <span className="shrink-0 text-sm tabular-nums text-muted-foreground">
                      {b.startTime}–{b.endTime}
                    </span>
                  </li>
              )}
              </ul>
            </section>
          }
        </div>

        <aside className="space-y-6">
          <section className="space-y-4 rounded-xl border border-border bg-card p-5">
            <h2 className="text-base font-semibold">ข้อมูลห้อง</h2>
            <dl className="grid grid-cols-2 gap-3">
              {specs.map(({ icon: Icon, label, value }) =>
              <div key={label} className="rounded-lg border border-border p-3">
                  <dt className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Icon className="size-3.5" aria-hidden="true" />
                    {label}
                  </dt>
                  <dd className="mt-1 text-lg font-semibold tabular-nums">{value}</dd>
                </div>
              )}
            </dl>
            <div className="flex items-center gap-2 text-sm">
              <LayoutPanelTop className="size-4 text-muted-foreground" aria-hidden="true" />
              รูปแบบการจัดห้อง: <span className="font-medium">{LAYOUT_LABEL[room.layout]}</span>
            </div>
          </section>

          <section className="space-y-3 rounded-xl border border-border bg-card p-5">
            <h2 className="text-base font-semibold">Equipment</h2>
            <div className="flex flex-wrap gap-1.5">
              {room.equipment.map((item) =>
              <Badge key={item} variant="secondary">
                  {item}
                </Badge>
              )}
            </div>
          </section>

          <section className="space-y-3 rounded-xl border border-border bg-card p-5">
            <h2 className="text-base font-semibold">Layout ของห้อง</h2>
            <img
              src={room.layoutImage}
              alt={`ผังห้องประชุม ${room.name}`}
              className="w-full rounded-lg border border-border bg-white object-contain" />
            
            <p className="text-xs text-muted-foreground">
              ผังนี้อัปโหลดโดยผู้ดูแลระบบ เพื่อให้ผู้จองเห็นการจัดวางที่นั่งก่อนตัดสินใจ
            </p>
          </section>
        </aside>
      </div>

      {selection &&
      <BookingDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        room={room}
        date={date}
        start={selection.start}
        end={selection.end} />

      }
    </div>);

}