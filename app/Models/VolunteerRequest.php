<?php

namespace App\Models;

use App\Scopes\TenantScope;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Concerns\HasUuids; 

class VolunteerRequest extends Model
{   

    use HasUuids;

    protected $fillable = [
        'ong_id',
        'name',
        'phone',
        'email',
        'notes',
        'status',
    ];

    // 🛡️ Aplicação automática do escopo de isolamento
    protected static function booted()
    {
        static::addGlobalScope(new TenantScope);
    }

    public function ong(): BelongsTo
    {
        return $this->belongsTo(Ong::class);
    }
}