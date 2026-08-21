export type RoomStatus = 'ACTIVE' | 'MAINTENANCE' | 'DISABLED';

export type RoomLayout = 'BOARDROOM' | 'U_SHAPE' | 'THEATER' | 'CLASSROOM' | 'ROUND';

export type BookingStatus = 'CONFIRMED' | 'CANCELLED' | 'COMPLETED';

export type Role = 'ADMIN' | 'USER';

export interface Room {
  id: string;
  name: string;
  building: string;
  floor: number;
  capacity: number;
  monitors: number;
  microphones: number;
  tvs: number;
  cameras: number;
  powerOutlets: number;
  layout: RoomLayout;
  equipment: string[];
  status: RoomStatus;
  statusNote?: string;
  image: string;
  layoutImage: string;
}

export interface Booking {
  id: string;
  roomId: string;
  userId: string;
  userName: string;
  title: string;
  /** ISO date, e.g. 2026-08-20 */
  date: string;
  /** HH:mm */
  startTime: string;
  /** HH:mm */
  endTime: string;
  attendees: number;
  note?: string;
  status: BookingStatus;
  createdAt: string;
}

export interface RoomFilters {
  query: string;
  building: string;
  floor: string;
  minCapacity: string;
  equipment: string[];
  onlyAvailable: boolean;
}