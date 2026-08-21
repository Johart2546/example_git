import { useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useApp } from '../context/AppContext.jsx';
import Badge from '../components/Badge.jsx';
import Modal from '../components/Modal.jsx';
import { formatThaiDate } from '../data.js';

const START_TIMES = ['09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00'];

const PRESET_SLOTS = [
  ['09:00', '10:00'],
  ['10:00', '11:00'],
  ['11:00', '12:00'],
  ['13:00', '14:00'],
  ['14:00', '15:00'],
  ['15:00', '16:00'],
];

function todayISO() {
  const now = new Date();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${now.getFullYear()}-${month}-${day}`;
}

export default function RoomDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { rooms, addBooking } = useApp();

  const room = rooms.find((currentRoom) => currentRoom.id === id);

  const [date, setDate] = useState(todayISO());
  const [start, setStart] = useState('10:00');
  const [end, setEnd] = useState('11:00');
  const [booker, setBooker] = useState('ณัฐวุฒิ ส.');
  const [confirmOpen, setConfirmOpen] = useState(false);

  const endOptions = useMemo(
    () => START_TIMES.filter((time) => time > start),
    [start]
  );

  if (!room) {
    return (
      <div className="page">
        <div className="empty-state">
          <p className="empty-state__title">ไม่พบห้องประชุม</p>
          <p className="empty-state__hint">ไม่พบห้องประชุมที่ขอ หรือห้องอาจถูกลบไปแล้ว</p>
          <button type="button" className="btn" onClick={() => navigate('/')}>
            กลับไปค้นหาห้อง
          </button>
        </div>
      </div>
    );
  }

  const unavailable = room.status === 'maintenance' || room.status === 'disabled';
  const timeInvalid = end <= start;

  const handleConfirm = () => {
    addBooking({
      id: `b${Date.now()}`,
      roomId: room.id,
      roomName: room.name,
      user: booker.trim() || 'ณัฐวุฒิ ส.',
      date: formatThaiDate(date),
      start,
      end,
      status: 'pending',
    });
    setConfirmOpen(false);
    navigate('/my-bookings');
  };

  const specs = [
    { label: 'รหัสห้อง', value: room.id },
    { label: 'อาคาร', value: room.building },
    { label: 'ชั้น', value: room.floor },
    { label: 'ความจุ', value: `${room.capacity} คน` },
    { label: 'จำนวนจอ', value: `${room.screens} จอ` },
    { label: 'ไมโครโฟน', value: `${room.microphones} ตัว` },
    { label: 'TV', value: `${room.tv} เครื่อง` },
    { label: 'ปลั๊กไฟ', value: `${room.plugs} จุด` },
    { label: 'Layout', value: room.layout },
  ];

  return (
    <div className="page">
      <div className="detail-grid">
        <section className="panel" aria-label="รายละเอียดห้อง">
          <div className="detail-header">
            <div>
              <h2 className="detail-title">{room.name}</h2>
              <p className="detail-meta">
                {room.building} · {room.floor}
              </p>
            </div>
            <Badge status={room.status} />
          </div>

          <dl className="spec-list">
            {specs.map((spec) => (
              <div key={spec.label} className="spec-list__item">
                <dt className="spec-list__label">{spec.label}</dt>
                <dd className="spec-list__value">{spec.value}</dd>
              </div>
            ))}
          </dl>

          <h3 className="section-heading">อุปกรณ์ภายในห้อง</h3>
          <div className="equipment-row">
            {room.equipment.map((tag) => (
              <span key={tag} className="chip chip--static">
                {tag}
              </span>
            ))}
          </div>

          <p className="availability-line">
            {unavailable
              ? 'ห้องนี้ไม่พร้อมให้จอง'
              : 'พร้อมให้จอง · ช่วงเวลาปกติ 09:00–16:00 น.'}
          </p>
        </section>

        <section className="panel" aria-label="ฟอร์มการจอง">
          <h2 className="detail-title">จองห้องประชุม</h2>

          {unavailable ? (
            <div className="booking-disabled">
              <p>ห้องนี้ไม่พร้อมให้จอง</p>
              <p className="booking-disabled__hint">
                ห้องมีสถานะ “{room.status === 'maintenance' ? 'ซ่อมบำรุง' : 'ปิดใช้งาน'}”
                ในขณะนี้ กรุณาเลือกห้องอื่น
              </p>
            </div>
          ) : (
            <form
              className="booking-form"
              onSubmit={(event) => {
                event.preventDefault();
                if (date && !timeInvalid) {
                  setConfirmOpen(true);
                }
              }}
            >
              <div className="field">
                <label className="field__label" htmlFor="booking-date">
                  วันที่
                </label>
                <input
                  id="booking-date"
                  className="input"
                  type="date"
                  required
                  value={date}
                  onChange={(event) => setDate(event.target.value)}
                />
              </div>

              <div className="field">
                <label className="field__label" htmlFor="booking-start">
                  เวลาเริ่ม
                </label>
                <select
                  id="booking-start"
                  className="input"
                  value={start}
                  onChange={(event) => {
                    const nextStart = event.target.value;
                    setStart(nextStart);
                    if (end <= nextStart) {
                      setEnd(START_TIMES[START_TIMES.indexOf(nextStart) + 1] || '');
                    }
                  }}
                >
                  {START_TIMES.map((time) => (
                    <option key={time} value={time}>
                      {time} น.
                    </option>
                  ))}
                </select>
              </div>

              <div className="field">
                <label className="field__label" htmlFor="booking-end">
                  เวลาสิ้นสุด
                </label>
                <select
                  id="booking-end"
                  className="input"
                  value={end}
                  onChange={(event) => setEnd(event.target.value)}
                >
                  {endOptions.length > 0 ? (
                    endOptions.map((time) => (
                      <option key={time} value={time}>
                        {time} น.
                      </option>
                    ))
                  ) : (
                    <option value="">เลือกเวลาสิ้นสุด</option>
                  )}
                </select>
              </div>

              <div className="field">
                <label className="field__label" htmlFor="booking-user">
                  ผู้จอง
                </label>
                <input
                  id="booking-user"
                  className="input"
                  type="text"
                  value={booker}
                  onChange={(event) => setBooker(event.target.value)}
                />
              </div>

              <div className="field">
                <span className="field__label">เลือกช่วงเวลา</span>
                <div className="slot-row">
                  {PRESET_SLOTS.map(([slotStart, slotEnd]) => {
                    const active = start === slotStart && end === slotEnd;
                    return (
                      <button
                        key={`${slotStart}-${slotEnd}`}
                        type="button"
                        className={`slot-chip${active ? ' slot-chip--active' : ''}`}
                        aria-pressed={active}
                        onClick={() => {
                          setStart(slotStart);
                          setEnd(slotEnd);
                        }}
                      >
                        {slotStart}–{slotEnd}
                      </button>
                    );
                  })}
                </div>
              </div>

              {timeInvalid && (
                <p className="form-warning">เวลาสิ้นสุดต้องอยู่หลังเวลาเริ่ม</p>
              )}

              <button type="submit" className="btn btn--primary btn--block" disabled={timeInvalid}>
                ยืนยันการจอง
              </button>
            </form>
          )}
        </section>
      </div>

      <Modal
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        title="ยืนยันการจอง"
        footer={
          <>
            <button type="button" className="btn" onClick={() => setConfirmOpen(false)}>
              ยกเลิก
            </button>
            <button type="button" className="btn btn--primary" onClick={handleConfirm}>
              ยืนยัน
            </button>
          </>
        }
      >
        <div className="summary-list">
          <div className="summary-list__item">
            <span className="summary-list__label">ห้อง</span>
            <span className="summary-list__value">{room.name}</span>
          </div>
          <div className="summary-list__item">
            <span className="summary-list__label">วันที่</span>
            <span className="summary-list__value">{formatThaiDate(date)}</span>
          </div>
          <div className="summary-list__item">
            <span className="summary-list__label">เวลา</span>
            <span className="summary-list__value">
              {start} – {end} น.
            </span>
          </div>
          <div className="summary-list__item">
            <span className="summary-list__label">ผู้จอง</span>
            <span className="summary-list__value">{booker.trim() || 'ณัฐวุฒิ ส.'}</span>
          </div>
        </div>
        <p className="modal-note">การจองจะอยู่ในสถานะ “รออนุมัติ” จนกว่าผู้ดูแลจะอนุมัติ</p>
      </Modal>
    </div>
  );
}
