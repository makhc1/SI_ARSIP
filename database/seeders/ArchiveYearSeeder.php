<?php

namespace Database\Seeders;

use App\Models\ArchiveYear;
use Illuminate\Database\Seeder;

class ArchiveYearSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        ArchiveYear::firstOrCreate(
            ['year' => '2024'],
            [
                'title' => 'Berkas Naskah Dinas T.A. 2024',
                'description' => 'Arsip naskah dinas untuk tahun anggaran 2024.',
                'gdrive_folder_id' => 'dummy_folder_id_2024',
                'is_active' => false,
            ]
        );

        ArchiveYear::firstOrCreate(
            ['year' => '2025'],
            [
                'title' => 'Berkas Naskah Dinas T.A. 2025',
                'description' => 'Arsip naskah dinas untuk tahun anggaran berjalan (2025).',
                'gdrive_folder_id' => 'dummy_folder_id_2025',
                'is_active' => true,
            ]
        );

        ArchiveYear::firstOrCreate(
            ['year' => '2026'],
            [
                'title' => 'Berkas Naskah Dinas T.A. 2026',
                'description' => 'Arsip naskah dinas untuk tahun anggaran 2026.',
                'gdrive_folder_id' => 'dummy_folder_id_2026',
                'is_active' => false,
            ]
        );
    }
}
