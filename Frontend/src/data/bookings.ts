import type { Booking } from '../types';
import { addDaysISO, todayISO } from '../utils/time';

const today = todayISO();
const tomorrow = addDaysISO(today, 1);
const nextWeek = addDaysISO(today, 4);
const lastWeek = addDaysISO(today, -6);
const yesterday = addDaysISO(today, -1);

export const CURRENT_USER = {
  id: 'u-01',
  name: 'ณัฐพงษ์ ศรีวิไล',
  email: 'nattapong.s@company.co.th',
  department: 'Product Design'
};

export const bookings: Booking[] = [
{
  id: 'BK-1042',
  roomId: 'A201',
  userId: CURRENT_USER.id,
  userName: CURRENT_USER.name,
  title: 'Sprint Planning — Q3',
  date: today,
  startTime: '10:00',
  endTime: '11:30',
  attendees: 8,
  note: 'ต้องใช้ Video Conference กับทีมเชียงใหม่',
  status: 'CONFIRMED',
  createdAt: lastWeek
},
{
  id: 'BK-1043',
  roomId: 'A201',
  userId: 'u-07',
  userName: 'สุภาพร ทองดี',
  title: 'Vendor Review',
  date: today,
  startTime: '14:00',
  endTime: '15:00',
  attendees: 5,
  status: 'CONFIRMED',
  createdAt: lastWeek
},
{
  id: 'BK-1044',
  roomId: 'A101',
  userId: 'u-12',
  userName: 'ธนกร ภักดี',
  title: 'Daily Standup',
  date: today,
  startTime: '09:00',
  endTime: '09:30',
  attendees: 6,
  status: 'CONFIRMED',
  createdAt: lastWeek
},
{
  id: 'BK-1045',
  roomId: 'B101',
  userId: 'u-05',
  userName: 'กมลชนก แสงทอง',
  title: 'New Hire Onboarding',
  date: tomorrow,
  startTime: '13:00',
  endTime: '16:00',
  attendees: 22,
  status: 'CONFIRMED',
  createdAt: lastWeek
},
{
  id: 'BK-1046',
  roomId: 'A202',
  userId: CURRENT_USER.id,
  userName: CURRENT_USER.name,
  title: 'Design Critique',
  date: tomorrow,
  startTime: '10:30',
  endTime: '12:00',
  attendees: 12,
  status: 'CONFIRMED',
  createdAt: lastWeek
},
{
  id: 'BK-1047',
  roomId: 'B203',
  userId: CURRENT_USER.id,
  userName: CURRENT_USER.name,
  title: '1:1 with Manager',
  date: nextWeek,
  startTime: '15:00',
  endTime: '15:30',
  attendees: 2,
  status: 'CONFIRMED',
  createdAt: today
},
{
  id: 'BK-1030',
  roomId: 'A102',
  userId: CURRENT_USER.id,
  userName: CURRENT_USER.name,
  title: 'Research Debrief',
  date: yesterday,
  startTime: '11:00',
  endTime: '12:00',
  attendees: 4,
  status: 'COMPLETED',
  createdAt: lastWeek
},
{
  id: 'BK-1021',
  roomId: 'A201',
  userId: CURRENT_USER.id,
  userName: CURRENT_USER.name,
  title: 'Quarterly Business Review',
  date: lastWeek,
  startTime: '09:00',
  endTime: '11:00',
  attendees: 10,
  status: 'COMPLETED',
  createdAt: addDaysISO(lastWeek, -3)
},
{
  id: 'BK-1018',
  roomId: 'B203',
  userId: CURRENT_USER.id,
  userName: CURRENT_USER.name,
  title: 'Roadmap Sync (ยกเลิก)',
  date: lastWeek,
  startTime: '14:00',
  endTime: '15:00',
  attendees: 5,
  status: 'CANCELLED',
  createdAt: addDaysISO(lastWeek, -4)
},
{
  id: 'BK-1048',
  roomId: 'B102',
  userId: 'u-09',
  userName: 'อนันต์ พูนสุข',
  title: 'All Hands',
  date: nextWeek,
  startTime: '16:00',
  endTime: '17:30',
  attendees: 38,
  status: 'CANCELLED',
  createdAt: lastWeek
}];