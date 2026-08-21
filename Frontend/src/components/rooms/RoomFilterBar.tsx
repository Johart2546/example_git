import React from 'react';
import { Search, X } from 'lucide-react';
import type { RoomFilters } from '../../types';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { Label } from '../ui/Label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/Select';
import { BUILDINGS, EQUIPMENT_OPTIONS } from '../../data/rooms';

interface Props {
  filters: RoomFilters;
  onChange: (filters: RoomFilters) => void;
  resultCount: number;
}

export const EMPTY_FILTERS: RoomFilters = {
  query: '',
  building: 'ALL',
  floor: 'ALL',
  minCapacity: 'ALL',
  equipment: [],
  onlyAvailable: false
};

export function RoomFilterBar({ filters, onChange, resultCount }: Props) {
  const set = <K extends keyof RoomFilters,>(key: K, value: RoomFilters[K]) =>
  onChange({ ...filters, [key]: value });

  const toggleEquipment = (item: string) =>
  set(
    'equipment',
    filters.equipment.includes(item) ?
    filters.equipment.filter((e) => e !== item) :
    [...filters.equipment, item]
  );

  const isDirty = JSON.stringify(filters) !== JSON.stringify(EMPTY_FILTERS);

  return (
    <section aria-label="ตัวกรองห้องประชุม" className="rounded-xl border border-border bg-card p-4">
      <div className="grid gap-3 lg:grid-cols-[minmax(0,1.6fr)_repeat(3,minmax(0,1fr))]">
        <div className="space-y-1.5">
          <Label htmlFor="room-search">ค้นหา</Label>
          <div className="relative">
            <Search
              className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
              aria-hidden="true" />
            
            <Input
              id="room-search"
              value={filters.query}
              placeholder="ชื่อห้อง หรือ รหัสห้อง"
              className="pl-9"
              onChange={(e) => set('query', e.target.value)} />
            
          </div>
        </div>

        <div className="space-y-1.5">
          <Label>อาคาร</Label>
          <Select value={filters.building} onValueChange={(v) => set('building', v)}>
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">ทุกอาคาร</SelectItem>
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
          <Select value={filters.floor} onValueChange={(v) => set('floor', v)}>
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">ทุกชั้น</SelectItem>
              <SelectItem value="1">ชั้น 1</SelectItem>
              <SelectItem value="2">ชั้น 2</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1.5">
          <Label>จำนวนที่นั่งขั้นต่ำ</Label>
          <Select value={filters.minCapacity} onValueChange={(v) => set('minCapacity', v)}>
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">ไม่ระบุ</SelectItem>
              <SelectItem value="4">4 คนขึ้นไป</SelectItem>
              <SelectItem value="8">8 คนขึ้นไป</SelectItem>
              <SelectItem value="12">12 คนขึ้นไป</SelectItem>
              <SelectItem value="20">20 คนขึ้นไป</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <span className="text-sm text-muted-foreground">อุปกรณ์:</span>
        {EQUIPMENT_OPTIONS.map((item) => {
          const active = filters.equipment.includes(item);
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

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-border pt-3">
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={filters.onlyAvailable}
            onChange={(e) => set('onlyAvailable', e.target.checked)}
            className="size-4 rounded border-border accent-[color:var(--primary)]" />
          
          แสดงเฉพาะห้องที่เปิดให้จอง
        </label>
        <div className="flex items-center gap-3">
          <span className="text-sm text-muted-foreground">พบ {resultCount} ห้อง</span>
          {isDirty &&
          <Button variant="ghost" size="sm" onClick={() => onChange(EMPTY_FILTERS)}>
              <X className="size-3.5" aria-hidden="true" />
              ล้างตัวกรอง
            </Button>
          }
        </div>
      </div>
    </section>);

}