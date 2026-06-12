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
        return Inertia::render('Vitrine/Home', ['slug' => $slug]);
    }

 public function adote(Request $request, $slug)
    {
        $tenantId = app('currentTenant');

        $pets = Animal::with(['breed', 'temporaryHome.address'])
            ->where('ong_id', $tenantId)
            ->where('status', 'available') // 👈 Limpamos o array e deixamos só o available
            ->latest()
            ->paginate(12);

        return Inertia::render('Vitrine/Adote', [
            'pets' => $pets,
            'slug' => $slug
        ]);
    }

    public function comoAdotar($slug)
    {
        return Inertia::render('Vitrine/ComoAdotar', ['slug' => $slug]);
    }

    public function quemSomos($slug)
    {
        return Inertia::render('Vitrine/QuemSomos', ['slug' => $slug]);
    }

    public function doar($slug)
    {
        return Inertia::render('Vitrine/Doar', ['slug' => $slug]);
    }

    public function showAnimal($slug, $animalId)
    {
        $tenantId = app('currentTenant');

        $animal = Animal::with(['breed'])
            ->where('ong_id', $tenantId)
            ->where('id', $animalId)
            ->where('status', 'available') // 👈 Adicionado aqui para barrar acessos por link direto!
            ->firstOrFail();

        return Inertia::render('Vitrine/AnimalDetails', [
            'slug' => $slug,
            'animal' => $animal
        ]);
    }
}