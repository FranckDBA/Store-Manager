<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Product;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class StockMovementController extends Controller
{
    public function store(Request $request): JsonResponse
    {
        $data = $request->validate([
            'client_movement_id' => ['required','string','max:100'],
            'product_id' => ['required','integer','exists:products,id'],
            'movement_type' => ['required','in:entry,exit,adjustment'],
            'quantity' => ['required','numeric','gt:0'],
            'delta' => ['required','numeric'],
            'reason' => ['nullable','string','max:1000'],
            'created_at' => ['nullable','date'],
        ]);

        $existing = DB::table('stock_movements')->where('client_movement_id', $data['client_movement_id'])->first();
        if ($existing) {
            return response()->json(['message' => 'Mouvement déjà synchronisé.', 'movement_id' => $existing->id, 'already_synced' => true]);
        }

        $movement = DB::transaction(function () use ($data, $request) {
            $product = Product::whereKey($data['product_id'])->lockForUpdate()->firstOrFail();
            $delta = (float) $data['delta'];
            if ($product->stock + $delta < 0) {
                throw ValidationException::withMessages(['stock' => ['Stock serveur insuffisant pour ce mouvement. Synchronise le catalogue puis réessaie.']]);
            }
            $product->stock = (int) ($product->stock + $delta);
            $product->save();

            $id = DB::table('stock_movements')->insertGetId([
                'client_movement_id' => $data['client_movement_id'],
                'product_id' => $product->id,
                'user_id' => $request->user()->id,
                'movement_type' => $data['movement_type'],
                'quantity' => $data['quantity'],
                'delta' => $delta,
                'reason' => $data['reason'] ?? '',
                'created_at' => $data['created_at'] ?? now(),
                'updated_at' => now(),
            ]);
            return ['id' => $id, 'product_id' => $product->id, 'stock' => $product->stock];
        });

        return response()->json(['message' => 'Mouvement synchronisé.', 'movement_id' => $movement['id'], 'product_id' => $movement['product_id'], 'stock' => $movement['stock'], 'already_synced' => false], 201);
    }
}
