<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('ong_settings', function (Blueprint $table) {
            $table->string('hero_image_url')->nullable()->after('hero_subtitle'); // Imagem de fundo
            $table->string('secondary_color')->nullable()->after('primary_color'); // Cor de destaque/botão secundário
            $table->text('mission_text')->nullable()->after('about_text'); // Um texto curto de impacto
            $table->string('pix_key')->nullable(); // Fundamental para doações
            $table->string('public_whatsapp')->nullable(); // Contato público (diferente do fone do dono da ONG)
            $table->string('public_email')->nullable();
        });
    }

    public function down(): void
    {
        Schema::table('ong_settings', function (Blueprint $table) {
            $table->dropColumn([
                'hero_image_url', 'secondary_color', 'mission_text', 
                'pix_key', 'public_whatsapp', 'public_email'
            ]);
        });
    }
};