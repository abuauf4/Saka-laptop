<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('submissions', function (Blueprint $table): void {
            $table->id(); $table->string('device_name'); $table->string('brand')->nullable()->index(); $table->string('category')->nullable()->index();
            $table->string('processor')->nullable(); $table->string('ram')->nullable(); $table->string('storage')->nullable(); $table->string('gpu')->nullable();
            $table->unsignedSmallInteger('year')->nullable(); $table->string('condition')->nullable(); $table->string('completeness')->nullable();
            $table->text('notes')->nullable(); $table->json('photos')->nullable(); $table->string('customer_name'); $table->string('customer_phone')->index();
            $table->text('customer_address')->nullable(); $table->json('qc_checklist')->nullable(); $table->text('qc_notes')->nullable();
            $table->unsignedBigInteger('offer_price')->default(0); $table->text('offer_notes')->nullable(); $table->string('status')->default('received')->index(); $table->timestamps();
        });
        Schema::create('inventory_items', function (Blueprint $table): void {
            $table->id(); $table->string('sku')->unique(); $table->foreignId('submission_id')->nullable()->constrained()->nullOnDelete();
            $table->string('name'); $table->string('brand')->nullable()->index(); $table->string('category')->nullable()->index(); $table->json('specifications')->nullable();
            $table->string('condition')->nullable(); $table->unsignedBigInteger('purchase_price')->default(0); $table->unsignedBigInteger('selling_price')->default(0);
            $table->enum('status',['available','reserved','sold'])->default('available')->index(); $table->json('photos')->nullable(); $table->timestamps();
        });
        Schema::create('transactions', function (Blueprint $table): void {
            $table->id(); $table->string('invoice_number')->unique(); $table->string('customer_name')->nullable(); $table->string('customer_phone')->nullable();
            $table->unsignedBigInteger('subtotal')->default(0); $table->unsignedBigInteger('discount')->default(0); $table->unsignedBigInteger('total')->default(0);
            $table->string('payment_method')->nullable(); $table->enum('status',['draft','completed','cancelled'])->default('draft')->index();
            $table->json('items'); $table->text('notes')->nullable(); $table->timestamp('sold_at')->nullable()->index(); $table->timestamps();
        });
        Schema::create('cache', function (Blueprint $table): void { $table->string('key')->primary(); $table->mediumText('value'); $table->integer('expiration'); });
        Schema::create('cache_locks', function (Blueprint $table): void { $table->string('key')->primary(); $table->string('owner'); $table->integer('expiration'); });
        Schema::create('jobs', function (Blueprint $table): void { $table->id(); $table->string('queue')->index(); $table->longText('payload'); $table->unsignedTinyInteger('attempts'); $table->unsignedInteger('reserved_at')->nullable(); $table->unsignedInteger('available_at'); $table->unsignedInteger('created_at'); });
        Schema::create('job_batches', function (Blueprint $table): void { $table->string('id')->primary(); $table->string('name'); $table->integer('total_jobs'); $table->integer('pending_jobs'); $table->integer('failed_jobs'); $table->longText('failed_job_ids'); $table->mediumText('options')->nullable(); $table->integer('cancelled_at')->nullable(); $table->integer('created_at'); $table->integer('finished_at')->nullable(); });
        Schema::create('failed_jobs', function (Blueprint $table): void { $table->id(); $table->string('uuid')->unique(); $table->text('connection'); $table->text('queue'); $table->longText('payload'); $table->longText('exception'); $table->timestamp('failed_at')->useCurrent(); });
    }
    public function down(): void
    {
        foreach (['failed_jobs','job_batches','jobs','cache_locks','cache','transactions','inventory_items','submissions'] as $table) Schema::dropIfExists($table);
    }
};
