import { useEffect, useState, type FormEvent } from 'react';
import { useForm } from '@inertiajs/react';
import { ImagePlus, Upload, X } from 'lucide-react';
import { toast } from 'sonner';

import type { Category, Product } from '@/types';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import InputError from '@/components/input-error';

interface Props {
    categories: Category[];
    product?: Product | null;
    onClose: () => void;
}

function getProductImageUrl(image?: string | null) {
    if (!image) return null;

    if (image.startsWith('http://') || image.startsWith('https://') || image.startsWith('/')) {
        return image;
    }

    return `/storage/${image}`;
}

export default function ProductForm({ categories, product, onClose }: Props) {
    const {
        data,
        setData,
        post,
        put,
        processing,
        errors,
        reset,
    } = useForm({
        name: product?.name ?? '',
        category_id: product?.category_id?.toString() ?? '',
        description: product?.description ?? '',
        price: product?.price?.toString() ?? '',
        purchase_price: product?.purchase_price?.toString() ?? '',
        stock: product?.stock?.toString() ?? '0',
        is_active: product?.is_active ?? true,
        image: null as File | null,
    });

    const [selectedImagePreview, setSelectedImagePreview] = useState<string | null>(null);
    const [existingImageFailed, setExistingImageFailed] = useState(false);

    useEffect(() => {
        if (!data.image) {
            setSelectedImagePreview(null);
            return;
        }

        const objectUrl = URL.createObjectURL(data.image);
        setSelectedImagePreview(objectUrl);

        return () => URL.revokeObjectURL(objectUrl);
    }, [data.image]);

    const existingImageUrl = getProductImageUrl(product?.image);
    const previewUrl = selectedImagePreview ?? (existingImageFailed ? null : existingImageUrl);

    function handleImageChange(file: File | null) {
        if (!file) {
            setData('image', null);
            return;
        }

        if (!file.type.startsWith('image/')) {
            toast.error('Veuillez sélectionner un fichier image.');
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            toast.error('L’image ne doit pas dépasser 5 Mo.');
            return;
        }

        setExistingImageFailed(false);
        setData('image', file);
    }

    function submit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();

        const options = {
            forceFormData: true,
            onSuccess: () => {
                toast.success(product ? 'Produit mis à jour.' : 'Produit créé.');
                reset();
                onClose();
            },
        };

        if (product) {
            put(`/products/${product.id}`, options);
        } else {
            post('/products', options);
        }
    }

    return (
        <Dialog
            open={true}
            onOpenChange={(open) => {
                if (!open && !processing) onClose();
            }}
        >
            <DialogContent className="max-h-[92dvh] overflow-y-auto p-0 sm:max-w-[680px]">
                <DialogHeader className="border-b bg-gradient-to-r from-primary/5 via-background to-background px-5 py-4 sm:px-6">
                    <DialogTitle className="text-lg font-semibold tracking-tight">
                        {product ? 'Modifier le produit' : 'Ajouter un produit'}
                    </DialogTitle>
                    {/* <p className="text-sm text-muted-foreground">
                        Renseignez les informations du produit et ajoutez une image pour le reconnaître plus facilement.
                    </p> */}
                </DialogHeader>

                <form onSubmit={submit} className="space-y-5 px-5 py-5 sm:px-6">
                    <div className="grid gap-5 sm:grid-cols-[minmax(0,1fr)_220px]">
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="name">Nom du produit</Label>
                                <Input
                                    id="name"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    placeholder="Ex. : Riz 25 kg"
                                    autoComplete="off"
                                    required
                                />
                                <InputError message={errors.name} />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="category_id">Catégorie</Label>
                                <Select
                                    value={data.category_id}
                                    onValueChange={(value) => setData('category_id', value)}
                                >
                                    <SelectTrigger id="category_id" className="w-full">
                                        <SelectValue placeholder="Choisir une catégorie" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {categories.map((category) => (
                                            <SelectItem key={category.id} value={category.id.toString()}>
                                                {category.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <InputError message={errors.category_id} />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="description">Description</Label>
                                <Input
                                    id="description"
                                    value={data.description}
                                    onChange={(e) => setData('description', e.target.value)}
                                    placeholder="Description courte (facultatif)"
                                />
                                <InputError message={errors.description} />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="image">Image du produit</Label>
                            <label
                                htmlFor="image"
                                className="group flex cursor-pointer flex-col overflow-hidden rounded-xl border border-dashed bg-muted/20 transition-colors hover:border-primary/50 hover:bg-primary/[0.03]"
                            >
                                <div className="relative flex aspect-square w-full items-center justify-center overflow-hidden bg-muted/30">
                                    {previewUrl ? (
                                        <img
                                            src={previewUrl}
                                            alt={`Aperçu de ${data.name || 'produit'}`}
                                            className="h-full w-full object-contain p-2"
                                            onError={() => setExistingImageFailed(true)}
                                        />
                                    ) : (
                                        <div className="flex flex-col items-center gap-2 p-4 text-center">
                                            <span className="flex size-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                                                <ImagePlus className="size-6" />
                                            </span>
                                            <span className="text-sm font-medium">Ajouter une image</span>
                                            <span className="text-xs text-muted-foreground">PNG, JPG, WEBP</span>
                                        </div>
                                    )}
                                    <span className="absolute bottom-2 right-2 flex size-9 items-center justify-center rounded-lg border bg-background/95 text-foreground shadow-sm transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                                        <Upload className="size-4" />
                                    </span>
                                </div>
                                <div className="space-y-1 p-3">
                                    <p className="truncate text-sm font-medium">
                                        {data.image?.name ?? (previewUrl ? 'Image actuelle' : 'Choisir un fichier')}
                                    </p>
                                    <p className="text-xs text-muted-foreground">Maximum 5 Mo</p>
                                </div>
                            </label>
                            <Input
                                id="image"
                                type="file"
                                accept="image/png,image/jpeg,image/webp,image/gif"
                                className="sr-only"
                                onChange={(e) => handleImageChange(e.target.files?.[0] ?? null)}
                            />
                            {data.image && (
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    className="w-full text-muted-foreground"
                                    onClick={() => {
                                        setData('image', null);
                                        setExistingImageFailed(false);
                                        const input = document.getElementById('image') as HTMLInputElement | null;
                                        if (input) input.value = '';
                                    }}
                                >
                                    <X className="mr-2 size-4" />
                                    Annuler la nouvelle image
                                </Button>
                            )}
                            <InputError message={errors.image} />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                        <div className="space-y-2">
                            <Label htmlFor="purchase_price">Prix d’achat (CDF)</Label>
                            <Input
                                id="purchase_price"
                                type="number"
                                step="0.01"
                                min="0"
                                value={data.purchase_price}
                                onChange={(e) => setData('purchase_price', e.target.value)}
                                placeholder="0.00"
                                required
                            />
                            <InputError message={errors.purchase_price} />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="price">Prix de vente (CDF)</Label>
                            <Input
                                id="price"
                                type="number"
                                step="0.01"
                                min="0.01"
                                value={data.price}
                                onChange={(e) => setData('price', e.target.value)}
                                placeholder="0.00"
                                required
                            />
                            <InputError message={errors.price} />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="stock">Stock</Label>
                            <Input
                                id="stock"
                                type="number"
                                min="0"
                                step="1"
                                value={data.stock}
                                onChange={(e) => setData('stock', e.target.value)}
                                placeholder="0"
                                required
                            />
                            <InputError message={errors.stock} />
                        </div>
                    </div>

                    <div className="flex flex-col-reverse gap-2 border-t pt-4 sm:flex-row sm:justify-between">
                        <div className="flex items-center gap-2 rounded-lg bg-muted/40 px-3 py-2">
                            <Input
                                type="checkbox"
                                id="is_active"
                                checked={data.is_active}
                                onChange={(e) => setData('is_active', e.target.checked)}
                                className="size-4"
                            />
                            <Label htmlFor="is_active" className="cursor-pointer text-sm">
                                Actif (visible au point de vente)
                            </Label>
                        </div>

                        <div className="flex justify-end gap-2">
                            <Button type="button" variant="outline" onClick={onClose} disabled={processing}>
                                Annuler
                            </Button>
                            <Button type="submit" disabled={processing} className="min-w-28">
                                {processing ? 'Enregistrement…' : product ? 'Mettre à jour' : 'Créer le produit'}
                            </Button>
                        </div>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
