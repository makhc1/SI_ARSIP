# Pendahuluan

## Latar Belakang dan Urgensi Digitalisasi Arsip

Pengelolaan naskah dinas dan dokumentasi kedinasan merupakan pilar fundamental dalam menjamin akuntabilitas, transparansi, dan kontinuitas operasional pada instansi pemerintahan. Di lingkungan Direktorat Jenderal Kekuatan Pertahanan (Ditjen Kuathan), Kementerian Pertahanan Republik Indonesia, arus dokumen tahunan—yang mencakup naskah dinas, dokumen perencanaan strategis, laporan kinerja, hingga dokumen penetapan anggaran—memerlukan sistem repositori yang terstruktur, aman, serta memiliki kecepatan penelusuran yang tinggi.

Sebelum implementasi SIARSIP KUATHAN, pengelolaan dan distribusi naskah dinas digital dilakukan melalui portal publikasi statis berbasis Google Sites. Meskipun media tersebut dapat berfungsi sebagai sarana distribusi awal, pemanfaatan portal statis memiliki sejumlah keterbatasan operasional yang signifikan:

1. **Struktur Navigasi Tidak Dinamis:** Dokumen tidak terindeks ke dalam basis data relasional, sehingga penelusuran dokumen naskah dinas memerlukan pencarian manual per halaman.
2. **Ketergantungan Akses Tab Terpisah:** Pengguna diarahkan secara manual menuju tautan Google Drive eksternal tanpa adanya fasilitas pratinjau dokumen (*in-app preview*) terintegrasi.
3. **Ketiadaan Pengelompokan Berbasis Tahun Anggaran:** Penataan arsip belum terstandarisasi menurut siklus Tahun Anggaran (T.A.) dan klasifikasi naskah kedinasan secara terpadu.
4. **Keterbatasan Tata Kelola Wewenang:** Tidak tersedianya mekanisme seleksi hak akses antara pengguna biasa dengan administrator pengelola arsip.

Berdasarkan standar internasional manajemen kearsipan ISO 15489-1:2016 [@iso15489] dan regulasi kearsipan nasional [@anri2019], pengelolaan arsip dinamis elektronik wajib menjamin empat prinsip utama: keaslian (*authenticity*), keandalan (*reliability*), integritas (*integrity*), dan keterpakaian (*usability*). Selain itu, tata naskah dinas di lingkungan Kementerian Pertahanan mengamanatkan tata kelola administrasi persuratan kedinasan yang tertib dan berjenjang [@kemhan2020]. 

Aplikasi **SIARSIP KUATHAN** dibangun guna menjawab kebutuhan tersebut dengan menggabungkan keandalan penyimpanan awan Google Drive API dengan portal web modern berbasis Laravel dan Inertia.js.

## Maksud dan Tujuan Pedoman

Buku Panduan Penggunaan ini disusun dengan maksud sebagai pedoman operasional formal bagi seluruh personel di lingkungan Ditjen Kuathan Kemhan dalam mengoperasikan sistem SIARSIP KUATHAN. 

Adapun tujuan penyusunan buku panduan ini adalah sebagai berikut:
1. Memberikan panduan langkah demi langkah bagi personel dalam melakukan penelusuran, pratinjau, dan pengunduhan naskah dinas kedinasan.
2. Memandu staf operasional dalam prosedur pengajuan (*upload submission*) berkas arsip baru ke dalam sistem.
3. Menjadi acuan kerja baku bagi Administrator Arsip dalam memverifikasi, menyetujui (*approve*), atau menolak (*reject*) usulan berkas naskah dinas.
4. Menstandarisasi tata cara pengelolaan akun pengguna, penugasan hak akses, serta pemeliharaan direktori arsip kedinasan.

## Ruang Lingkup Sistem

Ruang lingkup operasional sistem informasi SIARSIP KUATHAN mencakup:
1. **Modul Autentikasi dan Manajemen Sesi:** Pengamanan akses berbasis kredensial surat elektronik kedinasan dan pengelolaan peran (*role-based access control*).
2. **Modul Repositori Arsip Berbasis Tahun Anggaran:** Pengelompokan dokumen berdasarkan siklus tahun anggaran aktif maupun arsip tahun-tahun terdahulu.
3. **Modul Klasifikasi Naskah Dinas:** Pengorganisasian dokumen ke dalam rumpun jenis (surat masuk, surat keluar, nota dinas, naskah telaahan, laporan kinerja, rencana kerja).
4. **Modul Pratinjau Dokumen Instan:** Fasilitas peninjauan dokumen naskah dinas (format PDF) langsung pada jendela peramban tanpa kewajiban mengunduh berkas fisik.
5. **Modul Pengusulan dan Verifikasi Berkas:** Siklus hidup persetujuan berkas dari staf pengusul hingga penetapan oleh administrator arsip.

## Sasaran Pengguna dan Matriks Hak Akses

Sasaran pengguna sistem SIARSIP KUATHAN terdiri atas dua kelompok pengguna dengan batasan hak akses operasional yang diatur secara tegas:

| Modul dan Fitur Sistem | Pegawai / Pengguna (Viewer) | Administrator Arsip (Admin) |
| :--- | :---: | :---: |
| Masuk ke Dasbor Sistem | Dapat Mengakses | Dapat Mengakses |
| Menjelajahi Direktori Tahun Anggaran | Dapat Mengakses | Dapat Mengakses |
| Pencarian dan Filter Dokumen | Dapat Mengakses | Dapat Mengakses |
| Pratinjau Dokumen (*In-App Preview*) | Dapat Mengakses | Dapat Mengakses |
| Mengunduh Salinan Berkas Resmi | Dapat Mengakses | Dapat Mengakses |
| Mengajukan Usulan Unggahan Baru | Dapat Mengajukan | Dapat Mengajukan |
| Memantau Riwayat Usulan Pribadi | Dapat Memantau | Dapat Memantau |
| Verifikasi Usulan (Setujui / Tolak) | Tidak Diizinkan | Memiliki Wewenang Penuh |
| Tambah / Ubah / Hapus Tahun Anggaran | Tidak Diizinkan | Memiliki Wewenang Penuh |
| Pengelolaan Akun dan Peran Pengguna | Tidak Diizinkan | Memiliki Wewenang Penuh |
| Pemeliharaan Metadata Sistem | Tidak Diizinkan | Memiliki Wewenang Penuh |
