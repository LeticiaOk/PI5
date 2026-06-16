<?php

namespace App\Http\Controllers\SuperAdmin;

use App\Http\Controllers\Controller;
use App\Http\Requests\SuperAdmin\StoreOngRequest;
use App\Http\Requests\SuperAdmin\UpdateOngRequest;
use App\Models\Ong;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\DB;

class SuperAdminOngController extends Controller
{
    /**
     * Cria uma nova ONG e inicializa as configurações do Tenant de forma atómica.
     */
    public function store(StoreOngRequest $request): RedirectResponse
    {
        $validated = $request->validated();
        
        // Atribui um novo UUID para a chave primária string
        $validated['id'] = str()->uuid()->toString();

        DB::transaction(function () use ($validated) {
            // 1. Cria a instituição
            $ong = Ong::create($validated);

            // 2. Inicializa as configurações obrigatórias para evitar quebra de layout no primeiro acesso
            $ong->settings()->create([
                'primary_color' => '#4f46e5',
                'hero_background_color' => '#0f172a',
                'hero_subtitle' => 'Transformando vidas de quatro patas todos os dias.',
                'manual_saved_count' => 0,
                'manual_volunteers_count' => 0,
            ]);
        });

        return back()->with('success', 'Nova instituição registada e configurada com sucesso!');
    }

    /**
     * Atualiza os dados cadastrais da ONG.
     */
    public function update(UpdateOngRequest $request, string $id): RedirectResponse
    {
        $ong = Ong::findOrFail($id);
        
        $ong->update($request->validated());

        return back()->with('success', 'Dados da instituição atualizados com sucesso.');
    }

    /**
     * Remove a instituição da plataforma (Usa SoftDeletes conforme configurado na sua Model).
     */
    public function destroy(string $id): RedirectResponse
    {
        $ong = Ong::findOrFail($id);
        
        // O SoftDeletes protege a integridade e histórico de dados de adoções passadas
        $ong->delete();

        return back()->with('success', 'Instituição desativada e movida para a lixeira.');
    }
}