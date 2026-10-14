# Pemeliharaan Sistem dan Penanganan Kendala

## Pemeliharaan Rutin Peladen Aplikasi

Guna memastikan ketersediaan layanan (*high availability*) serta performa respons aplikasi yang konsisten, pengelola teknologi informasi wajib melaksanakan pemeliharaan sistem secara berkala yang meliputi:

1. **Pemeliharaan Memori Singgah (Cache Maintenance):**
   Peladen Laravel memanfaatkan lapisan cache untuk mempercepat komputasi rute, konfigurasi, dan daftar dokumen. Jalankan pemeliharaan cache melalui baris perintah Artisan jika terjadi perubahan struktur aplikasi:
   - `php artisan config:cache` (memperbarui cache konfigurasi lingkungan)
   - `php artisan route:cache` (mengoptimalkan pemetaan rute)
   - `php artisan view:cache` (melakukan prapemrosesan antarmuka)
2. **Pengelolaan Log Aktivitas dan Kesalahan:**
   Berkas pencatatan sistem yang tersimpan pada direktori `storage/logs/` harus dipantau secara mingguan. Terapkan mekanisme rotasi log harian (*daily log rotation*) agar ukuran berkas tidak membebani kapasitas media penyimpanan lokal peladen.
3. **Pencadangan Basis Data Metadata:**
   Meskipun berkas fisik biner berada di infrastruktur Google Drive yang terlindungi redundansi data awan, basis data relasional yang menampung metadata dokumen, akun pengguna, dan riwayat audit wajib dicadangkan (*backup*) secara otomatis setiap hari ke media penyimpanan terpisah.

## Manajemen Kredensial dan Kuota Google Drive API

Integrasi dengan ekosistem Google Workspace kedinasan membutuhkan pengawasan terhadap aspek autentikasi dan kuota akses:

1. **Keamanan Kunci Akun Layanan (*Service Account Key*):**
   - Berkas kunci berformat JSON harus disimpan pada jalur direktori yang dilindungi (`storage/app/credentials/service-account.json`) dengan hak akses berkas ketat (*file permissions* 600 atau setara).
   - Jangan pernah menyertakan berkas JSON kredensial ke dalam repositori *Version Control System* (Git).
   - Lakukan rotasi berkas kunci kredensial pada konsol Google Cloud Platform minimal satu kali dalam satu tahun kalender kerja.
2. **Wewenang Folder Google Drive:**
   Folder induk kearsipan di Google Drive wajib memberikan hak akses tingkat *Editor* kepada alamat email akun layanan (misal: `siarsip-sa@ditjen-kuathan.iam.gserviceaccount.com`). Apabila hak akses tersebut dicabut atau terdegradasi, sistem tidak akan dapat melakukan penulisan berkas baru.
3. **Pengawasan Batasan Kuota Permintaan (*API Rate Limit*):**
   Google Drive API menerapkan ambang batas kuota permintaan harian dan per detik. Mekanisme cache 30--60 menit yang diterapkan pada SIARSIP KUATHAN meminimalisasi konsumsi kuota hingga di bawah 10% dari ambang batas resmi.

## Matriks Penanganan Masalah Umum

Tabel berikut menyajikan panduan diagnosis dan langkah penyelesaian untuk kendala operasional yang kerap dihadapi pengguna maupun administrator:

| Gejala Kendala | Kemungkinan Penyebab | Tindakan Penyelesaian |
| :--- | :--- | :--- |
| **Pratinjau dokumen tidak muncul (layar putih/kosong)** | Hak akses Google Drive belum diberikan ke akun layanan, atau jaringan intranet memblokir domain Google. | Pastikan email Service Account memiliki akses *Editor/Viewer* ke folder terkait. Periksa pengaturan proksi jaringan instansi. |
| **Gagal mengunggah naskah dinas baru** | Ukuran berkas melebihi batas 25 MB, format berkas bukan PDF, atau kuota Google Drive penuh. | Kompresi ukuran berkas PDF menggunakan perangkat lunak standar. Periksa sisa ruang penyimpanan pada Google Drive kedinasan. |
| **Dokumen baru di Google Drive belum tampil di web** | Data arsip masih tersimpan pada memori singgah (*cache*) peladen. | Administrator dapat menekan tombol **Sinkronisasi Ulang** pada dasbor untuk mematikan cache lama dan mengambil data terbaru. |
| **Sesi login terputus secara mendadak** | Masa berlaku sesi kedaluwarsa setelah 120 menit tanpa aktivitas, atau alamat IP pengguna berubah. | Masuk kembali menggunakan akun kedinasan. Pastikan koneksi internet stabil dan tidak sering terputus-sambung. |
| **Pesan kesalahan *403 Forbidden* saat membuka berkas** | Akun pengguna tidak memiliki izin peran yang sesuai (*Role Mismatch*). | Hubungi Administrator Arsip untuk memverifikasi penugasan peran (*role*) pada modul manajemen pengguna. |

## Prosedur Pelaporan dan Eskalasi Bantuan

Apabila terjadi kendala teknis di luar matriks penanganan masalah di atas, pengguna disarankan melakukan eskalasi dengan tata cara:

1. Catat rincian pesan kesalahan yang ditampilkan pada layar, beserta tangkapan layar (*screenshot*) terkait.
2. Hubungi Tim Pengembang dan Pengelola TI Ditjen Kuathan Kemhan melalui kontak meja bantuan (*helpdesk*) kedinasan.
3. Berikan informasi mengenai jenis peramban web yang digunakan, nomor surat dinas yang mengalami kendala, serta waktu terjadinya insiden.
