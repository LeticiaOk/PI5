<?php

namespace Database\Seeders;

use App\Models\Ong;
use App\Models\User;
use App\Models\Animal;
use App\Models\Adopter; 
use App\Models\Breed;
use App\Models\OngSetting;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Hash;
use Faker\Factory as Faker; 

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $faker = Faker::create('pt_BR');

        $this->call([
            BreedSeeder::class,
        ]);
        
        $poodle = Breed::where('name', 'Poodle')->first();
        $persa = Breed::where('name', 'Persa')->first();

        User::withoutEvents(function () {
            User::create([
                'name' => 'Super Admin SaaS',
                'email' => 'admin@meusaas.com',
                'password' => Hash::make('senha123'),
                'ong_id' => null,
            ]);
        });

        // ONG 1 - Cão Feliz
        $ong1 = Ong::create([
            'id' => Str::uuid(),
            'slug' => 'caofeliz',
            'name' => 'ONG Cão Feliz',
            'cnpj' => '11111111111111',
            'email' => 'contato@caofeliz.com.br',
            'whatsapp' => '11999999999',
            'branding' => ['primary_color' => '#FF5733'],
            'is_active' => true,
        ]);

        OngSetting::create([
            'ong_id' => $ong1->id,
            'primary_color' => '#FF5733',
            'hero_title' => 'Dê uma nova chance para um peludo',
            'hero_subtitle' => "Somos a Cão Feliz, uma ONG focada em resgatar cachorros em situação de rua.\n\nVenha conhecer seu novo melhor amigo!",
            'about_text' => 'Fundada em 2020, nossa ONG já salvou mais de 500 animais.',
            'instagram_url' => 'https://instagram.com/ongcaofeliz',
        ]);

        User::create([
            'name' => 'Gestor Cão Feliz',
            'email' => 'gestor@caofeliz.com.br',
            'password' => Hash::make('senha123'),
            'ong_id' => $ong1->id,
        ]);

        Animal::withoutGlobalScopes()->create([
            'ong_id' => $ong1->id,
            'name' => 'Rex',
            'species' => 'dog',
            'breed_id' => $poodle->id,
            'gender' => 'male',
            'size' => 'large',
            'arrival_date' => now()->subMonths(2),
            'estimated_birth_date' => now()->subYears(3),
            'is_neutered' => true,
            'is_vaccinated' => true,
            'status' => 'available',
            'description' => 'Um cão muito brincalhão e protetor.'
        ]);

        for ($i = 0; $i < 2; $i++) {
            $adopter = Adopter::withoutGlobalScopes()->create([
                'ong_id' => $ong1->id,
                'name'   => $faker->name,
                'cpf'    => $faker->cpf(false), 
                'phone'  => $faker->cellphoneNumber,
                'email'  => $faker->unique()->safeEmail,
            ]);

            $adopter->address()->create([
                'ong_id'       => $ong1->id,
                'zip_code'     => $faker->postcode,
                'street'       => $faker->streetName,
                'number'       => $faker->buildingNumber,
                'neighborhood' => 'Bairro ' . $faker->word,
                'city'         => $faker->city,
                'state'        => $faker->stateAbbr, 
            ]);
        }

        // ONG 2 - Gato Mestre
        $ong2 = Ong::create([
            'id' => Str::uuid(),
            'slug' => 'gatomestre',
            'name' => 'Abrigo Gato Mestre',
            'cnpj' => '22222222222222',
            'email' => 'contato@gatomestre.com.br',
            'whatsapp' => '22999999999',
            'branding' => ['primary_color' => '#8E44AD'],
            'is_active' => true,
        ]);

        OngSetting::create([
            'ong_id' => $ong2->id,
            'primary_color' => '#8E44AD',
            'hero_title' => 'Gatos incríveis buscando lares amorosos',
            'hero_subtitle' => 'O Abrigo Gato Mestre cuida exclusivamente de felinos. Nossos ronrons aguardam por você.',
            'about_text' => 'Especialistas em felinos desde 2018.',
            'instagram_url' => 'https://instagram.com/gatomestre',
        ]);

        User::create([
            'name' => 'Diretora Gato Mestre',
            'email' => 'diretora@gatomestre.com.br',
            'password' => Hash::make('senha123'),
            'ong_id' => $ong2->id,
        ]);

        Animal::withoutGlobalScopes()->create([
            'ong_id' => $ong2->id,
            'name' => 'Mingau',
            'species' => 'cat',
            'breed_id' => $persa->id,
            'gender' => 'female',
            'size' => 'small',
            'arrival_date' => now()->subDays(15),
            'estimated_birth_date' => now()->subMonths(6),
            'is_neutered' => false,
            'is_vaccinated' => true,
            'status' => 'foster_care',
            'description' => 'Uma gatinha dócil que adora colo.'
        ]);

        // Ignora os escopos globais para a factory conseguir puxar animais aleatórios
        \App\Models\AdoptionRequest::withoutGlobalScopes(function () {
            \App\Models\AdoptionRequest::factory(30)->create();
        });
    }
}