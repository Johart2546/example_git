import React, { useMemo, useState } from 'react';
import { SearchX } from 'lucide-react';
import { useBooking } from '../contexts/BookingContext';
import { RoomCard } from '../components/rooms/RoomCard';
import { EMPTY_FILTERS, RoomFilterBar } from '../components/rooms/RoomFilterBar';
import { DateStrip } from '../components/booking/DateStrip';
import { Button } from '../components/ui/Button';
import { formatDateTH, todayISO } from '../utils/time';
import { isRoomBookable } from '../utils/room';
import type { RoomFilters } from '../types';

export function RoomsPage() {
  const { rooms, bookings } = useBooking();
  const [date, setDate] = useState(todayISO());
  const [filters, setFilters] = useState<RoomFilters>(EMPTY_FILTERS);

  const filtered = useMemo(() => {
    const q = filters.query.trim().toLowerCase();
    return rooms.filter((room) => {
      if (q && !`${room.id} ${room.name}`.toLowerCase().includes(q)) return false;
      if (filters.building !== 'ALL' && room.building !== filters.building) return false;
      if (filters.floor !== 'ALL' && String(room.floor) !== filters.floor) return false;
      if (filters.minCapacity !== 'ALL' && room.capacity < Number(filters.minCapacity)) return false;
      if (filters.equipment.some((e) => !room.equipment.includes(e))) return false;
      if (filters.onlyAvailable && !isRoomBookable(room)) return false;
      return true;
    });
  }, [rooms, filters]);

  const grouped = useMemo(() => {
    const map = new Map<string, typeof filtered>();
    filtered.forEach((room) => {
      const key = `${room.building} · ชั้น ${room.floor}`;
      map.set(key, [...(map.get(key) ?? []), room]);
    });
    return [...map.entries()].sort(([a], [b]) => a.localeCompare(b));
  }, [filtered]);

  return (
    <div className="space-y-6">
      <header className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight">ค้นหาห้องประชุม</h1>
        <p className="text-sm text-muted-foreground">
          เลือกวันที่ที่ต้องการใช้งาน แล้วกรองห้องตามอาคาร ชั้น จำนวนที่นั่ง และอุปกรณ์
        </p>
      </header>

      <section aria-label="เลือกวันที่" className="space-y-2">
        <p className="text-sm font-medium">{formatDateTH(date)}</p>
        <DateStrip value={date} onChange={setDate} />
      </section>

      <RoomFilterBar filters={filters} onChange={setFilters} resultCount={filtered.length} />

      {filtered.length === 0 ?
      <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed border-border bg-card py-16 text-center">
          <SearchX className="size-8 text-muted-foreground" aria-hidden="true" />
          <div>
            <p className="font-medium">ไม่พบห้องประชุมที่ตรงกับเงื่อนไข</p>
            <p className="text-sm text-muted-foreground">ลองลดเงื่อนไขอุปกรณ์ หรือเปลี่ยนอาคาร/ชั้น</p>
          </div>
          <Button variant="outline" onClick={() => setFilters(EMPTY_FILTERS)}>
            ล้างตัวกรองทั้งหมด
          </Button>
        </div> :

      grouped.map(([group, items]) =>
      <section key={group} className="space-y-3">
            <div className="flex items-center gap-3">
              <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">{group}</h2>
              <span className="h-px flex-1 bg-border" aria-hidden="true" />
              <span className="text-xs text-muted-foreground">{items.length} ห้อง</span>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
              {items.map((room) =>
          <RoomCard key={room.id} room={room} bookings={bookings} date={date} />
          )}
            </div>
          </section>
      )
      }
    </div>);

}