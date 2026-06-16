<?php

namespace App\Http\Requests\SuperAdmin;

use Illuminate\Foundation\Http\FormRequest;

class StoreOngRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true; // Controlado pelo middleware da rota
    }

  protected function prepareForValidation(): void
{
    $this->merge([
        'slug' => str()->slug($this->slug),
        // Adicionada a checagem: só formata se existir
        'cnpj' => $this->cnpj ? preg_replace('/\D/', '', $this->cnpj) : null,
        'whatsapp' => $this->whatsapp ? preg_replace('/\D/', '', $this->whatsapp) : null,
    ]);
}

public function rules(): array
{
    return [
        'name' => ['required', 'string', 'max:255'],
        'slug' => ['required', 'string', 'max:255', 'unique:ongs,slug'],
        'cnpj' => ['nullable', 'string', 'size:14', 'unique:ongs,cnpj'], // <-- Alterado para nullable
        'email' => ['required', 'email', 'max:255'],
        'whatsapp' => ['nullable', 'string', 'max:15'],
        'is_active' => ['required', 'boolean'],
    ];
}
}