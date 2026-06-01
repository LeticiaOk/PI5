<?php

namespace App\Http\Controllers;

use App\Models\Breed;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class BreedController extends Controller
{
    /**
     * Retorna as raças filtradas pela espécie informad apenas pelo id e o nome.
    **/
    public function bySpecies(string $species): JsonResponse
    {
        // Validação rápida de escopo aceitável
        if (!in_array($species, ['dog', 'cat', 'other'])) {
            return response()->json([], 400);
        }

        $breeds = Breed::where('species', $species)
            ->select('id', 'name')
            ->orderBy('name', 'asc')
            ->get();

        return response()->json($breeds);
    }
}