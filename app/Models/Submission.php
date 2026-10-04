<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Submission extends Model
{
    protected $fillable = ['device_name','brand','category','processor','ram','storage','gpu','year','condition','completeness','notes','photos','customer_name','customer_phone','customer_address','qc_checklist','qc_notes','offer_price','offer_notes','status'];
    protected function casts(): array { return ['photos'=>'array','qc_checklist'=>'array','offer_price'=>'integer','year'=>'integer']; }
}
