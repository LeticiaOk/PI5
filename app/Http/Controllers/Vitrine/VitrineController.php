<?php

namespace App\Http\Controllers\Vitrine;

use App\Http\Controllers\Controller;
use App\Models\Animal;
use Inertia\Inertia;
use Illuminate\Http\Request;

class VitrineController extends Controller
{
 public function home(Request $request, $slug)
{
    $tenantId = app('currentTenant');
    $ong = \App\Models\Ong::with('settings')->findOrFail($tenantId);

    // 🤖 INTELIGÊNCIA: O sistema conta sozinho os animais disponíveis para adoção
    $availableCount = \App\Models\Animal::where('ong_id', $tenantId)
                        ->where('status', 'available')
                        ->count();

    return Inertia::render('Vitrine/Home', [
        'slug' => $slug,
        'ong' => $ong,
        'settings' => $ong->settings ?? [],
        'availableCount' => $availableCount // Enviamos o dado real!
    ]);
}

 public function adote(Request $request, $slug)
{
    $tenantId = app('currentTenant');
    $ong = \App\Models\Ong::with('settings')->findOrFail($tenantId); // 👈 Puxa as configurações igual à Home

    $pets = Animal::with(['breed', 'temporaryHome.address'])
        ->where('ong_id', $tenantId)
        ->where('status', 'available')
        ->latest()
        ->paginate(12);

    return Inertia::render('Vitrine/Adote', [
        'pets' => $pets,
        'slug' => $slug,
        'settings' => $ong->settings ?? [] // 👈 Enviamos as configurações de estilo aqui também!
    ]);
}

    public function comoAdotar($slug)
    {
        return Inertia::render('Vitrine/ComoAdotar', ['slug' => $slug]);
    }

    public function quemSomos($slug)
    {   
        $tenantId = app('currentTenant');
        $ong = \App\Models\Ong::with('settings')->findOrFail($tenantId);
        return Inertia::render('Vitrine/QuemSomos', ['slug' => $slug, 'settings' => $ong->settings ?? []]);
    }

    public function doar($slug)
    { 
        $tenantId = app('currentTenant');
        $ong = \App\Models\Ong::with('settings')->findOrFail($tenantId);
        return Inertia::render('Vitrine/Doar', ['slug' => $slug, 'settings' => $ong->settings ?? []]);
    }

    public function showAnimal($slug, $animalId)
    {
        $tenantId = app('currentTenant');
        $ong = \App\Models\Ong::with('settings')->findOrFail($tenantId);
        $animal = Animal::with(['breed'])
            ->where('ong_id', $tenantId)
            ->where('id', $animalId)
            ->where('status', 'available') // 👈 Adicionado aqui para barrar acessos por link direto!
            ->firstOrFail();

        return Inertia::render('Vitrine/AnimalDetails', [
            'slug' => $slug,
            'animal' => $animal,
            'settings' => $ong->settings ?? []
        ]);
    }
}