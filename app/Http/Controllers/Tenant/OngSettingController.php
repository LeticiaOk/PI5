<?php

namespace App\Http\Controllers\Tenant;

use App\Http\Controllers\Controller;
use App\Models\OngSetting;
use Illuminate\Http\Request;
use Inertia\Inertia;

class OngSettingController extends Controller
{
    public function edit()
    {
        $tenantId = app('currentTenant');

        // 🤖 Inteligência: Se a ONG for nova e não tiver uma linha no banco ainda,
        // o firstOrCreate cria uma linha vazia automaticamente para não quebrar o form!
        $settings = OngSetting::firstOrCreate(
            ['ong_id' => $tenantId],
            [
                'primary_color' => '#4f46e5',
                'hero_subtitle' => 'Transformando vidas de quatro patas todos os dias.',
                'manual_saved_count' => 0,
                'manual_volunteers_count' => 0,
                'hero_background_color' => '#0f172a',
            ]
        );

        return Inertia::render('Tenant/Settings', [
            'settings' => $settings
        ]);
    }

    public function update(Request $request)
    {
        $tenantId = app('currentTenant');
        
        $settings = OngSetting::where('ong_id', $tenantId)->firstOrFail();

        $validated = $request->validate([
            'primary_color' => 'required|string|max:7',
            'hero_subtitle' => 'required|string|max:255',
            'about_text' => 'nullable|string',
            'public_whatsapp' => 'nullable|string|max:20',
            'display_whatsapp' => 'required|boolean',
            'manual_saved_count' => 'required|integer|min:0',
            'manual_volunteers_count' => 'required|integer|min:0',
            'about_photo_1' => 'nullable|url|max:255',
            'about_photo_2' => 'nullable|url|max:255',
            'hero_image_url' => 'nullable|url|max:255',
            'hero_background_color' => 'required|string|max:7',
        ], [
            'about_photo_1.url' => 'A foto 1 precisa ser uma URL válida de imagem.',
            'about_photo_2.url' => 'A foto 2 precisa ser uma URL válida de imagem.',
        ]);

        $settings->update($validated);

        return back()->with('success', 'Visual da sua Vitrine atualizado com sucesso!');
    }
}