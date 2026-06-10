<?php

namespace App\Http\Middleware;

use Closure;
use App\Models\Ong;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\App;
use Inertia\Inertia; // 💡 Importante adicionar

class ResolveTenantBySlug
{
    public function handle(Request $request, Closure $next)
    {
        // Pega o {slug} da URL (ex: 'gatomestre')
        $slug = $request->route('slug');
        
        // Resolve a ONG Trazendo as configurações junto (Eager Loading)
        $ong = Ong::with('settings')->where('slug', $slug)->firstOrFail();
        
        // Registra o ID do tenant no Container (para ser usado pelo Controller)
        App::instance('tenant_id', $ong->id);

        //  MÁGICA: Compartilha os dados da ONG globalmente com a Landing Page
        Inertia::share([
            'tenant' => [
                'name' => $ong->name,
                'slug' => $ong->slug,
                'whatsapp' => $ong->whatsapp,
                'settings' => $ong->settings ? [
                    'primary_color' => $ong->settings->primary_color,
                    'hero_title'    => $ong->settings->hero_title,
                    'hero_subtitle' => $ong->settings->hero_subtitle,
                    'about_text'    => $ong->settings->about_text,
                ] : null
            ]
        ]);

        return $next($request);
    }
}