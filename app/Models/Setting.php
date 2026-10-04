<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Setting extends Model
{
    protected $fillable = ['site_name','tagline','phone','whatsapp','email','address','maps_url','opening_hours','logo_path','seo_title','seo_description','google_analytics_id','google_ads_id','meta_pixel_id','smtp_host','smtp_port','smtp_username','smtp_password'];
    protected $hidden = ['smtp_password'];
    protected function casts(): array { return ['smtp_password' => 'encrypted', 'smtp_port' => 'integer']; }

    public static function singleton(): self
    {
        return static::query()->firstOrCreate(
            ['id' => 1],
            [
                'site_name' => 'Saka Laptop',
                'tagline' => 'Pusat Inspeksi & Trade-in Laptop Bekas',
            ]
        );
    }
}
