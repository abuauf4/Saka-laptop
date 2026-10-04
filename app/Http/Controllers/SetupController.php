<?php

namespace App\Http\Controllers;

use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\File;
use Illuminate\View\View;
use Throwable;

class SetupController extends Controller
{
    public function show(): View
    {
        abort_if(File::exists(config('saka.installed_marker')), 404);
        return view('setup.index');
    }

    public function run(Request $request): RedirectResponse
    {
        abort_if(File::exists(config('saka.installed_marker')), 404);

        $expected = (string) config('saka.setup_key');
        abort_if($expected === '', 503, 'APP_SETUP_KEY belum dikonfigurasi.');

        $data = $request->validate(['key' => ['required', 'string']]);
        abort_unless(hash_equals($expected, (string) $data['key']), 403);

        try {
            Artisan::call('migrate', ['--force' => true]);
            Artisan::call('db:seed', ['--force' => true]);
            File::put(config('saka.installed_marker'), now()->toIso8601String());
        } catch (Throwable $e) {
            report($e);
            return back()->withErrors(['setup' => 'Setup gagal. Cek konfigurasi database dan ADMIN_PASSWORD.']);
        }

        return redirect()->route('login')->with('status', 'Setup selesai. Silakan login.');
    }
}
