# Panduan Administrator Arsip

## Peran dan Tanggung Jawab Administrator

Administrator Arsip memegang peran sentral dalam menjamin ketertiban, keakuratan, dan keamanan seluruh naskah dinas yang tersimpan di dalam SIARSIP KUATHAN. Wewenang operasional administrator mencakup tata kelola direktori Tahun Anggaran, verifikasi berkas usulan yang masuk dari staf operasional, pemeliharaan metadata dokumen, serta pengelolaan wewenang akun pengguna.

Dalam menjalankan fungsinya, Administrator berkewajiban:
1. Memastikan seluruh berkas yang disetujui memenuhi standar naskah dinas Kemhan [@kemhan2020].
2. Menjaga kerahasiaan kredensial administratif serta kredensial integrasi Google Cloud Service Account.
3. Melakukan monitoring rutin terhadap antrean usulan berkas guna mencegah penumpukan dokumen yang belum terverifikasi.

## Pengelolaan Direktori Tahun Anggaran

Setiap berkas naskah dinas dikelompokkan ke dalam wadah Tahun Anggaran yang terhubung dengan folder spesifik pada Google Drive kedinasan. Prosedur pengelolaan Tahun Anggaran dilakukan sebagai berikut:

1. **Menambah Tahun Anggaran Baru:**
   - Buka menu **Kelola Tahun Anggaran** pada bilah navigasi administrator.
   - Klik tombol **Tambah Tahun Anggaran**.
   - Masukkan angka tahun anggaran (misal: `2026`).
   - Masukkan judul resmi direktori (misal: *Berkas Naskah Dinas T.A. 2026*).
   - Masukkan ID Folder Google Drive (`gdrive_folder_id`) yang diperoleh dari tautan folder Google Drive resmi bagian kearsipan.
   - Tetapkan status tahun anggaran sebagai *Aktif* (*Active*).
   - Klik **Simpan Direktori**.
2. **Memperbarui Metadata Tahun Anggaran:**
   - Klik tombol **Sunting** pada baris tahun anggaran yang ingin diubah.
   - Lakukan penyesuaian deskripsi atau perbaikan tautan folder Google Drive jika terjadi migrasi penyimpanan.
   - Klik tombol **Perbarui**.
3. **Menutup Periode Tahun Anggaran:**
   - Setelah masa audit tahun anggaran berakhir, ubah status tahun terkait menjadi *Arsip Tertutup* (*Inactive*). Hal ini mencegah penambahan berkas baru secara tidak sengaja oleh staf operasional.

## Alur Kerja Verifikasi dan Persetujuan Usulan Berkas

Seluruh naskah dinas yang diajukan oleh pengguna umum wajib melalui mekanisme penelaahan sebelum dipublikasikan secara resmi ke dalam repositori utama:

1. **Membuka Antrean Verifikasi:**
   - Navigasikan menuju menu **Daftar Usulan Arsip** (`/upload`).
   - Sistem menyajikan tabel antrean naskah dinas yang berstatus *Menunggu Verifikasi*.
2. **Pemeriksaan Dokumen Usulan:**
   - Klik tombol **Detail & Pratinjau** pada naskah yang diajukan.
   - Periksa kesesuaian antara nomor surat, tanggal surat, perihal, dan berkas fisik PDF yang terlampir.
3. **Tindakan Persetujuan (*Approval*):**
   - Apabila berkas telah lengkap dan sah, klik tombol hijau **Setujui Berkas** (*Approve*).
   - Sistem akan memindahkan berkas secara permanen ke Google Drive kedinasan, mendaftarkan metadata ke basis data relasional, dan mengubah status usulan menjadi *Disetujui*. Berkas kini dapat diakses oleh seluruh pengguna.
4. **Tindakan Penolakan (*Rejection*):**
   - Apabila berkas memiliki kekurangan (misal: stempel dinas tidak terbaca, halaman terpotong, atau nomor naskah salah), klik tombol merah **Tolak Berkas** (*Reject*).
   - Masukkan catatan alasan penolakan secara jelas pada kotak dialog yang muncul.
   - Sistem akan memperbarui status usulan menjadi *Ditolak* dan menyajikan catatan perbaikan kepada staf pengusul.

## Manajemen Naskah Dinas Terpublikasi

Administrator memiliki wewenang untuk melakukan koreksi terhadap naskah dinas yang telah dipublikasikan:

1. **Pembaruan Metadata:** Administrator dapat memperbaiki kesalahan pengetikan nomor surat atau perihal naskah melalui tombol **Sunting Dokumen** pada katalog arsip tahunan.
2. **Penggantian Berkas (*Replace File*):** Apabila terdapat ralat resmi dari instansi penerbit surat, berkas naskah dapat diperbarui tanpa mengubah nomor indeks dokumen kearsipan.
3. **Pencabutan dan Penghapusan Berkas:** Apabila sebuah dokumen dibatalkan secara hukum, administrator dapat menghapus catatan arsip. Tindakan ini secara otomatis menghapus berkas pada Google Drive dan mencatat riwayat penghapusan ke dalam berkas log keamanan sistem.

## Tata Kelola Pengguna dan Penugasan Hak Akses

Pengendalian akun personel dilakukan melalui modul manajemen pengguna (`/users`):

1. **Pemeriksaan Daftar Personel:** Administrator dapat memantau seluruh pengguna terdaftar, status verifikasi email kedinasan, serta waktu login terakhir.
2. **Penugasan Peran (*Role Assignment*):**
   - Peran **Viewer / Staf:** Diberikan kepada personel umum untuk kebutuhan penelusuran, peninjauan, pengunduhan, dan pengusulan berkas.
   - Peran **Administrator:** Hanya diberikan kepada pejabat pengelola arsip atau tim teknologi informasi yang berwenang.
3. **Penonaktifan Akun:** Personel yang telah dipindahtugaskan (*mutasi*) atau memasuki masa purnatugas wajib dinonaktifkan aksesnya guna mencegah penyalahgunaan wewenang.

## Sinkronisasi dan Pemeliharaan Cache Sistem

Untuk menjaga performa sistem tetap prima saat melayani permintaan berkas dalam jumlah besar:

1. **Mekanisme Caching Otomatis:** Daftar dokumen dari Google Drive disimpan dalam memori singgah (*cache*) peladen selama 60 menit.
2. **Sinkronisasi Manual (*Force Sync*):** Apabila administrator melakukan penambahan atau pemindahan berkas langsung pada antarmuka Google Drive (di luar antarmuka SIARSIP), administrator dapat menekan tombol **Sinkronisasi Ulang Direktori** pada dashboard untuk memaksa peladen memperbarui cache seketika.
