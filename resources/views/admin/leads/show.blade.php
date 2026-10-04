@extends('layouts.admin')
@section('title', 'Detail Lead')
@section('content')
<div class="topline">
    <div>
        <a class="back-link" href="{{ route('admin.leads.index') }}">← Kembali</a>
        <h1>{{ $lead->name }}</h1>
        <p class="muted">{{ $lead->device_name }}@if($lead->brand) · {{ $lead->brand }}@endif</p>
    </div>
    <a class="btn btn-dark" target="_blank" rel="noopener" href="https://wa.me/{{ preg_replace('/\D+/', '', $lead->whatsapp) }}">Chat WhatsApp</a>
</div>

<div class="detail-grid">
    <section class="detail-card">
        <h3>Data customer</h3>
        <dl class="detail-list">
            <div><dt>Nama</dt><dd>{{ $lead->name }}</dd></div>
            <div><dt>WhatsApp</dt><dd>+{{ $lead->whatsappNumber() }}</dd></div>
            <div><dt>Perangkat</dt><dd>{{ $lead->device_name }}</dd></div>
            <div><dt>Brand</dt><dd>{{ $lead->brand ?: '—' }}</dd></div>
            <div><dt>Spesifikasi</dt><dd>{!! nl2br(e($lead->specifications ?: '—')) !!}</dd></div>
            <div><dt>Kondisi</dt><dd>{!! nl2br(e($lead->condition ?: '—')) !!}</dd></div>
            <div><dt>Catatan customer</dt><dd>{!! nl2br(e($lead->notes ?: '—')) !!}</dd></div>
            <div><dt>Sumber</dt><dd>{{ $lead->source ?: '—' }}</dd></div>
            <div><dt>Masuk</dt><dd>{{ $lead->created_at->format('d M Y, H:i') }}</dd></div>
        </dl>
    </section>

    <section class="detail-card">
        <h3>Tindak lanjut</h3>
        <form method="post" action="{{ route('admin.leads.update', $lead) }}">
            @csrf @method('PATCH')
            <div class="field">
                <label>Status</label>
                <select name="status">
                    @foreach(['new'=>'Baru','contacted'=>'Dihubungi','qualified'=>'Potensial','closed'=>'Selesai'] as $value=>$label)
                        <option value="{{ $value }}" @selected($lead->status===$value)>{{ $label }}</option>
                    @endforeach
                </select>
            </div>
            <div class="field">
                <label>Catatan internal</label>
                <textarea name="admin_notes" rows="9" placeholder="Catatan follow-up, harga, hasil chat, dll.">{{ old('admin_notes',$lead->admin_notes) }}</textarea>
            </div>
            <button class="btn btn-dark">Simpan</button>
        </form>
    </section>
</div>
@endsection
