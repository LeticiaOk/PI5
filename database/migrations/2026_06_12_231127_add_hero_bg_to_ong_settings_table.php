<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('ong_settings', function (Blueprint $table) {
            $table->string('hero_background_color')->default('#0f172a')->after('hero_image_url'); // Padrão: Slate 900
        });
    }

    public function down(): void
    {
        Schema::table('ong_settings', function (Blueprint $table) {
            $table->dropColumn('hero_background_color');
        });
    }
};