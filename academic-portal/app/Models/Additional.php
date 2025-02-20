<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\User;

class Additional extends Model
{
    protected $table = 'additional_tbl';

    protected $fillable = [
        'sub_code',        
        'sub_name',
    ];
}
