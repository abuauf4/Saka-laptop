<!doctype html>
<html lang="id">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="theme-color" content="#10110f">
    <title>@yield('title', $globalSettings?->seo_title ?: (($globalSettings?->site_name ?: 'Saka Laptop').' — Jual Laptop Bekas'))</title>
    <meta name="description" content="@yield('description', $globalSettings?->seo_description ?: 'Ajukan laptop bekas, dapatkan pengecekan yang jelas dan penawaran berdasarkan kondisi aktual perangkat.')">
    <meta name="robots" content="index,follow,max-image-preview:large">
    <link rel="canonical" href="@yield('canonical', url()->current())">
    <meta property="og:type" content="@yield('og_type', 'website')">
    <meta property="og:site_name" content="{{ $globalSettings?->site_name ?: 'Saka Laptop' }}">
    <meta property="og:title" content="@yield('og_title', trim($__env->yieldContent('title')) ?: ($globalSettings?->site_name ?: 'Saka Laptop'))">
    <meta property="og:description" content="@yield('og_description', trim($__env->yieldContent('description')) ?: 'Jual laptop bekas dengan proses yang jelas dan praktis.')">
    <meta property="og:url" content="@yield('canonical', url()->current())">
    <link rel="icon" href="{{ asset('assets/homepage/logo.jpg') }}">
    <link rel="stylesheet" href="{{ asset('assets/v2/app.css') }}">
    @stack('head')
</head>
<body>
<header class="public-header">
    <div class="container public-nav">
        <a class="public-brand" href="{{ route('home') }}">
            <span class="brand-mark brand-mark-header">
                <img src="{{ asset('assets/homepage/logo.jpg') }}" alt="{{ $globalSettings?->site_name ?: 'Saka Laptop' }}">
            </span>
            <span>{{ $globalSettings?->site_name ?: 'Saka Laptop' }}</span>
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
                <span class="brand-mark brand-mark-footer">
                    <img src="{{ asset('assets/homepage/logo.jpg') }}" alt="">
                </span>
                <strong>{{ $globalSettings?->site_name ?: 'Saka Laptop' }}</strong>
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
        <span>© {{ date('Y') }} {{ $globalSettings?->site_name ?: 'Saka Laptop' }}</span>
        <a class="developer-credit" href="https://motion.nauka.id" target="_blank" rel="noopener">
            <span>Designed &amp; developed by</span>
            <img src="{{ asset('assets/branding/nauka-motion.webp') }}" alt="Nauka Motion">
        </a>
    </div>
</footer>

@if($globalSettings?->whatsapp)
<a class="wa-fab" target="_blank" rel="noopener" aria-label="Chat WhatsApp" href="https://wa.me/{{ preg_replace('/\D+/', '', $globalSettings->whatsapp) }}">
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        <path fill="currentColor" d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479s1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.262.489 1.693.625.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.981.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884a9.82 9.82 0 0 1 6.988 2.895 9.825 9.825 0 0 1 2.9 6.988c-.003 5.45-4.437 9.884-9.892 9.884M20.465 3.488A11.815 11.815 0 0 0 12.055 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.056 24l6.305-1.654a11.882 11.882 0 0 0 5.689 1.448h.005c6.558 0 11.893-5.335 11.896-11.893a11.821 11.821 0 0 0-3.486-8.413Z"/>
    </svg>
</a>
@endif
</body>
</html>
