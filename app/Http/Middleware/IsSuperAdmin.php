<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class IsSuperAdmin
{
    public function handle(Request $request, Closure $next): Response
    {
        // Se o usuário está logado e o ong_id é nulo, ele é o Dono do SaaS!
        if (auth()->check() && auth()->user()->ong_id === null) {
            return $next($request);
        }

        // Se for uma ONG comum tentando bisbilhotar o seu painel, toma bloqueio:
        abort(403, 'Acesso restrito à administração da PlataformaX.');
    }
}