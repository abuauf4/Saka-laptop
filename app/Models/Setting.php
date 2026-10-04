<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Setting extends Model
{
    protected $fillable = ['site_name','tagline','phone','whatsapp','email','address','maps_url','opening_hours','logo_path','seo_title','seo_description','google_analytics_id','google_ads_id','meta_pixel_id','smtp_host','smtp_port','smtp_username','smtp_password'];
    protected $hidden = ['smtp_password'];

    protected function casts(): array
    {
        return [
            'smtp_password' => 'encrypted',
            'smtp_port' => 'integer',
        ];
    }

    public static function singleton(): self
    {
        return static::query()->firstOrCreate(
            ['id' => 1],
            [
                'site_name' => 'Saka Laptop',
                'tagline' => 'Pusat Inspeksi & Trade-in Laptop Bekas',
                'phone' => '+62881010302510',
                'whatsapp' => '62881010302510',
                'address' => 'Jl. Salam 3, RT.10/RW.3, Kb. Jeruk, Kec. Kb. Jeruk, Kota Jakarta Barat, Daerah Khusus Ibukota Jakarta 11530',
                'maps_url' => 'https://maps.app.goo.gl/bENhSKVVmPKcfAeq9?g_st=ac',
                'opening_hours' => 'Senin - Sabtu: 09.00 - 21.00 WIB · Minggu: 10.00 - 18.00 WIB',
                'logo_path' => '/assets/homepage/logo.jpg',
                'seo_title' => 'Saka Laptop — Jual Laptop Bekas Jakarta & Trade-in',
                'seo_description' => 'Jual laptop bekas di Jakarta dengan proses praktis, pengecekan terstruktur, dan penawaran berdasarkan kondisi aktual perangkat.',
            ]
        );
    }
}
