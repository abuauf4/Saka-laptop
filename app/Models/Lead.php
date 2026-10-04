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
}
