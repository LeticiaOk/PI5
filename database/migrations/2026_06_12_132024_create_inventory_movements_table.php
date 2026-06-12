<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('inventory_movements', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('ong_id')->constrained('ongs')->cascadeOnDelete();
            $table->foreignUuid('inventory_id')->constrained('inventories')->cascadeOnDelete();
            
            $table->enum('type', ['in', 'out']);
            $table->decimal('quantity', 10, 2);
            $table->string('responsible_name');
            $table->string('description')->nullable();
            
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('inventory_movements');
    }
};