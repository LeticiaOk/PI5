<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('adoption_requests', function (Blueprint $table) {
            // Adiciona a coluna booleana, por padrão é false (LGPD exige consentimento ativo)
            $table->boolean('accepts_marketing')->default(false)->after('animal_id');

            // Checkbox Obrigatório (Termos de Uso / Privacidade da ONG e da PlataformaX)
            $table->boolean('terms_accepted')->default(false)->after('accepts_marketing');
        });
    }

    public function down(): void
    {
        Schema::table('adoption_requests', function (Blueprint $table) {
            $table->dropColumn('accepts_marketing');
            $table->dropColumn('terms_accepted');
        });
    }
};