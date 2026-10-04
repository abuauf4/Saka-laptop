@extends('layouts.public')
@section('title', $article->meta_title ?: $article->title)
@section('description', $article->meta_description ?: $article->excerpt)
@section('content')
<article class="section" style="padding-top:140px"><div class="container" style="max-width:820px"><h1 style="font-size:clamp(36px,6vw,64px);letter-spacing:-.05em">{{ $article->title }}</h1>@if($article->excerpt)<p class="muted">{{ $article->excerpt }}</p>@endif<div style="margin-top:32px">{!! nl2br(e($article->body)) !!}</div></div></article>
@endsection
