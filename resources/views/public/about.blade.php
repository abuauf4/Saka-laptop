@extends('layouts.public')
@section('title', 'Tentang Kami — '.$settings->site_name)
@section('content')
<section class="section" style="padding-top:140px"><div class="container"><p class="muted">Tentang Kami</p><h2>{{ $content->brand_title }}</h2><p class="muted" style="max-width:760px">{{ $content->brand_copy }}</p><div class="card" style="margin-top:28px"><strong>{{ $settings->site_name }}</strong><p>{{ $settings->address }}</p><p>{{ $settings->opening_hours }}</p></div></div></section>
@endsection
