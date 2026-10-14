<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $permissions = [
            'upload-dokumen',
            'manage-arsip',
            'view-rahasia',
            'view-terbatas',
            'manage-roles',
        ];

        foreach ($permissions as $permission) {
            Permission::firstOrCreate(['name' => $permission]);
        }

        $adminRole = Role::firstOrCreate(['name' => 'Admin']);
        $devRole = Role::firstOrCreate(['name' => 'Developer']);
        $viewerRole = Role::firstOrCreate(['name' => 'Viewer']);

        $adminRole->syncPermissions(Permission::all());
        $devRole->syncPermissions(Permission::all());

        $admin = User::firstOrCreate(
            ['email' => 'admin@example.com'],
            [
                'name' => 'Administrator',
                'password' => Hash::make('password'),
                'email_verified_at' => now(),
            ]
        );
        $admin->syncRoles([$adminRole]);

        $viewer = User::firstOrCreate(
            ['email' => 'viewer@example.com'],
            [
                'name' => 'Pegawai Viewer',
                'password' => Hash::make('password'),
                'email_verified_at' => now(),
            ]
        );
        $viewer->syncRoles([$viewerRole]);

        $this->call([
            ArchiveYearSeeder::class,
        ]);
    }
}
