<?php

use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Admin\SettingsController;
use App\Http\Controllers\Admin\UserController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\PublicSiteController;
use Illuminate\Support\Facades\Route;

Route::get('/', [PublicSiteController::class, 'home'])->name('home');
Route::get('/tentang', [PublicSiteController::class, 'about'])->name('about');
Route::get('/artikel', [PublicSiteController::class, 'articles'])->name('articles.index');
Route::get('/artikel/{slug}', [PublicSiteController::class, 'article'])->name('articles.show');

foreach ([
    'jual-laptop-bekas-jakarta',
    'jual-laptop-jakarta',
    'jual-macbook-bekas-jakarta',
    'jual-laptop-gaming-bekas',
    'jual-laptop-kantor-bekas',
    'tukar-tambah-laptop',
] as $slug) {
    Route::get('/'.$slug, [PublicSiteController::class, 'landing'])->name('landing.'.$slug);
}

Route::middleware('guest')->group(function (): void {
    Route::get('/admin/login', [AuthController::class, 'showLogin'])->name('login');
    Route::post('/admin/login', [AuthController::class, 'login'])->middleware('throttle:6,1');
});

Route::post('/admin/logout', [AuthController::class, 'logout'])->middleware('auth')->name('logout');

Route::prefix('admin')->middleware('auth')->name('admin.')->group(function (): void {
    Route::get('/', DashboardController::class)->name('dashboard');

    Route::get('/settings', [SettingsController::class, 'edit'])
        ->middleware('permission:settings.view')
        ->name('settings.edit');
    Route::put('/settings', [SettingsController::class, 'update'])
        ->middleware('permission:settings.update')
        ->name('settings.update');

    Route::resource('users', UserController::class)
        ->except(['show'])
        ->middleware('permission:users.view');
});
