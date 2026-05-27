<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Breed extends Model
{
    use HasFactory;

    protected $fillable = ['name', 'species'];

    public function animals()
    {
        return $this->hasMany(Animal::class);
    }
}