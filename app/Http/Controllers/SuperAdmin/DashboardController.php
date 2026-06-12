<?php

namespace App\Http\Controllers\SuperAdmin;

use App\Http\Controllers\Controller;
use App\Models\Ong;
use App\Models\AdoptionRequest;
use App\Models\LandingLead; // 👈 Importamos o novo Model
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        $ongs = Ong::orderBy('created_at', 'desc')->get();

        $adoptionLeads = AdoptionRequest::with(['animal:id,name', 'ong:id,name'])
            ->orderBy('created_at', 'desc')
            ->get();

        // 👈 Puxamos os leads da Landing Page
        $landingLeads = LandingLead::orderBy('created_at', 'desc')->get();

        return Inertia::render('SuperAdmin/Dashboard', [
            'ongs' => $ongs,
            'adoptionLeads' => $adoptionLeads,
            'totalMarketingOptIn' => $adoptionLeads->where('accepts_marketing', true)->count(),
            'landingLeads' => $landingLeads, 
        ]);
    }
}