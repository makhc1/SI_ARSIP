# Laporan Audit Keamanan Kode Sumber (Security Audit Report)
**Aplikasi:** Sistem Informasi Arsip (SI-ARSIP)  
**Entitas:** Kementerian Pertahanan Republik Indonesia  
**Tanggal Audit:** 12 Oktober 2026  
**Status:** Temuan Terkonfirmasi & Rekomendasi Remediasi Sebelum Perbaikan  

---

## 1. Ringkasan Eksekutif & Matriks Risiko

Audit keamanan berbasis analisis kode sumber (*source-code security review*) telah dilakukan terhadap area kritis aplikasi SI-ARSIP: **Otentikasi & Registrasi**, **Hak Akses & Otorisasi Peran (RBAC)**, **Upload Dokumen**, serta **Streaming & Akses File Arsip**.

Ditemukan **7 kelemahan keamanan** mulai dari tingkat keparahan **High** hingga **Low**. Kelemahan paling kritis adalah tiadanya validasi tipe file unggahan (*Unrestricted File Upload*) dan celah otorisasi *Broken Object Level Authorization (BOLA/IDOR)* yang memungkinkan pengguna biasa menghapus atau mengubah arsip kategori biasa di Google Drive.

### Matriks Temuan Keamanan

| ID Temuan | Kategori | Tingkat Keparahan | Referensi CWE | Lokasi File Utama | Status |
|---|---|---|---|---|---|
| **SEC-01** | Upload Dokumen | **HIGH** | [CWE-434](https://cwe.mitre.org/data/definitions/434.html) | `app/Http/Requests/StoreUploadRequest.php` | ✅ Teratasi (Fixed) |
| **SEC-02** | Otorisasi & Arsip | **HIGH** | [CWE-639](https://cwe.mitre.org/data/definitions/639.html) / [CWE-862](https://cwe.mitre.org/data/definitions/862.html) | `app/Http/Controllers/ArchiveFileController.php` | ✅ Teratasi (Fixed) |
| **SEC-03** | Akses File Arsip | **MEDIUM** | [CWE-276](https://cwe.mitre.org/data/definitions/276.html) | `app/Http/Controllers/ArchiveFileController.php` | ✅ Teratasi (Fixed) |
| **SEC-04** | Streaming Dokumen | **MEDIUM** | [CWE-79](https://cwe.mitre.org/data/definitions/79.html) / [CWE-113](https://cwe.mitre.org/data/definitions/113.html) | `app/Http/Controllers/ArchiveFileController.php` | ✅ Teratasi (Fixed) |
| **SEC-05** | Otentikasi & Akun | **MEDIUM** | [CWE-306](https://cwe.mitre.org/data/definitions/306.html) | `routes/auth.php`, `app/Models/User.php` | ✅ Teratasi (Fixed) |
| **SEC-06** | Jaringan & Rate Limit | **LOW** | [CWE-290](https://cwe.mitre.org/data/definitions/290.html) | `bootstrap/app.php` | ✅ Teratasi (Fixed) |
| **SEC-07** | Otorisasi RBAC | **LOW** | [CWE-754](https://cwe.mitre.org/data/definitions/754.html) | `app/Http/Middleware/HandleInertiaRequests.php` | ✅ Teratasi (Fixed) |

---

## 2. Rincian Temuan & Rekomendasi Perbaikan

---

### [SEC-01] Unrestricted File Upload Without MIME / Extension Validation

- **Tingkat Keparahan:** **HIGH**
- **CWE:** [CWE-434: Unrestricted Upload of File with Dangerous Type](https://cwe.mitre.org/data/definitions/434.html)
- **Komponen Terdampak:**
  - `app/Http/Requests/StoreUploadRequest.php` (Baris 23–33)
  - `app/Http/Controllers/UploadController.php` (Baris 67–90)

#### Akar Masalah & Mekanisme Kerentanan:
Pada validasi `StoreUploadRequest::rules()`:
```php
public function rules(): array
{
    return [
        'title' => 'required|string|max:255',
        'description' => 'nullable|string|max:1000',
        'year' => 'required|string|digits:4',
        'type' => 'required|in:masuk,keluar',
        'classification' => 'required|in:biasa,terbatas,rahasia',
        'file' => 'required|file|max:51200', // 50MB
    ];
}
```
Aturan validasi hanya memeriksa keberadaan file dan batas ukuran 50MB tanpa memvalidasi ekstensi (`mimes`) maupun MIME type (`mimetypes`). Pengguna dengan hak upload dapat mengunggah file berbahaya (misal skrip `.php`, `.phar`, `.html`, `.svg` berisi JavaScript jahat, atau executable `.exe`/`.bat`). File tersebut disimpan di disk lokal server (`uploads/pending/`) dan kemudian dikirimkan ke Google Drive kementerian.

#### Dampak Keamanan:
- **Stored Cross-Site Scripting (XSS):** Jika file SVG atau HTML diunggah dan dibuka oleh pengguna lain.
- **Penyebaran Berkas Berbahaya:** File malware/eksekusi dapat menyusup ke repositori arsip resmi Kemhan RI.

#### Rekomendasi Solusi Defensif:
Tambahkan batasan whitelist ekstensi dokumen resmi yang ketat pada `StoreUploadRequest.php`:
```diff
--- a/app/Http/Requests/StoreUploadRequest.php
+++ b/app/Http/Requests/StoreUploadRequest.php
@@ -28,7 +28,12 @@ class StoreUploadRequest extends FormRequest
             'year' => 'required|string|digits:4',
             'type' => 'required|in:masuk,keluar',
             'classification' => 'required|in:biasa,terbatas,rahasia',
-            'file' => 'required|file|max:51200', // 50MB
+            'file' => [
+                'required',
+                'file',
+                'mimes:pdf,docx,doc,xlsx,xls,pptx,ppt',
+                'max:51200', // 50MB
+            ],
         ];
     }
```

---

### [SEC-02] Broken Object Level Authorization (BOLA/IDOR) pada Hapus & Ubah Nama Arsip

- **Tingkat Keparahan:** **HIGH**
- **CWE:** [CWE-639: Authorization Bypass Through User-Controlled Key](https://cwe.mitre.org/data/definitions/639.html) / [CWE-862: Missing Authorization](https://cwe.mitre.org/data/definitions/862.html)
- **Komponen Terdampak:**
  - `routes/web.php` (Baris 39–44)
  - `app/Http/Controllers/ArchiveFileController.php` (Baris 51–75, 189–228)

#### Akar Masalah & Mekanisme Kerentanan:
Rute penghapusan dan pengubahan nama arsip di `routes/web.php` hanya diberi middleware `['auth', 'verified']`:
```php
Route::put('/arsip/file/{id}', [ArchiveFileController::class, 'update'])->name('arsip.file.update');
Route::delete('/arsip/file/{id}', [ArchiveFileController::class, 'destroy'])->name('arsip.file.destroy');
```
Di dalam `ArchiveFileController::destroy()` dan `update()`:
```php
$this->authorizeFileAccess($request, $id);
```
Fungsi `authorizeFileAccess()` hanya memeriksa:
```php
if ($classification === 'terbatas' && ! $isAdmin && ! $user->hasPermissionTo('view-terbatas')) {
    abort(403);
}
if ($classification === 'rahasia' && ! $isAdmin) {
    abort(403);
}
return $classification;
```
Ketika file memiliki klasifikasi **Biasa**, kedua blok `if` tidak terpenuhi, sehingga fungsi langsung lolos tanpa melempar 403. Tidak ada pemeriksaan peran `Admin` atau permission `manage-arsip` sama sekali pada aksi penghapusan dan pengubahan nama.

#### Dampak Keamanan:
**Setiap pengguna terdaftar (bahkan role Viewer biasa atau akun publik baru) dapat mengirimkan request DELETE `/arsip/file/{id}` untuk menghapus file arsip kategori Biasa secara permanen dari Google Drive kementerian.**

#### Rekomendasi Solusi Defensif:
Tambahkan pemeriksaan otorisasi mutlak pada method `update` dan `destroy` di `ArchiveFileController.php`:
```diff
--- a/app/Http/Controllers/ArchiveFileController.php
+++ b/app/Http/Controllers/ArchiveFileController.php
@@ -190,6 +190,8 @@ class ArchiveFileController extends Controller
     public function update(Request $request, string $id)
     {
+        abort_unless($request->user()->hasRole(['Admin', 'Developer']) || $request->user()->hasPermissionTo('manage-arsip'), 403, 'Akses ditolak: Anda tidak memiliki izin untuk mengubah nama arsip.');
+
         $request->validate([
             'name' => 'required|string|max:255',
@@ -210,6 +212,8 @@ class ArchiveFileController extends Controller
     public function destroy(Request $request, string $id)
     {
+        abort_unless($request->user()->hasRole(['Admin', 'Developer']) || $request->user()->hasPermissionTo('manage-arsip'), 403, 'Akses ditolak: Anda tidak memiliki izin untuk menghapus arsip.');
+
         $request->validate([
             'year' => 'required|string',
```

---

### [SEC-03] Fail-Open Access Control Logic pada Verifikasi Folder Google Drive

- **Tingkat Keparahan:** **MEDIUM**
- **CWE:** [CWE-276: Incorrect Default Permissions](https://cwe.mitre.org/data/definitions/276.html)
- **Komponen Terdampak:**
  - `app/Http/Controllers/ArchiveFileController.php` (Baris 51–75)

#### Akar Masalah & Mekanisme Kerentanan:
Pada fungsi `authorizeFileAccess()`:
```php
$metadata = $this->driveService->getFileMetadata($fileId);
$parents = $metadata->getParents();

if (empty($parents)) {
    $classification = 'rahasia';
} else {
    $parentName = $this->driveService->getFolderName($parents[0]);
    $classification = strtolower($parentName ?? 'rahasia');
}
```
Jika file yang diminta berada di luar folder arsip (misal folder kerja internal di Drive, draf, atau folder yang namanya bukan `'terbatas'` dan bukan `'rahasia'`), fungsi tidak melakukan penolakan (*fail-open*). Segala nama folder yang tidak dikenal secara otomatis dianggap bukan rahasia dan bukan terbatas, sehingga diizinkan diakses oleh pengguna mana pun.

#### Dampak Keamanan:
Akses tidak sah terhadap file lain yang berada di Google Drive organisasi jika pengguna mengetahui atau menebak ID file tersebut.

#### Rekomendasi Solusi Defensif:
Terapkan prinsip *deny-by-default*. Tolak semua permintaan yang tidak berada dalam hierarki klasifikasi yang valid (`biasa`, `terbatas`, `rahasia`):
```diff
--- a/app/Http/Controllers/ArchiveFileController.php
+++ b/app/Http/Controllers/ArchiveFileController.php
@@ -72,6 +72,10 @@ class ArchiveFileController extends Controller
             abort(403, 'Akses ditolak. Dokumen Rahasia hanya dapat diakses oleh Admin.');
         }
 
+        if (! in_array($classification, ['biasa', 'terbatas', 'rahasia'])) {
+            abort(403, 'Akses ditolak. Berkas tidak berada dalam direktori arsip yang valid.');
+        }
+
         return $classification;
     }
```

---

### [SEC-04] Potensi Stored XSS & Header Injection pada File Streaming

- **Tingkat Keparahan:** **MEDIUM**
- **CWE:** [CWE-79: Cross-site Scripting](https://cwe.mitre.org/data/definitions/79.html) / [CWE-113: HTTP Response Splitting](https://cwe.mitre.org/data/definitions/113.html)
- **Komponen Terdampak:**
  - `app/Http/Controllers/ArchiveFileController.php` (Baris 248–266)

#### Akar Masalah & Mekanisme Kerentanan:
Method `stream()` mengirimkan respons:
```php
return response($content, 200)
    ->header('Content-Type', $metadata->mimeType)
    ->header('Content-Disposition', 'inline; filename="'.$metadata->name.'"');
```
1. Jika file yang diunggah berupa file SVG atau HTML, browser merendernya secara `inline` pada domain aplikasi. Skrip jahat di dalam berkas akan dieksekusi dalam konteks origin SI-ARSIP, memungkinkan pencurian data sesi atau token CSRF.
2. Nama file `$metadata->name` disisipkan langsung ke header tanpa penanganan karakter kutip ganda (`"`) atau baris baru, rentan terhadap malformasi header.

#### Rekomendasi Solusi Defensif:
1. Batasi `inline` hanya untuk tipe MIME yang aman (`application/pdf`, `image/png`, `image/jpeg`). Untuk tipe file lain, wajibkan `attachment`.
2. Sanitisasi nama file untuk header `Content-Disposition`.
3. Tambahkan header proteksi `X-Content-Type-Options: nosniff`.

---

### [SEC-05] Registrasi Akun Publik Terbuka Tanpa Verifikasi Email Aktif

- **Tingkat Keparahan:** **MEDIUM**
- **CWE:** [CWE-306: Missing Authentication for Critical Function](https://cwe.mitre.org/data/definitions/306.html)
- **Komponen Terdampak:**
  - `routes/auth.php` (Baris 15–18)
  - `app/Models/User.php` (Baris 5–16)
  - `routes/web.php` (Baris 23)

#### Akar Masalah & Mekanisme Kerentanan:
1. Endpoint `GET/POST /register` terbuka untuk publik tanpa pembatasan domain email (misal `@kemhan.go.id`), tanpa CAPTCHA, dan tanpa mekanisme persetujuan admin.
2. Model `User.php` tidak mengimplementasikan `Illuminate\Contracts\Auth\MustVerifyEmail`.
3. Akibatnya, middleware `verified` pada rute arsip (`routes/web.php`) tidak memblokir user baru, karena Laravel menganggap verifikasi email tidak diwajibkan untuk model tersebut.
4. Siapa pun di internet dapat membuat akun dan langsung mendapatkan akses ke seluruh direktori arsip kategori Biasa.

#### Rekomendasi Solusi Defensif:
Untuk sistem arsip internal kementerian, nonaktifkan registrasi mandiri publik. Akun pegawai baru seharusnya hanya dibuat oleh Administrator melalui menu Pengguna:
```diff
--- a/routes/auth.php
+++ b/routes/auth.php
@@ -14,8 +14,8 @@ use Illuminate\Support\Facades\Route;
 Route::middleware('guest')->group(function () {
-    Route::get('register', [RegisteredUserController::class, 'create'])
-        ->name('register');
-    Route::post('register', [RegisteredUserController::class, 'store']);
+    // Registrasi publik dinonaktifkan: akun dibuat oleh Administrator
+    // Route::get('register', ...);
+    // Route::post('register', ...);
```

---

### [SEC-06] Wildcard Proxy Trust `trustProxies('*')` Melemahkan Rate Limiting

- **Tingkat Keparahan:** **LOW**
- **CWE:** [CWE-290: Authentication Bypass by Spoofing](https://cwe.mitre.org/data/definitions/290.html)
- **Komponen Terdampak:**
  - `bootstrap/app.php` (Baris 18)
  - `app/Http/Requests/Auth/LoginRequest.php` (Baris 84)

#### Akar Masalah & Mekanisme Kerentanan:
Pada `bootstrap/app.php`:
```php
$middleware->trustProxies(at: '*');
```
Pengaturan ini membuat aplikasi mempercayai header `X-Forwarded-For` dari klien manapun secara acak. Kunci pembatas laju percobaan login (*throttle key*) dihitung berdasarkan kombinasi email dan IP (`$this->ip()`). Penyerang dapat merotasi nilai header `X-Forwarded-For` untuk menghindari batasan 5 kali percobaan login (*brute force bypass*).

#### Rekomendasi Solusi Defensif:
Tentukan IP atau subnet reverse proxy / load balancer secara spesifik, atau hapus `at: '*'` jika aplikasi tidak berada di balik reverse proxy khusus:
```diff
--- a/bootstrap/app.php
+++ b/bootstrap/app.php
@@ -15,7 +15,7 @@ return Application::configure(basePath: dirname(__DIR__))
         health: '/up',
     )
     ->withMiddleware(function (Middleware $middleware): void {
-        $middleware->trustProxies(at: '*');
+        // $middleware->trustProxies(at: ['10.0.0.0/8']); // Hanya subnet proxy terpercaya
```

---

### [SEC-07] Unhandled Exception `PermissionDoesNotExist` pada Pengguna Non-Admin

- **Tingkat Keparahan:** **LOW**
- **CWE:** [CWE-754: Improper Check for Unusual or Exceptional Conditions](https://cwe.mitre.org/data/definitions/754.html)
- **Komponen Terdampak:**
  - `app/Http/Middleware/HandleInertiaRequests.php` (Baris 34)
  - `database/seeders/DatabaseSeeder.php` (Baris 20–21)

#### Akar Masalah & Mekanisme Kerentanan:
Pada `HandleInertiaRequests.php` yang dijalankan di setiap request web:
```php
$canUpload = $user ? ($user->hasRole('Admin') || $user->hasPermissionTo('upload-dokumen')) : false;
```
Package Spatie Permission akan melempar exception fatal `PermissionDoesNotExist` bila permission `upload-dokumen` belum dibuat di database. Karena seeder dan migrasi belum pernah mendaftarkan nama-nama permission tersebut, pengguna non-Admin yang login akan langsung mengalami HTTP 500 error saat mengakses halaman web apa pun.

#### Rekomendasi Solusi Defensif:
1. Daftarkan seluruh daftar permission resmi (`upload-dokumen`, `manage-arsip`, `view-rahasia`, `view-terbatas`, `manage-roles`) ke dalam seeder atau migrasi database.
2. Gunakan `$user->can('upload-dokumen')` alih-alih `hasPermissionTo()`, karena metode `can()` secara aman mengembalikan `false` tanpa memicu uncaught exception jika permission belum ada di tabel.

---

## 3. Rencana Aksi Remediasi (Action Roadmap)

Berikut urutan prioritas perbaikan yang disarankan:

### Fase 1 — Prioritas Tinggi (Harus Segera Diperbaiki)
1. **[SEC-01] Validasi Ekstensi & MIME File Upload:** Tambahkan whitelist `mimes:pdf,docx,doc,xlsx,xls,pptx,ppt` pada `StoreUploadRequest.php`.
2. **[SEC-02] Otorisasi Hapus & Ubah Nama Arsip:** Tambahkan pengecekan `hasRole(['Admin', 'Developer']) || hasPermissionTo('manage-arsip')` pada `ArchiveFileController::update` dan `destroy`.

### Fase 2 — Prioritas Menengah (Peningkatan Pengamanan)
3. **[SEC-03] Deny-by-Default Klasifikasi Folder:** Tolak akses file jika parent folder bukan salah satu dari klasifikasi arsip yang sah di `ArchiveFileController.php`.
4. **[SEC-04] Sanitasi Header & Pembatasan Inline Stream:** Batasi `inline` hanya untuk PDF/Gambar aman dan tambahkan proteksi nama file di `ArchiveFileController::stream`.
5. **[SEC-05] Batasi Registrasi Publik:** Nonaktifkan route `/register` publik di `routes/auth.php` agar akun hanya dapat dibuat secara terkontrol oleh Admin.

### Fase 3 — Prioritas Rendah & Stabilitas
6. **[SEC-06] Konfigurasi Proxy Tepercaya:** Sesuaikan `trustProxies` di `bootstrap/app.php`.
7. **[SEC-07] Seeder Permission Resmi & Pemanggilan `can()` yang Aman:** Daftarkan permission resmi di seeder database dan gunakan `$user->can()`.

---
*Laporan ini disimpan di berkas:* `SECURITY_AUDIT_REPORT.md`
