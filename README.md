# Sistem Antrian Toko 
Aplikasi memiliki dua halaman utama:
- Tampilan customer untuk masuk ke dalam antrian
- Tampilan admin untuk memantau dan mengubah status antrian

## Teknologi yang Digunakan

- **Backend**: Node.js + Express
- **Database**: MongoDB (dengan Mongoose)
- **Frontend**: React.js
- **Real-time Update**: Socket.IO
- **PDF Generator**: `pdf-creator-node`
- **Auto-increment Nomor Urut**: Menggunakan counter collection di MongoDB

## Fitur Utama

- [x] Masuk antrian + download PDF otomatis
- [x] Real-time update antrian di semua client
- [x] Support multi-mesin antrian tanpa duplikasi nomor
- [x] Status "Telah Diproses" di halaman admin
- [x] PDF generator sesuai ketentuan
- [x] Dokumentasi lengkap dan struktur kode modular

## Cara Menjalankan Aplikasi

### 1. Clone Repository

```bash
git clone https://github.com/username/nama-repo.git 
cd nama-repo
```

#### a. Setup Backend

```bash
cd backend
npm install
cp .env.example .env
npm run dev
```
##### a.1. isi file env

```bash
PORT=3000
MONGO_URI=mongodb://host:port/namadb
```

### b. Setup Frontend

```bash
cd frontend
npm install
npm start
```

# PERTANYAAN TAMBAHAN
## 1. Monolith atau Microservice?
Aku memilih Monolithic Architecture untuk proyek ini karena:

- Ukuran proyek relatif kecil
- Deployment lebih sederhana
- Komunikasi antar modul lebih cepat karena dalam satu proses


## 2. MVC atau FE-BE dipisah?
Untuk proyek ini, saya menggunakan FE dan BE dipisah , karena:

- Memudahkan pengembangan UI modern (React)
- Lebih mudah diintegrasikan dengan teknologi lain di masa depan
- Dapat digunakan oleh mobile apps atau third-party apps

Untuk skala kecil atau internal, MVC seperti menggunakan EJS sebagai view engine bisa lebih cepat, tapi saya sengaja memisahkan agar lebih production-ready dan scalable.

## 3. Optimasi Query untuk Jutaan Data
Jika data sudah mencapai jutaan record, beberapa optimasi yang dapat dilakukan:

Gunakan indexing pada field sering diquery (misal: status, timestamp)
Gunakan pagination (skip dan limit) saat ambil data
Backup dan dump database secara berkala