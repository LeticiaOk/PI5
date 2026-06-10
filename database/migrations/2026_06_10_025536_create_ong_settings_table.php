<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('ong_settings', function (Blueprint $table) {
            $table->id();
            $table->foreignUuid('ong_id')->constrained('ongs')->cascadeOnDelete();
            
            // Os padrões agora ficam no BANCO DE DADOS, não no JSX
            $table->string('primary_color', 7)->default('#4f46e5');
            $table->string('hero_title')->default('Mude o destino de um olhar esperançoso');
            $table->text('hero_subtitle')->nullable();
            $table->longText('about_text')->nullable();
            
            $table->string('facebook_url')->nullable();
            $table->string('instagram_url')->nullable();

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('ong_settings');
    }
};