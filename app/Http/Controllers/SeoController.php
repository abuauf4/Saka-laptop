<?php

namespace App\Http\Controllers;

use App\Models\Article;
use Illuminate\Http\Response;

class SeoController extends Controller
{
    public function sitemap(): Response
    {
        $fixed = [
            ['loc' => route('home'), 'priority' => '1.0', 'changefreq' => 'weekly'],
            ['loc' => route('about'), 'priority' => '0.6', 'changefreq' => 'monthly'],
            ['loc' => route('articles.index'), 'priority' => '0.7', 'changefreq' => 'weekly'],
            ['loc' => route('landing.jual-laptop-bekas-jakarta'), 'priority' => '0.9', 'changefreq' => 'monthly'],
            ['loc' => route('landing.jual-laptop-jakarta'), 'priority' => '0.8', 'changefreq' => 'monthly'],
            ['loc' => route('landing.jual-macbook-bekas-jakarta'), 'priority' => '0.8', 'changefreq' => 'monthly'],
            ['loc' => route('landing.jual-laptop-gaming-bekas'), 'priority' => '0.8', 'changefreq' => 'monthly'],
            ['loc' => route('landing.jual-laptop-kantor-bekas'), 'priority' => '0.8', 'changefreq' => 'monthly'],
            ['loc' => route('landing.tukar-tambah-laptop'), 'priority' => '0.7', 'changefreq' => 'monthly'],
        ];

        $articles = Article::query()
            ->where('status', 'published')
            ->orderByDesc('updated_at')
            ->get(['slug', 'updated_at'])
            ->map(fn (Article $article) => [
                'loc' => route('articles.show', $article->slug),
                'lastmod' => $article->updated_at->toAtomString(),
                'priority' => '0.7',
                'changefreq' => 'monthly',
            ]);

        $xml = view('seo.sitemap', [
            'urls' => collect($fixed)->concat($articles),
        ])->render();

        return response($xml, 200, [
            'Content-Type' => 'application/xml; charset=UTF-8',
        ]);
    }
}
