<?php

namespace App\Http\Controllers;

use App\Models\Sale;
use App\Models\SaleItem;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class SalesHistoryController extends Controller
{
    public function index(Request $request): Response
    {
        $validated = $request->validate([
            'period' => ['nullable', 'in:day,month,year'],
            'date' => ['nullable', 'date_format:Y-m-d'],
            'month' => ['nullable', 'date_format:Y-m'],
            'year' => ['nullable', 'date_format:Y'],
            'page' => ['nullable', 'integer', 'min:1'],
        ]);

        $period = $validated['period'] ?? 'month';

        $start = match ($period) {
            'day' => Carbon::createFromFormat(
                'Y-m-d',
                $validated['date'] ?? now()->format('Y-m-d')
            )->startOfDay(),

            'year' => Carbon::createFromFormat(
                'Y',
                $validated['year'] ?? now()->format('Y')
            )->startOfYear(),

            default => Carbon::createFromFormat(
                'Y-m',
                $validated['month'] ?? now()->format('Y-m')
            )->startOfMonth(),
        };

        $end = match ($period) {
            'day' => $start->copy()->endOfDay(),
            'year' => $start->copy()->endOfYear(),
            default => $start->copy()->endOfMonth(),
        };

        $salesQuery = Sale::query()
            ->where('status', 'completed')
            ->whereBetween('created_at', [$start, $end]);

        $salesCount = (clone $salesQuery)->count();

        $revenue = (clone $salesQuery)->sum('total');

        $itemsQuery = SaleItem::query()
            ->whereHas('sale', function ($query) use ($start, $end) {
                $query->where('status', 'completed')
                    ->whereBetween('created_at', [$start, $end]);
            });

        $missingCostCount = (clone $itemsQuery)
            ->whereNull('unit_cost')
            ->count();

        $cost = (clone $itemsQuery)
            ->whereNotNull('unit_cost')
            ->sum(DB::raw('unit_cost * quantity'));

        $profit = $missingCostCount === 0
            ? round((float) $revenue - (float) $cost, 2)
            : null;

        $sales = (clone $salesQuery)
            ->with('items')
            ->latest()
            ->paginate(15)
            ->withQueryString();

        return Inertia::render('sales/history', [
            'filters' => [
                'period' => $period,
                'date' => $start->format('Y-m-d'),
                'month' => $start->format('Y-m'),
                'year' => $start->format('Y'),
            ],
            'stats' => [
                'sales_count' => $salesCount,
                'revenue' => round((float) $revenue, 2),
                'cost' => round((float) $cost, 2),
                'profit' => $profit,
                'missing_cost_count' => $missingCostCount,
            ],
            'sales' => $sales,
        ]);
    }
}
