<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Spatie\Permission\Models\Role;

class UserController extends Controller
{
    public function index(Request $request): Response
    {
        abort_unless($request->user()->hasRole(['Admin', 'Developer']) || $request->user()->can('manage-roles'), 403);

        $users = User::with('roles')->latest()->get()->map(function ($u) {
            return [
                'id' => $u->id,
                'name' => $u->name,
                'email' => $u->email,
                'roles' => $u->roles->pluck('name'),
                'created_at' => $u->created_at->format('d M Y'),
            ];
        });

        $roles = Role::pluck('name');

        return Inertia::render('Users/Index', [
            'users' => $users,
            'roles' => $roles,
        ]);
    }

    public function updateRoles(Request $request, User $user)
    {
        abort_unless($request->user()->hasRole(['Admin', 'Developer']) || $request->user()->can('manage-roles'), 403);

        $request->validate([
            'roles' => 'array',
            'roles.*' => 'exists:roles,name',
        ]);

        $user->syncRoles($request->roles ?? []);

        return back()->with('success', 'Peran pengguna berhasil diperbarui.');
    }
}
