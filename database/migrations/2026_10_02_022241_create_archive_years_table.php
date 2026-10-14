<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('archive_years', function (Blueprint $table) {
            $table->id();
            $table->year('year')->unique();
            $table->string('title', 150);
            $table->text('description')->nullable();
            $table->string('gdrive_folder_id', 100);
            $table->boolean('is_active')->default(false);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('archive_years');
    }
};
