<!doctype html>
<html lang="id">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>@yield('title', 'Backend') — Saka Laptop</title>
    <link rel="stylesheet" href="{{ asset('assets/v2/app.css') }}">
</head>
<body>
<div class="admin-shell">
    <aside class="sidebar">
        <a href="{{ route('admin.leads.index') }}" class="admin-brand">Saka Laptop</a>
        <p class="sidebar-kicker">Backend ringan</p>
        <nav class="sidebar-nav">
            <a href="{{ route('admin.leads.index') }}" @class(['active' => request()->routeIs('admin.leads.*')])>Leads</a>
            <a href="{{ route('admin.articles.index') }}" @class(['active' => request()->routeIs('admin.articles.*')])>Artikel</a>
            <a href="{{ route('home') }}" target="_blank" rel="noopener">Lihat website ↗</a>
        </nav>
        <form method="post" action="{{ route('logout') }}" class="sidebar-logout">
            @csrf
            <button type="submit">Keluar</button>
        </form>
    </aside>
    <main class="content">
        @if(session('status'))<div class="alert">{{ session('status') }}</div>@endif
        @yield('content')
    </main>
</div>
</body>
</html>
