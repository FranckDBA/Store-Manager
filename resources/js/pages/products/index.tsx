import { Category, Product } from "@/types";
import { Head, router } from "@inertiajs/react";
import { useState } from "react";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import ProductForm from "./product-form";

interface Props {
    products: Product[];
    categories: Category[];
}

export default function ProductIndex({
    products,
    categories,
}: Props) {
    const [showForm, setShowForm] = useState(false);
    const [editing, setEditing] = useState<Product | null>(null);

    // Ouvrir le formulaire pour ajouter un produit
    function handleAdd() {
        setEditing(null);
        setShowForm(true);
    }

    // Ouvrir le formulaire pour modifier un produit
    function handleEdit(product: Product) {
        setEditing(product);
        setShowForm(true);
    }

    // Fermer le formulaire
    function handleClose() {
        setShowForm(false);
        setEditing(null);
    }

    // Supprimer un produit
    function handleDelete(product: Product) {
        if (!confirm(`Delete "${product.name}"?`)) {
            return;
        }

        router.delete(`/products/${product.id}`, {
            onSuccess: () => {
                toast.success("Product deleted.");
            },
        });
    }

    return (
        <>
            <Head title="Products" />

            <div className="p-6">
                {/* Header */}
                <div className="mb-4 flex items-center justify-between">
                    <h1 className="text-2xl font-bold">
                        Products
                    </h1>

                    <Button onClick={handleAdd}>
                        <Plus className="mr-2 h-4 w-4" />
                        Add Product
                    </Button>
                </div>

                {/* Table */}
                <div className="rounded-lg border">
                    <table className="w-full text-sm">
                        <thead className="border-b bg-muted/50">
                            <tr>
                                <th className="px-4 py-3 text-left">
                                    Name
                                </th>

                                <th className="px-4 py-3 text-left">
                                    Category
                                </th>

                                <th className="px-4 py-3 text-right">
                                    Price
                                </th>

                                <th className="px-4 py-3 text-right">
                                    Stock
                                </th>

                                <th className="px-4 py-3 text-center">
                                    Status
                                </th>

                                <th className="px-4 py-3 text-right">
                                    Actions
                                </th>
                            </tr>
                        </thead>

                        <tbody>
                            {/* Aucun produit */}
                            {products.length === 0 && (
                                <tr>
                                    <td
                                        colSpan={6}
                                        className="px-4 py-8 text-center text-muted-foreground"
                                    >
                                        No product yet. Click
                                        "Add Product" to get started.
                                    </td>
                                </tr>
                            )}

                            {/* Liste des produits */}
                            {products.map((product) => (
                                <tr
                                    key={product.id}
                                    className="border-b last:border-0 hover:bg-muted/25"
                                >
                                    {/* Name */}
                                    <td className="px-4 py-3 font-medium">
                                        {product.name}
                                    </td>

                                    {/* Category */}
                                    <td className="px-4 py-3 text-muted-foreground">
                                        {product.category?.name ?? "-"}
                                    </td>

                                    {/* Price */}
                                    <td className="px-4 py-3 text-right">
                                        ${product.price}
                                    </td>

                                    {/* Stock */}
                                    <td
                                        className={`px-4 py-3 text-right ${
    product.stock <= 5
        ? "font-semibold text-orange-600"
        : ""
}`}
                                    >
                                        {product.stock}

                                        {product.stock === 0 && (
                                            <span className="ml-1 text-xs text-destructive">
                                                (Out)
                                            </span>
                                        )}
                                    </td>

                                    {/* Status */}
                                    <td className="px-4 py-3 text-center">
                                        <Badge
                                            variant={
                                                product.is_active
                                                    ? "default"
                                                    : "secondary"
                                            }
                                        >
                                            {product.is_active
                                                ? "Active"
                                                : "Inactive"}
                                        </Badge>
                                    </td>

                                    {/* Actions */}
                                    <td className="px-4 py-3 text-right">
                                        {/* Edit */}
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="icon"
                                            onClick={() =>
                                                handleEdit(product)
                                            }
                                        >
                                            <Pencil className="h-4 w-4" />
                                        </Button>

                                        {/* Delete */}
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="icon"
                                            onClick={() =>
                                                handleDelete(product)
                                            }
                                        >
                                            <Trash2 className="h-4 w-4 text-destructive" />
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Product Form */}
            {showForm && (
                <ProductForm
                    categories={categories}
                    product={editing}
                    onClose={handleClose}
                />
            )}
        </>
    );
}

ProductIndex.layout = {
    breadcrumbs: [
        {
            title: "Products",
            href: "/products",
        },
    ],
};

