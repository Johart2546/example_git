import { createContext, useContext, useState } from 'react';
import { ROOMS, INITIAL_BOOKINGS, ALL_TAGS } from '../data.js';

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [rooms, setRooms] = useState(ROOMS);
  const [bookings, setBookings] = useState(INITIAL_BOOKINGS);

  const addRoom = (room) => {
    setRooms((prev) => [room, ...prev]);
  };

  const updateRoom = (id, patch) => {
    setRooms((prev) => prev.map((room) => (room.id === id ? { ...room, ...patch } : room)));
  };

  const deleteRoom = (id) => {
    setRooms((prev) => prev.filter((room) => room.id !== id));
  };

  const addBooking = (booking) => {
    setBookings((prev) => [booking, ...prev]);
  };

  const cancelBooking = (id) => {
    setBookings((prev) =>
      prev.map((booking) => (booking.id === id ? { ...booking, status: 'cancelled' } : booking))
    );
  };

  const value = {
    rooms,
    setRooms,
    bookings,
    setBookings,
    allTags: ALL_TAGS,
    addRoom,
    updateRoom,
    deleteRoom,
    addBooking,
    cancelBooking,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
