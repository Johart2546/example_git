import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext.jsx';
import Badge from '../components/Badge.jsx';

const STATUS_FILTERS = [
  { value: 'all', label: 'ทั้งหมด' },
  { value: 'confirmed', label: 'ยืนยันแล้ว' },
  { value: 'pending', label: 'รออนุมัติ' },
  { value: 'cancelled', label: 'ยกเลิกแล้ว' },
  { value: 'completed', label: 'เสร็จสิ้น' },
];

export default function AdminBookingsPage() {
  const { bookings } = useApp();

  const [query, setQuery] = useState('');
  const [status, setStatus] = useState('all');

  const total = bookings.length;
  const confirmedCount = bookings.filter((b) => b.status === 'confirmed').length;
  const pendingCount = bookings.filter((b) => b.status === 'pending').length;
  const cancelledCount = bookings.filter((b) => b.status === 'cancelled').length;

  const filteredBookings = useMemo(() => {
    const q = query.trim().toLowerCase();
    return bookings.filter((booking) => {
      if (status !== 'all' && booking.status !== status) return false;
      if (!q) return true;
      return (
        booking.user.toLowerCase().includes(q) ||
        booking.roomName.toLowerCase().includes(q) ||
        booking.roomId.toLowerCase().includes(q) ||
        booking.date.toLowerCase().includes(q)
      );
    });
  }, [bookings, query, status]);

  const stats = [
    { label: 'การจองทั้งหมด', value: total },
    { label: 'ยืนยันแล้ว', value: confirmedCount },
    { label: 'รออนุมัติ', value: pendingCount },
    { label: 'ยกเลิก', value: cancelledCount },
  ];

  return (
    <div className="page">
      <div className="stats-row">
        {stats.map((stat) => (
          <div key={stat.label} className="stat-card">
            <span className="stat-card__value">{stat.value}</span>
            <span className="stat-card__label">{stat.label}</span>
          </div>
        ))}
      </div>

      <div className="panel">
        <div className="toolbar">
          <div className="search-input search-input--grow">
            <input
              type="search"
              placeholder="ค้นหาผู้จอง ห้อง หรือวันที่"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              aria-label="ค้นหาการจอง"
            />
          </div>

          <div className="field field--inline">
            <label className="field__label" htmlFor="admin-booking-status">
              สถานะ
            </label>
            <select
              id="admin-booking-status"
              className="input"
              value={status}
              onChange={(event) => setStatus(event.target.value)}
            >
              {STATUS_FILTERS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {filteredBookings.length === 0 ? (
          <div className="table-empty">ไม่พบรายการจองที่ค้นหา</div>
        ) : (
          <div className="table-wrap">
            <table className="table">
              <thead>
                <tr>
                  <th>ผู้จอง</th>
                  <th>ห้อง</th>
                  <th>วันที่</th>
                  <th>เวลา</th>
                  <th>สถานะ</th>
                  <th>การจัดการ</th>
                </tr>
              </thead>
              <tbody>
                {filteredBookings.map((booking) => (
                  <tr key={booking.id}>
                    <td>{booking.user}</td>
                    <td className="table__room">{booking.roomName}</td>
                    <td>{booking.date}</td>
                    <td>
                      {booking.start} – {booking.end}
                    </td>
                    <td>
                      <Badge status={booking.status} />
                    </td>
                    <td>
                      <Link className="btn btn--sm" to={`/room/${booking.roomId}`}>
                        ดูรายละเอียด
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
