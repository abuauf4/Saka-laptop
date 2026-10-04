@extends('layouts.public')
@section('title', 'Tentang Kami — '.$settings->site_name)
@section('description', 'Kenali proses dan cara kerja '.$settings->site_name.' dalam menerima laptop bekas.')

@section('content')
<section class="inner-hero">
    <div class="container">
        <span class="section-kicker light">Tentang kami</span>
        <h1>{{ $content->brand_title }}</h1>
        <p>{{ $content->brand_copy }}</p>
    </div>
</section>

<section class="public-section">
    <div class="container about-grid">
        <div>
            <span class="section-kicker">Cara kerja</span>
            <h2>Lebih penting prosesnya jelas daripada janji yang berlebihan.</h2>
        </div>
        <div>
            <p>Kami membantu pemilik perangkat melepas laptop lama dengan alur yang mudah dipahami: data awal, pengecekan, lalu penawaran berdasarkan kondisi aktual.</p>
            @if($settings->address)<p><strong>Lokasi:</strong><br>{{ $settings->address }}</p>@endif
            @if($settings->opening_hours)<p><strong>Jam operasional:</strong><br>{{ $settings->opening_hours }}</p>@endif
            <a class="button button-dark" href="{{ route('home') }}#ajukan">Ajukan laptop</a>
        </div>
    </div>
</section>

<section class="public-section soft-section">
    <div class="container process-list">
        @foreach(($content->workflow_stages ?? []) as $stage)
        <article>
            <div class="step-number">{{ $stage['n'] ?? '' }}</div>
            <div><h3>{{ $stage['title'] ?? '' }}</h3><p>{{ $stage['desc'] ?? '' }}</p></div>
        </article>
        @endforeach
    </div>
</section>
@endsection
