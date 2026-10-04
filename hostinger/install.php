<?php
declare(strict_types=1);

session_start();

$basePath = dirname(__DIR__).'/saka-app';
$marker = $basePath.'/storage/app/.installed';
$tokenFile = $basePath.'/.install-token';

if (is_file($marker)) {
    http_response_code(404);
    exit('Not found');
}

if (! is_file($tokenFile)) {
    http_response_code(503);
    exit('Installer belum siap. Upload paket Hostinger lengkap terlebih dahulu.');
}

if (empty($_SESSION['install_csrf'])) {
    $_SESSION['install_csrf'] = bin2hex(random_bytes(24));
}

function h(?string $value): string
{
    return htmlspecialchars((string) $value, ENT_QUOTES, 'UTF-8');
}

function envQuote(string $value): string
{
    $value = str_replace(["\r", "\n"], '', $value);
    $value = str_replace(['\\', '"'], ['\\\\', '\\"'], $value);
    return '"'.$value.'"';
}

function appUrl(): string
{
    $https = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off')
        || (($_SERVER['HTTP_X_FORWARDED_PROTO'] ?? '') === 'https');

    $scheme = $https ? 'https' : 'http';
    $host = $_SERVER['HTTP_HOST'] ?? 'jakartalaptops.com';

    return $scheme.'://'.$host;
}

$errors = [];
$success = false;

$values = [
    'install_code' => '',
    'db_host' => 'localhost',
    'db_port' => '3306',
    'db_database' => '',
    'db_username' => '',
    'db_password' => '',
    'admin_email' => 'admin@saka-laptop.id',
    'admin_password' => '',
];

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    foreach ($values as $key => $default) {
        $values[$key] = trim((string) ($_POST[$key] ?? $default));
    }

    if (! hash_equals($_SESSION['install_csrf'], (string) ($_POST['_token'] ?? ''))) {
        $errors[] = 'Sesi installer tidak valid. Muat ulang halaman lalu coba lagi.';
    }

    $expectedCode = trim((string) file_get_contents($tokenFile));
    if ($expectedCode === '' || ! hash_equals($expectedCode, $values['install_code'])) {
        $errors[] = 'Install Code salah.';
    }

    foreach (['db_host','db_port','db_database','db_username','admin_email','admin_password'] as $required) {
        if ($values[$required] === '') {
            $errors[] = 'Semua field wajib harus diisi.';
            break;
        }
    }

    if (! filter_var($values['admin_email'], FILTER_VALIDATE_EMAIL)) {
        $errors[] = 'Email admin tidak valid.';
    }

    if (strlen($values['admin_password']) < 10) {
        $errors[] = 'Password admin minimal 10 karakter.';
    }

    if (! $errors) {
        try {
            $dsn = 'mysql:host='.$values['db_host'].';port='.$values['db_port'].';dbname='.$values['db_database'].';charset=utf8mb4';
            $pdo = new PDO($dsn, $values['db_username'], $values['db_password'], [
                PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_TIMEOUT => 8,
            ]);
            $pdo->query('SELECT 1');
        } catch (Throwable $e) {
            $errors[] = 'Koneksi database gagal. Cek host, nama database, username, dan password MySQL.';
        }
    }

    if (! $errors) {
        try {
            $appKey = 'base64:'.base64_encode(random_bytes(32));
            $env = implode(PHP_EOL, [
                'APP_NAME='.envQuote('Saka Laptop'),
                'APP_ENV=production',
                'APP_KEY='.envQuote($appKey),
                'APP_DEBUG=false',
                'APP_URL='.envQuote(appUrl()),
                '',
                'APP_LOCALE=id',
                'APP_FALLBACK_LOCALE=id',
                'APP_FAKER_LOCALE=id_ID',
                '',
                'DB_CONNECTION=mysql',
                'DB_HOST='.envQuote($values['db_host']),
                'DB_PORT='.envQuote($values['db_port']),
                'DB_DATABASE='.envQuote($values['db_database']),
                'DB_USERNAME='.envQuote($values['db_username']),
                'DB_PASSWORD='.envQuote($values['db_password']),
                '',
                'SESSION_DRIVER=file',
                'SESSION_LIFETIME=120',
                'SESSION_SECURE_COOKIE=true',
                'CACHE_STORE=file',
                'QUEUE_CONNECTION=sync',
                'FILESYSTEM_DISK=public',
                '',
                'LOG_CHANNEL=single',
                'LOG_LEVEL=warning',
                '',
                'ADMIN_EMAIL='.envQuote(strtolower($values['admin_email'])),
                'ADMIN_PASSWORD='.envQuote($values['admin_password']),
                '',
            ]);

            if (file_put_contents($basePath.'/.env', $env, LOCK_EX) === false) {
                throw new RuntimeException('Tidak bisa menulis file .env');
            }

            require $basePath.'/vendor/autoload.php';
            $app = require $basePath.'/bootstrap/app.php';

            $kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
            $kernel->bootstrap();

            Illuminate\Support\Facades\Artisan::call('migrate', ['--force' => true]);
            Illuminate\Support\Facades\Artisan::call('db:seed', ['--force' => true]);
            Illuminate\Support\Facades\Artisan::call('optimize:clear');

            if (! is_dir(dirname($marker))) {
                mkdir(dirname($marker), 0755, true);
            }

            file_put_contents($marker, date(DATE_ATOM), LOCK_EX);
            @unlink($tokenFile);

            $success = true;
            session_regenerate_id(true);
        } catch (Throwable $e) {
            error_log('[Saka Installer] '.$e->getMessage());
            $errors[] = 'Instalasi gagal. Detail teknis disimpan di error log hosting. Pastikan PHP 8.3+ dan database benar.';
        }
    }
}
?>
<!doctype html>
<html lang="id">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Install Saka Laptop</title>
<style>
:root{color-scheme:light}*{box-sizing:border-box}body{margin:0;background:#f5f5f1;color:#171814;font-family:Inter,system-ui,-apple-system,sans-serif}.wrap{width:min(760px,calc(100% - 28px));margin:40px auto}.card{background:#fff;border:1px solid #e3e3dc;border-radius:24px;padding:28px;box-shadow:0 20px 70px rgba(20,20,18,.08)}h1{font-size:32px;letter-spacing:-.04em;margin:0 0 8px}.sub{color:#74756f;margin:0 0 26px}.grid{display:grid;grid-template-columns:1fr 1fr;gap:14px}.field{margin-bottom:14px}.field.full{grid-column:1/-1}label{display:block;font-size:12px;font-weight:800;margin-bottom:6px}input{width:100%;border:1px solid #d9d9d1;border-radius:12px;padding:12px 13px;font:inherit}.note{font-size:12px;color:#7a7b75}.error{background:#fff0ee;color:#98291e;border:1px solid #ffd2cc;padding:12px 14px;border-radius:12px;margin-bottom:14px}.ok{background:#eaf8ef;color:#145f39;border:1px solid #cdebd7;padding:18px;border-radius:16px}.btn{width:100%;border:0;border-radius:13px;background:#111;color:#fff;padding:14px 18px;font-weight:850;font-size:14px;cursor:pointer;margin-top:8px}.brand{font-size:12px;font-weight:900;letter-spacing:.12em;text-transform:uppercase;color:#9a7b39;margin-bottom:10px}@media(max-width:640px){.wrap{margin:18px auto}.card{padding:20px;border-radius:18px}.grid{grid-template-columns:1fr}.field.full{grid-column:auto}h1{font-size:28px}}
</style>
</head>
<body>
<div class="wrap">
<div class="card">
<div class="brand">Saka Laptop · Hostinger Installer</div>
<?php if ($success): ?>
    <div class="ok">
        <strong>Instalasi selesai.</strong>
        <p>Database, akun admin, dan konfigurasi aplikasi sudah siap. Installer otomatis dinonaktifkan.</p>
        <p><a href="/admin/login">Buka login admin →</a></p>
    </div>
<?php else: ?>
    <h1>Setup sekali, langsung jalan.</h1>
    <p class="sub">Isi data MySQL dari hPanel dan buat password admin. Tidak perlu edit file atau menjalankan command.</p>

    <?php foreach ($errors as $error): ?>
        <div class="error"><?= h($error) ?></div>
    <?php endforeach; ?>

    <form method="post" autocomplete="off">
        <input type="hidden" name="_token" value="<?= h($_SESSION['install_csrf']) ?>">
        <div class="field full">
            <label>Install Code</label>
            <input name="install_code" value="<?= h($values['install_code']) ?>" required>
            <div class="note">Lihat file INSTALL-CODE.txt di folder hasil extract.</div>
        </div>
        <div class="grid">
            <div class="field"><label>DB Host</label><input name="db_host" value="<?= h($values['db_host']) ?>" required></div>
            <div class="field"><label>DB Port</label><input name="db_port" value="<?= h($values['db_port']) ?>" inputmode="numeric" required></div>
            <div class="field"><label>Nama Database</label><input name="db_database" value="<?= h($values['db_database']) ?>" required></div>
            <div class="field"><label>Username Database</label><input name="db_username" value="<?= h($values['db_username']) ?>" required></div>
            <div class="field full"><label>Password Database</label><input type="password" name="db_password" value="" required></div>
            <div class="field"><label>Email Admin</label><input type="email" name="admin_email" value="<?= h($values['admin_email']) ?>" required></div>
            <div class="field"><label>Password Admin</label><input type="password" name="admin_password" value="" minlength="10" required></div>
        </div>
        <button class="btn" type="submit">Install Saka Laptop</button>
    </form>
<?php endif; ?>
</div>
</div>
</body>
</html>
