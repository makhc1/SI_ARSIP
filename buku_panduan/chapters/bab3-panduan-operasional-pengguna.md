# Panduan Operasional Pengguna

## Akses dan Autentikasi Pengguna

Seluruh personel Ditjen Kuathan yang telah terdaftar dapat mengakses sistem informasi kearsipan melalui peramban web pada alamat portal resmi kedinasan. Tata cara masuk ke dalam sistem adalah sebagai berikut:

1. Buka peramban web dan arahkan menuju alamat URL resmi SIARSIP KUATHAN.
2. Pada halaman awal (*Login Screen*), masukkan alamat surat elektronik kedinasan (*official email*) pada kolom yang tersedia.
3. Masukkan kata sandi akun kedinasan pada kolom kata sandi.
4. Centang kotak pilihan *Ingat Saya* (*Remember Me*) apabila menggunakan komputer kerja pribadi yang terjamin keamanannya.
5. Klik tombol **Masuk Sistem** untuk memproses verifikasi kredensial.
6. Apabila personel mengalami kendala lupa kata sandi, klik tautan *Lupa Kata Sandi*, masukkan alamat email terdaftar, dan ikuti instruksi pemulihan yang dikirimkan oleh sistem ke kotak masuk email kedinasan.

## Penjelajahan Direktori Tahun Anggaran

Setelah proses autentikasi berhasil, sistem akan mengarahkan pengguna ke halaman Beranda (*Dashboard*) yang menampilkan direktori arsip berbasis siklus Tahun Anggaran (T.A.):

1. **Memilih Tahun Anggaran:** Antarmuka menyajikan kartu-kartu Tahun Anggaran (seperti T.A. 2024, T.A. 2025, dan T.A. 2026). Setiap kartu dilengkapi dengan label tahun, keterangan singkat, serta indikator status kearsipan.
2. **Indikator Status:** Kartu dengan penanda warna hijau (*T.A. Berjalan*) menandakan periode aktif yang masih dapat menerima usulan penambahan berkas dinas. Kartu dengan penanda abu-abu netral (*Arsip Tertutup*) menandakan arsip periode lampau yang berstatus pembacaan permanen.
3. **Membuka Direktori:** Klik pada salah satu kartu Tahun Anggaran yang dikehendaki untuk masuk ke daftar berkas naskah dinas terkait. Navigasi dieksekusi secara mulus melalui teknologi Inertia.js tanpa jeda pemuatan ulang halaman.

## Pencarian dan Penyaringan Naskah Dinas

Pada halaman daftar arsip tahunan, pengguna disajikan katalog tabel formal yang memuat seluruh dokumen dinas. Fasilitas pencarian dan penyaringan dirancang untuk mempermudah penelusuran:

1. **Pencarian Berbasis Kata Kunci:** Masukkan nomor surat, perihal, atau kata kunci tertentu pada bilah pencarian di bagian atas tabel. Sistem akan secara otomatis menyaring baris data secara instan sesuai masukan pengguna.
2. **Penyaringan Klasifikasi Dokumen:** Pengguna dapat membatasi daftar dokumen berdasarkan rumpun naskah kedinasan melalui menu tarik-turun (*dropdown filter*), meliputi:
   - Surat Masuk Kedinasan
   - Surat Keluar Kedinasan
   - Nota Dinas Internal
   - Naskah Telaahan Staf
   - Laporan Kinerja dan Evaluasi
   - Rencana Kerja dan Anggaran
3. **Penyortiran Data:** Klik tajuk kolom pada tabel (seperti Nama Dokumen atau Tanggal Pembaruan) untuk mengurutkan daftar berkas dari yang terbaru maupun berdasarkan abjad.

## Pemanfaatan Pratinjau Dokumen Terintegrasi

Salah satu keunggulan SIARSIP KUATHAN adalah ketersediaan penampil dokumen langsung di dalam aplikasi (*in-app preview*):

1. **Membuka Pratinjau:** Klik tombol **Pratinjau** berlambang ikon mata pada baris dokumen yang dituju.
2. **Jendela Modal Penampil:** Dokumen format PDF akan dibuka seketika di dalam jendela penampil modal khusus tanpa membuka tab peramban baru. Aliran data berkas diambil secara aman dari Google Drive melalui protokol proksi peladen internal.
3. **Fasilitas Kontrol Dokumen:** Pada bilah atas jendela pratinjau, pengguna dapat melakukan perbesaran (*zoom in*), perkecilan (*zoom out*), lompat ke nomor halaman tertentu, serta memutar sudut pandang dokumen.
4. **Menutup Pratinjau:** Klik tombol silang pada pojok kanan atas jendela modal atau tekan tombol *Escape* (Esc) pada papan ketik.

## Prosedur Pengunduhan Salinan Resmi

Apabila personel membutuhkan salinan digital untuk keperluan administrasi kedinasan atau disposisi luring:

1. Klik tombol **Unduh** pada baris dokumen terkait di tabel arsip.
2. Sistem akan menyalurkan berkas naskah dinas secara langsung dengan nama berkas asli dan ekstensi yang sesuai.
3. Seluruh pengunduhan berkas tercatat dalam log aktivitas peladen guna keperluan audit dan kepatuhan kearsipan instansi.

## Pengajuan Usulan Unggah Berkas Baru

Personel operasional yang berwenang menyampaikan naskah dinas baru dapat mengajukan usulan berkas melalui alur pengajuan sistem:

1. Klik menu navigasi **Usulkan Berkas** atau navigasikan ke rute unggah dokumen.
2. Pada formulir pengusulan (*Upload Submission Form*), lengkapi atribut metadata dokumen:
   - **Tahun Anggaran:** Pilih tahun anggaran yang relevan dengan naskah dinas.
   - **Nomor Naskah Dinas:** Masukkan kode penomoran resmi surat dinas sesuai format Kemhan.
   - **Judul / Perihal Berkas:** Tuliskan perihal naskah secara lengkap, jelas, dan tanpa singkatan tidak baku.
   - **Klasifikasi Naskah:** Pilih rumpun klasifikasi yang sesuai.
   - **Berkas Lampiran:** Pilih berkas naskah digital dalam format PDF (ukuran berkas maksimum 25 MB).
   - **Keterangan Tambahan:** Cantumkan ringkasan disposisi atau urgensi berkas jika diperlukan.
3. Periksa kembali kebenaran data, lalu klik tombol **Kirim Usulan**.
4. Sistem akan menempatkan usulan pada antrean verifikasi dengan status **Menunggu Persetujuan** (*Pending Approval*). Pengusul dapat memantau perkembangan status verifikasi pada tabel riwayat usulan pribadi.
