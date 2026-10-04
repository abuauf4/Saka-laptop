<!doctype html>
<html lang="id">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>@yield('title', $globalSettings?->seo_title ?: $globalSettings?->site_name ?: 'Jakarta Laptops')</title>
    <meta name="description" content="@yield('description', $globalSettings?->seo_description ?: 'Pusat inspeksi dan trade-in laptop bekas.')">
    <link rel="canonical" href="{{ url()->current() }}">
    <link rel="stylesheet" href="{{ asset('assets/v2/app.css') }}">
    @stack('head')
</head>
<body>
<header class="site-header"><div class="container nav"><a class="brand" href="{{ route('home') }}">{{ $globalSettings?->site_name ?: 'Jakarta Laptops' }}</a><nav class="nav-links"><a href="{{ route('home') }}#proses">Proses</a><a href="{{ route('about') }}">Tentang</a><a href="{{ route('articles.index') }}">Artikel</a>@if($globalSettings?->whatsapp)<a class="btn" target="_blank" rel="noopener" href="https://wa.me/{{ preg_replace('/\D+/', '', $globalSettings->whatsapp) }}">Ajukan Laptop</a>@endif</nav></div></header>
@yield('content')
</body>
</html>
