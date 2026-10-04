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
        $ownerEmail = strtolower((string) env('OWNER_EMAIL'));
        $ownerPassword = (string) env('OWNER_PASSWORD');
        $developerEmail = strtolower((string) env('DEVELOPER_EMAIL'));
        $developerPassword = (string) env('DEVELOPER_PASSWORD');

        if ($ownerEmail === '' || $ownerPassword === '') {
            throw new RuntimeException('OWNER_EMAIL dan OWNER_PASSWORD wajib diisi sebelum setup production.');
        }

        if ($developerEmail === '' || $developerPassword === '') {
            throw new RuntimeException('DEVELOPER_EMAIL dan DEVELOPER_PASSWORD wajib diisi sebelum setup production.');
        }

        if ($ownerEmail === $developerEmail) {
            throw new RuntimeException('Email owner dan developer harus berbeda.');
        }

        User::query()->updateOrCreate(
            ['email' => $ownerEmail],
            [
                'name' => 'Owner Saka Laptop',
                'password' => Hash::make($ownerPassword),
                'status' => 'active',
            ]
        );

        User::query()->updateOrCreate(
            ['email' => $developerEmail],
            [
                'name' => 'Developer',
                'password' => Hash::make($developerPassword),
                'status' => 'active',
            ]
        );

        Setting::singleton();
        HomepageContent::singleton();
    }
}
