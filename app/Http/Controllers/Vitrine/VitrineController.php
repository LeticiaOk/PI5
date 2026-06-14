<?php

namespace App\Http\Controllers\Vitrine;

use App\Http\Controllers\Controller;
use App\Models\Animal;
use App\Models\Ong;
use Inertia\Inertia;
use Illuminate\Http\Request;

class VitrineController extends Controller
{
    public function home(Request $request, $slug)
    {
        $tenantId = app('currentTenant');
        $ong = Ong::with('settings')->findOrFail($tenantId);

        $availableCount = Animal::where('ong_id', $tenantId)
            ->where('status', 'available')
            ->count();

        return Inertia::render('Vitrine/Home', [
            'slug' => $slug,
            'ong' => $ong,
            'settings' => $ong->settings ?? [],
            'availableCount' => $availableCount
        ]);
    }

    public function adote(Request $request, $slug)
    {
        $tenantId = app('currentTenant');
        $ong = Ong::with('settings')->findOrFail($tenantId);

        $pets = Animal::with(['breed', 'temporaryHome.address'])
            ->where('ong_id', $tenantId)
            ->where('status', 'available')
            ->latest()
            ->paginate(12);

        return Inertia::render('Vitrine/Adote', [
            'pets' => $pets,
            'slug' => $slug,
            'ong' => $ong,
            'settings' => $ong->settings ?? []
        ]);
    }

    public function comoAdotar($slug)
    {
        $tenantId = app('currentTenant');
        $ong = Ong::with('settings')->findOrFail($tenantId);

        return Inertia::render('Vitrine/ComoAdotar', [
            'slug' => $slug,
            'ong' => $ong,
            'settings' => $ong->settings ?? []
        ]);
    }

    public function quemSomos($slug)
    {
        $tenantId = app('currentTenant');
        $ong = Ong::with('settings')->findOrFail($tenantId);

        return Inertia::render('Vitrine/QuemSomos', [
            'slug' => $slug,
            'ong' => $ong,
            'settings' => $ong->settings ?? []
        ]);
    }

    public function doar($slug)
    {
        $tenantId = app('currentTenant');
        $ong = Ong::with('settings')->findOrFail($tenantId);

        return Inertia::render('Vitrine/Doar', [
            'slug' => $slug,
            'ong' => $ong,
            'settings' => $ong->settings ?? []
        ]);
    }

    public function showAnimal($slug, $animalId)
    {
        $tenantId = app('currentTenant');
        $ong = Ong::with('settings')->findOrFail($tenantId);

        $animal = Animal::with(['breed'])
            ->where('ong_id', $tenantId)
            ->where('id', $animalId)
            ->where('status', 'available')
            ->firstOrFail();

        return Inertia::render('Vitrine/AnimalDetails', [
            'slug' => $slug,
            'animal' => $animal,
            'ong' => $ong,
            'settings' => $ong->settings ?? []
        ]);
    }
}