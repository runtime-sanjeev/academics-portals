<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\User;

class LanguageTwo extends Model
{
    protected $table = 'language2_tbl';

    protected $fillable = [
        'sub_code',        
        'sub_name',
    ];
}
