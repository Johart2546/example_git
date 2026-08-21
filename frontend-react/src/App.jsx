import { BrowserRouter, Routes, Route, Outlet, useLocation } from 'react-router-dom';
import { AppProvider } from './context/AppContext.jsx';
import Sidebar from './components/Sidebar.jsx';
import Topbar from './components/Topbar.jsx';
import SearchPage from './pages/SearchPage.jsx';
import RoomDetailPage from './pages/RoomDetailPage.jsx';
import MyBookingsPage from './pages/MyBookingsPage.jsx';
import AdminRoomsPage from './pages/AdminRoomsPage.jsx';
import AdminBookingsPage from './pages/AdminBookingsPage.jsx';

function getPageTitle(pathname) {
  if (pathname === '/') return 'ค้นหาห้องประชุม';
  if (pathname === '/my-bookings') return 'การจองของฉัน';
  if (pathname === '/admin/rooms') return 'จัดการห้องประชุม';
  if (pathname === '/admin/bookings') return 'รายการจองทั้งหมด';
  if (pathname.startsWith('/room/')) return 'รายละเอียดห้องประชุม';
  return 'จองห้องประชุม';
}

function AppLayout() {
  const location = useLocation();
  const title = getPageTitle(location.pathname);

  return (
    <div className="app-shell">
      <Sidebar />
      <div className="app-main">
        <Topbar title={title} />
        <main className="app-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<AppLayout />}>
            <Route path="/" element={<SearchPage />} />
            <Route path="/room/:id" element={<RoomDetailPage />} />
            <Route path="/my-bookings" element={<MyBookingsPage />} />
            <Route path="/admin/rooms" element={<AdminRoomsPage />} />
            <Route path="/admin/bookings" element={<AdminBookingsPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AppProvider>
  );
}
