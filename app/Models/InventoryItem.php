<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class InventoryItem extends Model
{
    protected $fillable = ['sku','submission_id','name','brand','category','specifications','condition','purchase_price','selling_price','status','photos'];
    protected function casts(): array { return ['specifications'=>'array','photos'=>'array','purchase_price'=>'integer','selling_price'=>'integer']; }
}
