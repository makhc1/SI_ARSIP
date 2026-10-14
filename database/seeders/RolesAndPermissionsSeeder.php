<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;
use Spatie\Permission\PermissionRegistrar;

class RolesAndPermissionsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Reset cached roles and permissions
        app()[PermissionRegistrar::class]->forgetCachedPermissions();

        // create permissions
        $permissions = [
            'view-terbatas',
            'view-rahasia',
            'upload-dokumen',
            'manage-arsip',
            'manage-roles',
            'manage-permissions',
        ];

        foreach ($permissions as $permission) {
            Permission::firstOrCreate(['name' => $permission]);
        }

        // define roles and their permissions
        $roles = [
            'Developer' => [
                'view-terbatas',
                'view-rahasia',
                'upload-dokumen',
                'manage-arsip',
                'manage-roles',
                'manage-permissions',
            ],
            'Admin' => [
                'view-terbatas',
                'view-rahasia',
                'upload-dokumen',
                'manage-arsip',
            ],
            'Kabag Datin' => [ // Kepala Bagian Data dan Informasi
                'view-terbatas',
                'view-rahasia',
                'upload-dokumen',
                'manage-arsip',
            ],
            'Kasubbag Datin' => [ // Kepala Subbagian Data dan Informasi
                'view-terbatas',
                'upload-dokumen',
            ],
            'Analis Data' => [
                'view-terbatas',
            ],
            'Staf Datin' => [
                // hanya bisa akses biasa (default)
            ],
            'Viewer' => [
                // hanya view biasa
            ],
        ];

        foreach ($roles as $roleName => $rolePermissions) {
            $role = Role::firstOrCreate(['name' => $roleName]);
            if (! empty($rolePermissions)) {
                $role->syncPermissions($rolePermissions);
            }
        }
    }
}
