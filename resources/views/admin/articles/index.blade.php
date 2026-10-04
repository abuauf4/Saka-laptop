@extends('layouts.admin')
@section('title', 'Artikel')
@section('content')
<div class="topline">
    <div>
        <p class="admin-eyebrow">Konten SEO</p>
        <h1>Artikel</h1>
        <p class="muted">Tulis, simpan draft, dan publish artikel website.</p>
    </div>
    <a class="btn btn-dark" href="{{ route('admin.articles.create') }}">+ Artikel baru</a>
</div>

<form class="toolbar" method="get">
    <input name="q" value="{{ request('q') }}" placeholder="Cari judul artikel...">
    <select name="status">
        <option value="">Semua status</option>
        <option value="draft" @selected(request('status')==='draft')>Draft</option>
        <option value="published" @selected(request('status')==='published')>Published</option>
    </select>
    <button class="btn btn-dark">Filter</button>
</form>

<div class="article-list">
@forelse($articles as $article)
    <div class="article-row">
        <div>
            <a class="lead-title" href="{{ route('admin.articles.edit', $article) }}">{{ $article->title }}</a>
            <div class="muted">/{{ $article->slug }} · {{ $article->updated_at->diffForHumans() }}</div>
        </div>
        <div class="article-actions">
            <span class="status-badge {{ $article->status==='published' ? 'status-qualified' : 'status-new' }}">{{ $article->status }}</span>
            @if($article->status==='published')<a target="_blank" href="{{ route('articles.show',$article->slug) }}">Lihat ↗</a>@endif
        </div>
    </div>
@empty
    <div class="empty-state">Belum ada artikel.</div>
@endforelse
</div>

<div class="pager">{{ $articles->links() }}</div>
@endsection
