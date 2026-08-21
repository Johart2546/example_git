import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { toast } from 'sonner';
import type { Booking, Role, Room } from '../types';
import { rooms as seedRooms } from '../data/rooms';
import { bookings as seedBookings, CURRENT_USER } from '../data/bookings';
import { activeBookingsForRoom, hasConflict, isRoomBookable } from '../utils/room';
import { todayISO } from '../utils/time';

interface CreateBookingInput {
  roomId: string;
  title: string;
  date: string;
  startTime: string;
  endTime: string;
  attendees: number;
  note?: string;
}

interface Result {
  ok: boolean;
  message: string;
}

interface BookingContextValue {
  role: Role;
  setRole: (role: Role) => void;
  currentUser: typeof CURRENT_USER;
  rooms: Room[];
  bookings: Booking[];
  getRoom: (id: string) => Room | undefined;
  addRoom: (room: Room) => Result;
  updateRoom: (room: Room) => Result;
  deleteRoom: (id: string) => Result;
  createBooking: (input: CreateBookingInput) => Result;
  cancelBooking: (id: string) => Result;
}

const BookingContext = createContext<BookingContextValue | null>(null);

export function BookingProvider({ children }: {children: React.ReactNode;}) {
  const [role, setRole] = useState<Role>('USER');
  const [rooms, setRooms] = useState<Room[]>(seedRooms);
  const [bookings, setBookings] = useState<Booking[]>(seedBookings);

  const getRoom = useCallback((id: string) => rooms.find((r) => r.id === id), [rooms]);

  const addRoom = useCallback(
    (room: Room): Result => {
      if (rooms.some((r) => r.id.toLowerCase() === room.id.toLowerCase())) {
        const message = `รหัสห้อง ${room.id} ถูกใช้งานแล้ว`;
        toast.error(message);
        return { ok: false, message };
      }
      setRooms((prev) => [room, ...prev]);
      toast.success(`สร้างห้อง ${room.name} เรียบร้อย`);
      return { ok: true, message: 'created' };
    },
    [rooms]
  );

  const updateRoom = useCallback((room: Room): Result => {
    setRooms((prev) => prev.map((r) => r.id === room.id ? room : r));
    toast.success(`บันทึกข้อมูลห้อง ${room.name} แล้ว`);
    return { ok: true, message: 'updated' };
  }, []);

  const deleteRoom = useCallback(
    (id: string): Result => {
      const active = activeBookingsForRoom(bookings, id);
      if (active.length > 0) {
        const message = `ไม่สามารถลบได้ — ห้องนี้ยังมีการจองค้างอยู่ ${active.length} รายการ`;
        toast.error(message);
        return { ok: false, message };
      }
      setRooms((prev) => prev.filter((r) => r.id !== id));
      toast.success(`ลบห้อง ${id} เรียบร้อย`);
      return { ok: true, message: 'deleted' };
    },
    [bookings]
  );

  const createBooking = useCallback(
    (input: CreateBookingInput): Result => {
      const room = rooms.find((r) => r.id === input.roomId);
      if (!room) return { ok: false, message: 'ไม่พบห้องประชุม' };

      if (!isRoomBookable(room)) {
        const message = 'ห้องนี้ปิดให้บริการชั่วคราว จึงไม่สามารถจองได้';
        toast.error(message);
        return { ok: false, message };
      }
      if (input.date < todayISO()) {
        const message = 'ไม่สามารถจองย้อนหลังได้';
        toast.error(message);
        return { ok: false, message };
      }
      if (input.startTime >= input.endTime) {
        const message = 'เวลาสิ้นสุดต้องอยู่หลังเวลาเริ่ม';
        toast.error(message);
        return { ok: false, message };
      }
      const conflict = hasConflict(bookings, input.roomId, input.date, input.startTime, input.endTime);
      if (conflict) {
        const message = `ช่วงเวลานี้ถูกจองแล้ว (${conflict.startTime}–${conflict.endTime})`;
        toast.error(message);
        return { ok: false, message };
      }
      if (input.attendees > room.capacity) {
        const message = `จำนวนผู้เข้าร่วมเกินความจุห้อง (${room.capacity} ที่นั่ง)`;
        toast.error(message);
        return { ok: false, message };
      }

      const booking: Booking = {
        id: `BK-${Math.floor(2000 + Math.random() * 7999)}`,
        userId: CURRENT_USER.id,
        userName: CURRENT_USER.name,
        status: 'CONFIRMED',
        createdAt: todayISO(),
        ...input
      };
      setBookings((prev) => [booking, ...prev]);
      toast.success(`จองห้อง ${room.name} สำเร็จ`, {
        description: `${input.date} · ${input.startTime}–${input.endTime}`
      });
      return { ok: true, message: booking.id };
    },
    [bookings, rooms]
  );

  const cancelBooking = useCallback((id: string): Result => {
    setBookings((prev) => prev.map((b) => b.id === id ? { ...b, status: 'CANCELLED' } : b));
    toast.success(`ยกเลิกการจอง ${id} แล้ว`);
    return { ok: true, message: 'cancelled' };
  }, []);

  const value = useMemo<BookingContextValue>(
    () => ({
      role,
      setRole,
      currentUser: CURRENT_USER,
      rooms,
      bookings,
      getRoom,
      addRoom,
      updateRoom,
      deleteRoom,
      createBooking,
      cancelBooking
    }),
    [role, rooms, bookings, getRoom, addRoom, updateRoom, deleteRoom, createBooking, cancelBooking]
  );

  return <BookingContext.Provider value={value}>{children}</BookingContext.Provider>;
}

export function useBooking(): BookingContextValue {
  const ctx = useContext(BookingContext);
  if (!ctx) throw new Error('useBooking must be used within a BookingProvider');
  return ctx;
}