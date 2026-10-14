# Rencana Eksekusi SIARSIP KUATHAN

Berdasarkan PRD (`siarsip.md`) dan diskusi awal, berikut adalah arsitektur dan langkah-langkah implementasinya:

## 🏛️ Rangkuman Keputusan Teknis
*   **Tech Stack Utama:** Laravel 11 + Inertia.js + **React 18** + Tailwind CSS.
*   **Starter Kit:** **Laravel Breeze** (stack React) untuk mempercepat setup autentikasi dasar.
*   **Database:** **MySQL / MariaDB** (untuk environment lokal maupun produksi).
*   **Hak Akses (RBAC):** Seluruh pengguna (termasuk *Viewer*/Pegawai) wajib login. Pembagian peran (Admin vs Pegawai) dikelola menggunakan package `spatie/laravel-permission`.
*   **Integrasi Google Drive:** Menggunakan **Service Account** (Kredensial sudah terpasang).

---

## 🛠️ Langkah Pengerjaan (Fase 1: Setup & Integrasi Drive) - ✅ SELESAI

### Langkah 1: Inisialisasi Proyek Laravel & Breeze - ✅ SELESAI
1.  [x] Membuat proyek Laravel 11 baru.
2.  [x] Menginstal Laravel Breeze dengan stack React + Inertia.
3.  [x] Menjalankan instalasi NPM (`npm install` & `npm run build`).

### Langkah 2: Setup Database & Spatie Permission - ✅ SELESAI
1.  [x] Membuat database MySQL baru (nama: `siarsip`).
2.  [x] Mengonfigurasi koneksi di file `.env`.
3.  [x] Menginstal `spatie/laravel-permission`.
4.  [x] Membuat *Migration* dan *Seeder* untuk *Roles* (`Admin`, `Viewer`) serta membuat akun *dummy* untuk memudahkan login.

### Langkah 3: Konfigurasi Google Drive API - ✅ SELESAI
1.  [x] **Panduan Manual:** Dibuatkan panduan `panduan_google_drive.md`.
2.  [x] Menyimpan file `credentials.json` di direktori aman (`storage/app/credentials/credentials.json`).
3.  [x] Menginstal package resmi Google API (`composer require google/apiclient`).
4.  [x] Membuat `GoogleDriveService` dengan metode `getFilesInFolder()` dan `getSubfolderIdByName()`.

### Langkah 4: Pembuatan Struktur Database Tambahan - ✅ SELESAI
1.  [x] Membuat model, migration, dan controller untuk entitas `archive_years` (Tahun Anggaran).
2.  [x] Melakukan *migrate* seluruh tabel ke database lokal.

---

## 🛠️ Langkah Pengerjaan (Fase 2 & 3: UI & Logika Aplikasi) - ✅ SELESAI

### Langkah 5: Desain UI Cinematic (Tema Merah Putih Kemenhan) - ✅ SELESAI
1.  [x] **Beranda (Dashboard):** Membuat halaman *landing page* hero yang elegan, *full-screen*, *cinematic dark overlay* merah-hitam menggunakan gambar yang di-generate oleh AI, serta integrasi logo kementerian.
2.  [x] **Direktori Tahun (Lapis 1):** Halaman grid untuk Tahun Anggaran (misal T.A. 2025, T.A. 2026) dengan gambar AI kotak dokumen *leather* premium.
3.  [x] **Direktori Masuk/Keluar (Lapis 2):** Halaman pilihan Surat Masuk dan Surat Keluar setelah memilih Tahun, lengkap dengan ilustrasi *tray* kayu berefek *LED glow*.

### Langkah 6: Tabel Data Dokumen & Routing Otomatis - ✅ SELESAI
1.  [x] **Routing Bertingkat:** Memisahkan *route* untuk dashboard, `/arsip`, `/arsip/{year}`, dan `/arsip/{year}/{type}`.
2.  [x] **Integrasi Tabel React:** Menampilkan tabel dokumen berisi Nama, Tipe, Ukuran, Tanggal Dibuat, dan tombol "Pratinjau".
3.  [x] **Fitur Pencarian:** Menerapkan bar pencarian di UI tabel Arsip dengan tombol "Cari".
4.  [x] **Penanganan Error:** Jika folder belum di-*share* atau ID Folder tidak valid, muncul pesan peringatan warna merah yang rapi (tidak 500 server error).

---

## 🚀 Deployment ke Cloud / Railway - ✅ TERKONFIGURASI
*   **Docker Container:** Konfigurasi `Dockerfile` multi-stage (Node 20 Alpine untuk Vite build + PHP 8.3 FPM Alpine dengan Nginx & Supervisord).
*   **Fix Dependency Peer Conflict:** Menambahkan `--legacy-peer-deps` pada `npm ci` di Dockerfile & `.npmrc` untuk mengatasi konflik peer Vite 8 vs plugin React.
*   **Nginx Dual-Stack Fix:** Memastikan Nginx hanya me-listen IPv4 port dynamic `$PORT` bawaan Railway untuk mencegah crash socket IPv6.
*   **Database Adaptor Otomatis:** `config/database.php` otomatis mendukung variabel bawaan Railway (`MYSQLHOST`, `MYSQLPORT`, `MYSQLUSER`, dsb.) maupun TiDB Cloud.
*   **Railway Config:** File konfigurasi khusus `railway.json` dengan builder Dockerfile dan health check `/up`.

---

## 🛠️ STATUS SAAT INI (Tunggu Tindakan Pengguna) - 🚧 PENDING

Sistem SIARSIP sudah **100% siap** secara fungsi dan visual serta siap di-*deploy* ke Railway.

### TUGAS YANG BELUM DISELESAIKAN (Tugas Pengguna & Agen Selanjutnya):
1.  [ ] **Pengguna (Setup Railway Variables):** Pastikan Environment Variables berikut diisi di Dashboard Railway:
    *   `APP_KEY`: Jalankan `php artisan key:generate --show` lalu pasang nilainya.
    *   `APP_URL`: Domain resmi Railway Anda (misal `https://si-arsip-production.up.railway.app`).
    *   `DB_CONNECTION`: `mysql` (jika menggunakan database Railway MySQL).
    *   `AUTO_MIGRATE`: `true` (untuk menjalankan migrasi otomatis saat boot).
    *   `GOOGLE_CREDENTIALS_JSON`: Salin isi file JSON dari Service Account Google Drive.
2.  [ ] **Pengguna:** Membuat Folder Induk di Google Drive (misal: "Arsip T.A. 2026") dan membagikannya (*Share* -> Viewer) ke email Service Account: `kuathanri@gen-lang-client-0095584862.iam.gserviceaccount.com`.
3.  [ ] **Pengguna:** Membuat sub-folder persis bernama **"Surat Masuk"** dan **"Surat Keluar"** di dalam folder induk tersebut, dan mengisi beberapa dokumen di dalamnya sebagai percobaan.
4.  [ ] **Pengguna / Agen Selanjutnya:** Menyalin ID dari Folder Induk, lalu memasukkan/mengganti (*update*) nilai `gdrive_folder_id` pada tabel database `archive_years` menggantikan data *dummy* saat ini.
5.  [ ] **Opsional / Tambahan:** Membangun antarmuka (UI) Admin khusus agar admin bisa mengedit Nama Tahun Anggaran dan ID Folder secara mandiri tanpa harus mengubah database lewat *coding*.
