<?php

namespace App\Services;
use App\Models\Product;
use App\Models\Sale;
use App\Models\SaleItem;
use Carbon\Carbon;
use Illuminate\Support\Collection;

class SalesReportService
{
    /**
     * Génère le rapport des ventes pour une journée.
     */
    public function daily(?Carbon $date = null): array
    {
        $date ??= today();

        $todaySales = Sale::whereDate('created_at', $date)
            ->where('status', 'completed')
            ->get();

        $todayRevenue = SaleItem::whereHas('sale', function ($query) use ($date) {
            $query->whereDate('created_at', $date)
                ->where('status', 'completed');
        })->sum('subtotal');

        $totalItemsSold = SaleItem::whereHas('sale', function ($query) use ($date) {
            $query->whereDate('created_at', $date)
                ->where('status', 'completed');
        })->sum('quantity');

        $topProducts = SaleItem::query()
            ->join('products', 'products.id', '=', 'sale_items.product_id')
            ->selectRaw('
                products.id as product_id,
                products.name as product_name,
                SUM(sale_items.quantity) as total_qty,
                SUM(sale_items.subtotal) as total_revenue
            ')
            ->whereHas('sale', function ($query) use ($date) {
                $query->whereDate('created_at', $date)
                    ->where('status', 'completed');
            })
            ->groupBy('products.id', 'products.name')
            ->orderByDesc('total_qty')
            ->limit(5)
            ->get();

        $lowStockProducts = Product::where('stock', '>', 0)
            ->where('stock', '<=', 5)
            ->where('is_active', true)
            ->orderBy('stock')
            ->get([
                'id',
                'name',
                'stock',
            ]);

        $outOfStockProducts = Product::where('stock', '<=', 0)
            ->where('is_active', true)
            ->get([
                'id',
                'name',
                'stock',
            ]);

        return [
            'date' => $date->format('Y-m-d'),

            'revenue' => (float) $todayRevenue,

            'transactions' => $todaySales->count(),

            'items_sold' => (int) $totalItemsSold,

            'top_products' => $topProducts,

            'low_stock_products' => $lowStockProducts,

            'out_of_stock_products' => $outOfStockProducts,
        ];
    }
}
