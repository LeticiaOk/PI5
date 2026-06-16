<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('volunteer_requests', function (Blueprint $table) {
            $table->uuid('id')->primary();
            // 🛡️ Chave de Isolamento Multi-tenant
            $table->foreignUuid('ong_id')->constrained('ongs')->onDelete('cascade');
            
            $table->string('name');
            $table->string('phone');
            $table->string('email')->nullable();
            $table->text('notes');
            $table->string('status')->default('pending'); // pending, approved, rejected
            
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('volunteer_requests');
    }
};