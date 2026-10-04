<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;

$app = Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware): void {
        //
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        //
    })->create();

$appBase = dirname(__DIR__);
$parent = dirname($appBase);

if (basename($appBase) === '.saka-app' && basename($parent) === 'public_html') {
    $runtime = dirname($parent).'/saka-runtime';
    $app->usePublicPath($parent);
    $app->useEnvironmentPath($runtime);
    $app->useStoragePath($runtime.'/storage');
} elseif (basename($appBase) === 'saka-app' && is_dir($parent.'/public_html')) {
    $runtime = $parent.'/saka-runtime';
    $app->usePublicPath($parent.'/public_html');
    $app->useEnvironmentPath($runtime);
    $app->useStoragePath($runtime.'/storage');
}

return $app;
