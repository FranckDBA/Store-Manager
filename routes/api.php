<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\ProductController;
use App\Http\Controllers\Api\SaleSyncController;
use App\Http\Controllers\Api\StockMovementController;
use App\Http\Controllers\Api\ConfirmPasswordController;
use App\Http\Controllers\WhatsAppWebhookController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/whatsapp/webhook', [WhatsAppWebhookController::class, 'verify']);
Route::post('/whatsapp/webhook', [WhatsAppWebhookController::class, 'receive']);
Route::post('/login', [AuthController::class, 'login']);

// Lecture du catalogue disponible pour les clients mobiles authentifiés.
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/products', [ProductController::class, 'index']);
    Route::post('/products', [ProductController::class, 'store']);
    Route::put('/products/{product}', [ProductController::class, 'update']);
    Route::patch('/products/{product}', [ProductController::class, 'update']);
    Route::post('/stock-movements/sync', [StockMovementController::class, 'store']);
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', fn (Request $request) => response()->json($request->user()));
    Route::post('/sales/sync', [SaleSyncController::class, 'store']);
    Route::post('/confirm-password', ConfirmPasswordController::class);
});
