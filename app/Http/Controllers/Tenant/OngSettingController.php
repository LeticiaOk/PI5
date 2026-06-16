<?php

namespace App\Http\Controllers\Tenant;

use App\Http\Controllers\Controller;
use App\Models\OngSetting;
use App\Models\Ong; 
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Storage;

class OngSettingController extends Controller
{
    public function edit()
    {
        $tenantId = app('currentTenant');

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

        // Enviamos o Logo atual da tabela ONGS para o React
        $ong = Ong::select('logo_path')->find($tenantId);

        return Inertia::render('Tenant/Settings', [
            'settings' => $settings,
            'ongLogo' => $ong->logo_path ?? null, 
        ]);
    }

    public function update(Request $request)
    {
        $tenantId = app('currentTenant');
        
        $settings = OngSetting::where('ong_id', $tenantId)->firstOrFail();
        $ong = Ong::findOrFail($tenantId); 

        // 1. Chave PIX adicionada na validação
        $validated = $request->validate([
            'primary_color' => 'required|string|max:7',
            'hero_subtitle' => 'required|string|max:255',
            'about_text' => 'nullable|string|max:2000',
            'public_whatsapp' => 'nullable|string|max:20',
            'public_email' => 'nullable|email|max:255',
            'display_whatsapp' => 'required|boolean',
            'facebook_url' => 'nullable|url|max:255',
            'instagram_url' => 'nullable|url|max:255',
            'pix_key' => 'nullable|string|max:255', // <-- AQUI
            'manual_saved_count' => 'required|integer|min:0',
            'manual_volunteers_count' => 'required|integer|min:0',
            'hero_background_color' => 'required|string|max:7',
            
            'logo_path' => 'nullable|image|mimes:jpeg,png,jpg,webp,svg|max:2048',
            'hero_image_url' => 'nullable|image|mimes:jpeg,png,jpg,webp|max:2048',
            'about_photo_1' => 'nullable|image|mimes:jpeg,png,jpg,webp|max:2048',
            'about_photo_2' => 'nullable|image|mimes:jpeg,png,jpg,webp|max:2048',

            'remove_logo' => 'nullable|boolean',
            'remove_hero_image' => 'nullable|boolean',
            'remove_about_photo_1' => 'nullable|boolean',
            'remove_about_photo_2' => 'nullable|boolean',
        ], [
            'public_email.email' => 'Por favor, insira um endereço de e-mail válido.',
            'logo_path.image' => 'O logo precisa ser uma imagem válida.',
            'hero_image_url.image' => 'O banner precisa ser uma imagem válida.',
            'about_photo_1.image' => 'A foto 1 precisa ser uma imagem válida.',
            'about_photo_2.image' => 'A foto 2 precisa ser uma imagem válida.',
        ]);

        $uploadPath = "tenants/{$tenantId}/settings";

        $deleteOldImage = function ($url) {
            if ($url) {
                $path = str_replace('/storage/', '', $url);
                if (Storage::disk('public')->exists($path)) {
                    Storage::disk('public')->delete($path);
                }
            }
        };

        // ─── 1. PROCESSAMENTO DO LOGO (Salva na model ONG) ───
        $ongDataToUpdate = [];
        if ($request->hasFile('logo_path')) {
            $deleteOldImage($ong->logo_path);
            $path = $request->file('logo_path')->store($uploadPath, 'public');
            $ongDataToUpdate['logo_path'] = '/storage/' . $path;
        } elseif ($request->boolean('remove_logo')) {
            $deleteOldImage($ong->logo_path);
            $ongDataToUpdate['logo_path'] = null;
        }

        if (!empty($ongDataToUpdate)) {
            $ong->update($ongDataToUpdate);
        }
        unset($validated['logo_path']); // Remove do array para não quebrar a model OngSetting

        // ─── 2. PROCESSAMENTO DO BANNER E FOTOS (Salva na model OngSetting) ───
        if ($request->hasFile('hero_image_url')) {
            $deleteOldImage($settings->hero_image_url);
            $path = $request->file('hero_image_url')->store($uploadPath, 'public');
            $validated['hero_image_url'] = '/storage/' . $path;
        } elseif ($request->boolean('remove_hero_image')) {
            $deleteOldImage($settings->hero_image_url);
            $validated['hero_image_url'] = null;
        } else {
            unset($validated['hero_image_url']);
        }

        if ($request->hasFile('about_photo_1')) {
            $deleteOldImage($settings->about_photo_1);
            $path = $request->file('about_photo_1')->store($uploadPath, 'public');
            $validated['about_photo_1'] = '/storage/' . $path;
        } elseif ($request->boolean('remove_about_photo_1')) {
            $deleteOldImage($settings->about_photo_1);
            $validated['about_photo_1'] = null;
        } else {
            unset($validated['about_photo_1']);
        }

        if ($request->hasFile('about_photo_2')) {
            $deleteOldImage($settings->about_photo_2);
            $path = $request->file('about_photo_2')->store($uploadPath, 'public');
            $validated['about_photo_2'] = '/storage/' . $path;
        } elseif ($request->boolean('remove_about_photo_2')) {
            $deleteOldImage($settings->about_photo_2);
            $validated['about_photo_2'] = null;
        } else {
            unset($validated['about_photo_2']);
        }

        unset($validated['remove_logo'], $validated['remove_hero_image'], $validated['remove_about_photo_1'], $validated['remove_about_photo_2']);
        
        if (!empty($validated['public_whatsapp'])) {
            $validated['public_whatsapp'] = preg_replace('/\D/', '', $validated['public_whatsapp']);
        }

        // A $validated agora possui 'pix_key', que será salvo automaticamente aqui.
        $settings->update($validated);

        return back()->with('success', 'Configurações atualizadas com sucesso!');
    }
}