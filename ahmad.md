# Spesifikasi Role, Permission, dan Data Personel (SI_ARSIP)
**Unit Organisasi:** Bagian Data dan Informasi (Bagdatin) Set Ditjen Kuathan Kemhan

Dokumen ini adalah spesifikasi teknis untuk AI Agent guna mengimplementasikan sistem **Role-Based Access Control (RBAC)** menggunakan `spatie/laravel-permission`, penyesuaian struktur tabel `users`, serta pembuatan `RolePermissionSeeder` dan `UserSeeder` berdasarkan struktur organisasi asli.

---

## 1. Hierarki Organisasi & Pembagian Subbagian (Divisi)

Struktur organisasi dipimpin oleh **Kabag Datin** dan membawahi **3 Subbagian (Subbag)**:
1. **`PIMPINAN`**: Kepala Bagian Data dan Informasi (Kabag Datin) — Akses pantau seluruh subbagian.
2. **`LAHTA`**: Subbagian Pengolahan Data (Kasubbag Lahta beserta staf).
3. **`SIMAK_BMN`**: Subbagian Sistem Informasi Manajemen dan Akuntansi Barang Milik Negara (Kasubbag Simak BMN beserta staf).
4. **`DOKSIPTAKA`**: Subbagian Dokumentasi, Arsip, dan Perpustakaan (Kasubbag Doksiptaka beserta staf — Unit inti pengelola arsip).

---

## 2. Daftar Role (`roles`) & Hak Akses (`permissions`)

Implementasikan role berikut ke dalam sistem menggunakan Spatie Permission:

| Nama Role (Slug) | Label Jabatan / Peran | Pemegang Role Utama | Level Akses & Tanggung Jawab di SI_ARSIP |
| :--- | :--- | :--- | :--- |
| `super_admin` | Administrator Utama Arsip & Sistem | **Shafa T.P., A.Md.A.Pkt.** (Penata Kelola Sistem & TI Doksiptaka) & Developer | **FULL AKSES MUTLAK (Bypass / All Permissions).** Mengelola seluruh arsip lintas subbagian, konfigurasi tahun arsip (`archive_years`), sinkronisasi & folder Google Drive, manajemen user & role, approval berkas, serta penghapusan arsip. |
| `kabag_datin` | Kabag Datin | Kolonel Laut (K) Inggil K. | Pimpinan tertinggi Bagdatin. Akses *read/view/download* seluruh arsip di semua Subbagian, *approval* tingkat akhir, & dashboard statistik eksekutif. |
| `kasubbag` | Kepala Subbagian | Kasubbag Lahta, Simak BMN, & Doksiptaka | Pimpinan tingkat Subbagian. Mengelola, memverifikasi (`approve/reject`), melihat, dan mengunggah arsip di subbagiannya (Khusus Kasubbag Doksiptaka dapat melihat seluruh arsip lintas subbagian). |
| `penelaah_kebijakan` | Penelaah Teknis Kebijakan | Staf Senior Penelaah Kebijakan | Pemeriksa dokumen/kebijakan. Bisa mengunggah, mengedit, meninjau (*review*) draf arsip, dan melihat arsip di subbagiannya. |
| `pengolah_data` | Pengolah Data & Informasi | Staf Pengolah Data & TI Subbagian | Operator arsip subbagian. Fokus pada *input*, *upload* dokumen (`pending_uploads`), pembaruan metadata arsip, dan pengelolaan berkas harian di subbagiannya. |
| `operasional` | Penata & Pengolah Layanan Operasional / Teknisi | Staf Layanan Operasional & Teknisi Sarpras | Staf pendukung operasional. Akses *view/download* arsip operasional dan *upload* dokumen laporan teknis/sarpras/operasional. |

### Daftar Permissions (`permissions`):
- **System & User Management (Khusus `super_admin`):**
  - `manage_users` (Tambah, edit, hapus, reset password user)
  - `manage_roles` (Atur role dan permission)
  - `manage_settings` (Pengaturan sistem & konfigurasi umum)
- **Master Arsip & Google Drive (Khusus `super_admin` & `kasubbag` Doksiptaka):**
  - `manage_archive_years` (Buka/tutup tahun arsip di tabel `archive_years`)
  - `manage_gdrive_folders` (Kelola struktur folder & sinkronisasi Google Drive)
- **Operasional Arsip:**
  - `view_all_archives` (Lihat arsip semua subbagian: `super_admin`, `kabag_datin`, dan `kasubbag` Doksiptaka)
  - `view_subbag_archives` (Lihat arsip subbagian sendiri)
  - `create_archive` (Upload arsip baru / masuk ke `pending_uploads`)
  - `edit_archive` (Edit metadata arsip)
  - `delete_archive` (Hapus arsip)
  - `approve_archive` (Verifikasi/setujui arsip yang diunggah)
  - `download_archive` (Unduh dokumen arsip dari sistem/Google Drive)

> **Catatan Penting untuk AI Agent:** Gunakan `Gate::before` di `AppServiceProvider` agar role `super_admin` (Shafa) selalu me-return `true` untuk seluruh pengecekan permission tanpa terkecuali.

---

## 3. Penyesuaian Skema Tabel `users`

Buat migration baru untuk menambahkan atribut kepegawaian Kemhan pada tabel `users` (jika belum ada):
- `nrp_nip` (string, nullable, unique): NRP (TNI) atau NIP (PNS/CPNS) — bisa digunakan untuk login selain email.
- `rank_grade` (string, nullable): Pangkat / Golongan (contoh: `CPNS Pengatur II/c`, `Kolonel Laut (K)`).
- `position_title` (string, nullable): Nama jabatan lengkap sesuai struktur organisasi.
- `subbagian` (string, nullable): `PIMPINAN`, `LAHTA`, `SIMAK_BMN`, `DOKSIPTAKA`.
- `is_active` (boolean, default: `true`): Status aktif personel.

---

## 4. Data Master Personel untuk `UserSeeder`

Buat seeder yang meng-input data asli personel Bagdatin berikut (gunakan password default: `Kemhan2026!` atau `password`):

### A. Pimpinan Bagian (`PIMPINAN`)
1. **Inggil K., S.Kep., Ners., M.Tr. Hanla., M.Tr. (Han)., M.M.**
   - **Jabatan:** Kabag Datin
   - **Pangkat/Gol:** Kolonel Laut (K)
   - **NRP/NIP:** `13571/P`
   - **Email:** `inggil.kabag@kemhan.go.id`
   - **Subbagian:** `PIMPINAN`
   - **Role:** `kabag_datin`

---

### B. Subbagian Dokumentasi, Arsip, dan Perpustakaan (`DOKSIPTAKA`) — *Unit Inti Kearsipan*
1. **Shafa T.P., A.Md.A.Pkt.** ⭐ *(Pengelola Utama Sistem Arsip)*
   - **Jabatan:** Penata Kelola Sistem & Teknologi Informasi
   - **Pangkat/Gol:** CPNS Pengatur II/c
   - **NRP/NIP:** `200007312025062003`
   - **Email:** `shafa@kemhan.go.id`
   - **Subbagian:** `DOKSIPTAKA`
   - **Role:** `super_admin` (Akses Penuh Seluruh Sistem & Arsip)
2. **Hartini, S.E., M.Si.**
   - **Jabatan:** Kasubbag Doksiptaka
   - **Pangkat/Gol:** Pembina IV/a
   - **NRP/NIP:** `197701152005012011`
   - **Email:** `hartini@kemhan.go.id`
   - **Subbagian:** `DOKSIPTAKA`
   - **Role:** `kasubbag` (Diberikan tambahan direct permission: `view_all_archives`, `manage_archive_years`)
3. **Arwinsyah**
   - **Jabatan:** Pengolah Data & Informasi
   - **Pangkat/Gol:** Kapten Inf
   - **NRP/NIP:** `21010263630679`
   - **Email:** `arwinsyah@kemhan.go.id`
   - **Subbagian:** `DOKSIPTAKA`
   - **Role:** `pengolah_data`

---

### C. Subbagian Pengolahan Data (`LAHTA`)
1. **Mirza, S.E., M.M., M.Han.**
   - **Jabatan:** Kasubbag Lahta
   - **Pangkat/Gol:** Letkol Laut (P)
   - **NRP/NIP:** `14914/P`
   - **Email:** `mirza@kemhan.go.id`
   - **Subbagian:** `LAHTA`
   - **Role:** `kasubbag`
2. **Tihana, S.Sos.**
   - **Jabatan:** Penelaah Teknis Kebijakan
   - **Pangkat/Gol:** Penata Tk. I III/d
   - **NRP/NIP:** `196905211696032001`
   - **Email:** `tihana@kemhan.go.id`
   - **Subbagian:** `LAHTA`
   - **Role:** `penelaah_kebijakan`
3. **Heru Suliyanto**
   - **Jabatan:** Pengolah Data & Informasi
   - **Pangkat/Gol:** Penda Tk. I III/b
   - **NRP/NIP:** `197004251990031002`
   - **Email:** `heru.suliyanto@kemhan.go.id`
   - **Subbagian:** `LAHTA`
   - **Role:** `pengolah_data`
4. **Priyanto**
   - **Jabatan:** Penata Kelola Sistem & Teknologi Informasi
   - **Pangkat/Gol:** Lettu Cke
   - **NRP/NIP:** `21040172780682`
   - **Email:** `priyanto@kemhan.go.id`
   - **Subbagian:** `LAHTA`
   - **Role:** `pengolah_data`
5. **Agung Nugroho**
   - **Jabatan:** Pengolah Layanan Operasional
   - **Pangkat/Gol:** Serka
   - **NRP/NIP:** `31020891780283`
   - **Email:** `agung.nugroho@kemhan.go.id`
   - **Subbagian:** `LAHTA`
   - **Role:** `operasional`

---

### D. Subbagian SIMAK BMN (`SIMAK_BMN`)
1. **Riana Dewi Mariana, S.Pd., M.Si.**
   - **Jabatan:** Kasubbag Simak BMN
   - **Pangkat/Gol:** Letkol Laut (KH/W)
   - **NRP/NIP:** `15200/P`
   - **Email:** `riana.dewi@kemhan.go.id`
   - **Subbagian:** `SIMAK_BMN`
   - **Role:** `kasubbag`
2. **Bestly**
   - **Jabatan:** Penelaah Teknis Kebijakan
   - **Pangkat/Gol:** Mayor Cpn
   - **NRP/NIP:** `11070047390981`
   - **Email:** `bestly@kemhan.go.id`
   - **Subbagian:** `SIMAK_BMN`
   - **Role:** `penelaah_kebijakan`
3. **Suhono**
   - **Jabatan:** Pengolah Data & Informasi
   - **Pangkat/Gol:** Penda Tk. I III/b
   - **NRP/NIP:** `196802111991031001`
   - **Email:** `suhono@kemhan.go.id`
   - **Subbagian:** `SIMAK_BMN`
   - **Role:** `pengolah_data`
4. **Cecep U.A.A., S.AP.**
   - **Jabatan:** Pengolah Data & Informasi
   - **Pangkat/Gol:** Penda Tk. I III/b
   - **NRP/NIP:** `198302262010121002`
   - **Email:** `cecep@kemhan.go.id`
   - **Subbagian:** `SIMAK_BMN`
   - **Role:** `pengolah_data`
5. **Deni Priyandani**
   - **Jabatan:** Penata Layanan Operasional
   - **Pangkat/Gol:** Letda Lek
   - **NRP/NIP:** `535176`
   - **Email:** `deni.priyandani@kemhan.go.id`
   - **Subbagian:** `SIMAK_BMN`
   - **Role:** `operasional`

---

## 5. Instruksi Tugas untuk AI Agent
1. **Migration:** Buat migration penambahan kolom `nrp_nip`, `rank_grade`, `position_title`, `subbagian`, dan `is_active` pada tabel `users`, serta tambahkan ke `$fillable` di model `User`.
2. **Gate Super Admin:** Tambahkan `Gate::before` pada `AppServiceProvider::boot()` agar user dengan role `super_admin` (Shafa) mendapatkan akses penuh ke seluruh fitur secara otomatis.
3. **Seeder:** Buat `BagdatinRoleUserSeeder` (dan panggil di `DatabaseSeeder`) yang otomatis membuat seluruh Role, Permission, dan ke-14 akun personel aktif di atas menggunakan `updateOrCreate` berdasarkan `nrp_nip` atau `email`.
4. **Login NRP/NIP atau Email:** Sesuaikan halaman/logic autentikasi agar personel dapat login menggunakan **Email** maupun **NRP/NIP** mereka.
5. **Inertia Shared Data:** Pastikan `HandleInertiaRequests` mengirimkan data `roles`, `permissions`, `subbagian`, `rank_grade`, dan `position_title` pada objek `auth.user` ke frontend React.
6.
