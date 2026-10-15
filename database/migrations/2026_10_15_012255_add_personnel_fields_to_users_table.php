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
        Schema::table('users', function (Blueprint $table) {
            $table->string('nrp_nip')->nullable()->unique()->after('email');
            $table->string('rank_grade')->nullable()->after('nrp_nip');
            $table->string('position_title')->nullable()->after('rank_grade');
            $table->string('subbagian')->nullable()->after('position_title');
            $table->boolean('is_active')->default(true)->after('subbagian');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn([
                'nrp_nip',
                'rank_grade',
                'position_title',
                'subbagian',
                'is_active',
            ]);
        });
    }
};
