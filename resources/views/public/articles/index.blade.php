@extends('layouts.public')
@section('title', 'Artikel & Tips — '.($globalSettings?->site_name ?: 'Jakarta Laptops'))
@section('content')
<section class="section" style="padding-top:140px"><div class="container"><h2>Artikel & Tips</h2><div class="grid">@forelse($articles as $article)<article class="card"><h3><a href="{{ route('articles.show', $article->slug) }}">{{ $article->title }}</a></h3><p class="muted">{{ $article->excerpt }}</p></article>@empty<p class="muted">Belum ada artikel.</p>@endforelse</div><div style="margin-top:24px">{{ $articles->links() }}</div></div></section>
@endsection
