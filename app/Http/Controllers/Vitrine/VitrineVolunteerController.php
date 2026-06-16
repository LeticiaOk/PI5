<?php
namespace App\Http\Controllers\Vitrine;

use App\Http\Controllers\Controller;
use App\Models\VolunteerRequest;
use Illuminate\Http\Request;

class VitrineVolunteerController extends Controller
{
    public function store(Request $request, $slug)
    {
        // 1. Validação Estrita (Prevenção contra injeção de dados anômalos)
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'phone' => 'required|string|max:20',
            'email' => 'nullable|email|max:255',
            'notes' => 'required|string|max:1000',
            'terms_accepted' => 'accepted', // Valida o checkbox obrigatoriamente
        ]);

        // 2. Identificação Segura do Tenant
        // O middleware 'resolve.tenant' (que você já configurou no web.php)
        // garante que a ONG existe e injeta o ID no container da aplicação.
        $tenantId = app('currentTenant');

        if (!$tenantId) {
            abort(404, 'Instituição não encontrada.');
        }

        // 3. Persistência Isolada
        VolunteerRequest::create([
            'ong_id' => $tenantId, // 🛡️ Injeção rigorosa do ID da ONG
            'name' => strip_tags($validated['name']), // Sanitização contra XSS
            'phone' => strip_tags($validated['phone']),
            'email' => $validated['email'] ? strip_tags($validated['email']) : null,
            'notes' => strip_tags($validated['notes']),
            'status' => 'pending',
        ]);

        // Retorna sucesso para o frontend (Inertia intercepta sem recarregar a página)
        return back()->with('success', 'Solicitação enviada com sucesso!');
    }
}