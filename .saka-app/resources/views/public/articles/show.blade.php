@extends('layouts.public')
@section('title', $article->meta_title ?: $article->title)
@section('description', $article->meta_description ?: $article->excerpt)
@section('canonical', route('articles.show', $article->slug))
@section('og_type', 'article')
@if($article->cover_path)
@section('og_image', asset(ltrim($article->cover_path,'/')))
@endif

@push('head')
@php
$articleSchema = [
    '@context'=>'https://schema.org',
    '@type'=>'Article',
    'headline'=>$article->title,
    'description'=>$article->meta_description ?: $article->excerpt,
    'datePublished'=>optional($article->published_at)->toIso8601String(),
    'dateModified'=>$article->updated_at->toIso8601String(),
    'mainEntityOfPage'=>url()->current(),
    'publisher'=>['@type'=>'Organization','name'=>$globalSettings?->site_name ?: 'Saka Laptop'],
];
if($article->cover_path){$articleSchema['image']=[asset(ltrim($article->cover_path,'/'))];}
@endphp
<script type="application/ld+json">{!! json_encode(array_filter($articleSchema), JSON_UNESCAPED_SLASHES|JSON_UNESCAPED_UNICODE) !!}</script>
@endpush

@section('content')
<article class="article-page">
    <header class="article-header container">
        <a class="back-link public-back" href="{{ route('articles.index') }}">← Semua artikel</a>
        <span class="section-kicker">Panduan</span>
        <h1>{{ $article->title }}</h1>
        @if($article->excerpt)<p>{{ $article->excerpt }}</p>@endif
        <div class="article-byline">{{ optional($article->published_at)->format('d M Y') ?: $article->created_at->format('d M Y') }} · {{ $globalSettings?->site_name ?: 'Saka Laptop' }}</div>
    </header>

    @if($article->cover_path)
        <div class="container article-cover"><img src="{{ asset(ltrim($article->cover_path,'/')) }}" alt="{{ $article->title }}"></div>
    @endif

    <div class="container article-body-public">
        {!! nl2br(e($article->body)) !!}
    </div>
</article>

<section class="article-cta">
    <div class="container">
        <div><span class="section-kicker">Siap lanjut?</span><h2>Ajukan laptopmu untuk direview.</h2></div>
        <a class="button button-dark" href="{{ route('home') }}#ajukan">Kirim detail laptop</a>
    </div>
</section>
@endsection
