# example_git

## Git wrong data here

Git คือเครื่องมือที่ช่วยจัดการ version ของ code ทำให้เราสามารถ track change (การสร้าง / แก้ / ลบ) ได้ว่า ใครทำ เมื่อไหร่ และทำอะไรไปบ้าง

## ขั้นตอนพื้นฐานของ Gitj

Flow หลักของ Git มีดังนี้

1. เปลี่ยน folder ให้เป็น Git ด้วย `git init`
2. เตรียม file (stage change) ด้วย `git add`
3. เช็คการเปลี่ยนแปลง ณ ขณะนั้นด้วย `git status`
4. บันทึก snapshot (stage change) ด้วย `git commit`
5. เช็ค history ของการ commit ด้วย `git log`

### 1. git init

เริ่มต้นใช้งาน Git ใน folder

```sh
# คำจำกัดความ: สร้าง folder .git สำหรับเก็บ history การ commit เอาไว้ในโปรเจกต์
git init
```

#### ตัวอย่างการใช้งาน

```sh
git init              # เริ่มต้นใช้ Git ใน folder ปัจจุบัน
git init my-project   # สร้าง folder ใหม่ชื่อ my-project แล้วเริ่มต้นใช้ Git
```

### 2. git add

เตรียมไฟล์เพื่อทำการ commit (stage change)

```sh
# add แบบไฟล์เดียว
git add <file>

# add แบบทั้งหมด
git add -A
```

#### ตัวอย่างการใช้งาน

```sh
git add index.html    # stage ไฟล์ index.html
git add -A            # stage ทุกไฟล์ที่แก้ไขไปพร้อมกัน
```

### 3. git status

เช็คสถานะของไฟล์ในโปรเจกต์

```sh
# คำจำกัดความ: ดูว่าไฟล์ไหนถูกแก้ไข ไฟล์ไหนยังไม่ได้ stage หรือถูก commit แล้ว
git status
```

#### ตัวอย่างการใช้งาน

```sh
git status            # เช็คว่ามีไฟล์อะไรเปลี่ยนบ้างก่อน commit
```

### 4. git commit

บันทึกการเปลี่ยนแปลง (snapshot) ไว้ในประวัติของ Git

```sh
# ทำการ snapshot พร้อม commit message
git commit -m '<commit message>'

# ทำการ add พร้อมกับทำการ snapshot message
git commit -am '<commit message>'
```

#### ตัวอย่างการใช้งาน

```sh
git commit -m "เพิ่มหน้า login"          # commit พร้อมข้อความอธิบาย
git commit -am "แก้ไขฟังก์ชัน login"     # add + commit ในคำสั่งเดียว
```

### 5. git log

ดูประวัติการ commit ทั้งหมด

```sh
# คำจำกัดความ: แสดงประวัติการ commit ทั้งหมดในโปรเจกต์
git log
```

#### ตัวอย่างการใช้งาน

```sh
git log --oneline     # ดูประวัติแบบย่อหนึ่งบรรทัดต่อ commit
```

#### ตัวอย่างผลลัพธ์ของ git log

```sh
$ git log --oneline
c3f2a1e (HEAD -> main) เพิ่มระบบชำระเงิน
b8d9e0f รวม feature/login เข้า main
a1b2c3d เพิ่มหน้า login
9e8d7c6 แก้ไขฟังก์ชัน login
a9ee56c first commit
```

ประวัติ (history) จะเรียงจาก commit ล่าสุด (บนสุด) ไปเก่า (ล่างสุด) โดย commit แรกของโปรเจกต์จะอยู่ล่างสุดเสมอ

## Branch (สาขา)

### สร้าง branch ใหม่

```sh
# คำจำกัดความ: สร้าง branch ใหม่ชื่อ <branch> และสลับไปใช้งานทันที
git checkout -b <branch>
```

#### ตัวอย่างการใช้งาน

```sh
git checkout -b feature/login    # สร้าง branch สำหรับพัฒนาฟีเจอร์ login
```

### ดูรายชื่อ branch

```sh
# คำจำกัดความ: แสดงรายการ branch ทั้งหมดที่มีในโปรเจกต์
git branch
```

#### ตัวอย่างการใช้งาน

```sh
git branch          # ดูรายการ branch ทั้งหมด
git branch -v       # ดูรายการ branch พร้อม commit ล่าสุดของแต่ละ branch
git branch -a       # ดูรวมทั้ง branch บน remote
```

### รวม branch เข้าด้วยกัน

```sh
# คำจำกัดความ: รวมโค้ดจาก <branch> เข้าสู่ branch ที่ใช้งานอยู่
git merge <branch>
```

#### ตัวอย่างการใช้งาน

```sh
git checkout main        # กลับมาที่ branch main
git merge feature/login  # นำโค้ดจาก feature/login มารวมกับ main
```

#### ตัวอย่างการใช้งานหลาย branch พร้อมกัน

```sh
# สร้าง branch สำหรับพัฒนาฟีเจอร์ 2 ตัวพร้อมกันโดยไม่รบกวนกัน
git checkout -b feature/login     # branch สำหรับฟีเจอร์ login
# ... แก้ไขโค้ด login และ commit ...
git commit -am "เพิ่มหน้า login"

git checkout main                 # สลับกลับมาที่ main เพื่อสร้าง branch ใหม่
git checkout -b feature/payment   # branch สำหรับฟีเจอร์ payment
# ... แก้ไขโค้ด payment และ commit ...
git commit -am "เพิ่มระบบชำระเงิน"

# กลับมา main เพื่อรวม branch ทั้งสองเข้าด้วยกันทีละตัว
git checkout main
git merge feature/login           # รวม login เข้า main
git merge feature/payment         # รวม payment เข้า main

# ลบ branch ที่รวมแล้วเพื่อไม่ให้เกะกะ
git branch -d feature/login
git branch -d feature/payment

git branch                        # ตรวจสอบว่าเหลือแต่ branch หลัก
```

## Remote (รีโมท)

### โคลนโปรเจกต์ (Clone)

```sh
# คำจำกัดความ: คัดลอกโปรเจกต์ทั้งหมดจาก remote (เช่น GitHub) ลงมาบนเครื่อง
git clone <url>
```

#### ตัวอย่างการใช้งาน

```sh
git clone https://github.com/user/my-project.git   # ดาวน์โหลดโปรเจกต์ลงเครื่อง
```

### ตั้งค่า remote แรก (Remote add origin)

```sh
# คำจำกัดความ: กำหนด remote ชื่อ origin ให้ชี้ไปที่ repository บน GitHub / GitLab
git remote add origin <url>
```

#### ตัวอย่างการใช้งาน

```sh
git remote add origin https://github.com/user/my-project.git   # เชื่อมกับ GitHub
git remote -v                                                 # ตรวจสอบ remote ที่ตั้งไว้
```

### อัปโหลดโค้ดขึ้น remote (Push)

```sh
# คำจำกัดความ: อัปโหลด commit ที่ทำไว้บนเครื่องไปยัง remote เช่น GitHub หรือ GitLab
git push
```

#### ตัวอย่างการใช้งาน

```sh
git push                # ส่ง commit ทั้งหมดบนเครื่องขึ้น remote
```

### ดึงโค้ดจาก remote (Pull)

```sh
# คำจำกัดความ: ดึงข้อมูลและอัปเดตโค้ดล่าสุดจาก remote มาที่เครื่อง
git pull
```

#### ตัวอย่างการใช้งาน

```sh
git pull                # ดึงการแก้ไขล่าสุดของเพื่อนร่วมทีมจาก remote
```