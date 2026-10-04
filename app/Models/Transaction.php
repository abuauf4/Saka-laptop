<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Transaction extends Model
{
    protected $fillable = ['invoice_number','customer_name','customer_phone','subtotal','discount','total','payment_method','status','items','notes','sold_at'];
    protected function casts(): array { return ['items'=>'array','subtotal'=>'integer','discount'=>'integer','total'=>'integer','sold_at'=>'datetime']; }
}
