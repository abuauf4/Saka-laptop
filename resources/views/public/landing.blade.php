@extends('layouts.public')
@php
$landingCopy = [
    'jual-laptop-bekas-jakarta' => [
        'eyebrow'=>'Jual laptop bekas Jakarta',
        'title'=>'Jual Laptop Bekas di Jakarta Tanpa Proses Berbelit.',
        'desc'=>'Kirim detail perangkat dari rumah. Kami review kondisi awal lalu lanjutkan pengecekan untuk penawaran yang jelas.',
    ],
    'jual-laptop-jakarta' => [
        'eyebrow'=>'Jual laptop Jakarta',
        'title'=>'Punya Laptop yang Mau Dijual di Jakarta?',
        'desc'=>'Ajukan dulu detailnya. Tim kami akan menghubungi kamu lewat WhatsApp untuk melanjutkan proses pengecekan.',
    ],
    'jual-macbook-bekas-jakarta' => [
        'eyebrow'=>'Jual MacBook bekas',
        'title'=>'Jual MacBook Bekas dengan Penilaian yang Transparan.',
        'desc'=>'MacBook Air atau Pro bisa diajukan dari rumah. Sertakan model, spesifikasi, kondisi, dan kelengkapannya.',
    ],
    'jual-laptop-gaming-bekas' => [
        'eyebrow'=>'Jual laptop gaming bekas',
        'title'=>'Laptop Gaming Lama Masih Punya Nilai.',
        'desc'=>'ROG, TUF, Legion, MSI, Predator, dan laptop gaming lain bisa diajukan untuk pengecekan kondisi.',
    ],
    'jual-laptop-kantor-bekas' => [
        'eyebrow'=>'Laptop kantor & aset IT',
        'title'=>'Lepas Laptop Kantor Bekas dengan Proses yang Rapi.',
        'desc'=>'Untuk satu unit maupun kebutuhan aset kantor, kirim detail awal agar tim kami bisa menindaklanjuti dengan lebih efisien.',
    ],
    'tukar-tambah-laptop' => [
        'eyebrow'=>'Tukar tambah laptop',
        'title'=>'Mulai dari Nilai Laptop Lamamu.',
        'desc'=>'Ajukan perangkat lama lebih dulu untuk mengetahui kondisinya sebelum melanjutkan opsi tukar tambah.',
    ],
];
$copy = $landingCopy[$slug] ?? ['eyebrow'=>'Jakarta Laptops','title'=>$content->hero_title,'desc'=>$content->hero_subtitle];
@endphp
@section('title', $copy['title'].' — '.($settings->site_name ?: 'Jakarta Laptops'))
@section('description', $copy['desc'])

@section('content')
<section class="landing-hero" style="--hero:url('{{ asset(ltrim($content->hero_image ?: '/Hero.webp','/')) }}')">
    <div class="hero-overlay"></div>
    <div class="container landing-copy">
        <span class="hero-pill"><i></i>{{ $copy['eyebrow'] }}</span>
        <h1>{{ $copy['title'] }}</h1>
        <p>{{ $copy['desc'] }}</p>
        <div class="hero-actions">
            <a class="button button-light" href="#kirim-detail">Kirim detail laptop</a>
            <a class="button button-ghost" href="{{ route('home') }}#proses">Lihat proses</a>
        </div>
    </div>
</section>

<section class="trust-strip">
    <div class="container trust-grid">
        @foreach(($content->trust_stats ?? []) as $item)
        <article><strong>{{ $item['stat'] ?? '' }}</strong><span>{{ $item['label'] ?? '' }}</span><p>{{ $item['desc'] ?? '' }}</p></article>
        @endforeach
    </div>
</section>

<section class="public-section">
    <div class="container section-heading">
        <span class="section-kicker">Proses sederhana</span>
        <h2>Mulai online, lanjutkan setelah datanya jelas.</h2>
        <p>Nggak perlu langsung datang hanya untuk menjelaskan unit. Kirim detail utama dulu, lalu tim kami follow-up.</p>
    </div>
    <div class="container process-list compact-process">
        @foreach(array_slice($content->workflow_stages ?? [],0,4) as $stage)
        <article><div class="step-number">{{ $stage['n'] ?? '' }}</div><div><h3>{{ $stage['title'] ?? '' }}</h3><p>{{ $stage['desc'] ?? '' }}</p></div></article>
        @endforeach
    </div>
</section>

<section id="kirim-detail" class="lead-section compact-lead">
    <div class="container lead-layout">
        <div class="lead-copy">
            <span class="section-kicker light">{{ $copy['eyebrow'] }}</span>
            <h2>Kirim data utamanya dulu.</h2>
            <p>Form ini langsung masuk ke tim kami. Setelah itu komunikasi dilanjutkan lewat WhatsApp.</p>
        </div>
        <form class="lead-form" method="post" action="{{ route('leads.store') }}">
            @csrf
            <input type="hidden" name="source" value="{{ url()->current() }}">
            <div class="hp-field" aria-hidden="true"><label>Website</label><input name="website" tabindex="-1" autocomplete="off"></div>
            @if(session('lead_sent'))<div class="lead-success"><strong>Data sudah masuk.</strong><span>Tim kami akan lanjutkan lewat WhatsApp.</span></div>@endif
            <div class="form-row">
                <label>Nama<input name="name" value="{{ old('name') }}" required placeholder="Nama kamu"></label>
                <label>WhatsApp<input name="whatsapp" value="{{ old('whatsapp') }}" required inputmode="tel" placeholder="08xxxxxxxxxx"></label>
            </div>
            <div class="form-row">
                <label>Nama / tipe laptop<input name="device_name" value="{{ old('device_name') }}" required placeholder="Contoh: MacBook Air M2"></label>
                <label>Brand<input name="brand" value="{{ old('brand') }}" placeholder="Apple, Lenovo, ASUS..."></label>
            </div>
            <label>Spesifikasi & kondisi<textarea name="specifications" rows="3" placeholder="Processor, RAM, SSD, kondisi umum">{{ old('specifications') }}</textarea></label>
            <label>Catatan<textarea name="condition" rows="3" placeholder="Minus layar, baterai, fisik, kelengkapan, dll.">{{ old('condition') }}</textarea></label>
            <button class="button submit-lead" type="submit">Kirim pengajuan →</button>
        </form>
    </div>
</section>

<section class="public-section soft-section">
    <div class="container faq-layout">
        <div class="section-heading"><span class="section-kicker">FAQ</span><h2>Yang biasanya ditanyakan.</h2></div>
        <div class="faq-list">
            @foreach(array_slice($content->faqs ?? [],0,4) as $faq)
            <details @if($loop->first) open @endif><summary>{{ $faq['q'] ?? '' }}<span>+</span></summary><p>{{ $faq['a'] ?? '' }}</p></details>
            @endforeach
        </div>
    </div>
</section>
@endsection
