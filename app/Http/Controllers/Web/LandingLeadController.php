<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use App\Models\LandingLead;
use Illuminate\Http\Request;

class LandingLeadController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:100',
            'email' => 'required|email|max:150|unique:landing_leads,email',
            'phone' => 'required|string|max:20',
            'ong_name' => 'nullable|string|max:150',
            'terms_accepted' => 'accepted', // 👈 A trava obrigatória da LGPD!
        ], [
            'email.unique' => 'Este e-mail já está na nossa lista de espera!',
            'terms_accepted.accepted' => 'Você precisa aceitar os termos de uso para continuar.'
        ]);

        LandingLead::create([
            'name' => strip_tags($validated['name']),
            'email' => $validated['email'],
            'phone' => strip_tags($validated['phone']),
            'ong_name' => strip_tags($validated['ong_name']),
            'terms_accepted' => true,
            'status' => 'pending',
        ]);

        return back()->with('success', 'Interesse registrado com sucesso! Entraremos em contato em breve.');
    }
}