<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Lead extends Model
{
    protected $fillable = [
        'name',
        'whatsapp',
        'device_name',
        'brand',
        'specifications',
        'condition',
        'notes',
        'source',
        'status',
        'admin_notes',
        'contacted_at',
    ];

    protected function casts(): array
    {
        return [
            'contacted_at' => 'datetime',
        ];
    }

    public static function normalizeWhatsapp(?string $value): string
    {
        $digits = preg_replace('/\D+/', '', (string) $value) ?: '';

        if (str_starts_with($digits, '0')) {
            return '62'.substr($digits, 1);
        }

        if (str_starts_with($digits, '8')) {
            return '62'.$digits;
        }

        return $digits;
    }

    public function whatsappNumber(): string
    {
        return self::normalizeWhatsapp($this->whatsapp);
    }

    public function whatsappUrl(?string $message = null): string
    {
        $url = 'https://wa.me/'.$this->whatsappNumber();

        if ($message !== null && $message !== '') {
            $url .= '?text='.rawurlencode($message);
        }

        return $url;
    }
}
