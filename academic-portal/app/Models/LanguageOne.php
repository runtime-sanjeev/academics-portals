<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\User;

class LanguageOne extends Model
{
    protected $table = 'language1_tbl';

    protected $fillable = [
        'sub_code',        
        'sub_name',
    ];
}
