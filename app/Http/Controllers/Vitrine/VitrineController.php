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
        $tenantId = app('tenant_id');

        $pets = Animal::with(['breed', 'temporaryHome.address'])
            ->where('ong_id', $tenantId)
            ->whereIn('status', ['available', 'foster_care'])
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
}