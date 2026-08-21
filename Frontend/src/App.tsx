import React from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { BookingProvider } from './contexts/BookingContext';
import { AppShell } from './components/layout/AppShell';
import { RoomsPage } from './pages/RoomsPage';
import { RoomDetailPage } from './pages/RoomDetailPage';
import { MyBookingsPage } from './pages/MyBookingsPage';
import { AdminRoomsPage } from './pages/admin/AdminRoomsPage';
import { AdminBookingsPage } from './pages/admin/AdminBookingsPage';
import { Toaster } from './components/ui/Sonner';

export function App() {
  return (
    <BookingProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<AppShell />}>
            <Route path="/" element={<Navigate to="/rooms" replace />} />
            <Route path="/rooms" element={<RoomsPage />} />
            <Route path="/rooms/:roomId" element={<RoomDetailPage />} />
            <Route path="/my-bookings" element={<MyBookingsPage />} />
            <Route path="/admin/rooms" element={<AdminRoomsPage />} />
            <Route path="/admin/bookings" element={<AdminBookingsPage />} />
            <Route path="*" element={<Navigate to="/rooms" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
      <Toaster position="top-right" richColors closeButton />
    </BookingProvider>);

}