<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreArchiveYearRequest;
use App\Http\Requests\UpdateArchiveYearRequest;
use App\Models\ArchiveYear;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ArchiveYearController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $archiveYears = ArchiveYear::orderBy('year', 'desc')->get();
        $user = $request->user();

        return Inertia::render('Arsip/Index', [
            'archiveYears' => $archiveYears,
            'canManageArsip' => $user->hasRole(['Admin', 'Developer']) || $user->hasPermissionTo('manage-arsip'),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreArchiveYearRequest $request)
    {
        $data = $request->validated();

        // Extract Google Drive Folder ID if the user pasted a full URL
        $gdriveInput = $data['gdrive_folder_id'];

        if (preg_match('/folders\/([a-zA-Z0-9_-]+)/', $gdriveInput, $matches)) {
            $data['gdrive_folder_id'] = $matches[1];
        } elseif (preg_match('/id=([a-zA-Z0-9_-]+)/', $gdriveInput, $matches)) {
            $data['gdrive_folder_id'] = $matches[1];
        }

        ArchiveYear::create($data);

        return redirect()->back()->with('success', 'Tahun anggaran berhasil ditambahkan.');
    }

    /**
     * Display the specified resource.
     */
    public function show(string $year)
    {
        $archiveYear = ArchiveYear::where('year', $year)->first();

        if (! $archiveYear) {
            return Inertia::render('Arsip/NotFound', [
                'message' => "Direktori arsip untuk tahun {$year} belum tersedia di dalam sistem.",
            ]);
        }

        return Inertia::render('Arsip/Year', [
            'archiveYear' => $archiveYear,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(ArchiveYear $archiveYear)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateArchiveYearRequest $request, ArchiveYear $archiveYear)
    {
        $data = $request->validated();

        if (isset($data['gdrive_folder_id'])) {
            $gdriveInput = $data['gdrive_folder_id'];
            if (preg_match('/folders\/([a-zA-Z0-9_-]+)/', $gdriveInput, $matches)) {
                $data['gdrive_folder_id'] = $matches[1];
            } elseif (preg_match('/id=([a-zA-Z0-9_-]+)/', $gdriveInput, $matches)) {
                $data['gdrive_folder_id'] = $matches[1];
            }
        }

        $archiveYear->update($data);

        return redirect()->back()->with('success', 'Tahun anggaran berhasil diperbarui.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Request $request, $id)
    {
        $user = $request->user();
        if (! ($user->hasRole(['Admin', 'Developer']) || $user->hasPermissionTo('manage-arsip'))) {
            abort(403);
        }

        $archiveYear = ArchiveYear::findOrFail($id);
        $archiveYear->delete();

        return redirect()->back()->with('success', 'Tahun anggaran berhasil dihapus.');
    }
}
