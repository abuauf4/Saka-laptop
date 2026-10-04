<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class HomepageContent extends Model
{
    protected $fillable = ['hero_eyebrow','hero_title','hero_subtitle','hero_image','trust_stats','brand_title','brand_copy','brand_points','workflow_stages','device_categories','faqs','closing_title','closing_subtitle'];
    protected function casts(): array { return ['trust_stats'=>'array','brand_points'=>'array','workflow_stages'=>'array','device_categories'=>'array','faqs'=>'array']; }
    public static function singleton(): self
    {
        return static::query()->firstOrCreate(['id'=>1],[
            'hero_eyebrow'=>'Laptop Lamamu Masih Bernilai','hero_title'=>'Jual Laptop Bekasmu Tanpa Ribet.',
            'hero_subtitle'=>'Kirim foto dan spesifikasi laptop melalui WhatsApp. Tim kami bantu analisa dan berikan penawaran.',
            'hero_image'=>'/Hero.webp','trust_stats'=>[
                ['stat'=>'12','label'=>'Titik QC','desc'=>'Pemeriksaan menyeluruh sebelum penawaran final.'],
                ['stat'=>'Cepat','label'=>'Respons','desc'=>'Estimasi awal setelah foto dan spesifikasi diterima.'],
                ['stat'=>'100%','label'=>'Transparan','desc'=>'Penawaran berdasarkan kondisi aktual perangkat.'],
            ],'brand_title'=>'Bukan Sekadar Membeli Laptop.','brand_copy'=>'Kami membantu proses penilaian perangkat secara transparan sebelum memberikan penawaran.',
            'brand_points'=>[],'workflow_stages'=>[],'device_categories'=>[],'faqs'=>[],
            'closing_title'=>'Laptop Lamamu Masih Bernilai.','closing_subtitle'=>'Chat kami sekarang via WhatsApp. Gratis, tanpa komitmen.',
        ]);
    }
}
