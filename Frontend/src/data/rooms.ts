import type { Room } from '../types';

const BOARDROOM = "/b0d4de93-e387-4b9b-96ae-2d453d9d3985.jpg";
const HUDDLE = "/9d5b7f6d-87f9-4c4c-8782-8bf6dbc9e65f.jpg";
const TRAINING = "/48266391-bf85-4515-856b-db488fd43cdd.jpg";
const VIDEOCONF = "/e1bea4b4-6c1d-43de-beec-c30c31537113.jpg";
export const LAYOUT_PLAN = "/3f1b3655-388a-4c6d-b3c0-915e636a872b.jpg";

export const BUILDINGS = ['Building A', 'Building B'];

export const EQUIPMENT_OPTIONS = [
'Projector',
'TV',
'Microphone',
'Whiteboard',
'HDMI',
'Video Conference',
'Speakerphone',
'Flipchart'];


export const rooms: Room[] = [
{
  id: 'A101',
  name: 'A101 — Orchid',
  building: 'Building A',
  floor: 1,
  capacity: 6,
  monitors: 1,
  microphones: 1,
  tvs: 1,
  cameras: 1,
  powerOutlets: 6,
  layout: 'ROUND',
  equipment: ['TV', 'Whiteboard', 'HDMI', 'Speakerphone'],
  status: 'ACTIVE',
  image: HUDDLE,
  layoutImage: LAYOUT_PLAN
},
{
  id: 'A102',
  name: 'A102 — Jasmine',
  building: 'Building A',
  floor: 1,
  capacity: 4,
  monitors: 1,
  microphones: 0,
  tvs: 1,
  cameras: 0,
  powerOutlets: 4,
  layout: 'ROUND',
  equipment: ['TV', 'HDMI', 'Whiteboard'],
  status: 'ACTIVE',
  image: HUDDLE,
  layoutImage: LAYOUT_PLAN
},
{
  id: 'A103',
  name: 'A103 — Lotus',
  building: 'Building A',
  floor: 1,
  capacity: 8,
  monitors: 2,
  microphones: 2,
  tvs: 1,
  cameras: 1,
  powerOutlets: 8,
  layout: 'BOARDROOM',
  equipment: ['TV', 'Microphone', 'Video Conference', 'HDMI'],
  status: 'MAINTENANCE',
  statusNote: 'จอหลักชำรุด รออะไหล่ถึง 30 ส.ค.',
  image: BOARDROOM,
  layoutImage: LAYOUT_PLAN
},
{
  id: 'A201',
  name: 'A201 — Executive',
  building: 'Building A',
  floor: 2,
  capacity: 10,
  monitors: 2,
  microphones: 2,
  tvs: 2,
  cameras: 1,
  powerOutlets: 12,
  layout: 'BOARDROOM',
  equipment: ['Projector', 'TV', 'Microphone', 'Whiteboard', 'HDMI', 'Video Conference'],
  status: 'ACTIVE',
  image: BOARDROOM,
  layoutImage: LAYOUT_PLAN
},
{
  id: 'A202',
  name: 'A202 — Summit',
  building: 'Building A',
  floor: 2,
  capacity: 14,
  monitors: 2,
  microphones: 4,
  tvs: 2,
  cameras: 2,
  powerOutlets: 16,
  layout: 'U_SHAPE',
  equipment: ['Projector', 'TV', 'Microphone', 'Video Conference', 'Flipchart'],
  status: 'ACTIVE',
  image: VIDEOCONF,
  layoutImage: LAYOUT_PLAN
},
{
  id: 'B101',
  name: 'B101 — Workshop',
  building: 'Building B',
  floor: 1,
  capacity: 24,
  monitors: 1,
  microphones: 2,
  tvs: 1,
  cameras: 1,
  powerOutlets: 24,
  layout: 'CLASSROOM',
  equipment: ['Projector', 'Microphone', 'Whiteboard', 'Flipchart', 'HDMI'],
  status: 'ACTIVE',
  image: TRAINING,
  layoutImage: LAYOUT_PLAN
},
{
  id: 'B102',
  name: 'B102 — Auditorium',
  building: 'Building B',
  floor: 1,
  capacity: 40,
  monitors: 0,
  microphones: 6,
  tvs: 0,
  cameras: 2,
  powerOutlets: 20,
  layout: 'THEATER',
  equipment: ['Projector', 'Microphone', 'Video Conference'],
  status: 'DISABLED',
  statusNote: 'ปิดปรับปรุงระบบเสียงทั้งห้อง',
  image: TRAINING,
  layoutImage: LAYOUT_PLAN
},
{
  id: 'B203',
  name: 'B203 — Focus',
  building: 'Building B',
  floor: 2,
  capacity: 6,
  monitors: 1,
  microphones: 1,
  tvs: 1,
  cameras: 1,
  powerOutlets: 6,
  layout: 'ROUND',
  equipment: ['TV', 'HDMI', 'Video Conference', 'Whiteboard'],
  status: 'ACTIVE',
  image: VIDEOCONF,
  layoutImage: LAYOUT_PLAN
}];