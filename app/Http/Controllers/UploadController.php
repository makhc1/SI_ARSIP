<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreUploadRequest;
use App\Models\ArchiveYear;
use App\Models\PendingUpload;
use App\Services\GoogleDriveService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class UploadController extends Controller
{
    public function __construct(
        protected GoogleDriveService $driveService
    ) {}

    public function index(Request $request): Response
    {
        abort_unless($request->user()->hasRole(['Admin', 'Developer']) || $request->user()->can('upload-dokumen'), 403);

        $pendingUploads = PendingUpload::with(['uploader'])->pending()->latest()->get()->map(function ($upload) {
            return [
                'id' => $upload->id,
                'title' => $upload->title,
                'description' => $upload->description,
                'year' => $upload->year,
                'type' => $upload->type,
                'classification' => [
                    'value' => $upload->classification->value,
                    'label' => $upload->classification->label(),
                    'color' => $upload->classification->color(),
                ],
                'original_filename' => $upload->original_filename,
                'stored_filename' => $upload->stored_filename,
                'status' => $upload->status,
                'uploader_name' => $upload->uploader->name ?? 'Unknown',
                'created_at' => $upload->created_at->format('d M Y H:i'),
            ];
        });

        $archiveYears = ArchiveYear::orderBy('year', 'desc')->get(['id', 'year', 'title', 'gdrive_folder_id']);
        $pendingCount = PendingUpload::pending()->count();

        return Inertia::render('Upload/Index', [
            'pendingUploads' => $pendingUploads,
            'archiveYears' => $archiveYears,
            'pendingCount' => $pendingCount,
        ]);
    }

    public function create(Request $request): Response
    {
        abort_unless($request->user()->hasRole(['Admin', 'Developer']) || $request->user()->can('upload-dokumen'), 403);

        $archiveYears = ArchiveYear::orderBy('year', 'desc')->get(['id', 'year', 'title']);

        return Inertia::render('Upload/Create', [
            'archiveYears' => $archiveYears,
        ]);
    }

    public function store(StoreUploadRequest $request): RedirectResponse
    {
        $file = $request->file('file');

        $originalFilename = $file->getClientOriginalName();
        $storedFilename = now()->timestamp.'_'.Str::uuid().'.'.$file->getClientOriginalExtension();

        // Save to local storage temporarily
        $path = $file->storeAs('uploads/pending', $storedFilename, 'local');

        PendingUpload::create([
            'title' => $request->title,
            'description' => $request->description,
            'year' => $request->year,
            'type' => $request->type,
            'classification' => $request->classification,
            'original_filename' => $originalFilename,
            'stored_filename' => $storedFilename,
            'status' => 'pending',
            'uploaded_by' => $request->user()->id,
        ]);

        return redirect()->route('upload.index')->with('success', 'Dokumen berhasil diupload dan menunggu persetujuan.');
    }

    public function approve(Request $request, PendingUpload $upload): RedirectResponse
    {
        abort_unless($request->user()->hasRole(['Admin', 'Developer']) || $request->user()->can('manage-arsip'), 403);

        $request->validate([
            'gdrive_folder_id' => 'required|string',
        ]);

        try {
            $localFilePath = storage_path('app/private/uploads/pending/'.$upload->stored_filename);

            // Wait, storage path might be app/uploads/pending or app/private/uploads/pending depending on Laravel version (11). Let's use Storage::disk('local')->path()
            $localFilePath = Storage::disk('local')->path('uploads/pending/'.$upload->stored_filename);

            if (! file_exists($localFilePath)) {
                return back()->with('error', 'File fisik tidak ditemukan di server.');
            }

            $mimeType = mime_content_type($localFilePath) ?: 'application/octet-stream';

            // Find or create subfolders: type -> classification
            $typeLabel = $upload->type === 'masuk' ? 'Surat Masuk' : 'Surat Keluar';

            // 1. Get/create type folder (Surat Masuk / Surat Keluar)
            $typeFolderId = $this->driveService->getOrCreateSubfolder($request->gdrive_folder_id, $typeLabel);

            // 2. Get/create classification folder (Biasa / Terbatas / Rahasia)
            $classificationLabel = $upload->classification->label();
            $classificationFolderId = $this->driveService->getOrCreateSubfolder($typeFolderId, ucfirst(strtolower($classificationLabel)));

            // 3. Upload file to classification folder
            $gdriveFileId = $this->driveService->uploadFileToDrive(
                $classificationFolderId,
                $localFilePath,
                $upload->original_filename,
                $mimeType
            );

            // Update database
            $upload->update([
                'status' => 'approved',
                'gdrive_file_id' => $gdriveFileId,
                'approved_by' => $request->user()->id,
            ]);

            // Clean up cache for the classification folder
            $this->driveService->clearFolderCache($classificationFolderId);

            // Clean up local file
            Storage::disk('local')->delete('uploads/pending/'.$upload->stored_filename);

            return back()->with('success', 'Dokumen berhasil di-approve dan diupload ke Google Drive.');

        } catch (\Exception $e) {
            return back()->with('error', 'Gagal upload ke Google Drive: '.$e->getMessage());
        }
    }

    public function reject(Request $request, PendingUpload $upload): RedirectResponse
    {
        abort_unless($request->user()->hasRole(['Admin', 'Developer']) || $request->user()->can('manage-arsip'), 403);

        $upload->update([
            'status' => 'rejected',
        ]);

        Storage::disk('local')->delete('uploads/pending/'.$upload->stored_filename);

        return back()->with('success', 'Dokumen berhasil di-reject dan dihapus dari server.');
    }
}
