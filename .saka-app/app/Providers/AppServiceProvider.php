<?php

namespace App\Providers;

use App\Models\Setting;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\View;
use Illuminate\Support\ServiceProvider;
use Throwable;

class AppServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        //
    }

    public function boot(): void
    {
        Schema::defaultStringLength(191);

        View::composer('*', function ($view): void {
            try {
                $view->with('globalSettings', Setting::query()->first());
            } catch (Throwable) {
                $view->with('globalSettings', null);
            }
        });
    }
}
