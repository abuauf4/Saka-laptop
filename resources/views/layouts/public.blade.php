<!doctype html>
<html lang="id">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="theme-color" content="#10110f">
    <title>@yield('title', $globalSettings?->seo_title ?: (($globalSettings?->site_name ?: 'Jakarta Laptops').' — Jual Laptop Bekas'))</title>
    <meta name="description" content="@yield('description', $globalSettings?->seo_description ?: 'Ajukan laptop bekas, dapatkan pengecekan yang jelas dan penawaran berdasarkan kondisi aktual perangkat.')">
    <link rel="canonical" href="{{ url()->current() }}">
    <meta property="og:type" content="website">
    <meta property="og:site_name" content="{{ $globalSettings?->site_name ?: 'Jakarta Laptops' }}">
    <meta property="og:title" content="@yield('og_title', trim($__env->yieldContent('title')) ?: ($globalSettings?->site_name ?: 'Jakarta Laptops'))">
    <meta property="og:description" content="@yield('og_description', trim($__env->yieldContent('description')) ?: 'Jual laptop bekas dengan proses yang jelas dan praktis.')">
    <meta property="og:url" content="{{ url()->current() }}">
    <link rel="icon" href="{{ asset('assets/homepage/logo.jpg') }}">
    <link rel="stylesheet" href="{{ asset('assets/v2/app.css') }}">
    @stack('head')
</head>
<body>
<header class="public-header">
    <div class="container public-nav">
        <a class="public-brand" href="{{ route('home') }}">
            <img src="{{ asset('assets/homepage/logo.jpg') }}" alt="{{ $globalSettings?->site_name ?: 'Jakarta Laptops' }}">
            <span>{{ $globalSettings?->site_name ?: 'Jakarta Laptops' }}</span>
        </a>

        <nav class="desktop-nav" aria-label="Navigasi utama">
            <a href="{{ route('home') }}#proses">Proses</a>
            <a href="{{ route('home') }}#toko">Toko</a>
            <a href="{{ route('about') }}">Tentang</a>
            <a href="{{ route('articles.index') }}">Artikel</a>
            <a href="{{ route('home') }}#faq">FAQ</a>
            <a class="nav-cta" href="{{ route('home') }}#ajukan">Ajukan laptop</a>
        </nav>

        <details class="mobile-nav">
            <summary aria-label="Buka menu">Menu</summary>
            <div class="mobile-menu">
                <a href="{{ route('home') }}#proses">Proses</a>
                <a href="{{ route('home') }}#toko">Toko</a>
                <a href="{{ route('about') }}">Tentang</a>
                <a href="{{ route('articles.index') }}">Artikel</a>
                <a href="{{ route('home') }}#faq">FAQ</a>
                <a href="{{ route('home') }}#ajukan">Ajukan laptop</a>
            </div>
        </details>
    </div>
</header>

<main>@yield('content')</main>

<footer class="public-footer">
    <div class="container footer-grid">
        <div>
            <div class="footer-brand">
                <img src="{{ asset('assets/homepage/logo.jpg') }}" alt="">
                <strong>{{ $globalSettings?->site_name ?: 'Jakarta Laptops' }}</strong>
            </div>
            <p>Laptop lamamu masih bernilai. Ajukan dari rumah, lanjutkan proses setelah detail perangkat kami review.</p>
        </div>

        <div>
            <span class="footer-label">Navigasi</span>
            <a href="{{ route('home') }}#proses">Proses</a>
            <a href="{{ route('home') }}#toko">Toko & aktivitas</a>
            <a href="{{ route('articles.index') }}">Artikel</a>
            <a href="{{ route('about') }}">Tentang</a>
        </div>

        <div>
            <span class="footer-label">Kontak</span>
            @if($globalSettings?->whatsapp)
                <a target="_blank" rel="noopener" href="https://wa.me/{{ preg_replace('/\D+/', '', $globalSettings->whatsapp) }}">WhatsApp {{ $globalSettings->whatsapp }}</a>
            @endif
            @if($globalSettings?->email)<a href="mailto:{{ $globalSettings->email }}">{{ $globalSettings->email }}</a>@endif
            @if($globalSettings?->address)<p>{{ $globalSettings->address }}</p>@endif
        </div>
    </div>
    <div class="container footer-bottom">
        <span>© {{ date('Y') }} {{ $globalSettings?->site_name ?: 'Jakarta Laptops' }}</span>
        <span>Website by Nauka Motion</span>
    </div>
</footer>

@if($globalSettings?->whatsapp)
<a class="wa-fab" target="_blank" rel="noopener" aria-label="Chat WhatsApp" href="https://wa.me/{{ preg_replace('/\D+/', '', $globalSettings->whatsapp) }}">WA</a>
@endif
</body>
</html>
