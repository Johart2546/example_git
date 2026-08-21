import React from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { CalendarCheck, LayoutGrid, Building2, ClipboardList, DoorOpen } from 'lucide-react';
import { useBooking } from '../../contexts/BookingContext';
import { Avatar, AvatarFallback } from '../ui/Avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/Select';
import type { Role } from '../../types';

const USER_NAV = [
{ to: '/rooms', label: 'ห้องประชุม', icon: LayoutGrid },
{ to: '/my-bookings', label: 'การจองของฉัน', icon: CalendarCheck }];


const ADMIN_NAV = [
{ to: '/admin/rooms', label: 'จัดการห้องประชุม', icon: Building2 },
{ to: '/admin/bookings', label: 'รายการจอง', icon: ClipboardList }];


export function AppShell() {
  const { role, setRole, currentUser } = useBooking();
  const navigate = useNavigate();
  const nav = role === 'ADMIN' ? ADMIN_NAV : USER_NAV;

  function handleRoleChange(next: string) {
    const nextRole = next as Role;
    setRole(nextRole);
    navigate(nextRole === 'ADMIN' ? '/admin/rooms' : '/rooms');
  }

  const initials = currentUser.name.trim().slice(0, 1);

  return (
    <div className="min-h-screen w-full bg-background text-foreground font-heading">
      <header className="sticky top-0 z-30 w-full border-b border-border bg-background/95 backdrop-blur">
        <div className="mx-auto flex h-16 w-full max-w-[1400px] items-center gap-6 px-6">
          <div className="flex items-center gap-2.5">
            <span className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <DoorOpen className="size-4" aria-hidden="true" />
            </span>
            <div className="leading-tight">
              <p className="text-sm font-semibold">RoomBooking</p>
              <p className="text-[11px] text-muted-foreground">ระบบจองห้องประชุมภายในองค์กร</p>
            </div>
          </div>

          <nav aria-label="เมนูหลัก" className="hidden items-center gap-1 md:flex">
            {nav.map(({ to, label, icon: Icon }) =>
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
              [
              'flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors',
              isActive ?
              'bg-secondary text-secondary-foreground font-medium' :
              'text-muted-foreground hover:bg-accent hover:text-accent-foreground'].
              join(' ')
              }>
              
                <Icon className="size-4" aria-hidden="true" />
                {label}
              </NavLink>
            )}
          </nav>

          <div className="ml-auto flex items-center gap-3">
            <Select value={role} onValueChange={handleRoleChange}>
              <SelectTrigger className="w-[132px]" aria-label="สลับบทบาทผู้ใช้งาน">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="USER">User</SelectItem>
                <SelectItem value="ADMIN">Admin</SelectItem>
              </SelectContent>
            </Select>
            <div className="hidden items-center gap-2.5 sm:flex">
              <Avatar className="size-8">
                <AvatarFallback>{initials}</AvatarFallback>
              </Avatar>
              <div className="leading-tight">
                <p className="text-xs font-medium">{currentUser.name}</p>
                <p className="text-[11px] text-muted-foreground">{currentUser.department}</p>
              </div>
            </div>
          </div>
        </div>

        <nav aria-label="เมนูหลัก (มือถือ)" className="flex items-center gap-1 border-t border-border px-4 py-2 md:hidden">
          {nav.map(({ to, label, icon: Icon }) =>
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
            [
            'flex flex-1 items-center justify-center gap-2 rounded-lg px-3 py-2 text-xs transition-colors',
            isActive ? 'bg-secondary text-secondary-foreground font-medium' : 'text-muted-foreground'].
            join(' ')
            }>
            
              <Icon className="size-4" aria-hidden="true" />
              {label}
            </NavLink>
          )}
        </nav>
      </header>

      <main className="mx-auto w-full max-w-[1400px] px-6 py-8">
        <Outlet />
      </main>
    </div>);

}