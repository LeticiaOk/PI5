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
        $table->boolean('display_whatsapp')->default(false)->after('public_whatsapp');
    });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('ong_settings', function (Blueprint $table) {
            //
        });
    }
};
