<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreCategoryRequest;
use App\Http\Requests\UpdateCategoryRequest;
use App\Models\Category;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class CategoryController extends Controller
{
    /**
     * Afficher la liste des catégories.
     */
    public function index(): Response
    {
        return Inertia::render('categories/index', [
            'categories' => Category::withCount('products')
                ->orderBy('name')
                ->get(),
        ]);
    }

    /**
     * Afficher le formulaire de création.
     */
    public function create(): Response
    {
        return Inertia::render('Category/Create');
    }

    /**
     * Enregistrer une nouvelle catégorie.
     */
    public function store(StoreCategoryRequest $request): RedirectResponse
    {
        Category::create($request->validated());

        return redirect()->route('categories.index');
    }

    /**
     * Afficher une catégorie.
     */
    public function show(Category $category): Response
    {
        return Inertia::render('Category/Show', [
            'category' => $category,
        ]);
    }

    /**
     * Afficher le formulaire de modification.
     */
    public function edit(Category $category): Response
    {
        return Inertia::render('Category/Edit', [
            'category' => $category,
        ]);
    }

    /**
     * Mettre à jour une catégorie.
     */
    public function update(
        UpdateCategoryRequest $request,
        Category $category
    ): RedirectResponse {
        $category->update($request->validated());

        return redirect()->route('categories.index');
    }

    /**
     * Supprimer une catégorie.
     */
    public function destroy(Category $category): RedirectResponse
    {
        $category->delete();

        return redirect()->route('categories.index');
    }
}

