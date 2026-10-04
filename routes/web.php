<?php

use App\Http\Controllers\Admin\ArticleController as AdminArticleController;
use App\Http\Controllers\Admin\LeadController as AdminLeadController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\LeadCaptureController;
use App\Http\Controllers\MediaController;
use App\Http\Controllers\PublicSiteController;
use App\Http\Controllers\SeoController;
use Illuminate\Support\Facades\Route;

Route::get('/', [PublicSiteController::class, 'home'])->name('home');
Route::get('/tentang', [PublicSiteController::class, 'about'])->name('about');
Route::get('/artikel', [PublicSiteController::class, 'articles'])->name('articles.index');
Route::get('/artikel/{slug}', [PublicSiteController::class, 'article'])->name('articles.show');
Route::get('/sitemap.xml', [SeoController::class, 'sitemap'])->name('sitemap');
Route::get('/media/articles/{filename}', [MediaController::class, 'articleCover'])
    ->where('filename', '[A-Za-z0-9._-]+')
    ->name('media.article-cover');

foreach ([
    'jual-laptop-bekas-jakarta',
    'jual-laptop-jakarta',
    'jual-macbook-bekas-jakarta',
    'jual-laptop-gaming-bekas',
    'jual-laptop-kantor-bekas',
    'tukar-tambah-laptop',
] as $slug) {
    Route::get('/'.$slug, [PublicSiteController::class, 'landing'])
        ->defaults('slug', $slug)
        ->name('landing.'.$slug);
}

Route::post('/leads', [LeadCaptureController::class, 'store'])
    ->middleware('throttle:10,1')
    ->name('leads.store');


Route::get('/admin/login', [AuthController::class, 'showLogin'])->name('login');
Route::post('/admin/login', [AuthController::class, 'login'])
    ->middleware(['guest', 'throttle:6,1']);

Route::post('/admin/logout', [AuthController::class, 'logout'])->middleware('auth')->name('logout');

Route::prefix('admin')->middleware('auth')->name('admin.')->group(function (): void {
    Route::redirect('/', '/admin/leads');
    Route::get('/leads', [AdminLeadController::class, 'index'])->name('leads.index');
    Route::get('/leads/{lead}', [AdminLeadController::class, 'show'])->name('leads.show');
    Route::patch('/leads/{lead}', [AdminLeadController::class, 'update'])->name('leads.update');

    Route::resource('articles', AdminArticleController::class)->except(['show']);
});
