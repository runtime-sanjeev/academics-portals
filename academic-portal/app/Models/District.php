<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\User;

class District extends Model
{
    protected $table = 'districts_tbl';

    protected $fillable = [
        'district_code',        
        'district_name',
    ];
}
