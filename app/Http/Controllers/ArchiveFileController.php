<?php

namespace App\Http\Controllers;

use App\Enums\DocumentClassification;
use App\Models\ArchiveYear;
use App\Services\GoogleDriveService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Inertia\Inertia;
use Symfony\Component\HttpKernel\Exception\HttpException;

class ArchiveFileController extends Controller
{
    protected GoogleDriveService $driveService;

    public function __construct(GoogleDriveService $driveService)
    {
        $this->driveService = $driveService;
    }

    public function classificationSelection(Request $request, string $year, string $type)
    {
        $archiveYear = ArchiveYear::where('year', $year)->first();

        if (! $archiveYear) {
            return Inertia::render('Arsip/NotFound', [
                'message' => "Direktori arsip untuk tahun {$year} belum tersedia di dalam sistem.",
            ]);
        }

        $type = strtolower($type);
        if (! in_array($type, ['masuk', 'keluar'])) {
            return Inertia::render('Arsip/NotFound', [
                'message' => 'Kategori arsip yang Anda minta tidak valid (Pilih Surat Masuk atau Surat Keluar).',
            ]);
        }

        $user = $request->user();
        $isAdmin = $user->hasRole('Admin') || $user->hasPermissionTo('manage-arsip') || $user->hasPermissionTo('view-rahasia');
        $canViewTerbatas = $user->hasRole('Admin') || $user->hasPermissionTo('view-terbatas');

        return Inertia::render('Arsip/Year', [
            'archiveYear' => $archiveYear,
            'type' => $type,
            'typeLabel' => $type === 'masuk' ? 'Surat Masuk' : 'Surat Keluar',
            'userIsAdmin' => $isAdmin,
            'userCanViewTerbatas' => $canViewTerbatas,
        ]);
    }

    protected function authorizeFileAccess(Request $request, string $fileId): string
    {
        $metadata = $this->driveService->getFileMetadata($fileId);
        $parents = $metadata->getParents();

        if (empty($parents)) {
            $classification = 'rahasia';
        } else {
            $parentName = $this->driveService->getFolderName($parents[0]);
            $classification = strtolower($parentName ?? 'rahasia');
        }

        $user = $request->user();
        $isAdmin = $user->hasRole(['Admin', 'Developer']) || $user->can('manage-arsip') || $user->can('view-rahasia');

        if (! in_array($classification, ['biasa', 'terbatas', 'rahasia'], true)) {
            abort(403, 'Akses ditolak. Berkas tidak berada dalam direktori klasifikasi arsip yang valid.');
        }

        if ($classification === 'terbatas' && ! $isAdmin && ! $user->can('view-terbatas')) {
            abort(403, 'Akses ditolak. Anda tidak memiliki izin untuk mengakses dokumen klasifikasi Terbatas.');
        }

        if ($classification === 'rahasia' && ! $isAdmin) {
            abort(403, 'Akses ditolak. Dokumen Rahasia hanya dapat diakses oleh Admin.');
        }

        return $classification;
    }

    public function index(Request $request, string $year, string $type, string $classification)
    {
        $archiveYear = ArchiveYear::where('year', $year)->first();

        if (! $archiveYear) {
            return Inertia::render('Arsip/NotFound', [
                'message' => "Direktori arsip untuk tahun {$year} belum tersedia di dalam sistem.",
            ]);
        }

        $type = strtolower($type);
        if (! in_array($type, ['masuk', 'keluar'])) {
            return Inertia::render('Arsip/NotFound', [
                'message' => 'Kategori arsip yang Anda minta tidak valid (Pilih Surat Masuk atau Surat Keluar).',
            ]);
        }

        $classification = strtolower($classification);
        $enumClass = DocumentClassification::tryFrom($classification);
        if (! $enumClass) {
            return Inertia::render('Arsip/NotFound', [
                'message' => 'Klasifikasi dokumen tidak valid.',
            ]);
        }

        // Access Control
        $user = $request->user();
        $isAdmin = $user->hasRole(['Admin', 'Developer']) || $user->can('manage-arsip') || $user->can('view-rahasia');

        if ($classification === 'terbatas' && ! $isAdmin && ! $user->can('view-terbatas')) {
            return redirect()->route('arsip.year', ['year' => $year])
                ->with('error', 'Akses ditolak. Anda tidak memiliki izin untuk melihat dokumen klasifikasi Terbatas.');
        }

        if ($classification === 'rahasia' && ! $isAdmin) {
            return redirect()->route('arsip.year', ['year' => $year])
                ->with('error', 'Akses ditolak. Dokumen Rahasia hanya dapat diakses oleh Admin.');
        }

        $typeLabel = $type === 'masuk' ? 'Surat Masuk' : 'Surat Keluar';
        $classificationLabel = $enumClass->label();

        $files = [];
        $error_message = null;

        // If credentials exist, fetch from Google Drive. Otherwise, return mock data.
        if (file_exists(storage_path('app/credentials/credentials.json'))) {
            try {
                $cacheKey = "gdrive_files_{$archiveYear->id}_{$typeLabel}_{$classification}";

                $result = Cache::remember($cacheKey, 300, function () use ($archiveYear, $typeLabel, $classificationLabel, $year) {

                    // 1. Find type folder (Surat Masuk / Surat Keluar)
                    $typeFolderId = $this->driveService->getSubfolderIdByName($archiveYear->gdrive_folder_id, $typeLabel);

                    if (! $typeFolderId) {
                        return [
                            'files' => [],
                            'error' => "Folder '{$typeLabel}' tidak ditemukan di dalam Google Drive T.A. {$year}.",
                        ];
                    }

                    // 2. Find classification folder (Biasa / Terbatas / Rahasia)
                    $classFolderId = $this->driveService->getSubfolderIdByName($typeFolderId, ucfirst(strtolower($classificationLabel)));

                    if ($classFolderId) {
                        return [
                            'files' => array_values($this->driveService->getFilesInFolder($classFolderId)),
                            'error' => null,
                        ];
                    } else {
                        return [
                            'files' => [],
                            'error' => "Folder klasifikasi '{$classificationLabel}' tidak ditemukan di dalam '{$typeLabel}'.",
                        ];
                    }
                });

                $files = $result['files'];
                $error_message = $result['error'];
            } catch (\Exception $e) {
                $error_message = 'Gagal mengambil data dari Google Drive. Error: '.$e->getMessage();
            }
        } else {
            // Dummy Data
            $files = [
                [
                    'id' => 'dummy-1',
                    'name' => "{$typeLabel} - {$classificationLabel} - 001.pdf",
                    'mimeType' => 'application/pdf',
                    'size' => 1024500,
                    'createdTime' => now()->subDays(2)->toIso8601String(),
                    'webViewLink' => '#',
                ],
            ];
        }

        return Inertia::render('Arsip/Show', [
            'archiveYear' => $archiveYear,
            'type' => $type,
            'typeLabel' => $typeLabel,
            'classification' => [
                'value' => $enumClass->value,
                'label' => $enumClass->label(),
                'color' => $enumClass->color(),
            ],
            'userIsAdmin' => $isAdmin,
            'files' => $files,
            'errorMessage' => $error_message,
        ]);
    }

    public function update(Request $request, string $id)
    {
        abort_unless($request->user()->hasRole(['Admin', 'Developer']) || $request->user()->can('manage-arsip'), 403, 'Akses ditolak. Anda tidak memiliki izin untuk mengubah nama arsip.');

        $request->validate([
            'name' => 'required|string|max:255',
            'year' => 'required|string',
            'type' => 'required|string|in:masuk,keluar',
            'classification' => 'required|string|in:biasa,terbatas,rahasia',
        ]);

        $this->authorizeFileAccess($request, $id);

        try {
            $this->driveService->renameFile($id, $request->name);
            $this->clearCacheForFolder($request->year, $request->type, $request->classification);

            return back()->with('success', 'Nama arsip berhasil diubah.');
        } catch (\Exception $e) {
            return back()->with('error', 'Gagal mengubah nama arsip: '.$e->getMessage());
        }
    }

    public function destroy(Request $request, string $id)
    {
        abort_unless($request->user()->hasRole(['Admin', 'Developer']) || $request->user()->can('manage-arsip'), 403, 'Akses ditolak. Anda tidak memiliki izin untuk menghapus arsip.');

        $request->validate([
            'year' => 'required|string',
            'type' => 'required|string|in:masuk,keluar',
            'classification' => 'required|string|in:biasa,terbatas,rahasia',
        ]);

        $this->authorizeFileAccess($request, $id);

        try {
            $this->driveService->deleteFile($id);
            $this->clearCacheForFolder($request->year, $request->type, $request->classification);

            return back()->with('success', 'Arsip berhasil dihapus.');
        } catch (\Exception $e) {
            return back()->with('error', 'Gagal menghapus arsip: '.$e->getMessage());
        }
    }

    protected function clearCacheForFolder($year, $type, $classification)
    {
        $archiveYear = ArchiveYear::where('year', $year)->first();
        if ($archiveYear) {
            $typeLabel = strtolower($type) === 'masuk' ? 'Surat Masuk' : 'Surat Keluar';
            Cache::forget("gdrive_files_{$archiveYear->id}_{$typeLabel}_{$classification}");

            $typeFolderId = $this->driveService->getSubfolderIdByName($archiveYear->gdrive_folder_id, $typeLabel);
            if ($typeFolderId) {
                $classLabel = DocumentClassification::tryFrom($classification)?->label() ?? ucfirst($classification);
                $classFolderId = $this->driveService->getSubfolderIdByName($typeFolderId, ucfirst(strtolower($classLabel)));
                if ($classFolderId) {
                    $this->driveService->clearFolderCache($classFolderId);
                }
            }
        }
    }

    public function stream(Request $request, string $id)
    {
        try {
            if (! file_exists(storage_path('app/credentials/credentials.json'))) {
                abort(404, 'Credentials not found.');
            }

            $this->authorizeFileAccess($request, $id);

            $metadata = $this->driveService->getFileMetadata($id);
            $content = $this->driveService->getFileContent($id);

            $safeInlineMimes = [
                'application/pdf',
                'image/jpeg',
                'image/png',
                'image/webp',
            ];

            $mimeType = $metadata->mimeType ?: 'application/octet-stream';
            $disposition = in_array(strtolower($mimeType), $safeInlineMimes, true) ? 'inline' : 'attachment';

            $cleanName = str_replace(['"', "\r", "\n", '/', '\\'], '', basename($metadata->name));
            $encodedName = rawurlencode($cleanName);

            $response = response($content, 200)
                ->header('Content-Type', $mimeType)
                ->header('Content-Disposition', "{$disposition}; filename=\"{$cleanName}\"; filename*=UTF-8''{$encodedName}")
                ->header('X-Content-Type-Options', 'nosniff');

            if ($disposition === 'inline') {
                $response->header('Content-Security-Policy', "default-src 'none'; sandbox");
            }

            return $response;
        } catch (HttpException $e) {
            throw $e;
        } catch (\Exception $e) {
            abort(404, 'File not found or access denied.');
        }
    }
}
