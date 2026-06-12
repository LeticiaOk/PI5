<?php

namespace App\Http\Controllers;

use App\Models\Inventory;
use App\Models\InventoryMovement;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class InventoryController extends Controller
{
    // ── 1. MÉTODOS DE VISUALIZAÇÃO (AS 4 PÁGINAS) ───────────────────────
    
    // ── 1. MÉTODOS DE VISUALIZAÇÃO (AS 4 PÁGINAS) ───────────────────────
    
    private function getInventoryData($category)
    {
        // Traz os itens da categoria + os históricos de movimentação atrelados
        return Inventory::with('movements')
            ->where('category', $category)
            ->orderBy('created_at', 'desc')
            ->get();
    }

    public function food()
    {
        // 👇 AQUI: Definimos os campos extras específicos de Ração
        $customFields = [
            ['name' => 'especie', 'label' => 'Para qual espécie?', 'type' => 'select', 'options' => ['Cachorros', 'Gatos']],
            ['name' => 'fase', 'label' => 'Fase da Vida', 'type' => 'select', 'options' => ['Filhote', 'Adulto', 'Sênior']],
            ['name' => 'qualidade', 'label' => 'Classificação da Ração', 'type' => 'select', 'options' => ['Premium', 'Premium Especial', 'Super Premium']],
            ['name' => 'corante', 'label' => 'Possui Corante?', 'type' => 'select', 'options' => ['Sim', 'Não']],
            ['name' => 'hipoalergenica', 'label' => 'É Hipoalergênica?', 'type' => 'select', 'options' => ['Sim', 'Não']],
            ['name' => 'condicao_especial', 'label' => 'Condição Especial', 'type' => 'select', 'options' => ['Nenhuma', 'Castrados', 'Controle de Peso']],
        ];

        return Inertia::render('Inventory/Food', [
            'inventory' => $this->getInventoryData('food'),
            'customFields' => $customFields // Mandamos para o React
        ]);
    }

    public function medications()
    {
        // 👇 AQUI: Definimos os campos extras específicos de Remédios
        $customFields = [
            ['name' => 'especie', 'label' => 'Para qual espécie?', 'type' => 'select', 'options' => ['Cachorros', 'Gatos', 'Ambos']],
            ['name' => 'tipo_medicamento', 'label' => 'Tipo de Medicamento', 'type' => 'select', 'options' => ['Antipulgas/Carrapatos', 'Vermífugo', 'Antibiótico', 'Anti-inflamatório', 'Suplemento', 'Outros']],
        ];

        return Inertia::render('Inventory/Medications', [
            'inventory' => $this->getInventoryData('medications'),
            'customFields' => $customFields
        ]);
    }

    public function hygiene()
    {
        // Higiene não precisa de tantos detalhes, deixamos vazio (ou podemos adicionar depois)
        return Inertia::render('Inventory/Hygiene', [
            'inventory' => $this->getInventoryData('hygiene'),
            'customFields' => [] 
        ]);
    }

    public function cleaning()
    {
        // Limpeza é genérico, deixamos vazio
        return Inertia::render('Inventory/Cleaning', [
            'inventory' => $this->getInventoryData('cleaning'),
            'customFields' => []
        ]);
    }


    // ── 2. CRUD DE INSUMOS ──────────────────────────────────────────────

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'category' => 'required|in:food,medications,hygiene,cleaning',
            'quantity' => 'numeric|min:0',
            'unit' => 'required|string',
            'min_quantity' => 'numeric|min:0',
            'provider' => 'nullable|string',
            'details' => 'nullable|array', // O nosso JSON mágico
        ]);

        $validated['ong_id'] = auth()->user()->ong_id;

        Inventory::create($validated);

        return redirect()->back()->with('success', 'Insumo cadastrado com sucesso!');
    }

    public function update(Request $request, Inventory $inventory)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'unit' => 'required|string',
            'min_quantity' => 'numeric|min:0',
            'provider' => 'nullable|string',
            'details' => 'nullable|array',
        ]);

        $inventory->update($validated);

        return redirect()->back()->with('success', 'Insumo atualizado!');
    }

    public function destroy(Inventory $inventory)
    {
        $inventory->delete();
        return redirect()->back()->with('success', 'Insumo removido!');
    }

    // ── 3. O CORAÇÃO DO ESTOQUE (REGISTRAR ENTRADA/SAÍDA) ───────────────

    public function storeMovement(Request $request, Inventory $inventory)
    {
        // 1. PRIMEIRO nós validamos e criamos a variável $validated
        $validated = $request->validate([
            'type' => 'required|in:in,out',
            'quantity' => 'required|numeric|min:0.01',
            'responsible_name' => 'required|string|max:255',
            'description' => 'nullable|string|max:255',
        ]);

        // 2. Validação de Segurança ANTES da transação
        if ($validated['type'] === 'out' && $inventory->quantity < $validated['quantity']) {
            return redirect()->back()->withErrors([
                'quantity' => 'Saldo insuficiente em estoque para esta saída.'
            ]);
        }

        // 3. Database Transaction: Abre APENAS UMA VEZ
        DB::transaction(function () use ($validated, $inventory) {
            
            // Registra o extrato garantindo o ong_id correto
            InventoryMovement::create([
                'ong_id' => auth()->user()->ong_id, // 🛡️ CORREÇÃO MANTIDA AQUI
                'inventory_id' => $inventory->id,
                'type' => $validated['type'],
                'quantity' => $validated['quantity'],
                'responsible_name' => $validated['responsible_name'],
                'description' => $validated['description'],
            ]);

            // Atualiza o saldo final do insumo
            if ($validated['type'] === 'in') {
                $inventory->increment('quantity', $validated['quantity']);
            } else {
                $inventory->decrement('quantity', $validated['quantity']);
            }
            
        }); // Fim da transação

        return redirect()->back()->with('success', 'Movimentação registrada com sucesso!');
    }

}