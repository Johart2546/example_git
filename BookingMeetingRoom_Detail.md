# Meeting Room Booking System

## 1. Project Overview

พัฒนาระบบ **จองห้องประชุมภายในบริษัท (Meeting Room Booking System)** สำหรับให้พนักงานสามารถค้นหา ตรวจสอบสถานะ และจองห้องประชุมได้ โดยมี Admin สำหรับบริหารจัดการห้องประชุมและ User สำหรับใช้งานระบบจองห้องประชุม

ระบบมี Role หลัก 2 Role:

* **Admin** — จัดการข้อมูลห้องประชุม
* **User** — ค้นหาและจองห้องประชุม

เป้าหมายคือให้ระบบสามารถจัดการห้องประชุมหลายอาคาร หลายชั้น และหลายห้อง พร้อมตรวจสอบ Availability และป้องกันการจองห้องซ้อนกัน

---

# 2. Roles & Responsibilities

## Admin

Admin มีหน้าที่บริหารจัดการทรัพยากรห้องประชุม

### Admin สามารถ

1. เพิ่มห้องประชุม
2. แก้ไขข้อมูลห้องประชุม
3. ลบห้องประชุม
4. ดูรายการห้องประชุม
5. ดูรายการ Booking
6. ตรวจสอบสถานะการใช้งานห้อง
7. ปิดห้องชั่วคราว / Maintenance

### Business Rule: Delete Room

Admin **ไม่สามารถลบห้องประชุมที่ยังมี Booking ที่มีผลอยู่ในระบบได้**

ตัวอย่าง:

```text
Admin → Delete Room
          ↓
ตรวจสอบ Booking
          ↓
มี Active Booking?
    ├── Yes → ไม่อนุญาตให้ลบ + แสดงข้อความแจ้งเตือน
    └── No  → สามารถลบได้
```

---

# 3. User

User เป็นพนักงานที่ต้องการใช้ห้องประชุม

### User สามารถ

1. ดูห้องประชุม
2. ค้นหาห้องประชุม
3. Filter ห้องประชุมตามเงื่อนไข
4. ดูรายละเอียดห้อง
5. ดู Availability
6. เลือกวันที่และเวลา
7. จองห้องประชุม
8. ดู Booking ของตัวเอง
9. ยกเลิก Booking ของตัวเอง
10. ดูประวัติการจอง

---

# 4. Room Structure

ห้องประชุมมีโครงสร้างตามสถานที่:

```text
Building
   ↓
Floor
   ↓
Room
```

ตัวอย่าง:

```text
Building A
├── Floor 1
│   ├── Room A101
│   ├── Room A102
│   └── Room A103
│
└── Floor 2
    ├── Room A201
    └── Room A202
```

---

# 5. Room Information

แต่ละห้องประชุมควรมีข้อมูล เช่น

* Room ID
* Room Name
* Building
* Floor
* Capacity / จำนวนที่นั่ง
* จำนวนจอ
* จำนวน Microphone
* จำนวน TV
* จำนวนปลั๊ก
* Layout ของห้อง
* Equipment ภายในห้อง
* Room Status

ตัวอย่าง Equipment:

```text
Room A201

Capacity: 10

Equipment:
- Projector
- TV
- Microphone x2
- Whiteboard
- HDMI
- Video Conference
```

---

# 6. Room Status

ห้องประชุมสามารถมีสถานะ เช่น

```text
ACTIVE
MAINTENANCE
DISABLED
```

ถ้าห้องอยู่ในสถานะ `MAINTENANCE` หรือ `DISABLED`

→ User ไม่สามารถจองห้องนั้นได้

---
