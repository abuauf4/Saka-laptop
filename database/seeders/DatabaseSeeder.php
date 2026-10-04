<?php

namespace Database\Seeders;

use App\Models\HomepageContent;
use App\Models\Setting;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use RuntimeException;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $email = env('ADMIN_EMAIL', 'admin@saka-laptop.id');
        $password = env('ADMIN_PASSWORD');

        if (! $password) {
            throw new RuntimeException('ADMIN_PASSWORD wajib diisi sebelum setup production.');
        }

        User::query()->updateOrCreate(
            ['email' => strtolower($email)],
            [
                'name' => 'Saka Admin',
                'password' => Hash::make($password),
                'status' => 'active',
            ]
        );

        Setting::singleton();
        HomepageContent::singleton();
    }
}
