<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;
use Spatie\Permission\PermissionRegistrar;

class BagdatinRoleUserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Reset cached roles and permissions
        app()[PermissionRegistrar::class]->forgetCachedPermissions();

        // 1. Permissions List
        $permissions = [
            // System & User Management
            'manage_users',
            'manage_roles',
            'manage_settings',

            // Master Arsip & Google Drive
            'manage_archive_years',
            'manage_gdrive_folders',

            // Operasional Arsip
            'view_all_archives',
            'view_subbag_archives',
            'create_archive',
            'edit_archive',
            'delete_archive',
            'approve_archive',
            'download_archive',

            // Legacy permissions for backward compatibility
            'upload-dokumen',
            'manage-arsip',
            'view-rahasia',
            'view-terbatas',
            'manage-permissions',
        ];

        foreach ($permissions as $permission) {
            Permission::firstOrCreate(['name' => $permission]);
        }

        // 2. Roles & Permissions Mapping
        $rolesConfig = [
            'super_admin' => Permission::all()->pluck('name')->toArray(),
            'kabag_datin' => [
                'view_all_archives',
                'download_archive',
                'approve_archive',
                'view-rahasia',
                'view-terbatas',
            ],
            'kasubbag' => [
                'view_subbag_archives',
                'create_archive',
                'edit_archive',
                'approve_archive',
                'download_archive',
                'upload-dokumen',
                'manage-arsip',
                'view-terbatas',
            ],
            'penelaah_kebijakan' => [
                'view_subbag_archives',
                'create_archive',
                'edit_archive',
                'download_archive',
                'upload-dokumen',
                'view-terbatas',
            ],
            'pengolah_data' => [
                'view_subbag_archives',
                'create_archive',
                'edit_archive',
                'download_archive',
                'upload-dokumen',
                'view-terbatas',
            ],
            'operasional' => [
                'view_subbag_archives',
                'create_archive',
                'download_archive',
                'upload-dokumen',
                'view-terbatas',
            ],
        ];

        foreach ($rolesConfig as $roleName => $rolePermissions) {
            $role = Role::firstOrCreate(['name' => $roleName]);
            $role->syncPermissions($rolePermissions);
        }

        // 3. Personnel Data
        $defaultPassword = Hash::make('Kemhan2026!');

        $personnel = [
            // A. Pimpinan Bagian
            [
                'name' => 'Inggil K., S.Kep., Ners., M.Tr. Hanla., M.Tr. (Han)., M.M.',
                'position_title' => 'Kabag Datin',
                'rank_grade' => 'Kolonel Laut (K)',
                'nrp_nip' => '13571/P',
                'email' => 'inggil.kabag@kemhan.go.id',
                'subbagian' => 'PIMPINAN',
                'role' => 'kabag_datin',
                'direct_permissions' => [],
            ],
            // B. Subbagian Doksiptaka
            [
                'name' => 'Shafa T.P., A.Md.A.Pkt.',
                'position_title' => 'Penata Kelola Sistem & Teknologi Informasi',
                'rank_grade' => 'CPNS Pengatur II/c',
                'nrp_nip' => '200007312025062003',
                'email' => 'shafa@kemhan.go.id',
                'subbagian' => 'DOKSIPTAKA',
                'role' => 'super_admin',
                'direct_permissions' => [],
            ],
            [
                'name' => 'Hartini, S.E., M.Si.',
                'position_title' => 'Kasubbag Doksiptaka',
                'rank_grade' => 'Pembina IV/a',
                'nrp_nip' => '197701152005012011',
                'email' => 'hartini@kemhan.go.id',
                'subbagian' => 'DOKSIPTAKA',
                'role' => 'kasubbag',
                'direct_permissions' => ['view_all_archives', 'manage_archive_years'],
            ],
            [
                'name' => 'Arwinsyah',
                'position_title' => 'Pengolah Data & Informasi',
                'rank_grade' => 'Kapten Inf',
                'nrp_nip' => '21010263630679',
                'email' => 'arwinsyah@kemhan.go.id',
                'subbagian' => 'DOKSIPTAKA',
                'role' => 'pengolah_data',
                'direct_permissions' => [],
            ],
            // C. Subbagian Lahta
            [
                'name' => 'Mirza, S.E., M.M., M.Han.',
                'position_title' => 'Kasubbag Lahta',
                'rank_grade' => 'Letkol Laut (P)',
                'nrp_nip' => '14914/P',
                'email' => 'mirza@kemhan.go.id',
                'subbagian' => 'LAHTA',
                'role' => 'kasubbag',
                'direct_permissions' => [],
            ],
            [
                'name' => 'Tihana, S.Sos.',
                'position_title' => 'Penelaah Teknis Kebijakan',
                'rank_grade' => 'Penata Tk. I III/d',
                'nrp_nip' => '196905211696032001',
                'email' => 'tihana@kemhan.go.id',
                'subbagian' => 'LAHTA',
                'role' => 'penelaah_kebijakan',
                'direct_permissions' => [],
            ],
            [
                'name' => 'Heru Suliyanto',
                'position_title' => 'Pengolah Data & Informasi',
                'rank_grade' => 'Penda Tk. I III/b',
                'nrp_nip' => '197004251990031002',
                'email' => 'heru.suliyanto@kemhan.go.id',
                'subbagian' => 'LAHTA',
                'role' => 'pengolah_data',
                'direct_permissions' => [],
            ],
            [
                'name' => 'Priyanto',
                'position_title' => 'Penata Kelola Sistem & Teknologi Informasi',
                'rank_grade' => 'Lettu Cke',
                'nrp_nip' => '21040172780682',
                'email' => 'priyanto@kemhan.go.id',
                'subbagian' => 'LAHTA',
                'role' => 'pengolah_data',
                'direct_permissions' => [],
            ],
            [
                'name' => 'Agung Nugroho',
                'position_title' => 'Pengolah Layanan Operasional',
                'rank_grade' => 'Serka',
                'nrp_nip' => '31020891780283',
                'email' => 'agung.nugroho@kemhan.go.id',
                'subbagian' => 'LAHTA',
                'role' => 'operasional',
                'direct_permissions' => [],
            ],
            // D. Subbagian Simak BMN
            [
                'name' => 'Riana Dewi Mariana, S.Pd., M.Si.',
                'position_title' => 'Kasubbag Simak BMN',
                'rank_grade' => 'Letkol Laut (KH/W)',
                'nrp_nip' => '15200/P',
                'email' => 'riana.dewi@kemhan.go.id',
                'subbagian' => 'SIMAK_BMN',
                'role' => 'kasubbag',
                'direct_permissions' => [],
            ],
            [
                'name' => 'Bestly',
                'position_title' => 'Penelaah Teknis Kebijakan',
                'rank_grade' => 'Mayor Cpn',
                'nrp_nip' => '11070047390981',
                'email' => 'bestly@kemhan.go.id',
                'subbagian' => 'SIMAK_BMN',
                'role' => 'penelaah_kebijakan',
                'direct_permissions' => [],
            ],
            [
                'name' => 'Suhono',
                'position_title' => 'Pengolah Data & Informasi',
                'rank_grade' => 'Penda Tk. I III/b',
                'nrp_nip' => '196802111991031001',
                'email' => 'suhono@kemhan.go.id',
                'subbagian' => 'SIMAK_BMN',
                'role' => 'pengolah_data',
                'direct_permissions' => [],
            ],
            [
                'name' => 'Cecep U.A.A., S.AP.',
                'position_title' => 'Pengolah Data & Informasi',
                'rank_grade' => 'Penda Tk. I III/b',
                'nrp_nip' => '198302262010121002',
                'email' => 'cecep@kemhan.go.id',
                'subbagian' => 'SIMAK_BMN',
                'role' => 'pengolah_data',
                'direct_permissions' => [],
            ],
            [
                'name' => 'Deni Priyandani',
                'position_title' => 'Penata Layanan Operasional',
                'rank_grade' => 'Letda Lek',
                'nrp_nip' => '535176',
                'email' => 'deni.priyandani@kemhan.go.id',
                'subbagian' => 'SIMAK_BMN',
                'role' => 'operasional',
                'direct_permissions' => [],
            ],
        ];

        foreach ($personnel as $item) {
            $user = User::updateOrCreate(
                ['email' => $item['email']],
                [
                    'name' => $item['name'],
                    'position_title' => $item['position_title'],
                    'rank_grade' => $item['rank_grade'],
                    'nrp_nip' => $item['nrp_nip'],
                    'subbagian' => $item['subbagian'],
                    'is_active' => true,
                    'password' => $defaultPassword,
                    'email_verified_at' => now(),
                ]
            );

            $user->syncRoles([$item['role']]);

            if (! empty($item['direct_permissions'])) {
                $user->givePermissionTo($item['direct_permissions']);
            }
        }
    }
}
