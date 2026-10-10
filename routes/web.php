<?php

use App\Http\Controllers\CategoryController;
use App\Http\Controllers\CheckoutController;
use App\Http\Controllers\PosController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\ProductController;
use Illuminate\Support\Facades\Route;

Route::inertia('/', 'welcome')->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', [DashboardController::class, 'index'])
        ->name('dashboard');

    // Produits
    Route::resource('products', ProductController::class)
        ->except(['create', 'show', 'edit']);

    // Catégories
    Route::resource('categories', CategoryController::class)
        ->except(['create', 'show', 'edit']);

    // Point de vente
    Route::get('pos', [PosController::class, 'index'])
        ->name('pos.index');

    // Encaissement
    Route::post('checkout', [CheckoutController::class, 'store'])
        ->name('checkout');

    // Reçu
    Route::get('receipt/{sale}', [CheckoutController::class, 'receipt'])
        ->name('receipt');
});

require __DIR__ . '/settings.php';

