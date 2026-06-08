<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Breed;

class BreedSeeder extends Seeder
{
    public function run(): void
    {
        $breeds = [
            // Cachorros (Mais populares do Brasil)
            ['name' => 'Buldogue Francês', 'species' => 'dog'],
            ['name' => 'Chihuahua', 'species' => 'dog'],
            ['name' => 'Dachshund (Salsicha)', 'species' => 'dog'],
            ['name' => 'Golden Retriever', 'species' => 'dog'],
            ['name' => 'Husky Siberiano', 'species' => 'dog'],
            ['name' => 'Labrador', 'species' => 'dog'],
            ['name' => 'Lulu da Pomerânia (Spitz Alemão)', 'species' => 'dog'],
            ['name' => 'Pastor Alemão', 'species' => 'dog'],
            ['name' => 'Pinscher', 'species' => 'dog'],
            ['name' => 'Pitbull', 'species' => 'dog'],
            ['name' => 'Poodle', 'species' => 'dog'],
            ['name' => 'Pug', 'species' => 'dog'],
            ['name' => 'Rottweiler', 'species' => 'dog'],
            ['name' => 'Shih Tzu', 'species' => 'dog'],
            ['name' => 'Yorkshire', 'species' => 'dog'],
            ['name' => 'Outra raça', 'species' => 'dog'], 
            // Gatos
            ['name' => 'Angorá', 'species' => 'cat'],
            ['name' => 'Maine Coon', 'species' => 'cat'],
            ['name' => 'Persa', 'species' => 'cat'],
            ['name' => 'Ragdoll', 'species' => 'cat'],
            ['name' => 'Siamês', 'species' => 'cat'],
            ['name' => 'Sphynx', 'species' => 'cat'],
            ['name' => 'Outra raça', 'species' => 'cat'], 

            // Outros
            ['name' => 'Outra raça', 'species' => 'other'],
        ];

        foreach ($breeds as $breed) {
            Breed::firstOrCreate([
                'name' => $breed['name'],
                'species' => $breed['species']
            ]);
        }
    }
}