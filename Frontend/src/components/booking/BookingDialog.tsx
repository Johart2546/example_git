import React, { useEffect, useState } from 'react';
import { AlertTriangle, CalendarDays, Clock, Users } from 'lucide-react';
import type { Room } from '../../types';
import { useBooking } from '../../contexts/BookingContext';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Label } from '../ui/Label';
import { Textarea } from '../ui/Textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/Select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle } from
'../ui/Dialog';
import { TIME_SLOTS, durationLabel, formatDateTH, toMinutes } from '../../utils/time';
import { hasConflict } from '../../utils/room';

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  room: Room;
  date: string;
  start: string;
  end: string;
}

const END_SLOTS = [...TIME_SLOTS.slice(1), '20:00'];

export function BookingDialog({ open, onOpenChange, room, date, start, end }: Props) {
  const { bookings, createBooking, currentUser } = useBooking();
  const [title, setTitle] = useState('');
  const [attendees, setAttendees] = useState('4');
  const [note, setNote] = useState('');
  const [startTime, setStartTime] = useState(start);
  const [endTime, setEndTime] = useState(end);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (open) {
      setStartTime(start);
      setEndTime(end);
      setError(null);
    }
  }, [open, start, end]);

  const conflict = hasConflict(bookings, room.id, date, startTime, endTime);
  const overCapacity = Number(attendees) > room.capacity;
  const invalidRange = toMinutes(endTime) <= toMinutes(startTime);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) {
      setError('กรุณากรอกหัวข้อการประชุม');
      return;
    }
    const result = createBooking({
      roomId: room.id,
      title: title.trim(),
      date,
      startTime,
      endTime,
      attendees: Number(attendees) || 1,
      note: note.trim() || undefined
    });
    if (result.ok) {
      setTitle('');
      setNote('');
      onOpenChange(false);
    } else {
      setError(result.message);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[560px]">
        <DialogHeader>
          <DialogTitle>ยืนยันการจองห้องประชุม</DialogTitle>
          <DialogDescription>
            {room.name} · {room.building} ชั้น {room.floor}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 px-6 py-4">
          <div className="grid gap-3 rounded-lg border border-border bg-secondary/60 p-3 text-sm sm:grid-cols-3">
            <div className="flex items-center gap-2">
              <CalendarDays className="size-4 text-muted-foreground" aria-hidden="true" />
              {formatDateTH(date, false)}
            </div>
            <div className="flex items-center gap-2">
              <Clock className="size-4 text-muted-foreground" aria-hidden="true" />
              {startTime}–{endTime}
            </div>
            <div className="flex items-center gap-2">
              <Users className="size-4 text-muted-foreground" aria-hidden="true" />
              จุได้ {room.capacity} คน
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="booking-title">หัวข้อการประชุม</Label>
            <Input
              id="booking-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="เช่น Sprint Planning"
              required />
            
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            <div className="space-y-1.5">
              <Label>เวลาเริ่ม</Label>
              <Select value={startTime} onValueChange={setStartTime}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {TIME_SLOTS.map((t) =>
                  <SelectItem key={t} value={t}>
                      {t}
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>เวลาสิ้นสุด</Label>
              <Select value={endTime} onValueChange={setEndTime}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {END_SLOTS.map((t) =>
                  <SelectItem key={t} value={t}>
                      {t}
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="booking-attendees">ผู้เข้าร่วม</Label>
              <Input
                id="booking-attendees"
                type="number"
                min={1}
                value={attendees}
                onChange={(e) => setAttendees(e.target.value)}
                aria-invalid={overCapacity} />
              
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="booking-note">หมายเหตุ (ถ้ามี)</Label>
            <Textarea
              id="booking-note"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="อุปกรณ์เพิ่มเติม หรือรายละเอียดอื่น ๆ"
              rows={3} />
            
          </div>

          {(conflict || overCapacity || invalidRange || error) &&
          <div
            role="alert"
            className="flex gap-2 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
            
              <AlertTriangle className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
              <span>
                {invalidRange ?
              'เวลาสิ้นสุดต้องอยู่หลังเวลาเริ่ม' :
              conflict ?
              `ช่วงเวลานี้ชนกับ “${conflict.title}” (${conflict.startTime}–${conflict.endTime})` :
              overCapacity ?
              `จำนวนผู้เข้าร่วมเกินความจุห้อง (${room.capacity} ที่นั่ง)` :
              error}
              </span>
            </div>
          }

          <p className="text-xs text-muted-foreground">
            จองในนาม {currentUser.name} · {currentUser.email} · ระยะเวลา{' '}
            {invalidRange ? '—' : durationLabel(startTime, endTime)}
          </p>

          <DialogFooter className="px-0">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              ยกเลิก
            </Button>
            <Button type="submit" disabled={Boolean(conflict) || overCapacity || invalidRange}>
              ยืนยันการจอง
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>);

}