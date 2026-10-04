<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Article extends Model
{
    protected $fillable = ['title','slug','excerpt','body','cover_path','status','meta_title','meta_description','published_at'];
    protected function casts(): array { return ['published_at'=>'datetime']; }
}
