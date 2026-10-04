@extends('layouts.public')
@section('title', $settings->seo_title ?: $settings->site_name.' — Pusat Inspeksi & Trade-in Laptop Bekas')
@section('description', $settings->seo_description ?: $content->hero_subtitle)
@section('content')
<section class="hero" style="background-image:url('{{ asset(ltrim($content->hero_image ?: '/Hero.webp', '/')) }}')"><div class="container hero-inner"><span class="eyebrow">{{ $content->hero_eyebrow }}</span><h1>{{ $content->hero_title }}</h1><p>{{ $content->hero_subtitle }}</p><div class="actions">@if($settings->whatsapp)<a class="btn" target="_blank" rel="noopener" href="https://wa.me/{{ preg_replace('/\D+/', '', $settings->whatsapp) }}">Ajukan Laptop</a>@endif<a class="btn" href="#proses">Lihat Proses</a></div></div></section>
<section class="section"><div class="container"><div class="grid">@foreach(($content->trust_stats ?? []) as $item)<article class="card"><div class="stat">{{ $item['stat'] ?? '' }}</div><strong>{{ $item['label'] ?? '' }}</strong><p class="muted">{{ $item['desc'] ?? '' }}</p></article>@endforeach</div></div></section>
<section class="section" id="proses"><div class="container"><p class="muted">Saka Laptop v2</p><h2>{{ $content->brand_title }}</h2><p class="muted" style="max-width:720px">{{ $content->brand_copy }}</p></div></section>
@if($testimonials->isNotEmpty())<section class="section"><div class="container"><h2>Apa Kata Customer Kami</h2><div class="grid">@foreach($testimonials as $testimonial)<article class="card"><strong>{{ $testimonial->name }}</strong><p class="muted">{{ $testimonial->body }}</p></article>@endforeach</div></div></section>@endif
@endsection
