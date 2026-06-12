<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\AnimalController;
use App\Http\Controllers\AdopterController;
use App\Http\Controllers\AdoptionController;
use App\Http\Controllers\InventoryController;
use App\Http\Controllers\Admin\AdoptionRequestController;
use App\Http\Controllers\Vitrine\VitrineController;
use App\Http\Controllers\Vitrine\VitrineAdoptionController;
use App\Http\Controllers\TemporaryHomeController;
use App\Http\Controllers\VolunteerController;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Http;
use Inertia\Inertia;

// ── ROTAS DE REDIRECIONAMENTO ─────────────────────────────────────────────────

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'), // Avisa o React se o sistema de login está ativo
    ]);
})->middleware('throttle:60,1'); // 🛡️ Mantivemos a sua proteção contra spam!

// ── ÁREA DE USUÁRIO (Sessão, mas independente de ONG) ─────────────────────────
Route::middleware(['auth', 'verified', 'tenant'])->group(function () {
    Route::get('/dashboard', function () {
        return Inertia::render('Dashboard');
    })->name('dashboard');
});

Route::middleware(['auth', 'throttle:60,1'])->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});


// ==============================================================================
// 🔒 NÚCLEO DO SAAS (Proteção B2B: Exige Login + Isolamento de Tenant interno)
// ==============================================================================
Route::middleware(['auth', 'tenant'])->group(function () {

    Route::get('/breeds/{species}', [App\Http\Controllers\BreedController::class, 'bySpecies'])->name('breeds.by-species');
    
    // 🐾 Módulo 1: Prontuários de Animais
    Route::prefix('animals')->name('animals.')->group(function () {
        Route::get('/', [AnimalController::class, 'index'])->name('index');
        Route::get('/{animal}', [AnimalController::class, 'show'])->name('show');
        
        Route::middleware('throttle:30,1')->group(function () {
            Route::post('/', [AnimalController::class, 'store'])->name('store');
            Route::put('/{animal}', [AnimalController::class, 'update'])->name('update');
            Route::delete('/{animal}', [AnimalController::class, 'destroy'])->name('destroy');
        });
    });

    // 👤 Módulo 2: Adotantes
    Route::prefix('adopters')->name('adopters.')->group(function () {
        Route::get('/', [AdopterController::class, 'index'])->name('index');
        Route::middleware('throttle:20,1')->group(function () {
            Route::post('/', [AdopterController::class, 'store'])->name('store');
            Route::put('/{adopter}', [AdopterController::class, 'update'])->name('update');
            Route::delete('/{adopter}', [AdopterController::class, 'destroy'])->name('destroy');
        });
    });

    // 🤝 Módulo 3: Adoções
    Route::prefix('adoptions')->name('adoptions.')->group(function () {
        Route::get('/', [AdoptionController::class, 'index'])->name('index');
        Route::middleware('throttle:15,1')->group(function () {
            Route::post('/', [AdoptionController::class, 'store'])->name('store');
            Route::patch('/{adoption}/return', [AdoptionController::class, 'returnAnimal'])->name('return');
        });
    });

    // 📦 Módulo 4: Insumos (Inventory)

Route::prefix('insumos')->name('inventory.')->group(function () {
    // As 4 telas separadas
    Route::get('/racao', [InventoryController::class, 'food'])->name('food');
    Route::get('/medicamentos', [InventoryController::class, 'medications'])->name('medications');
    Route::get('/higiene', [InventoryController::class, 'hygiene'])->name('hygiene');
    Route::get('/limpeza', [InventoryController::class, 'cleaning'])->name('cleaning');

    // Cadastro, Edição e Exclusão do Insumo
    Route::post('/', [InventoryController::class, 'store'])->name('store');
    Route::put('/{inventory}', [InventoryController::class, 'update'])->name('update');
    Route::delete('/{inventory}', [InventoryController::class, 'destroy'])->name('destroy');

    // Rota Extrato (Entrada e Saída)
    Route::post('/{inventory}/movimentacao', [InventoryController::class, 'storeMovement'])->name('movements.store');
});

    // 📩 Módulo 5: Solicitações de Adoção
    Route::prefix('adoptions/requests')->name('adoptions.requests.')->group(function () {
        Route::get('/', [AdoptionRequestController::class, 'index'])->name('index');
        Route::patch('/{request}/status', [AdoptionRequestController::class, 'updateStatus'])->name('status');
    });

    // 🏠 Lares Temporários & Voluntários (Agora protegidos pelo Tenant)
    Route::resource('temporary-homes', TemporaryHomeController::class)->except(['create', 'show', 'edit']);
    Route::resource('volunteers', VolunteerController::class)->except(['create', 'show', 'edit']);

}); // Fim do Grupo Auth+Tenant


// 🌐 Rota Pública de CEP
Route::get('/api/cep/{cep}', function ($cep) {
    $cep = preg_replace('/\D/', '', $cep);
    if (strlen($cep) !== 8) return response()->json(['erro' => 'CEP inválido'], 400);
    $response = Http::timeout(5)->get("https://viacep.com.br/ws/{$cep}/json/");
    if ($response->successful() && !isset($response['erro'])) return $response->json();
    return response()->json(['erro' => 'CEP não encontrado'], 404);
})->name('api.cep');

require __DIR__.'/auth.php';


// ==============================================================================
// 🌍 ÁREA PÚBLICA (VITRINE) - Fora do middleware Auth! Totalmente aberta!
// ==============================================================================
Route::prefix('{slug}')->middleware(['web', 'resolve.tenant'])->group(function () {
    
    // Rotas de leitura (Páginas)
    Route::middleware('throttle:60,1')->group(function () {
        Route::get('/', [VitrineController::class, 'home'])->name('vitrine.home'); 
        Route::get('/adote', [VitrineController::class, 'adote'])->name('vitrine.adote');
        Route::get('/animal/{animal}', [VitrineController::class, 'showAnimal'])->name('vitrine.animal.show');
        Route::get('/como-adotar', [VitrineController::class, 'comoAdotar'])->name('vitrine.como-adotar');
        Route::get('/quem-somos', [VitrineController::class, 'quemSomos'])->name('vitrine.quem-somos');
        Route::get('/doar', [VitrineController::class, 'doar'])->name('vitrine.doar');
    });

    // 📩 Rota de Escrita (Formulário) - Onde o Lead é CRIADO
    Route::post('/adote/{animal_uuid}/solicitar', [VitrineAdoptionController::class, 'store'])
        ->middleware('throttle:5,1') 
        ->name('vitrine.adote.store');

});