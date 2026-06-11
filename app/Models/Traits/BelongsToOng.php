<?php

namespace App\Models\Traits;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Auth;

trait BelongsToOng
{
    /**
     * Boot the trait.
     */
    protected static function bootBelongsToOng(): void
    {
        static::addGlobalScope('ong_id', function (Builder $builder) {
            $table = $builder->getQuery()->from;

            // 1. PRIORIDADE MÁXIMA: Contexto explícito da Rota (seja pela URL da Vitrine ou Middleware do Admin)
            if (app()->bound('currentTenant')) {
                $builder->where($table . '.ong_id', app('currentTenant'));
            } 
            // 2. FALLBACK: Se por acaso esqueceu o middleware, mas o usuário está logado
            elseif (Auth::hasUser() && Auth::user()->ong_id) {
                $builder->where($table . '.ong_id', Auth::user()->ong_id);
            } 
            // 3. Fail-Secure (Bloqueio de Vazamento)
            else {
                if (!app()->runningInConsole()) {
                    $builder->whereRaw('1 = 0'); 
                }
            }
        });

        // Evento 'creating' para auto-preencher o ong_id no banco
        static::creating(function (Model $model) {
            if (empty($model->ong_id)) {
                // Mesma prioridade aqui
                if (app()->bound('currentTenant')) {
                    $model->ong_id = app('currentTenant');
                } elseif (Auth::hasUser() && Auth::user()->ong_id) {
                    $model->ong_id = Auth::user()->ong_id;
                } else {
                    throw new \Exception("Tentativa de criar registro em {$model->getTable()} sem contexto de ONG (Tenant Isolado).");
                }
            }
        });
    }

    /**
     * Relacionamento padrão com a tabela de ONGs.
     */
    public function ong()
    {
        return $this->belongsTo(\App\Models\Ong::class, 'ong_id');
    }
}