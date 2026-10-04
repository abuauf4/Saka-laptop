@extends('layouts.public')

@section('title', $settings->seo_title ?: $settings->site_name.' — Jual Laptop Bekas dengan Proses Transparan')
@section('description', $settings->seo_description ?: $content->hero_subtitle)

@push('head')
@php
$schema = [
    '@context' => 'https://schema.org',
    '@type' => 'LocalBusiness',
    'name' => $settings->site_name,
    'url' => url('/'),
    'telephone' => $settings->phone ?: $settings->whatsapp,
    'email' => $settings->email,
    'address' => $settings->address ? ['@type'=>'PostalAddress','streetAddress'=>$settings->address,'addressCountry'=>'ID'] : null,
];
@endphp
<script type="application/ld+json">{!! json_encode(array_filter($schema), JSON_UNESCAPED_SLASHES|JSON_UNESCAPED_UNICODE) !!}</script>
@endpush

@section('content')
<section class="home-hero" style="--hero:url('{{ asset(ltrim($content->hero_image ?: '/Hero.webp','/')) }}')">
    <div class="hero-overlay"></div>
    <div class="container hero-copy">
        <span class="hero-pill"><i></i>{{ $content->hero_eyebrow }}</span>
        <h1>{{ $content->hero_title }}</h1>
        <p>{{ $content->hero_subtitle }}</p>
        <div class="hero-actions">
            <a class="button button-light" href="#ajukan">Ajukan laptop</a>
            <a class="button button-ghost" href="#proses">Lihat proses</a>
        </div>
        <div class="hero-trust">
            <span>✓ QC terstruktur</span>
            <span>✓ Penawaran jelas</span>
            <span>✓ Tanpa kewajiban deal</span>
        </div>
    </div>
</section>

<section class="trust-strip">
    <div class="container trust-grid">
        @foreach(($content->trust_stats ?? []) as $item)
        <article>
            <strong>{{ $item['stat'] ?? '' }}</strong>
            <span>{{ $item['label'] ?? '' }}</span>
            <p>{{ $item['desc'] ?? '' }}</p>
        </article>
        @endforeach
    </div>
</section>

<section class="public-section soft-section">
    <div class="container split-intro">
        <div>
            <span class="section-kicker">Cara kami bekerja</span>
            <h2>{{ $content->brand_title }}</h2>
        </div>
        <p>{{ $content->brand_copy }}</p>
    </div>
    <div class="container principle-list">
        @foreach(($content->brand_points ?? []) as $point)
        <article>
            <span class="principle-index">0{{ $loop->iteration }}</span>
            <div><h3>{{ $point['title'] ?? '' }}</h3><p>{{ $point['desc'] ?? '' }}</p></div>
        </article>
        @endforeach
    </div>
</section>

<section id="proses" class="public-section">
    <div class="container section-heading">
        <span class="section-kicker">Alur kerja</span>
        <h2>Dari pengajuan sampai keputusan.</h2>
        <p>Lima langkah sederhana. Kamu tahu apa yang sedang terjadi di setiap tahap.</p>
    </div>
    <div class="container process-list">
        @foreach(($content->workflow_stages ?? []) as $stage)
        <article>
            <div class="step-number">{{ $stage['n'] ?? str_pad((string)$loop->iteration,2,'0',STR_PAD_LEFT) }}</div>
            <div><h3>{{ $stage['title'] ?? '' }}</h3><p>{{ $stage['desc'] ?? '' }}</p></div>
        </article>
        @endforeach
    </div>
</section>

<section id="toko" class="public-section soft-section">
    <div class="container section-heading">
        <span class="section-kicker">Bukan sekadar landing page</span>
        <h2>Toko & aktivitas nyata.</h2>
        <p>Beberapa aktivitas dan area kerja kami saat menangani perangkat.</p>
    </div>
    @php
    $photos = [
        ['/assets/homepage/toko-pembongkaran.webp','Proses pemeriksaan perangkat'],
        ['/assets/homepage/toko-tertata-rapih.webp','Area kerja'],
        ['/assets/homepage/toko-photo-2.webp','Pengecekan fungsi'],
        ['/assets/homepage/toko-photo-3.webp','Aktivitas toko'],
        ['/assets/homepage/toko-photo-4.webp','Laptop & MacBook'],
        ['/assets/homepage/toko-photo-5.webp','Aktivitas harian'],
        ['/assets/homepage/toko-photo-6.webp','Penanganan perangkat'],
    ];
    @endphp
    <div class="container store-gallery">
        @foreach($photos as [$src,$alt])
        <figure class="{{ $loop->first ? 'gallery-featured' : '' }}">
            <img src="{{ asset(ltrim($src,'/')) }}" alt="{{ $alt }}" loading="{{ $loop->first ? 'eager' : 'lazy' }}">
            <figcaption>{{ $alt }}</figcaption>
        </figure>
        @endforeach
    </div>
</section>

<section class="public-section">
    <div class="container section-heading">
        <span class="section-kicker">Yang kami terima</span>
        <h2>Bukan cuma satu jenis laptop.</h2>
        <p>Dari laptop harian sampai aset IT kantor bisa diajukan untuk direview.</p>
    </div>
    <div class="container device-grid">
        @foreach(($content->device_categories ?? []) as $category)
            <div><span>{{ str_pad((string)$loop->iteration,2,'0',STR_PAD_LEFT) }}</span>{{ $category['label'] ?? '' }}</div>
        @endforeach
    </div>
</section>

<section id="ajukan" class="lead-section">
    <div class="container lead-layout">
        <div class="lead-copy">
            <span class="section-kicker light">Mulai dari sini</span>
            <h2>Kirim detail laptopmu.</h2>
            <p>Nggak perlu nulis panjang. Isi data utama dulu; lead langsung masuk ke tim dan kami lanjutkan lewat WhatsApp.</p>
            <div class="lead-points">
                <span>01 <b>Isi data perangkat</b></span>
                <span>02 <b>Tim review</b></span>
                <span>03 <b>Kami hubungi via WhatsApp</b></span>
            </div>
        </div>

        <form class="lead-form" method="post" action="{{ route('leads.store') }}">
            @csrf
            <input type="hidden" name="source" value="{{ url()->current() }}">
            <div class="hp-field" aria-hidden="true"><label>Website</label><input name="website" tabindex="-1" autocomplete="off"></div>

            @if(session('lead_sent'))
                <div class="lead-success">
                    <strong>Data sudah masuk.</strong>
                    <span>Tim kami akan lanjutkan lewat WhatsApp.</span>
                </div>
            @endif

            @if($errors->any())
                <div class="lead-error">Ada data yang belum benar. Cek kembali field yang ditandai.</div>
            @endif

            <div class="form-row">
                <label>Nama
                    <input name="name" value="{{ old('name') }}" placeholder="Nama kamu" required>
                    @error('name')<small>{{ $message }}</small>@enderror
                </label>
                <label>WhatsApp
                    <input name="whatsapp" value="{{ old('whatsapp') }}" inputmode="tel" placeholder="08xxxxxxxxxx" required>
                    @error('whatsapp')<small>{{ $message }}</small>@enderror
                </label>
            </div>

            <div class="form-row">
                <label>Nama / tipe laptop
                    <input name="device_name" value="{{ old('device_name') }}" placeholder="Contoh: ThinkPad T14 Gen 2" required>
                    @error('device_name')<small>{{ $message }}</small>@enderror
                </label>
                <label>Brand
                    <input name="brand" value="{{ old('brand') }}" placeholder="Lenovo, ASUS, Apple...">
                </label>
            </div>

            <label>Spesifikasi utama
                <textarea name="specifications" rows="3" placeholder="Processor, RAM, SSD, GPU bila ada">{{ old('specifications') }}</textarea>
            </label>

            <label>Kondisi
                <textarea name="condition" rows="3" placeholder="Normal, baterai soak, layar shadow, minus fisik, dll.">{{ old('condition') }}</textarea>
            </label>

            <label>Catatan tambahan <span>(opsional)</span>
                <textarea name="notes" rows="3" placeholder="Kelengkapan, tahun beli, atau hal lain yang perlu kami tahu">{{ old('notes') }}</textarea>
            </label>

            <button class="button submit-lead" type="submit">Kirim pengajuan →</button>
            <p class="form-note">Dengan mengirim form, kamu setuju dihubungi terkait pengajuan ini.</p>
        </form>
    </div>
</section>

@if($testimonials->isNotEmpty())
<section class="public-section">
    <div class="container section-heading">
        <span class="section-kicker">Pengalaman customer</span>
        <h2>Apa kata mereka.</h2>
    </div>
    <div class="container testimonial-grid">
        @foreach($testimonials as $testimonial)
        <blockquote>
            <div class="stars">{{ str_repeat('★', max(1,min(5,$testimonial->rating))) }}</div>
            <p>“{{ $testimonial->body }}”</p>
            <footer><strong>{{ $testimonial->name }}</strong><span>{{ $testimonial->role }}{{ $testimonial->device ? ' · '.$testimonial->device : '' }}</span></footer>
        </blockquote>
        @endforeach
    </div>
</section>
@endif

<section id="faq" class="public-section soft-section">
    <div class="container faq-layout">
        <div class="section-heading">
            <span class="section-kicker">FAQ</span>
            <h2>Pertanyaan yang sering muncul.</h2>
        </div>
        <div class="faq-list">
            @foreach(($content->faqs ?? []) as $faq)
            <details @if($loop->first) open @endif>
                <summary>{{ $faq['q'] ?? '' }}<span>+</span></summary>
                <p>{{ $faq['a'] ?? '' }}</p>
            </details>
            @endforeach
        </div>
    </div>
</section>

<section class="closing-cta">
    <div class="container">
        <span class="section-kicker light">Masih ragu?</span>
        <h2>{{ $content->closing_title }}</h2>
        <p>{{ $content->closing_subtitle }}</p>
        <a class="button button-light" href="#ajukan">Ajukan laptop sekarang</a>
    </div>
</section>
@endsection
