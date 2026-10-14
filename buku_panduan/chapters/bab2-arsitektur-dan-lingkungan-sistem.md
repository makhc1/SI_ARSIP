# Arsitektur dan Lingkungan Sistem

## Landasan Arsitektur Perangkat Lunak

Aplikasi SIARSIP KUATHAN dikembangkan dengan mengadopsi arsitektur aplikasi web modern yang memadukan keandalan *backend* berbasis Laravel [@laravel2024] dengan keluwesan antarmuka pengguna berbasis Inertia.js [@inertia2024]. Pendekatan ini memungkinkan pembangunan aplikasi dengan pengalaman pengguna layaknya *Single Page Application* (SPA) tanpa mengorbankan kesederhanaan penanganan rute, kontroler, serta lapisan otentikasi di sisi peladen (*server-side*).

Struktur teknologi aplikasi terbagi menjadi tiga lapisan utama:
1. **Lapisan Penyajian (Presentation Layer):** Menggunakan pustaka komponen antarmuka yang ditata menggunakan Tailwind CSS dengan skema warna resmi kedinasan (*Navy & Slate Government-grade Palette*). Pembaruan data pada tampilan antarmuka dieksekusi melalui pertukaran state dinamis Inertia.js tanpa memuat ulang seluruh halaman peramban secara penuh.
2. **Lapisan Logika Bisnis (Business Logic Layer):** Diatur oleh kerangka kerja Laravel yang menangani logika otentikasi, validasi naskah dinas, manajemen antrean persetujuan berkas usulan, serta komunikasi dengan antarmuka pemrograman aplikasi eksternal (*External API*).
3. **Lapisan Repositori Data (Data Layer):** Menyimpan metadata dokumen (nomor surat, judul, kategori, tanggal unggah, tautan Google Drive) pada basis data relasional terindeks, sementara objek berkas biner (*binary files*) disimpan secara terpisah pada media penyimpanan awan (*cloud storage*).

## Pola Integrasi Penyimpanan Google Drive

Penyimpanan berkas fisik naskah dinas tidak diletakkan pada media penyimpanan lokal peladen aplikasi, melainkan dialihkan menuju infrastruktur Google Drive Kedinasan melalui pemanfaatan **Google Drive API v3** [@googledrive2024]. Pola integrasi ini dirancang dengan prinsip keamanan tingkat tinggi:

1. **Otentikasi Akun Layanan (Service Account):** Komunikasi peladen ke peladen (*server-to-server*) dijalankan menggunakan berkas kredensial Akun Layanan (*Service Account Key*) terenkripsi dalam format JSON. Hal ini meniadakan keharusan bagi setiap staf atau personel untuk melakukan otorisasi akun Google pribadi saat membuka arsip kedinasan.
2. **Abstraksi Struktur Folder:** Personel umum tidak mengetahui maupun memiliki akses langsung ke struktur direktori internal Google Drive. Seluruh akses baca, pratinjau, maupun unduh dialirkan (*streamed*) melalui perantara peladen aplikasi.
3. **Mekanisme Caching Cerdas:** Guna menjaga performa respon sistem dan menghindari batasan kuota permintaan (*rate limit*) Google Drive API, metadata daftar berkas per Tahun Anggaran disimpan sementara pada lapisan *Cache* peladen Laravel dengan masa retensi berkisar antara 30 hingga 60 menit.

## Mekanisme Keamanan dan Manajemen Sesi

Keamanan data naskah dinas kedinasan dilindungi melalui beberapa lapis pengamanan:
1. **Otentikasi Berlapis dan Enkripsi Sesi:** Sesi login pengguna dikelola secara aman dengan enkripsi token sesi serta perlindungan serangan *Cross-Site Request Forgery* (CSRF) pada setiap pengiriman formulir.
2. **Otorisasi Berbasis Peran (RBAC):** Setiap rute operasional kritis (seperti verifikasi unggahan, penghapusan dokumen, dan perubahan hak akses) diproteksi menggunakan lapisan perantara (*middleware*) yang memverifikasi wewenang peran sebelum instruksi dieksekusi.
3. **Penyaluran Berkas Aman (Secure Streaming Proxy):** Ketika personel membuka pratinjau berkas melalui rute `arsip/file/{id}/stream`, peladen membaca aliran data biner dari Google Drive dan menyalurkannya langsung ke jendela penampil (*viewer*) tanpa mengekspos tautan unduhan publik yang rentan disalahgunakan.

## Kebutuhan Sistem dan Peramban Pengguna

Untuk menjamin kenyamanan dan kestabilan operasional saat mengakses SIARSIP KUATHAN, pengguna disarankan menggunakan perangkat dan peramban web dengan spesifikasi minimum sebagai berikut:

| Komponen Perangkat | Spesifikasi Minimum | Rekomendasi Ideal |
| :--- | :--- | :--- |
| **Sistem Operasi** | Windows 10, macOS 11, atau Linux | Windows 11 / macOS 13+ |
| **Peramban Web** | Google Chrome v100+, Microsoft Edge v100+, Mozilla Firefox v100+ | Google Chrome versi terbaru |
| **Resolusi Layar** | $1280 \times 720$ piksel (HD) | $1920 \times 1080$ piksel (Full HD) |
| **Konektivitas Jaringan** | Jaringan Intranet Kemhan / Internet stabil 2 Mbps | Koneksi Internet berkecepatan 10 Mbps ke atas |
| **Penampil PDF** | Mesin penampil internal bawaan peramban (*Built-in PDF Viewer*) | Adobe Acrobat Reader (opsional untuk dokumen cetak) |
