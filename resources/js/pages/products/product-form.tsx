import { Category, Product } from "@/types";
import { useForm } from "@inertiajs/react";
import { FormEvent } from "react";
import { toast } from "sonner";

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import InputError from "@/components/input-error";

interface Props {
    categories: Category[];
    product?: Product | null;
    onClose: () => void;
}

export default function ProductForm({
    categories,
    product,
    onClose,
}: Props) {
    const {
        data,
        setData,
        post,
        put,
        processing,
        errors,
        reset,
    } = useForm({
        name: product?.name ?? "",
        category_id: product?.category_id?.toString() ?? "",
        description: product?.description ?? "",
        price: product?.price?.toString() ?? "",
        purchase_price:product?.purchase_price?.toString() ?? '',
        stock: product?.stock?.toString() ?? "0",
        is_active: product?.is_active ?? true,
        image: null as File | null,
    });

    // Soumission du formulaire
    function submit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();

        const options = {
            forceFormData: true,

            onSuccess: () => {
                toast.success(
                    product
                        ? "Product updated."
                        : "Product created."
                );

                reset();
                onClose();
            },
        };

        if (product) {
            put(`/products/${product.id}`, options);
        } else {
            post("/products", options);
        }
    }

    return (
        <Dialog
            open={true}
            onOpenChange={(open) => {
                if (!open) {
                    onClose();
                }
            }}
        >
            <DialogContent className="sm:max-w-[600px]">
                {/* Header du Dialog */}
                <DialogHeader>
                    <DialogTitle>
                        {product
                            ? "Edit Product"
                            : "Add Product"}
                    </DialogTitle>
                </DialogHeader>

                {/* Formulaire */}
                <form
                    onSubmit={submit}
                    className="space-y-4"
                >
                    {/* Name */}
                    <div className="space-y-2">
                        <Label htmlFor="name">
                            Name
                        </Label>

                        <Input
                            id="name"
                            type="text"
                            value={data.name}
                            onChange={(e) =>
                                setData(
                                    "name",
                                    e.target.value
                                )
                            }
                            placeholder="Product name"
                        />

                        <InputError
                            message={errors.name}
                        />
                    </div>

                    {/* Category */}
                    <div className="space-y-2">
                        <Label htmlFor="category_id">
                            Category
                        </Label>

                        <Select
                            value={data.category_id}
                            onValueChange={(value) =>
                                setData(
                                    "category_id",
                                    value
                                )
                            }
                        >
                            <SelectTrigger id="category_id">
                                <SelectValue placeholder="Select category" />
                            </SelectTrigger>

                            <SelectContent>
                                {categories.map(
                                    (category) => (
                                        <SelectItem
                                            key={category.id}
                                            value={category.id.toString()}
                                        >
                                            {category.name}
                                        </SelectItem>
                                    )
                                )}
                            </SelectContent>
                        </Select>

                        <InputError
                            message={
                                errors.category_id
                            }
                        />
                    </div>

                    {/* Purchase Price + Selling Price + Stock */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        {/* Purchase Price */}
                        <div className="space-y-2">
                            <Label htmlFor="purchase_price">
                                Purchase Price (CDF)
                            </Label>

                            <Input
                                id="purchase_price"
                                type="number"
                                step="0.01"
                                min="0"
                                value={data.purchase_price}
                                onChange={(e) =>
                                    setData("purchase_price", e.target.value)
                                }
                                placeholder="0.00"
                            />

                            <InputError message={errors.purchase_price} />
                        </div>

                        {/* Selling Price */}
                        <div className="space-y-2">
                            <Label htmlFor="price">
                                Selling Price (CDF)
                            </Label>

                            <Input
                                id="price"
                                type="number"
                                step="0.01"
                                min="0.01"
                                value={data.price}
                                onChange={(e) =>
                                    setData("price", e.target.value)
                                }
                                placeholder="0.00"
                            />

                            <InputError message={errors.price} />
                        </div>

                        {/* Stock */}
                        <div className="space-y-2">
                            <Label htmlFor="stock">Stock</Label>

                            <Input
                                id="stock"
                                type="number"
                                min="0"
                                step="1"
                                value={data.stock}
                                onChange={(e) =>
                                    setData("stock", e.target.value)
                                }
                                placeholder="0"
                            />

                            <InputError message={errors.stock} />
                        </div>
                    </div>

                    {/* Description */}
                    <div className="space-y-2">
                        <Label htmlFor="description">
                            Description
                        </Label>

                        <Input
                            id="description"
                            type="text"
                            value={data.description}
                            onChange={(e) =>
                                setData(
                                    "description",
                                    e.target.value
                                )
                            }
                            placeholder="Product description"
                        />

                        <InputError
                            message={
                                errors.description
                            }
                        />
                    </div>

                    {/* Image */}
                    <div className="space-y-2">
                        <Label htmlFor="image">
                            Image (optional)
                        </Label>

                        <Input
                            id="image"
                            type="file"
                            accept="image/*"
                            onChange={(e) =>
                                setData(
                                    "image",
                                    e.target.files?.[0] ??
                                        null
                                )
                            }
                        />

                        <InputError
                            message={errors.image}
                        />
                    </div>

                    {/* Active */}
                    <div className="flex items-center gap-2">
                        <Input
                            type="checkbox"
                            id="is_active"
                            checked={data.is_active}
                            onChange={(e) =>
                                setData(
                                    "is_active",
                                    e.target.checked
                                )
                            }
                            className="h-4 w-4"
                        />

                        <Label htmlFor="is_active">
                            Active (visible in POS)
                        </Label>
                    </div>

                    {/* Buttons */}
                    <div className="flex justify-end gap-2 pt-4">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={onClose}
                            disabled={processing}
                        >
                            Cancel
                        </Button>

                        <Button
                            type="submit"
                            disabled={processing}
                        >
                            {processing
                                ? "Saving..."
                                : product
                                ? "Update"
                                : "Create"}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}

