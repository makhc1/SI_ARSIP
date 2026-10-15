<?php

namespace Tests\Feature;

use App\Models\User;
use Database\Seeders\BagdatinRoleUserSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Gate;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class BagdatinRbacTest extends TestCase
{
    use RefreshDatabase;

    public function test_bagdatin_seeder_creates_all_roles_permissions_and_personnel(): void
    {
        $this->seed(BagdatinRoleUserSeeder::class);

        // Check roles
        $expectedRoles = [
            'super_admin',
            'kabag_datin',
            'kasubbag',
            'penelaah_kebijakan',
            'pengolah_data',
            'operasional',
        ];

        foreach ($expectedRoles as $roleName) {
            $this->assertDatabaseHas('roles', ['name' => $roleName]);
        }

        // Check 14 personnel
        $this->assertDatabaseCount('users', 14);

        // Shafa as super_admin
        $shafa = User::where('email', 'shafa@kemhan.go.id')->first();
        $this->assertNotNull($shafa);
        $this->assertSame('200007312025062003', $shafa->nrp_nip);
        $this->assertSame('DOKSIPTAKA', $shafa->subbagian);
        $this->assertTrue($shafa->hasRole('super_admin'));

        // Gate::before gives super_admin full bypass
        $this->assertTrue($shafa->can('any_non_existent_ability'));
        $this->assertTrue(Gate::forUser($shafa)->allows('manage_users'));

        // Hartini has direct permissions
        $hartini = User::where('email', 'hartini@kemhan.go.id')->first();
        $this->assertNotNull($hartini);
        $this->assertTrue($hartini->hasRole('kasubbag'));
        $this->assertTrue($hartini->hasDirectPermission('view_all_archives'));
        $this->assertTrue($hartini->hasDirectPermission('manage_archive_years'));
    }

    public function test_personnel_can_login_using_email(): void
    {
        $this->seed(BagdatinRoleUserSeeder::class);

        $response = $this->post('/login', [
            'email' => 'shafa@kemhan.go.id',
            'password' => 'Kemhan2026!',
        ]);

        $this->assertAuthenticated();
        $response->assertRedirect('/dashboard');
    }

    public function test_personnel_can_login_using_nrp_nip(): void
    {
        $this->seed(BagdatinRoleUserSeeder::class);

        $response = $this->post('/login', [
            'email' => '200007312025062003',
            'password' => 'Kemhan2026!',
        ]);

        $this->assertAuthenticated();
        $response->assertRedirect('/dashboard');
    }

    public function test_personnel_can_login_using_nip_with_slashes(): void
    {
        $this->seed(BagdatinRoleUserSeeder::class);

        // Inggil's NRP is 13571/P
        $response = $this->post('/login', [
            'email' => '13571/P',
            'password' => 'Kemhan2026!',
        ]);

        $this->assertAuthenticated();
        $response->assertRedirect('/dashboard');
    }

    public function test_inactive_personnel_cannot_login(): void
    {
        $this->seed(BagdatinRoleUserSeeder::class);

        $shafa = User::where('email', 'shafa@kemhan.go.id')->first();
        $shafa->update(['is_active' => false]);

        $response = $this->post('/login', [
            'email' => 'shafa@kemhan.go.id',
            'password' => 'Kemhan2026!',
        ]);

        $this->assertGuest();
        $response->assertSessionHasErrors('email');
    }

    public function test_handle_inertia_requests_shares_user_personnel_data(): void
    {
        $this->seed(BagdatinRoleUserSeeder::class);

        $shafa = User::where('email', 'shafa@kemhan.go.id')->first();

        $this->actingAs($shafa)
            ->get('/dashboard')
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('Dashboard')
                ->has('auth.user', fn (Assert $user) => $user
                    ->where('email', 'shafa@kemhan.go.id')
                    ->where('nrp_nip', '200007312025062003')
                    ->where('subbagian', 'DOKSIPTAKA')
                    ->where('rank_grade', 'CPNS Pengatur II/c')
                    ->where('position_title', 'Penata Kelola Sistem & Teknologi Informasi')
                    ->where('is_active', true)
                    ->where('canUpload', true)
                    ->has('roles')
                    ->has('permissions')
                    ->etc()
                )
            );
    }
}
