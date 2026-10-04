<?php

namespace App\Http\Controllers;

use App\Models\Article;
use App\Models\HomepageContent;
use App\Models\Setting;
use App\Models\Testimonial;
use Illuminate\Contracts\View\View;

class PublicSiteController extends Controller
{
    public function home(): View
    {
        return view('public.home', [
            'content' => HomepageContent::singleton(),
            'settings' => Setting::singleton(),
            'testimonials' => Testimonial::query()->where('is_active', true)->latest()->limit(6)->get(),
        ]);
    }

    public function about(): View
    {
        return view('public.about', [
            'content' => HomepageContent::singleton(),
            'settings' => Setting::singleton(),
        ]);
    }

    public function articles(): View
    {
        return view('public.articles.index', [
            'articles' => Article::query()
                ->where('status', 'published')
                ->latest('published_at')
                ->paginate(12),
        ]);
    }

    public function article(string $slug): View
    {
        $article = Article::query()
            ->where('slug', $slug)
            ->where('status', 'published')
            ->firstOrFail();

        return view('public.articles.show', compact('article'));
    }

    public function landing(string $slug): View
    {
        abort_unless(in_array($slug, [
            'jual-laptop-bekas-jakarta',
            'jual-laptop-jakarta',
            'jual-macbook-bekas-jakarta',
            'jual-laptop-gaming-bekas',
            'jual-laptop-kantor-bekas',
            'tukar-tambah-laptop',
        ], true), 404);

        return view('public.landing', [
            'slug' => $slug,
            'content' => HomepageContent::singleton(),
            'settings' => Setting::singleton(),
        ]);
    }
}
