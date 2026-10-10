<?php

namespace App\Http\Controllers;

use App\Models\Sale;
use App\Models\SaleItem;
use App\Models\Product;
use App\Services\SalesReportService;
use App\Services\WhatsAppReportFormatter;
use Inertia\Response;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index(SalesReportService $salesReportService,WhatsAppReportFormatter $formatter): Response
    {
        $today = today();
        $report = $salesReportService->daily();

        $message = $formatter->daily($report);



        // Ventes terminées aujourd'hui
        $todaySales = Sale::whereDate('created_at', $today)
            ->where('status', 'completed')
            ->get();

        // Chiffre d'affaires du jour
        $todayRevenue = SaleItem::whereHas('sale', function ($q) use ($today) {
            $q->whereDate('created_at', $today)
                ->where('status', 'completed');
        })->sum('subtotal');

        // Top products
        $topProducts = SaleItem::query()
            ->join('products', 'products.id', '=', 'sale_items.product_id')
            ->select(
                'products.id as product_id',
                'products.name as product_name',
                DB::raw('SUM(sale_items.quantity) as total_qty'),
                DB::raw('SUM(sale_items.subtotal) as total_revenue')
            )
            ->whereHas('sale', function ($q) use ($today) {
                $q->whereDate('created_at', $today)
                    ->where('status', 'completed');
            })
            ->groupBy('products.id', 'products.name')
            ->orderByDesc('total_qty')
            ->limit(5)
            ->get();

        // Ventes récentes
        $recentSales = Sale::with('items')
            ->latest()
            ->limit(10)
            ->get();

        return Inertia::render('dashboard', [
            'stats' => [
                'today_revenue' => number_format((float) $todayRevenue, 2),
                'today_transactions' => $todaySales->count(),
                'total_products' => Product::where('is_active', true)->count(),
                'low_stock_count' => Product::where('stock', '>', 0)
                    ->where('stock', '<=', 5)
                    ->count(),

                'out_of_stock_count' => Product::where('stock', '<=', 0)
                    ->count(),
            ],

            'top_products' => $topProducts,

            'recent_sales' => $recentSales,
        ]);
    }
}
