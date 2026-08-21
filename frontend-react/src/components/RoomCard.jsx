import Badge from './Badge.jsx';

function PeopleIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M17 21v-2a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v2" />
      <circle cx="10" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}

function MonitorIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="2" y="3" width="20" height="14" rx="2" />
      <path d="M8 21h8" />
      <path d="M12 17v4" />
    </svg>
  );
}

function MicIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
      <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
      <path d="M12 19v4" />
    </svg>
  );
}

export default function RoomCard({ room, onOpen }) {
  const unavailable = room.status === 'maintenance' || room.status === 'disabled';

  return (
    <article className="room-card">
      <div className="room-card__top">
        <div>
          <h3 className="room-card__name">{room.name}</h3>
          <p className="room-card__meta">
            {room.building} · {room.floor}
          </p>
        </div>
        <Badge status={room.status} />
      </div>

      <ul className="room-card__specs">
        <li className="room-card__spec">
          <PeopleIcon />
          <span>
            ความจุ <strong>{room.capacity}</strong> คน
          </span>
        </li>
        <li className="room-card__spec">
          <MonitorIcon />
          <span>
            จอ <strong>{room.screens}</strong> จอ
          </span>
        </li>
        <li className="room-card__spec">
          <MicIcon />
          <span>
            ไมโครโฟน <strong>{room.microphones}</strong> ตัว
          </span>
        </li>
      </ul>

      <div className="room-card__equipment">
        {room.equipment.map((tag) => (
          <span key={tag} className="chip chip--static">
            {tag}
          </span>
        ))}
      </div>

      <button
        type="button"
        className="btn btn--primary btn--block"
        onClick={() => onOpen(room)}
        disabled={unavailable}
      >
        {unavailable ? 'ไม่พร้อมให้จอง' : 'ดูรายละเอียด / จอง'}
      </button>
    </article>
  );
}
