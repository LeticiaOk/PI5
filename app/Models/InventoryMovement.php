<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Builder;

class InventoryMovement extends Model
{
    use HasFactory, HasUuids;

    protected $fillable = [
        'ong_id', 'inventory_id', 'type', 'quantity', 'responsible_name', 'description'
    ];

  protected static function booted()
    {
        static::addGlobalScope('ong', function (Builder $builder) {
            if (auth()->check()) {
                $builder->where('ong_id', auth()->user()->ong_id);
            }
        });
    }

    public function inventory()
    {
        return $this->belongsTo(Inventory::class);
    }
}