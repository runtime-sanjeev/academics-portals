<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\User;

class Student extends Model
{
    protected $table = 'students_tbl';

    protected $fillable = [
        'school_code',        
        'category',
        'student_code'
    ];
}
