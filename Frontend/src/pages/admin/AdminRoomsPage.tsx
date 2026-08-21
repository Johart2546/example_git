import React, { useMemo, useState } from 'react';
import { Plus, Pencil, Trash2, Search, Building2, Wrench, CircleSlash, DoorOpen } from 'lucide-react';
import { useBooking } from '../../contexts/BookingContext';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/Select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow } from
'../../components/ui/Table';
import { StatusBadge } from '../../components/rooms/StatusBadge';
import { RoomFormDialog } from '../../components/admin/RoomFormDialog';
import { DeleteRoomDialog } from '../../components/admin/DeleteRoomDialog';
import { activeBookingsForRoom, LAYOUT_LABEL } from '../../utils/room';
import type { Room, RoomStatus } from '../../types';

export function AdminRoomsPage() {
  const { rooms, bookings, addRoom, updateRoom, deleteRoom } = useBooking();
  const [query, setQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Room | null>(null);
  const [deleting, setDeleting] = useState<Room | null>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return rooms.filter((r) => {
      if (q && !`${r.id} ${r.name} ${r.building}`.toLowerCase().includes(q)) return false;
      if (statusFilter !== 'ALL' && r.status !== statusFilter) return false;
      return true;
    });
  }, [rooms, query, statusFilter]);

  const stats = [
  { label: 'ห้องทั้งหมด', value: rooms.length, icon: Building2 },
  { label: 'พร้อมใช้งาน', value: rooms.filter((r) => r.status === 'ACTIVE').length, icon: DoorOpen },
  { label: 'ปิดซ่อมบำรุง', value: rooms.filter((r) => r.status === 'MAINTENANCE').length, icon: Wrench },
  { label: 'ปิดใช้งาน', value: rooms.filter((r) => r.status === 'DISABLED').length, icon: CircleSlash }];


  function openCreate() {
    setEditing(null);
    setFormOpen(true);
  }

  function openEdit(room: Room) {
    setEditing(room);
    setFormOpen(true);
  }

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold tracking-tight">จัดการห้องประชุม</h1>
          <p className="text-sm text-muted-foreground">
            เพิ่ม แก้ไข ปิดปรับปรุง และลบห้องประชุมในทุกอาคาร
          </p>
        </div>
        <Button onClick={openCreate}>
          <Plus className="size-4" aria-hidden="true" />
          เพิ่มห้องประชุม
        </Button>
      </header>

      <section aria-label="สรุปสถานะห้อง" className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map(({ label, value, icon: Icon }) =>
        <div key={label} className="rounded-xl border border-border bg-card p-4">
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">{label}</p>
              <Icon className="size-4 text-muted-foreground" aria-hidden="true" />
            </div>
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
            placeholder="ค้นหารหัสห้อง ชื่อห้อง หรืออาคาร"
            className="pl-9"
            aria-label="ค้นหาห้องประชุม" />
          
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[180px]" aria-label="กรองตามสถานะ">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">ทุกสถานะ</SelectItem>
            <SelectItem value="ACTIVE">ACTIVE</SelectItem>
            <SelectItem value="MAINTENANCE">MAINTENANCE</SelectItem>
            <SelectItem value="DISABLED">DISABLED</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="overflow-hidden rounded-xl border border-border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ห้อง</TableHead>
              <TableHead>ตำแหน่ง</TableHead>
              <TableHead className="text-right">ที่นั่ง</TableHead>
              <TableHead>Layout</TableHead>
              <TableHead>อุปกรณ์</TableHead>
              <TableHead>สถานะ</TableHead>
              <TableHead className="text-right">การจองค้าง</TableHead>
              <TableHead className="text-right">จัดการ</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 &&
            <TableRow>
                <TableCell colSpan={8} className="py-12 text-center text-sm text-muted-foreground">
                  ไม่พบห้องประชุมที่ตรงกับเงื่อนไข
                </TableCell>
              </TableRow>
            }
            {filtered.map((room) => {
              const active = activeBookingsForRoom(bookings, room.id).length;
              return (
                <TableRow key={room.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <img
                        src={room.image}
                        alt=""
                        className="size-9 rounded-md border border-border object-cover" />
                      
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium">{room.name}</p>
                        <p className="font-mono text-[11px] text-muted-foreground">{room.id}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {room.building} · ชั้น {room.floor}
                  </TableCell>
                  <TableCell className="text-right tabular-nums">{room.capacity}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{LAYOUT_LABEL[room.layout]}</TableCell>
                  <TableCell className="text-xs text-muted-foreground">
                    จอ {room.monitors} · ทีวี {room.tvs} · ไมค์ {room.microphones} · กล้อง {room.cameras} · ปลั๊ก{' '}
                    {room.powerOutlets}
                  </TableCell>
                  <TableCell>
                    <Select
                      value={room.status}
                      onValueChange={(v) => updateRoom({ ...room, status: v as RoomStatus })}>
                      
                      <SelectTrigger size="sm" className="w-[150px]" aria-label={`สถานะของ ${room.name}`}>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ACTIVE">ACTIVE</SelectItem>
                        <SelectItem value="MAINTENANCE">MAINTENANCE</SelectItem>
                        <SelectItem value="DISABLED">DISABLED</SelectItem>
                      </SelectContent>
                    </Select>
                    <div className="mt-1.5">
                      <StatusBadge status={room.status} />
                    </div>
                  </TableCell>
                  <TableCell className="text-right tabular-nums">
                    <span className={active > 0 ? 'font-medium text-amber-600' : 'text-muted-foreground'}>
                      {active}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        aria-label={`แก้ไข ${room.name}`}
                        onClick={() => openEdit(room)}>
                        
                        <Pencil className="size-4" aria-hidden="true" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        aria-label={`ลบ ${room.name}`}
                        className="text-destructive"
                        onClick={() => setDeleting(room)}>
                        
                        <Trash2 className="size-4" aria-hidden="true" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>);

            })}
          </TableBody>
        </Table>
      </div>

      <RoomFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        room={editing}
        onSubmit={(room) => editing ? updateRoom(room) : addRoom(room)} />
      

      <DeleteRoomDialog
        room={deleting}
        bookings={bookings}
        open={Boolean(deleting)}
        onOpenChange={(open) => !open && setDeleting(null)}
        onConfirm={(id) => {
          deleteRoom(id);
          setDeleting(null);
        }} />
      
    </div>);

}