@extends('layouts.public')
@section('title', ucwords(str_replace('-', ' ', $slug)).' — '.($settings->site_name ?: 'Jakarta Laptops'))
@section('content')
<section class="hero" style="min-height:78vh;background-image:url('{{ asset(ltrim($content->hero_image ?: '/Hero.webp', '/')) }}')"><div class="container hero-inner"><span class="eyebrow">{{ strtoupper(str_replace('-', ' ', $slug)) }}</span><h1>{{ $content->hero_title }}</h1><p>{{ $content->hero_subtitle }}</p>@if($settings->whatsapp)<div class="actions"><a class="btn" target="_blank" rel="noopener" href="https://wa.me/{{ preg_replace('/\D+/', '', $settings->whatsapp) }}">Chat WhatsApp</a></div>@endif</div></section><section class="section"><div class="container"><h2>Proses transparan, penawaran jelas.</h2><p class="muted">Konten SEO spesifik per landing page akan dipindahkan dari versi Next.js pada tahap migrasi konten.</p></div></section>
@endsection
