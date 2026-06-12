<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('landing_leads', function (Blueprint $table) {
            $table->id();
            $table->string('name'); // Nome do responsável
            $table->string('email')->unique();
            $table->string('phone');
            $table->string('ong_name')->nullable(); // Nome da ONG que ele quer cadastrar
            $table->string('status')->default('pending'); // pending, contacted, converted
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('landing_leads');
    }
};