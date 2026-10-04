<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('settings', function (Blueprint $table): void {
            $table->id(); $table->string('site_name')->default('Jakarta Laptops'); $table->string('tagline')->nullable();
            $table->string('phone')->nullable(); $table->string('whatsapp')->nullable(); $table->string('email')->nullable();
            $table->text('address')->nullable(); $table->text('maps_url')->nullable(); $table->string('opening_hours')->nullable();
            $table->string('logo_path')->nullable(); $table->string('seo_title')->nullable(); $table->text('seo_description')->nullable();
            $table->string('google_analytics_id')->nullable(); $table->string('google_ads_id')->nullable(); $table->string('meta_pixel_id')->nullable();
            $table->string('smtp_host')->nullable(); $table->unsignedSmallInteger('smtp_port')->nullable(); $table->string('smtp_username')->nullable();
            $table->text('smtp_password')->nullable(); $table->timestamps();
        });
        Schema::create('homepage_contents', function (Blueprint $table): void {
            $table->id(); $table->string('hero_eyebrow')->nullable(); $table->string('hero_title'); $table->text('hero_subtitle')->nullable();
            $table->string('hero_image')->nullable(); $table->json('trust_stats')->nullable(); $table->string('brand_title')->nullable();
            $table->text('brand_copy')->nullable(); $table->json('brand_points')->nullable(); $table->json('workflow_stages')->nullable();
            $table->json('device_categories')->nullable(); $table->json('faqs')->nullable(); $table->string('closing_title')->nullable();
            $table->text('closing_subtitle')->nullable(); $table->timestamps();
        });
        Schema::create('testimonials', function (Blueprint $table): void {
            $table->id(); $table->string('name'); $table->string('role')->nullable(); $table->text('body'); $table->unsignedTinyInteger('rating')->default(5);
            $table->string('device')->nullable(); $table->string('avatar_path')->nullable(); $table->boolean('is_active')->default(true)->index(); $table->timestamps();
        });
        Schema::create('articles', function (Blueprint $table): void {
            $table->id(); $table->string('title'); $table->string('slug')->unique(); $table->text('excerpt')->nullable(); $table->longText('body')->nullable();
            $table->string('cover_path')->nullable(); $table->enum('status',['draft','published'])->default('draft')->index();
            $table->string('meta_title')->nullable(); $table->text('meta_description')->nullable(); $table->timestamp('published_at')->nullable()->index(); $table->timestamps();
        });
    }
    public function down(): void
    {
        Schema::dropIfExists('articles'); Schema::dropIfExists('testimonials'); Schema::dropIfExists('homepage_contents'); Schema::dropIfExists('settings');
    }
};
