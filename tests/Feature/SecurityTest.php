<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;
use Tests\TestCase;

class SecurityTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        // Seed roles & permissions
        $permissions = [
            'upload-dokumen',
            'manage-arsip',
            'view-rahasia',
            'view-terbatas',
            'manage-roles',
        ];

        foreach ($permissions as $perm) {
            Permission::firstOrCreate(['name' => $perm]);
        }

        $adminRole = Role::firstOrCreate(['name' => 'Admin']);
        $viewerRole = Role::firstOrCreate(['name' => 'Viewer']);

        $adminRole->syncPermissions(Permission::all());
    }

    public function test_unrestricted_file_upload_is_blocked_for_malicious_extensions(): void
    {
        Storage::fake('local');

        $admin = User::factory()->create();
        $admin->assignRole('Admin');

        // Test PHP script upload rejection
        $responsePhp = $this->actingAs($admin)->post('/upload', [
            'title' => 'Test Malicious Script',
            'year' => '2026',
            'type' => 'masuk',
            'classification' => 'biasa',
            'file' => UploadedFile::fake()->create('exploit.php', 100, 'application/x-php'),
        ]);

        $responsePhp->assertSessionHasErrors('file');

        // Test Executable upload rejection
        $responseExe = $this->actingAs($admin)->post('/upload', [
            'title' => 'Test Executable',
            'year' => '2026',
            'type' => 'masuk',
            'classification' => 'biasa',
            'file' => UploadedFile::fake()->create('malware.exe', 100, 'application/x-msdownload'),
        ]);

        $responseExe->assertSessionHasErrors('file');

        // Test SVG upload rejection (prevent stored XSS)
        $responseSvg = $this->actingAs($admin)->post('/upload', [
            'title' => 'Test SVG Vector',
            'year' => '2026',
            'type' => 'masuk',
            'classification' => 'biasa',
            'file' => UploadedFile::fake()->create('vector.svg', 100, 'image/svg+xml'),
        ]);

        $responseSvg->assertSessionHasErrors('file');
    }

    public function test_valid_pdf_file_upload_passes_validation(): void
    {
        Storage::fake('local');

        $admin = User::factory()->create();
        $admin->assignRole('Admin');

        $response = $this->actingAs($admin)->post('/upload', [
            'title' => 'Surat Resmi Rahasia',
            'description' => 'Dokumen resmi Kementerian Pertahanan',
            'year' => '2026',
            'type' => 'masuk',
            'classification' => 'rahasia',
            'file' => UploadedFile::fake()->create('dokumen_resmi.pdf', 500, 'application/pdf'),
        ]);

        $response->assertSessionHasNoErrors();
        $response->assertRedirect(route('upload.index'));
    }

    public function test_regular_user_cannot_delete_archive_file(): void
    {
        $viewer = User::factory()->create();
        $viewer->assignRole('Viewer');

        $response = $this->actingAs($viewer)->delete('/arsip/file/gdrive-file-id-123', [
            'year' => '2026',
            'type' => 'masuk',
            'classification' => 'biasa',
        ]);

        $response->assertStatus(403);
    }

    public function test_regular_user_cannot_rename_archive_file(): void
    {
        $viewer = User::factory()->create();
        $viewer->assignRole('Viewer');

        $response = $this->actingAs($viewer)->put('/arsip/file/gdrive-file-id-123', [
            'name' => 'Renamed Archive Title',
            'year' => '2026',
            'type' => 'masuk',
            'classification' => 'biasa',
        ]);

        $response->assertStatus(403);
    }
}
