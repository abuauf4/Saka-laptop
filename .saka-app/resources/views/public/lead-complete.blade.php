@extends('layouts.public')

@section('title', 'Pengajuan berhasil — Saka Laptop')

@push('head')
<meta name="robots" content="noindex,nofollow">
@endpush

@section('content')
<section style="min-height:100svh;display:grid;place-items:center;background:#11120f;color:#fff;padding:110px 20px 40px;text-align:center">
    <div style="max-width:520px">
        <div style="font-size:12px;letter-spacing:.12em;text-transform:uppercase;color:#d6bd7a;font-weight:800;margin-bottom:12px">Pengajuan diterima</div>
        <h1 style="font-size:clamp(34px,8vw,52px);line-height:1.05;margin:0 0 14px">Data laptopmu sudah masuk.</h1>
        <p style="color:rgba(255,255,255,.72);margin:0 0 24px">Sebentar, kami arahkan kamu ke WhatsApp untuk melanjutkan percakapan.</p>
        <a id="continue-whatsapp" class="button button-light" href="{{ $whatsappUrl }}">Lanjut ke WhatsApp</a>
    </div>
</section>

<script>
(function () {
    const whatsappUrl = @json($whatsappUrl);
    let redirected = false;

    function goToWhatsapp() {
        if (redirected) return;
        redirected = true;
        window.location.replace(whatsappUrl);
    }

    if (typeof window.gtag === 'function') {
        window.gtag('event', 'conversion', {
            'send_to': 'AW-18221664763/bBzXCNHK85AdEPuT4vBD',
            'event_callback': goToWhatsapp
        });
    }

    window.setTimeout(goToWhatsapp, 1200);
})();
</script>
@endsection
