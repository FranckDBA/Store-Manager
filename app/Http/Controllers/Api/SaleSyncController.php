<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Models\Sale;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class SaleSyncController extends Controller
{
    public function store(Request $request): JsonResponse
    {
        $data = $request->validate([
            'client_sale_id' => ['required', 'string', 'max:100'],
            'items' => ['required', 'array', 'min:1'],
            'items.*.product_id' => ['required', 'integer', 'exists:products,id'],
            'items.*.quantity' => ['required', 'integer', 'min:1'],
            'items.*.unit_price_at_sale' => ['required', 'numeric', 'min:0'],
            'items.*.unit_cost_at_sale' => ['required', 'numeric', 'min:0'],
            'items.*.product_name_at_sale' => ['nullable', 'string', 'max:255'],
            'total' => ['required', 'numeric', 'min:0'],
            'cash_tendered' => ['required', 'numeric', 'min:0'],
            'change_amount' => ['required', 'numeric', 'min:0'],
            'created_at' => ['nullable', 'date'],
        ]);

        $existing = Sale::where('client_sale_id', $data['client_sale_id'])->first();
        if ($existing) {
            return response()->json([
                'message' => 'Vente déjà synchronisée.',
                'sale_id' => $existing->id,
                'already_synced' => true,
            ]);
        }

        $sale = DB::transaction(function () use ($data, $request) {
            // Verrouille les produits pour empêcher les ventes concurrentes de dépasser le stock.
            $products = Product::whereIn('id', collect($data['items'])->pluck('product_id'))
                ->lockForUpdate()->get()->keyBy('id');

            foreach ($data['items'] as $item) {
                $product = $products->get($item['product_id']);
                if (!$product || $product->stock < $item['quantity']) {
                    throw ValidationException::withMessages([
                        'items' => ['Stock serveur insuffisant pour un ou plusieurs produits. Synchronise le catalogue puis réessaie.'],
                    ]);
                }
            }

            $sale = new Sale();
            $sale->user_id = $request->user()->id;
            $sale->client_sale_id = $data['client_sale_id'];
            $sale->total = $data['total'];
            $sale->cash_tendered = $data['cash_tendered'];
            $sale->change_amount = $data['change_amount'];
            $sale->status = 'completed';
            $sale->notes = 'Synchronisée depuis Store Manager Suite mobile';
            $sale->save();

            foreach ($data['items'] as $item) {
                $product = $products->get($item['product_id']);
                $unitPrice = (float) $item['unit_price_at_sale'];
                $unitCost = (float) $item['unit_cost_at_sale'];
                $quantity = (int) $item['quantity'];

                $sale->items()->create([
                    'product_id' => $product->id,
                    'product_name' => $item['product_name_at_sale'] ?? $product->name,
                    'unit_price' => $unitPrice,
                    'unit_cost' => $unitCost,
                    'quantity' => $quantity,
                    'subtotal' => round($unitPrice * $quantity, 2),
                ]);

                $product->decrement('stock', $quantity);
            }

            return $sale;
        });

        return response()->json([
            'message' => 'Vente synchronisée.',
            'sale_id' => $sale->id,
            'already_synced' => false,
        ], 201);
    }
}
