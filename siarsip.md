# Product Requirement Document (PRD)
## SIARSIP KUATHAN (Sistem Informasi Arsip Digital Terintegrasi Google Drive)

---

| Dokumen | Keterangan |
| :--- | :--- |
| **Nama Proyek** | SIARSIP KUATHAN |
| **Instansi** | Ditjen Kekuatan Pertahanan (Kuathan) - Kementerian Pertahanan RI |
| **Tipe Dokumen** | Product Requirement Document (PRD) |
| **Versi** | 1.0.0 |
| **Tech Stack** | Laravel, Inertia.js (React / Vue 3), Tailwind CSS, Google Drive API v3 |
| **Status** | Draft Ready for Development |

---

## 1. Latar Belakang & Urgensi

Direktorat Jenderal Kekuatan Pertahanan (Ditjen Kuathan) Kemhan saat ini mengelola repositori dokumen dan naskah dinas tahunan melalui portal Google Sites. Kendati berfungsi sebagai wadah distribusi, solusi berbasis Google Sites memiliki sejumlah limitasi operasional:
1. **Navigasi Kaku & Tidak Terstruktur:** Tampilan statis menyulitkan pencarian arsip secara cepat saat audit atau kebutuhan data mendesak.
2. **Keterbatasan Eksplorasi File:** Pegawai sering kali harus membuka Google Drive secara manual di tab terpisah.
3. **Standar Antarmuka Instansi:** Dibutuhkan portal internal mandiri yang berpenampilan formal, aman, cepat, dan memiliki klasifikasi berbasis Tahun Anggaran (T.A.).

Aplikasi **SIARSIP KUATHAN** dibangun sebagai pengganti/modernisasi dari portal terdahulu dengan memanfaatkan **Laravel + Inertia.js**, mengintegrasikan Google Drive API secara aman via Service Account, serta menyediakan antarmuka berkas tahunan interaktif dan fitur pratinjau dokumen langsung di peramban.

---

## 2. Tujuan Produk (Product Objectives)

* **Sentralisasi Arsip Tahunan:** Mengelompokkan seluruh berkas dinas berdasarkan Tahun Anggaran (misal: T.A. 2024, 2025, 2026) dalam format visual direktori yang mudah diakses.
* **Integrasi Google Drive Transparan:** File fisik tetap tersimpan aman di Google Drive kedinasan, sementara sistem web menyajikan metadata, katalogisasi, dan akses baca/unduh tanpa mengekspos struktur folder internal.
* **Pratinjau Instan (In-App Document Preview):** Memungkinkan pegawai meninjau dokumen PDF/naskah kedinasan langsung melalui modal pratinjau tanpa keharusan mengunduh berkas.
* **Pencarian Cepat & Filter:** Menyediakan pencarian *real-time* berbasis nama berkas, nomor surat, dan klasifikasi dokumen.

---

## 3. Profil Pengguna (User Personas)

1. **Pegawai / Staf Operasional (Viewer):**
   * Melihat katalog tahunan.
   * Mencari berkas dinas berdasarkan kata kunci atau tahun anggaran.
   * Meninjau dokumen via viewer terintegrasi dan mengunduh berkas yang diperlukan.
2. **Admin Arsip / Pengelola Data (Admin):**
   * Mengatur mapping Folder ID Google Drive per Tahun Anggaran.
   * Memperbarui informasi banner, ringkasan capaian tahunan, dan status aktif direktori.
   * Melakukan pemindaian ulang (*sync/refresh cache*) terhadap folder Google Drive.

---

## 4. Ruang Lingkup Fitur (Feature Scope)

### 4.1. Modul Beranda (Yearly Vault Directory)
* **Banner Identitas Kedinasan:** Menampilkan lambang/identitas resmi Ditjen Kuathan Kemhan.
* **Grid Direktori Tahun Anggaran:** 
  * Menampilkan card/banner interaktif tiap Tahun Anggaran (2024, 2025, 2026, dst.).
  * Indikator status: "T.A. Berjalan" (Aktif) atau "Arsip Tertutup" (Inaktif).
  * Statistik ringkas: Estimasi jumlah berkas dan pembaruan berkas terakhir.
* **Interaksi Klik:** Transisi mulus (Inertia visit) menuju halaman daftar dokumen tahun terkait tanpa reload halaman penuh.

### 4.2. Modul Daftar Arsip Dokumen (Archive Listing)
* **Katalog Tabular Formal:** Tabel daftar dokumen berisi kolom:
  * Nomor Urut
  * Judul Dokumen / Naskah Dinas
  * Tipe / Ekstensi File (PDF, DOCX, XLSX)
  * Ukuran Berkas
  * Tanggal Pembuatan / Pembaruan
* **Pencarian & Penyaringan Sektoral:** Input pencarian instan (*debounce*) untuk menyaring nama file secara lokal atau via server.
* **Aksi Dokumen:**
  * Tombol **"Pratinjau"**: Menampilkan berkas dalam modal iframe Google Drive Preview.
  * Tombol **"Unduh"**: Membuka tautan unduhan langsung berkas (`webContentLink`).

### 4.3. Modul Integrasi Google Drive
* **Autentikasi Service Account:** Menggunakan berkas kredensial JSON Google Cloud untuk akses server-to-server tanpa login perorangan.
* **Sinkronisasi Folder Per Tahun:** Backend Laravel membaca isi folder Google Drive berdasarkan `folder_id` yang terkonfigurasi.
* **Caching Response:** Menyimpan sementara respon Google Drive API menggunakan Laravel Cache (durasi 30-60 menit) guna meminimalkan kuota API rate limit.

---

## 5. Arsitektur Teknis & Alur Data

### 5.1. Tech Stack
* **Backend:** Laravel 11.x (PHP 8.2+)
* **Frontend Adapter:** Inertia.js
* **Frontend Framework:** React 18 / Vue 3
* **Styling Framework:** Tailwind CSS (Dark Navy & Slate Government-grade Theme)
* **Komponen Ikon:** Lucide Icons
* **Library Google API:** `google/apiclient: ^2.15`

### 5.2. Skema Alur Integrasi (Architecture Flow)

```text
+-------------------+           +-----------------------+           +-----------------------+
|  Inertia Client   |           |    Laravel Backend    |           |   Google Drive API    |
| (Browser/Pegawai) |           |      Controller       |           |   (Service Account)   |
+-------------------+           +-----------------------+           +-----------------------+
          |                                 |                                   |
          | 1. Klik Kartu "T.A. 2025"       |                                   |
          |-------------------------------->|                                   |
          |                                 | 2. Periksa Laravel Cache          |
          |                                 |    (Key: drive_files_2025)        |
          |                                 |                                   |
          |                                 | 3. Cache Miss: Panggil API Drive  |
          |                                 |---------------------------------->|
          |                                 |    q: 'FOLDER_ID_2025' in parents |
          |                                 |                                   |
          |                                 | 4. Return List File & Metadata    |
          |                                 |<----------------------------------|
          |                                 |                                   |
          |                                 | 5. Simpan Cache & Response        |
          | 6. Render Props ke Inertia Page |                                   |
          |<--------------------------------|                                   |
          |                                 |                                   |
          | 7. Klik Pratinjau (File ID)     |                                   |
          |    Buka Modal Iframe Preview    |                                   |
          +---------------------------------+                                   +
```

---

## 6. Rancangan Skema Konfigurasi & Basis Data

Sistem dapat beroperasi dalam mode **Hybrid** (menggunakan database untuk metadata folder & konfigurasi, sementara isi berkas langsung ditarik dari Google Drive API).

### Tabel `archive_years`
| Field | Tipe Data | Keterangan |
| :--- | :--- | :--- |
| `id` | `BIGINT UNSIGNED (PK)` | Auto-increment ID |
| `year` | `YEAR` | Tahun Anggaran, misal: `2025`, `2026` (Unique) |
| `title` | `VARCHAR(150)` | Label berkas, contoh: "Berkas Naskah Dinas T.A. 2025" |
| `description` | `TEXT` | Deskripsi singkat direktori |
| `gdrive_folder_id` | `VARCHAR(100)` | ID folder spesifik di Google Drive |
| `is_active` | `BOOLEAN` | Penanda tahun anggaran aktif / berjalan |
| `created_at / updated_at` | `TIMESTAMP` | Timestamps bawaan Laravel |

---

## 7. Desain Antarmuka Pengguna (UI/UX Guidelines)

Sesuai standar lingkungan kedinasan Kementerian Pertahanan:
* **Palet Warna:**
  * Primary: Deep Navy Blue (`#0B192C` / `#1E3E62`)
  * Neutral: Slate Gray (`#334155`), Off-white Background (`#F8FAFC`)
  * Accent / Badge: Dark Emerald (`#065F46`) untuk tahun berjalan, Crimson Slate (`#991B1B`) untuk dokumen berkas penting.
* **Tipografi:** Font sans-serif formal, tajam, dan memiliki keterbacaan tinggi (*Inter* atau *Plus Jakarta Sans*).
* **Komponen Visual:**
  * Sudut kurvatur proporsional (`rounded-lg` atau `rounded-xl`).
  * Bayangan halus berorientasi korporat (`shadow-sm` hingga `shadow-md`).
  * Tidak menggunakan animasi transisi berlebihan (*subtle fade & hover border highlight*).

---

## 8. Rencana Implementasi & Jadwal Pengerjaan (Milestones)

| Fase | Durasi | Target Output |
| :--- | :--- | :--- |
| **Fase 1: Setup & Integrasi Drive** | 2 Hari | Inisialisasi Laravel + Inertia, setup Service Account Google Cloud, validasi koneksi Google Drive API. |
| **Fase 2: Layout & Beranda Direktori** | 2 Hari | Halaman Beranda SIARSIP, komponen kartu direktori tahunan dengan styling kedinasan Kemhan. |
| **Fase 3: Tabel Arsip & Pencarian** | 3 Hari | Halaman daftar berkas per tahun, fitur pencarian instan, integrasi data dari Google Drive. |
| **Fase 4: Modal Pratinjau & Optimasi** | 2 Hari | Implementasi in-app iframe viewer dokumen, pengaturan Laravel Cache untuk performa loading cepat. |
| **Fase 5: Testing & Review Pembimbing** | 1 Hari | Validasi fungsionalitas, pengujian responsivitas, dan persiapan demonstrasi kepada mentor magang. |

---

## 9. Pertimbangan Keamanan & Batasan Sistem

* **Kredensial Service Account:** File JSON credential Google Cloud wajib diletakkan di direktori aman (`storage/app/credentials/`) dan tidak boleh disertakan ke dalam repositori publik (.gitignore).
* **Akses Pratinjau Terkendali:** Dokumen yang disajikan menggunakan tautan embed preview Google Drive tanpa memberikan hak penyuntingan (editor) ke publik.
* **Penanganan Dokumen Non-PDF:** Dokumen non-PDF (seperti arsip ZIP/RAR) diarahkan langsung ke opsi unduh dengan konfirmasi peramban.