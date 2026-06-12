<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('inventories', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('ong_id')->constrained('ongs')->cascadeOnDelete();
            
            $table->string('name');
            $table->enum('category', ['food', 'medications', 'hygiene', 'cleaning']);
            $table->decimal('quantity', 10, 2)->default(0); // O saldo atual
            $table->string('unit')->default('unidades'); // kg, litros, caixas
            $table->decimal('min_quantity', 10, 2)->default(0); // Alerta de estoque baixo
            $table->string('provider')->nullable();
            
            // O Segredo do Petshop:
            $table->json('details')->nullable(); 
            
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('inventories');
    }
};