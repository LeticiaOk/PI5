<?php

namespace App\Http\Controllers\SuperAdmin;

use App\Http\Controllers\Controller;
use App\Models\Ong;
use App\Models\AdoptionRequest;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        // 1. Puxa todas as ONGs do sistema
        $ongs = Ong::orderBy('created_at', 'desc')->get();

        // 2. Puxa todos os leads de adoção GLOBAIS (ignorando o tenant_id)
        // Usamos 'with' para trazer o nome do animal e da ONG junto
        $adoptionLeads = AdoptionRequest::with(['animal:id,name', 'ong:id,name'])
            ->orderBy('created_at', 'desc')
            ->get();

        // 3. (Futuro) Leads da Landing Page
        // $landingLeads = LandingLead::orderBy('created_at', 'desc')->get();

        return Inertia::render('SuperAdmin/Dashboard', [
            'ongs' => $ongs,
            'adoptionLeads' => $adoptionLeads,
            'totalMarketingOptIn' => $adoptionLeads->where('accepts_marketing', true)->count(),
            // 'landingLeads' => $landingLeads ?? [],
        ]);
    }
}