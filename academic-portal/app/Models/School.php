<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\School as Authenticatable;
use Illuminate\Notifications\Notifiable;

class School extends Model
{
    use HasFactory, Notifiable;
    protected $table = 'school_tbls';
    protected $fillable = [
        'school_code',        
        'password',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }
    //
}
