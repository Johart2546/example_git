import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, MapPin, Monitor, Mic, Tv, Plug } from 'lucide-react';
import type { Booking, Room } from '../../types';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { StatusBadge } from './StatusBadge';
import { isRoomBookable, nextFreeSlotLabel } from '../../utils/room';

interface Props {
  room: Room;
  bookings: Booking[];
  date: string;
}

export function RoomCard({ room, bookings, date }: Props) {
  const navigate = useNavigate();
  const bookable = isRoomBookable(room);
  const goToRoom = () => navigate(`/rooms/${room.id}?date=${date}`);

  return (
    <article className="group flex flex-col overflow-hidden rounded-xl border border-border bg-card text-card-foreground transition-shadow hover:shadow-md">
      <div className="relative aspect-[16/9] overflow-hidden bg-muted">
        <img
          src={room.image}
          alt={`ภาพห้องประชุม ${room.name}`}
          className={`size-full object-cover transition-transform duration-300 group-hover:scale-[1.03] ${bookable ? '' : 'grayscale'}`} />
        
        <div className="absolute left-3 top-3">
          <StatusBadge status={room.status} className="bg-background/95 backdrop-blur" />
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-3 p-4">
        <div>
          <h3 className="text-base font-semibold leading-tight">{room.name}</h3>
          <p className="mt-1 flex items-center gap-1.5 text-sm text-muted-foreground">
            <MapPin className="size-3.5" aria-hidden="true" />
            {room.building} · ชั้น {room.floor}
          </p>
        </div>

        <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1">
            <Users className="size-3.5" aria-hidden="true" /> {room.capacity} ที่นั่ง
          </span>
          <span className="inline-flex items-center gap-1">
            <Monitor className="size-3.5" aria-hidden="true" /> {room.monitors}
          </span>
          <span className="inline-flex items-center gap-1">
            <Tv className="size-3.5" aria-hidden="true" /> {room.tvs}
          </span>
          <span className="inline-flex items-center gap-1">
            <Mic className="size-3.5" aria-hidden="true" /> {room.microphones}
          </span>
          <span className="inline-flex items-center gap-1">
            <Plug className="size-3.5" aria-hidden="true" /> {room.powerOutlets}
          </span>
        </div>

        <div className="flex flex-wrap gap-1.5">
          {room.equipment.slice(0, 3).map((item) =>
          <Badge key={item} variant="secondary">
              {item}
            </Badge>
          )}
          {room.equipment.length > 3 && <Badge variant="outline">+{room.equipment.length - 3}</Badge>}
        </div>

        <p className="mt-auto text-xs text-muted-foreground">{nextFreeSlotLabel(bookings, room, date)}</p>

        {bookable ?
        <Button className="w-full" onClick={goToRoom}>
            ดูรายละเอียด &amp; จอง
          </Button> :

        <div className="space-y-2">
            <Button className="w-full" variant="secondary" disabled>
              ไม่เปิดให้จอง
            </Button>
            <Button variant="ghost" size="sm" className="w-full" onClick={goToRoom}>
              ดูรายละเอียดห้อง
            </Button>
          </div>
        }
      </div>
    </article>);

}