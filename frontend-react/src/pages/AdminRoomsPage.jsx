import { useEffect, useMemo, useState } from 'react';
import { useApp } from '../context/AppContext.jsx';
import Badge from '../components/Badge.jsx';
import Modal from '../components/Modal.jsx';
import TagFilter from '../components/TagFilter.jsx';

const LAYOUT_OPTIONS = ['Boardroom', 'U-Shape', 'Classroom', 'Theater'];

const EMPTY_FORM = {
  name: '',
  building: 'อาคาร A',
  floor: 'ชั้น 1',
  capacity: 8,
  screens: 1,
  microphones: 1,
  tv: 1,
  plugs: 4,
  layout: 'Boardroom',
  equipment: [],
  status: 'active',
};

function generateRoomId(rooms) {
  const used = new Set(rooms.map((room) => room.id));
  const prefixes = ['C1', 'C2', 'D1'];
  for (const prefix of prefixes) {
    for (let i = 1; i <= 99; i += 1) {
      const id = `${prefix}0${i}`;
      if (!used.has(id)) return id;
    }
  }
  return `C1${rooms.length + 1}`;
}

function RoomFormModal({ open, onClose, room, onSubmit }) {
  const { allTags } = useApp();
  const [form, setForm] = useState(EMPTY_FORM);

  useEffect(() => {
    if (open) {
      setForm(
        room
          ? {
              name: room.name,
              building: room.building,
              floor: room.floor,
              capacity: room.capacity,
              screens: room.screens,
              microphones: room.microphones,
              tv: room.tv,
              plugs: room.plugs,
              layout: room.layout,
              equipment: [...room.equipment],
              status: room.status,
            }
          : EMPTY_FORM
      );
    }
  }, [open, room]);

  const toggleTag = (tag) => {
    setForm((prev) => ({
      ...prev,
      equipment: prev.equipment.includes(tag)
        ? prev.equipment.filter((item) => item !== tag)
        : [...prev.equipment, tag],
    }));
  };

  const setField = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    onSubmit(form);
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={room ? 'แก้ไขห้องประชุม' : 'เพิ่มห้องประชุม'}
      footer={
        <>
          <button type="button" className="btn" onClick={onClose}>
            ยกเลิก
          </button>
          <button type="submit" form="room-form" className="btn btn--primary">
            {room ? 'บันทึกการแก้ไข' : 'เพิ่มห้อง'}
          </button>
        </>
      }
    >
      <form id="room-form" className="booking-form" onSubmit={handleSubmit}>
        <div className="field">
          <label className="field__label" htmlFor="room-name">
            ชื่อห้อง
          </label>
          <input
            id="room-name"
            className="input"
            type="text"
            required
            value={form.name}
            onChange={(event) => setField('name', event.target.value)}
            placeholder="เช่น ห้องประชุม C101"
          />
        </div>

        <div className="form-grid-2">
          <div className="field">
            <label className="field__label" htmlFor="room-building">
              อาคาร
            </label>
            <select
              id="room-building"
              className="input"
              value={form.building}
              onChange={(event) => setField('building', event.target.value)}
            >
              <option value="อาคาร A">อาคาร A</option>
              <option value="อาคาร B">อาคาร B</option>
            </select>
          </div>

          <div className="field">
            <label className="field__label" htmlFor="room-floor">
              ชั้น
            </label>
            <select
              id="room-floor"
              className="input"
              value={form.floor}
              onChange={(event) => setField('floor', event.target.value)}
            >
              <option value="ชั้น 1">ชั้น 1</option>
              <option value="ชั้น 2">ชั้น 2</option>
              <option value="ชั้น 3">ชั้น 3</option>
            </select>
          </div>
        </div>

        <div className="form-grid-4">
          <div className="field">
            <label className="field__label" htmlFor="room-capacity">
              ความจุ
            </label>
            <input
              id="room-capacity"
              className="input"
              type="number"
              min="1"
              required
              value={form.capacity}
              onChange={(event) => setField('capacity', event.target.value)}
            />
          </div>

          <div className="field">
            <label className="field__label" htmlFor="room-screens">
              จำนวนจอ
            </label>
            <input
              id="room-screens"
              className="input"
              type="number"
              min="0"
              value={form.screens}
              onChange={(event) => setField('screens', event.target.value)}
            />
          </div>

          <div className="field">
            <label className="field__label" htmlFor="room-mics">
              ไมโครโฟน
            </label>
            <input
              id="room-mics"
              className="input"
              type="number"
              min="0"
              value={form.microphones}
              onChange={(event) => setField('microphones', event.target.value)}
            />
          </div>

          <div className="field">
            <label className="field__label" htmlFor="room-tv">
              TV
            </label>
            <input
              id="room-tv"
              className="input"
              type="number"
              min="0"
              value={form.tv}
              onChange={(event) => setField('tv', event.target.value)}
            />
          </div>
        </div>

        <div className="form-grid-2">
          <div className="field">
            <label className="field__label" htmlFor="room-plugs">
              ปลั๊กไฟ
            </label>
            <input
              id="room-plugs"
              className="input"
              type="number"
              min="0"
              value={form.plugs}
              onChange={(event) => setField('plugs', event.target.value)}
            />
          </div>

          <div className="field">
            <label className="field__label" htmlFor="room-layout">
              Layout
            </label>
            <select
              id="room-layout"
              className="input"
              value={form.layout}
              onChange={(event) => setField('layout', event.target.value)}
            >
              {LAYOUT_OPTIONS.map((layout) => (
                <option key={layout} value={layout}>
                  {layout}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="field">
          <span className="field__label">อุปกรณ์</span>
          <TagFilter tags={allTags} selected={form.equipment} onToggle={toggleTag} />
        </div>

        <div className="field">
          <label className="field__label" htmlFor="room-status">
            สถานะ
          </label>
          <select
            id="room-status"
            className="input"
            value={form.status}
            onChange={(event) => setField('status', event.target.value)}
          >
            <option value="active">พร้อมใช้งาน</option>
            <option value="maintenance">ซ่อมบำรุง</option>
            <option value="disabled">ปิดใช้งาน</option>
          </select>
        </div>
      </form>
    </Modal>
  );
}

export default function AdminRoomsPage() {
  const { rooms, addRoom, updateRoom, deleteRoom } = useApp();

  const [query, setQuery] = useState('');
  const [building, setBuilding] = useState('all');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingRoom, setEditingRoom] = useState(null);

  const total = rooms.length;
  const activeCount = rooms.filter((room) => room.status === 'active').length;
  const maintenanceCount = rooms.filter((room) => room.status === 'maintenance').length;
  const disabledCount = rooms.filter((room) => room.status === 'disabled').length;

  const filteredRooms = useMemo(() => {
    const q = query.trim().toLowerCase();
    return rooms.filter((room) => {
      if (building !== 'all' && room.building !== building) return false;
      if (!q) return true;
      return (
        room.id.toLowerCase().includes(q) ||
        room.name.toLowerCase().includes(q) ||
        room.building.toLowerCase().includes(q) ||
        room.floor.toLowerCase().includes(q)
      );
    });
  }, [rooms, query, building]);

  const openAddModal = () => {
    setEditingRoom(null);
    setModalOpen(true);
  };

  const openEditModal = (room) => {
    setEditingRoom(room);
    setModalOpen(true);
  };

  const handleSubmit = (form) => {
    const payload = {
      name: form.name.trim(),
      building: form.building,
      floor: form.floor,
      capacity: Number(form.capacity),
      screens: Number(form.screens),
      microphones: Number(form.microphones),
      tv: Number(form.tv),
      plugs: Number(form.plugs),
      layout: form.layout,
      equipment: form.equipment,
      status: form.status,
    };

    if (editingRoom) {
      updateRoom(editingRoom.id, payload);
    } else {
      addRoom({ id: generateRoomId(rooms), ...payload });
    }
    setModalOpen(false);
    setEditingRoom(null);
  };

  const handleToggle = (room) => {
    if (room.status === 'active') {
      updateRoom(room.id, { status: 'maintenance' });
    } else {
      updateRoom(room.id, { status: 'active' });
    }
  };

  const handleDelete = (room) => {
    const confirmed = window.confirm(`ต้องการลบห้อง “${room.name}” ใช่หรือไม่?`);
    if (confirmed) {
      deleteRoom(room.id);
    }
  };

  const stats = [
    { label: 'ห้องทั้งหมด', value: total },
    { label: 'พร้อมใช้งาน', value: activeCount },
    { label: 'ซ่อมบำรุง', value: maintenanceCount },
    { label: 'ปิดใช้งาน', value: disabledCount },
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
              placeholder="ค้นหาชื่อห้อง รหัส หรืออาคาร"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              aria-label="ค้นหาห้องประชุม"
            />
          </div>

          <div className="field field--inline">
            <label className="field__label" htmlFor="admin-building">
              อาคาร
            </label>
            <select
              id="admin-building"
              className="input"
              value={building}
              onChange={(event) => setBuilding(event.target.value)}
            >
              <option value="all">ทั้งหมด</option>
              <option value="อาคาร A">อาคาร A</option>
              <option value="อาคาร B">อาคาร B</option>
            </select>
          </div>

          <button type="button" className="btn btn--primary" onClick={openAddModal}>
            เพิ่มห้องประชุม
          </button>
        </div>

        {filteredRooms.length === 0 ? (
          <div className="table-empty">ไม่พบห้องประชุมที่ค้นหา</div>
        ) : (
          <div className="table-wrap">
            <table className="table">
              <thead>
                <tr>
                  <th>รหัส</th>
                  <th>ชื่อห้อง</th>
                  <th>อาคาร/ชั้น</th>
                  <th>ความจุ</th>
                  <th>สถานะ</th>
                  <th>การจัดการ</th>
                </tr>
              </thead>
              <tbody>
                {filteredRooms.map((room) => (
                  <tr key={room.id}>
                    <td className="table__code">{room.id}</td>
                    <td className="table__room">{room.name}</td>
                    <td>
                      {room.building} · {room.floor}
                    </td>
                    <td>{room.capacity} คน</td>
                    <td>
                      <Badge status={room.status} />
                    </td>
                    <td>
                      <div className="table__actions">
                        <button
                          type="button"
                          className="btn btn--sm"
                          onClick={() => openEditModal(room)}
                        >
                          แก้ไข
                        </button>
                        <button
                          type="button"
                          className="btn btn--sm"
                          onClick={() => handleToggle(room)}
                        >
                          {room.status === 'active' ? 'ปิดชั่วคราว' : 'เปิดใช้งาน'}
                        </button>
                        <button
                          type="button"
                          className="btn btn--sm btn--danger"
                          onClick={() => handleDelete(room)}
                        >
                          ลบ
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <RoomFormModal
        open={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditingRoom(null);
        }}
        room={editingRoom}
        onSubmit={handleSubmit}
      />
    </div>
  );
}
