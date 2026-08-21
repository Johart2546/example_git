import React from 'react';
import { AlertTriangle } from 'lucide-react';
import type { Booking, Room } from '../../types';
import { activeBookingsForRoom } from '../../utils/room';
import { formatDateTH } from '../../utils/time';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle } from
'../ui/AlertDialog';

interface Props {
  room: Room | null;
  bookings: Booking[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (roomId: string) => void;
}

export function DeleteRoomDialog({ room, bookings, open, onOpenChange, onConfirm }: Props) {
  if (!room) return null;
  const blocking = activeBookingsForRoom(bookings, room.id);
  const canDelete = blocking.length === 0;

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            {canDelete ? `ลบห้อง ${room.name}?` : 'ไม่สามารถลบห้องนี้ได้'}
          </AlertDialogTitle>
          <AlertDialogDescription>
            {canDelete ?
            'ห้องนี้ไม่มีการจองค้างอยู่ในระบบ การลบจะไม่สามารถย้อนกลับได้' :
            'ระบบตรวจพบว่ายังมีการจองที่มีผลอยู่ กรุณายกเลิกหรือรอให้การจองสิ้นสุดก่อน'}
          </AlertDialogDescription>
        </AlertDialogHeader>

        {!canDelete &&
        <div className="mx-6 space-y-2 rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">
            <p className="flex items-center gap-2 font-medium">
              <AlertTriangle className="size-4" aria-hidden="true" />
              มีการจองค้างอยู่ {blocking.length} รายการ
            </p>
            <ul className="space-y-1 text-xs">
              {blocking.slice(0, 4).map((b) =>
            <li key={b.id} className="flex justify-between gap-3">
                  <span className="truncate">
                    {b.id} · {b.title}
                  </span>
                  <span className="shrink-0 tabular-nums">
                    {formatDateTH(b.date, false)} {b.startTime}–{b.endTime}
                  </span>
                </li>
            )}
              {blocking.length > 4 && <li>และอีก {blocking.length - 4} รายการ</li>}
            </ul>
          </div>
        }

        <AlertDialogFooter>
          <AlertDialogCancel>{canDelete ? 'ยกเลิก' : 'ปิด'}</AlertDialogCancel>
          {canDelete &&
          <AlertDialogAction
            className="bg-destructive text-white hover:bg-destructive/90"
            onClick={() => onConfirm(room.id)}>
            
              ยืนยันการลบห้อง
            </AlertDialogAction>
          }
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>);

}