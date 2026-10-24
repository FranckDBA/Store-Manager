<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Sale;
use Inertia\Inertia;

class SaleController extends Controller
{
    public function invoice(Sale $sale)
    {
        $sale->load('items');

        return Inertia::render('sales/invoice', [
            'sale' => $sale,
        ]);
    }
}

