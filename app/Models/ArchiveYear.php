<?php

namespace App\Models;

use Database\Factories\ArchiveYearFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ArchiveYear extends Model
{
    /** @use HasFactory<ArchiveYearFactory> */
    use HasFactory;

    protected $fillable = [
        'year',
        'title',
        'description',
        'gdrive_folder_id',
        'is_active',
    ];

    protected $casts = [
        'is_active' => 'boolean',
    ];
}
