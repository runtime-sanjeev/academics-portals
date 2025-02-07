<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\User;

class Block extends Model
{
    protected $table = 'block_tbl';

    protected $fillable = [
        'block_code',        
        'block_name',
    ];
}
