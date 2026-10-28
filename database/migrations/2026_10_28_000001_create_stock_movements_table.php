<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        if (Schema::hasTable('stock_movements')) {
            Schema::table('stock_movements', function (Blueprint $table) {
                if (!Schema::hasColumn('stock_movements', 'client_movement_id')) $table->string('client_movement_id', 100)->nullable()->unique();
                if (!Schema::hasColumn('stock_movements', 'user_id')) $table->foreignId('user_id')->nullable()->constrained()->nullOnDelete();
                if (!Schema::hasColumn('stock_movements', 'product_id')) $table->foreignId('product_id')->nullable()->constrained()->nullOnDelete();
                if (!Schema::hasColumn('stock_movements', 'movement_type')) $table->string('movement_type')->default('adjustment');
                if (!Schema::hasColumn('stock_movements', 'quantity')) $table->decimal('quantity', 12, 3)->default(0);
                if (!Schema::hasColumn('stock_movements', 'delta')) $table->decimal('delta', 12, 3)->default(0);
                if (!Schema::hasColumn('stock_movements', 'reason')) $table->text('reason')->nullable();
                if (!Schema::hasColumn('stock_movements', 'created_at')) $table->timestamps();
            });
            return;
        }
        Schema::create('stock_movements', function (Blueprint $table) {
            $table->id();
            $table->string('client_movement_id', 100)->unique();
            $table->foreignId('product_id')->constrained()->cascadeOnDelete();
            $table->foreignId('user_id')->nullable()->constrained()->nullOnDelete();
            $table->string('movement_type', 20);
            $table->decimal('quantity', 12, 3);
            $table->decimal('delta', 12, 3);
            $table->text('reason')->nullable();
            $table->timestamps();
            $table->index(['product_id', 'created_at']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('stock_movements');
    }
};
