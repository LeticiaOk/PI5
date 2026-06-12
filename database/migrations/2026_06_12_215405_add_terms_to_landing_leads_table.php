<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('landing_leads', function (Blueprint $table) {
            $table->boolean('terms_accepted')->default(false)->after('ong_name');
        });
    }

    public function down(): void
    {
        Schema::table('landing_leads', function (Blueprint $table) {
            $table->dropColumn('terms_accepted');
        });
    }
};