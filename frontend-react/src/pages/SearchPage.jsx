import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext.jsx';
import RoomCard from '../components/RoomCard.jsx';
import TagFilter from '../components/TagFilter.jsx';

function SearchIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.35-4.35" />
    </svg>
  );
}

export default function SearchPage() {
  const { rooms, allTags } = useApp();
  const navigate = useNavigate();

  const [query, setQuery] = useState('');
  const [selectedTags, setSelectedTags] = useState([]);
  const [building, setBuilding] = useState('all');
  const [floor, setFloor] = useState('all');
  const [status, setStatus] = useState('all');

  const toggleTag = (tag) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const filteredRooms = useMemo(() => {
    const q = query.trim().toLowerCase();

    return rooms.filter((room) => {
      if (building !== 'all' && room.building !== building) return false;
      if (floor !== 'all' && room.floor !== floor) return false;
      if (status !== 'all' && room.status !== status) return false;

      const tags = room.equipment || [];

      if (q) {
        const matchesText =
          room.name.toLowerCase().includes(q) ||
          room.building.toLowerCase().includes(q) ||
          room.floor.toLowerCase().includes(q);
        const matchesTag = tags.some((tag) => tag.toLowerCase().includes(q));
        if (!matchesText && !matchesTag) return false;
      }

      if (selectedTags.length > 0) {
        const hasEveryTag = selectedTags.every((tag) =>
          tags.some((roomTag) => roomTag.toLowerCase() === tag.toLowerCase())
        );
        if (!hasEveryTag) return false;
      }

      return true;
    });
  }, [rooms, query, building, floor, status, selectedTags]);

  return (
    <div className="page">
      <div className="search-bar">
        <div className="search-input">
          <span className="search-input__icon" aria-hidden="true">
            <SearchIcon />
          </span>
          <input
            type="search"
            placeholder="ค้นหาชื่อห้อง, อาคาร หรือ tag (เช่น Projector)"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            aria-label="ค้นหาห้องประชุม"
          />
        </div>
      </div>

      <p className="search-hint">ค้นหาชื่อห้อง, อาคาร หรือ tag (เช่น Projector)</p>

      <section className="filter-panel" aria-label="ตัวกรอง">
        <div className="filter-panel__row">
          <div className="field">
            <label className="field__label" htmlFor="filter-building">
              อาคาร
            </label>
            <select
              id="filter-building"
              className="input"
              value={building}
              onChange={(event) => setBuilding(event.target.value)}
            >
              <option value="all">ทั้งหมด</option>
              <option value="อาคาร A">อาคาร A</option>
              <option value="อาคาร B">อาคาร B</option>
            </select>
          </div>

          <div className="field">
            <label className="field__label" htmlFor="filter-floor">
              ชั้น
            </label>
            <select
              id="filter-floor"
              className="input"
              value={floor}
              onChange={(event) => setFloor(event.target.value)}
            >
              <option value="all">ทุกชั้น</option>
              <option value="ชั้น 1">ชั้น 1</option>
              <option value="ชั้น 2">ชั้น 2</option>
              <option value="ชั้น 3">ชั้น 3</option>
            </select>
          </div>

          <div className="field">
            <label className="field__label" htmlFor="filter-status">
              สถานะ
            </label>
            <select
              id="filter-status"
              className="input"
              value={status}
              onChange={(event) => setStatus(event.target.value)}
            >
              <option value="all">ทั้งหมด</option>
              <option value="active">พร้อมใช้งาน</option>
              <option value="maintenance">ซ่อมบำรุง</option>
              <option value="disabled">ปิดใช้งาน</option>
            </select>
          </div>
        </div>

        <div className="filter-panel__row">
          <span className="filter-panel__label">อุปกรณ์</span>
          <TagFilter tags={allTags} selected={selectedTags} onToggle={toggleTag} />
        </div>
      </section>

      <div className="result-count">
        พบห้องประชุม <strong>{filteredRooms.length}</strong> ห้อง
      </div>

      {filteredRooms.length === 0 ? (
        <div className="empty-state">
          <p className="empty-state__title">ไม่พบห้องประชุมที่ค้นหา</p>
          <p className="empty-state__hint">ลองเปลี่ยนคำค้น หรือปรับตัวกรองใหม่</p>
        </div>
      ) : (
        <div className="room-grid">
          {filteredRooms.map((room) => (
            <RoomCard
              key={room.id}
              room={room}
              onOpen={(currentRoom) => navigate(`/room/${currentRoom.id}`)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
