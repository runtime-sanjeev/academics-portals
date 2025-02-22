<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\User;

class State extends Model
{
    protected $table = 'statelist_tbl';

    protected $fillable = [
        'state_code', 
        'state_name',       
        
    ];
}
