@extends('layouts.public')
@section('title', 'Artikel & Tips — '.($globalSettings?->site_name ?: 'Saka Laptop'))
@section('description', 'Tips jual laptop bekas, perawatan perangkat, dan panduan sebelum melepas laptop lama.')
@section('canonical', request()->integer('page', 1) > 1 ? route('articles.index').'?page='.request()->integer('page') : route('articles.index'))

@section('content')
<section class="inner-hero article-hero">
    <div class="container">
        <span class="section-kicker light">Artikel & tips</span>
        <h1>Informasi sebelum kamu menjual laptop.</h1>
        <p>Panduan kondisi perangkat, persiapan data, dan hal-hal yang perlu diperhatikan sebelum proses pengecekan.</p>
    </div>
</section>

<section class="public-section">
    <div class="container article-public-grid">
        @forelse($articles as $article)
        <article class="public-article-card">
            <a href="{{ route('articles.show', $article->slug) }}">
                @if($article->cover_path)
                    <img src="{{ asset(ltrim($article->cover_path,'/')) }}" alt="{{ $article->title }}" loading="lazy">
                @else
                    <div class="article-cover-fallback">SL</div>
                @endif
                <div class="public-article-copy">
                    <span>{{ optional($article->published_at)->format('d M Y') ?: 'Artikel' }}</span>
                    <h2>{{ $article->title }}</h2>
                    <p>{{ $article->excerpt }}</p>
                    <strong>Baca artikel →</strong>
                </div>
            </a>
        </article>
        @empty
            <div class="empty-public"><strong>Artikel sedang disiapkan.</strong><p>Kembali lagi sebentar lagi untuk tips terbaru.</p></div>
        @endforelse
    </div>
    <div class="container pager">{{ $articles->links() }}</div>
</section>

<section class="article-cta">
    <div class="container">
        <div><span class="section-kicker">Punya perangkat?</span><h2>Nggak harus nunggu baca semuanya.</h2></div>
        <a class="button button-dark" href="{{ route('home') }}#ajukan">Ajukan laptop sekarang</a>
    </div>
</section>
@endsection
