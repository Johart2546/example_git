import React, { useEffect, useState } from 'react';
import { ImageIcon } from 'lucide-react';
import type { Room, RoomLayout, RoomStatus } from '../../types';
import { BUILDINGS, EQUIPMENT_OPTIONS, LAYOUT_PLAN } from '../../data/rooms';
import { LAYOUT_LABEL } from '../../utils/room';
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

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  room?: Room | null;
  onSubmit: (room: Room) => {ok: boolean;message: string;};
}

const DEFAULT_IMAGE = "/9d5b7f6d-87f9-4c4c-8782-8bf6dbc9e65f.jpg";


function emptyRoom(): Room {
  return {
    id: '',
    name: '',
    building: BUILDINGS[0],
    floor: 1,
    capacity: 6,
    monitors: 1,
    microphones: 1,
    tvs: 1,
    cameras: 1,
    powerOutlets: 6,
    layout: 'BOARDROOM',
    equipment: [],
    status: 'ACTIVE',
    image: DEFAULT_IMAGE,
    layoutImage: LAYOUT_PLAN
  };
}

const NUMERIC_FIELDS: Array<{key: keyof Room;label: string;}> = [
{ key: 'capacity', label: 'จำนวนที่นั่ง' },
{ key: 'monitors', label: 'จำนวนจอ' },
{ key: 'tvs', label: 'จำนวนทีวี' },
{ key: 'microphones', label: 'จำนวนไมโครโฟน' },
{ key: 'cameras', label: 'จำนวนกล้อง' },
{ key: 'powerOutlets', label: 'จำนวนปลั๊ก' }];


export function RoomFormDialog({ open, onOpenChange, room, onSubmit }: Props) {
  const isEdit = Boolean(room);
  const [draft, setDraft] = useState<Room>(room ?? emptyRoom());
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (open) {
      setDraft(room ? { ...room } : emptyRoom());
      setError(null);
    }
  }, [open, room]);

  const set = <K extends keyof Room,>(key: K, value: Room[K]) => setDraft((d) => ({ ...d, [key]: value }));

  function toggleEquipment(item: string) {
    setDraft((d) => ({
      ...d,
      equipment: d.equipment.includes(item) ?
      d.equipment.filter((e) => e !== item) :
      [...d.equipment, item]
    }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!draft.id.trim() || !draft.name.trim()) {
      setError('กรุณากรอกรหัสห้องและชื่อห้อง');
      return;
    }
    const result = onSubmit({ ...draft, id: draft.id.trim(), name: draft.name.trim() });
    if (result.ok) onOpenChange(false);else
    setError(result.message);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[720px]">
        <DialogHeader>
          <DialogTitle>{isEdit ? 'แก้ไขข้อมูลห้องประชุม' : 'สร้างห้องประชุมใหม่'}</DialogTitle>
          <DialogDescription>
            เลือกอาคารและชั้น จากนั้นกรอกรายละเอียดห้องและอุปกรณ์ภายในห้อง
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5 px-6 py-4">
          <div className="grid gap-3 sm:grid-cols-3">
            <div className="space-y-1.5">
              <Label htmlFor="room-id">รหัสห้อง</Label>
              <Input
                id="room-id"
                value={draft.id}
                disabled={isEdit}
                placeholder="A301"
                onChange={(e) => set('id', e.target.value.toUpperCase())}
                required />
              
            </div>
            <div className="space-y-1.5 sm:col-span-2">
              <Label htmlFor="room-name">ชื่อห้อง</Label>
              <Input
                id="room-name"
                value={draft.name}
                placeholder="A301 — Innovation"
                onChange={(e) => set('name', e.target.value)}
                required />
              
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            <div className="space-y-1.5">
              <Label>อาคาร</Label>
              <Select value={draft.building} onValueChange={(v) => set('building', v)}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {BUILDINGS.map((b) =>
                  <SelectItem key={b} value={b}>
                      {b}
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>ชั้น</Label>
              <Select value={String(draft.floor)} onValueChange={(v) => set('floor', Number(v))}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {[1, 2, 3, 4].map((f) =>
                  <SelectItem key={f} value={String(f)}>
                      ชั้น {f}
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Layout ของห้อง</Label>
              <Select value={draft.layout} onValueChange={(v) => set('layout', v as RoomLayout)}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {(Object.keys(LAYOUT_LABEL) as RoomLayout[]).map((l) =>
                  <SelectItem key={l} value={l}>
                      {LAYOUT_LABEL[l]}
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>
          </div>

          <fieldset className="space-y-3">
            <legend className="text-sm font-medium">จำนวนทรัพยากรภายในห้อง</legend>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {NUMERIC_FIELDS.map(({ key, label }) =>
              <div key={String(key)} className="space-y-1.5">
                  <Label htmlFor={`room-${String(key)}`}>{label}</Label>
                  <Input
                  id={`room-${String(key)}`}
                  type="number"
                  min={0}
                  value={String(draft[key] as number)}
                  onChange={(e) => set(key, Number(e.target.value) as Room[typeof key])} />
                
                </div>
              )}
            </div>
          </fieldset>

          <div className="space-y-2">
            <Label>Equipment ภายในห้อง</Label>
            <div className="flex flex-wrap gap-2">
              {EQUIPMENT_OPTIONS.map((item) => {
                const active = draft.equipment.includes(item);
                return (
                  <button
                    key={item}
                    type="button"
                    onClick={() => toggleEquipment(item)}
                    aria-pressed={active}
                    className={[
                    'rounded-full border px-3 py-1 text-xs font-medium transition-colors',
                    active ?
                    'border-primary bg-primary text-primary-foreground' :
                    'border-border bg-background text-muted-foreground hover:bg-accent hover:text-accent-foreground'].
                    join(' ')}>
                    
                    {item}
                  </button>);

              })}
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label>สถานะห้อง</Label>
              <Select value={draft.status} onValueChange={(v) => set('status', v as RoomStatus)}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ACTIVE">ACTIVE — พร้อมใช้งาน</SelectItem>
                  <SelectItem value="MAINTENANCE">MAINTENANCE — ปิดซ่อมบำรุง</SelectItem>
                  <SelectItem value="DISABLED">DISABLED — ปิดใช้งาน</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="room-note">หมายเหตุสถานะ</Label>
              <Textarea
                id="room-note"
                rows={2}
                value={draft.statusNote ?? ''}
                placeholder="เช่น รออะไหล่จอโปรเจกเตอร์"
                onChange={(e) => set('statusNote', e.target.value)} />
              
            </div>
          </div>

          <div className="flex items-center gap-3 rounded-lg border border-dashed border-border p-3">
            <span className="flex size-10 items-center justify-center rounded-md bg-secondary">
              <ImageIcon className="size-4 text-muted-foreground" aria-hidden="true" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium">Layout ของห้อง (สำหรับผู้จอง)</p>
              <p className="truncate text-xs text-muted-foreground">{draft.layoutImage}</p>
            </div>
            <img src={draft.layoutImage} alt="" className="h-12 w-16 rounded-md border border-border object-cover" />
          </div>

          {error &&
          <p role="alert" className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
              {error}
            </p>
          }

          <DialogFooter className="px-0">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              ยกเลิก
            </Button>
            <Button type="submit">{isEdit ? 'บันทึกการแก้ไข' : 'ยืนยันการสร้างห้อง'}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>);

}