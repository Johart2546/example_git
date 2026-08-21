import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext.jsx';
import Badge from '../components/Badge.jsx';

const CURRENT_USER = 'ณัฐวุฒิ ส.';

function BookingsTable({ bookings, onCancel }) {
  if (bookings.length === 0) {
    return (
      <div className="table-empty">ยังไม่มีรายการจอง</div>
    );
  }

  return (
    <div className="table-wrap">
      <table className="table">
        <thead>
          <tr>
            <th>ห้อง</th>
            <th>วันที่</th>
            <th>เวลา</th>
            <th>สถานะ</th>
            <th>การจัดการ</th>
          </tr>
        </thead>
        <tbody>
          {bookings.map((booking) => (
            <tr key={booking.id}>
              <td className="table__room">{booking.roomName}</td>
              <td>{booking.date}</td>
              <td>
                {booking.start} – {booking.end}
              </td>
              <td>
                <Badge status={booking.status} />
              </td>
              <td>
                <div className="table__actions">
                  <Link className="btn btn--sm" to={`/room/${booking.roomId}`}>
                    ดูรายละเอียด
                  </Link>
                  {onCancel && (
                    <button
                      type="button"
                      className="btn btn--sm btn--danger"
                      onClick={() => onCancel(booking.id)}
                    >
                      ยกเลิก
                    </button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function MyBookingsPage() {
  const { bookings, cancelBooking } = useApp();

  const myBookings = bookings.filter((booking) => booking.user === CURRENT_USER);
  const current = myBookings.filter(
    (booking) => booking.status === 'confirmed' || booking.status === 'pending'
  );
  const history = myBookings.filter(
    (booking) => booking.status === 'completed' || booking.status === 'cancelled'
  );

  return (
    <div className="page">
      <section className="panel">
        <h2 className="section-title">การจองปัจจุบัน</h2>
        <BookingsTable bookings={current} onCancel={cancelBooking} />
      </section>

      <section className="panel">
        <h2 className="section-title">ประวัติการจอง</h2>
        <BookingsTable bookings={history} />
      </section>
    </div>
  );
}
