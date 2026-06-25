<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Concerns\HasUuids;

class Asset extends Model
{
    use HasFactory, HasUuids;

    protected $fillable = [
        'user_id',
        'name',
        'category',
        'value',
        'purchase_date',
        'notes',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
