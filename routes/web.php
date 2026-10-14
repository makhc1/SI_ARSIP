<?php

use App\Http\Controllers\ArchiveFileController;
use App\Http\Controllers\ArchiveYearController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\UploadController;
use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return redirect()->route('dashboard');
});

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::get('/faq', function () {
    return Inertia::render('Faq');
})->middleware(['auth', 'verified'])->name('faq');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/arsip', [ArchiveYearController::class, 'index'])->name('arsip.index');
    Route::post('/arsip', [ArchiveYearController::class, 'store'])->name('arsip.store');
    Route::put('/arsip/{archiveYear}', [ArchiveYearController::class, 'update'])->name('arsip.update');
    Route::delete('/arsip/{id}', [ArchiveYearController::class, 'destroy'])->name('arsip.destroy');
    Route::get('/arsip/{year}', [ArchiveYearController::class, 'show'])->name('arsip.year');

    Route::get('/arsip/{year}/{type}', [ArchiveFileController::class, 'classificationSelection'])
        ->name('arsip.year.type');

    Route::get('/arsip/{year}/{type}/{classification}', [ArchiveFileController::class, 'index'])
        ->name('arsip.show');

    Route::get('/arsip/file/{id}/stream', [ArchiveFileController::class, 'stream'])
        ->name('arsip.file.stream');

    Route::put('/arsip/file/{id}', [ArchiveFileController::class, 'update'])
        ->name('arsip.file.update');

    Route::delete('/arsip/file/{id}', [ArchiveFileController::class, 'destroy'])
        ->name('arsip.file.destroy');
});

// Upload routes — Admin only
Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/upload', [UploadController::class, 'index'])->name('upload.index');
    Route::get('/upload/create', [UploadController::class, 'create'])->name('upload.create');
    Route::post('/upload', [UploadController::class, 'store'])->name('upload.store');
    Route::post('/upload/{upload}/approve', [UploadController::class, 'approve'])->name('upload.approve');
    Route::post('/upload/{upload}/reject', [UploadController::class, 'reject'])->name('upload.reject');
    Route::get('/users', [UserController::class, 'index'])->name('users.index');
    Route::put('/users/{user}/roles', [UserController::class, 'updateRoles'])->name('users.update-roles');
});

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';
