<?php

namespace App\Http\Middleware;

use App\Models\PendingUpload;
use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that is loaded on the first page visit.
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determine the current asset version.
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        $user = $request->user();
        $canUpload = $user ? ($user->hasRole('Admin') || $user->can('upload-dokumen')) : false;

        return [
            ...parent::share($request),
            'auth' => [
                'user' => $user ? array_merge($user->toArray(), [
                    'roles' => $user->getRoleNames(),
                    'permissions' => $user->getAllPermissions()->pluck('name'),
                    'canUpload' => $canUpload,
                ]) : null,
            ],
            'pendingUploadsCount' => $canUpload ? PendingUpload::pending()->count() : 0,
        ];
    }
}
