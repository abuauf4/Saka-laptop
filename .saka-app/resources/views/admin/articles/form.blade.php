@extends('layouts.admin')
@section('title', $article->exists ? 'Edit Artikel' : 'Artikel Baru')
@section('content')
<div class="topline">
    <div>
        <a class="back-link" href="{{ route('admin.articles.index') }}">← Artikel</a>
        <h1>{{ $article->exists ? 'Edit artikel' : 'Artikel baru' }}</h1>
    </div>
    @if($article->exists)
    <form method="post" action="{{ route('admin.articles.destroy',$article) }}" onsubmit="return confirm('Hapus artikel ini?')">
        @csrf @method('DELETE')
        <button class="btn danger-btn" type="submit">Hapus</button>
    </form>
    @endif
</div>

@if($errors->any())
<div class="error-box">@foreach($errors->all() as $error)<div>{{ $error }}</div>@endforeach</div>
@endif

<form class="article-editor" method="post" enctype="multipart/form-data" action="{{ $article->exists ? route('admin.articles.update',$article) : route('admin.articles.store') }}">
    @csrf
    @if($article->exists) @method('PUT') @endif

    <div class="editor-main">
        <div class="field">
            <label>Judul</label>
            <input name="title" value="{{ old('title',$article->title) }}" required>
        </div>
        <div class="field">
            <label>Slug <span class="muted">(kosongkan untuk otomatis)</span></label>
            <input name="slug" value="{{ old('slug',$article->slug) }}">
        </div>
        <div class="field">
            <label>Ringkasan</label>
            <textarea name="excerpt" rows="3">{{ old('excerpt',$article->excerpt) }}</textarea>
        </div>
        <div class="field">
            <label>Isi artikel</label>
            <textarea class="article-body" name="body" rows="24" required>{{ old('body',$article->body) }}</textarea>
        </div>
    </div>

    <aside class="editor-side">
        <div class="field">
            <label>Status</label>
            <select name="status">
                <option value="draft" @selected(old('status',$article->status ?: 'draft')==='draft')>Draft</option>
                <option value="published" @selected(old('status',$article->status)==='published')>Published</option>
            </select>
        </div>
        <div class="field">
            <label>Cover</label>
            @if($article->cover_path)<img class="cover-preview" src="{{ asset(ltrim($article->cover_path,'/')) }}" alt="">@endif
            <input type="file" name="cover" accept="image/*">
        </div>
        <div class="field">
            <label>Meta title</label>
            <input name="meta_title" value="{{ old('meta_title',$article->meta_title) }}">
        </div>
        <div class="field">
            <label>Meta description</label>
            <textarea name="meta_description" rows="5">{{ old('meta_description',$article->meta_description) }}</textarea>
        </div>
        <button class="btn btn-dark" style="width:100%">Simpan artikel</button>
    </aside>
</form>
@endsection
