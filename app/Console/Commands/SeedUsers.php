<?php

namespace App\Console\Commands;

use App\Models\User;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Hash;

class SeedUsers extends Command
{
    protected $signature = 'seed:users';

    protected $description = 'Seed users for Datin roles';

    public function handle()
    {
        $roles = ['Developer', 'Kabag Datin', 'Kasubbag Datin', 'Analis Data', 'Staf Datin'];
        foreach ($roles as $roleName) {
            $email = strtolower(str_replace(' ', '', $roleName)).'@kuathan.kemhan.go.id';
            $user = User::firstOrCreate(
                ['email' => $email],
                [
                    'name' => $roleName,
                    'password' => Hash::make('password'),
                ]
            );
            $user->assignRole($roleName);
            $this->info("Created user: $email / password");
        }
    }
}
