<?php

use Illuminate\Support\Facades\Artisan;

Artisan::command('saka:status', function (): void {
    $this->info('Saka Laptop v2 is ready.');
})->purpose('Check Saka Laptop v2 application status');
