<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;

class Breed extends Model
{
    use HasFactory, HasUuids;

    protected $fillable = ['name', 'species'];

    public function animals()
    {
        return $this->hasMany(Animal::class);
    }
}