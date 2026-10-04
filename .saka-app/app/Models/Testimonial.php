<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Testimonial extends Model
{
    protected $fillable = ['name', 'role', 'body', 'rating', 'device', 'avatar_path', 'is_active'];
    protected function casts(): array { return ['rating'=>'integer','is_active'=>'boolean']; }
}
