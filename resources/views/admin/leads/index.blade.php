@extends('layouts.admin')
@section('title', 'Leads')
@section('content')
<div class="topline">
    <div>
        <p class="admin-eyebrow">Customer masuk</p>
        <h1>Leads</h1>
        <p class="muted">Semua calon customer dari website masuk ke sini.</p>
    </div>
</div>

<div class="lead-stats">
    <a href="{{ route('admin.leads.index', ['status'=>'new']) }}" class="metric"><span>Baru</span><strong>{{ $counts['new'] }}</strong></a>
    <a href="{{ route('admin.leads.index', ['status'=>'contacted']) }}" class="metric"><span>Dihubungi</span><strong>{{ $counts['contacted'] }}</strong></a>
    <a href="{{ route('admin.leads.index', ['status'=>'qualified']) }}" class="metric"><span>Potensial</span><strong>{{ $counts['qualified'] }}</strong></a>
    <a href="{{ route('admin.leads.index', ['status'=>'closed']) }}" class="metric"><span>Selesai</span><strong>{{ $counts['closed'] }}</strong></a>
</div>

<form class="toolbar" method="get">
    <input name="q" value="{{ request('q') }}" placeholder="Cari nama, WA, laptop...">
    <select name="status">
        <option value="">Semua status</option>
        @foreach(['new'=>'Baru','contacted'=>'Dihubungi','qualified'=>'Potensial','closed'=>'Selesai'] as $value=>$label)
            <option value="{{ $value }}" @selected(request('status')===$value)>{{ $label }}</option>
        @endforeach
    </select>
    <button class="btn btn-dark">Filter</button>
</form>

<div class="lead-list">
@forelse($leads as $lead)
    <a class="lead-card" href="{{ route('admin.leads.show', $lead) }}">
        <div class="lead-main">
            <div class="lead-title">{{ $lead->name }}</div>
            <div class="muted">{{ $lead->device_name }}@if($lead->brand) · {{ $lead->brand }}@endif</div>
        </div>
        <div class="lead-meta">
            <span class="status-badge status-{{ $lead->status }}">{{ match($lead->status){'new'=>'Baru','contacted'=>'Dihubungi','qualified'=>'Potensial','closed'=>'Selesai'} }}</span>
            <span class="muted">{{ $lead->created_at->diffForHumans() }}</span>
        </div>
    </a>
@empty
    <div class="empty-state">Belum ada lead.</div>
@endforelse
</div>

<div class="pager">{{ $leads->links() }}</div>
@endsection
