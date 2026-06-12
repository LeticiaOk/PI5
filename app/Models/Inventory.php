<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Builder;

class Inventory extends Model
{
    use HasFactory, HasUuids;

    protected $fillable = [
        'ong_id', 'name', 'category', 'quantity', 'unit', 
        'min_quantity', 'provider', 'details'
    ];

    // Converte automaticamente o JSON do banco para Array no PHP
    protected $casts = [
        'details' => 'array',
    ];

    // Isolamento da ONG
  protected static function booted()
    {
        static::addGlobalScope('ong', function (Builder $builder) {
            // Verifica se tem alguém logado para aplicar o filtro automático
            if (auth()->check()) {
                $builder->where('ong_id', auth()->user()->ong_id);
            }
        });
    }

    public function movements()
    {
        return $this->hasMany(InventoryMovement::class)->orderBy('created_at', 'desc');
    }
}