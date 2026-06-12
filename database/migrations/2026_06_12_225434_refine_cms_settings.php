<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('ong_settings', function (Blueprint $table) {
            $table->string('about_photo_1')->nullable()->after('hero_image_url');
            $table->string('about_photo_2')->nullable()->after('about_photo_1');
            $table->integer('manual_saved_count')->default(0)->after('public_email'); 
            $table->integer('manual_volunteers_count')->default(0)->after('manual_saved_count');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('ong_settings', function (Blueprint $table) {
            $table->dropColumn([
                'about_photo_1', 
                'about_photo_2', 
                'manual_saved_count', 
                'manual_volunteers_count'
            ]);
        });
    }
};