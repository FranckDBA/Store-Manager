<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Product;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;

class ProductController extends Controller
{
    public function index(): JsonResponse
    {
        $products = Product::query()
            ->with('category:id,name')
            ->select(['id','category_id','name','description','price','purchase_price','stock','image','is_active','updated_at'])
            ->orderBy('name')->get();

        return response()->json(['data' => $products]);
    }

    public function store(Request $request): JsonResponse
    {
        $data = $request->validate([
            'name' => ['required','string','max:255'],
            'description' => ['nullable','string','max:5000'],
            'price' => ['required','numeric','min:0'],
            'purchase_price' => ['nullable','numeric','min:0'],
            'stock' => ['required','integer','min:0'],
            'category' => ['nullable','string','max:255'],
            'category_id' => ['nullable','integer','exists:categories,id'],
            'is_active' => ['sometimes','boolean'],
            'image_uri' => ['nullable','string','max:2048'],
        ]);

        $categoryId = $this->resolveCategory($data['category_id'] ?? null, $data['category'] ?? null);
        if (!$categoryId) {
            throw ValidationException::withMessages(['category' => ['Choisis ou saisis une catégorie valide.']]);
        }

        $product = Product::create([
            'category_id' => $categoryId,
            'name' => trim($data['name']),
            'description' => $data['description'] ?? null,
            'price' => $data['price'],
            'purchase_price' => $data['purchase_price'] ?? 0,
            'stock' => $data['stock'],
            'is_active' => $data['is_active'] ?? true,
        ]);

        return response()->json(['message' => 'Produit créé.', 'data' => $product->load('category:id,name')], 201);
    }

    public function update(Request $request, Product $product): JsonResponse
    {
        $data = $request->validate([
            'name' => ['sometimes','required','string','max:255'],
            'description' => ['sometimes','nullable','string','max:5000'],
            'price' => ['sometimes','required','numeric','min:0'],
            'purchase_price' => ['sometimes','numeric','min:0'],
            'stock' => ['sometimes','integer','min:0'],
            'category' => ['sometimes','nullable','string','max:255'],
            'category_id' => ['sometimes','nullable','integer','exists:categories,id'],
            'is_active' => ['sometimes','boolean'],
        ]);

        if (array_key_exists('category_id', $data) || array_key_exists('category', $data)) {
            $categoryId = $this->resolveCategory($data['category_id'] ?? null, $data['category'] ?? null);
            if (!$categoryId) {
                throw ValidationException::withMessages(['category' => ['Choisis ou saisis une catégorie valide.']]);
            }
            $data['category_id'] = $categoryId;
        }
        unset($data['category']);
        $product->fill($data)->save();

        return response()->json(['message' => 'Produit mis à jour.', 'data' => $product->fresh()->load('category:id,name')]);
    }

    private function resolveCategory(?int $categoryId, ?string $name): ?int
    {
        if ($categoryId) return $categoryId;
        $name = trim((string) $name);
        if ($name === '') {
            $existing = Category::query()->orderBy('id')->value('id');
            return $existing ? (int) $existing : null;
        }
        return (int) Category::firstOrCreate(['name' => $name])->id;
    }
}
