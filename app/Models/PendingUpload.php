<?php

namespace App\Models;

use App\Enums\DocumentClassification;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PendingUpload extends Model
{
    protected $fillable = [
        'title',
        'description',
        'year',
        'type',
        'classification',
        'original_filename',
        'stored_filename',
        'status',
        'uploaded_by',
        'approved_by',
        'gdrive_file_id',
    ];

    protected $casts = [
        'classification' => DocumentClassification::class,
        'status' => 'string',
    ];

    public function uploader(): BelongsTo
    {
        return $this->belongsTo(User::class, 'uploaded_by');
    }

    public function approver(): BelongsTo
    {
        return $this->belongsTo(User::class, 'approved_by');
    }

    public function scopePending(Builder $query): Builder
    {
        return $query->where('status', 'pending');
    }
}
