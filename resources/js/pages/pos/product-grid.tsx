import { useState } from 'react';
import { Product } from '@/types';
import { formatPrice } from '@/lib/formatPrice';

interface Props {
    products: Product[];
    onAdd: (product: Product) => void;
}

function getProductImageUrl(image: string) {
    // Accepte un chemin relatif, un chemin /storage/... ou une URL complète.
    if (/^https?:\/\//i.test(image) || image.startsWith('/')) {
        return image;
    }

    return `/storage/${image.replace(/^storage\//, '')}`;
}

export default function ProductsGrid({ products, onAdd }: Props) {
    if (products.length === 0) {
        return (
            <div className="flex flex-1 items-center justify-center text-muted-foreground">
                No Products found.
            </div>
        );
    }

    return (
        <div className="min-h-0 flex-1 overflow-y-auto p-3 sm:p-4">
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
                {products.map((product) => (
                    <ProductCard
                        key={product.id}
                        product={product}
                        onAdd={() => onAdd(product)}
                    />
                ))}
            </div>
        </div>
    );
}

function ProductCard({
    product,
    onAdd,
}: {
    product: Product;
    onAdd: () => void;
}) {
    const [imageFailed, setImageFailed] = useState(false);

    return (
        <button
            type="button"
            onClick={onAdd}
            className="group flex min-w-0 flex-col overflow-hidden rounded-xl border bg-card text-left transition-all duration-200 hover:border-primary hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
        >
            {/* Zone uniforme : l’image garde ses proportions et n’est pas coupée. */}
            <div className="flex aspect-square w-full items-center justify-center overflow-hidden bg-muted/40 p-2 sm:p-3">
                {product.image && !imageFailed ? (
                    <img
                        src={getProductImageUrl(product.image)}
                        alt={product.name}
                        loading="lazy"
                        onError={() => setImageFailed(true)}
                        className="h-full w-full object-contain transition-transform duration-200 group-hover:scale-105"
                    />
                ) : (
                    <div className="flex h-full w-full items-center justify-center rounded-lg bg-muted text-3xl font-semibold text-muted-foreground">
                        {product.name?.charAt(0)?.toUpperCase() || '?'}
                    </div>
                )}
            </div>

            <div className="flex w-full min-w-0 flex-1 flex-col gap-1 p-2 sm:p-3">
                <p
                    className="truncate text-xs font-medium sm:text-sm"
                    title={product.name}
                >
                    {product.name}
                </p>

                <p className="text-sm font-bold text-primary sm:text-base">
                    {formatPrice(product.price)}
                </p>

                <p className="text-xs text-muted-foreground">
                    Stock : <span className="font-medium text-foreground">{product.stock}</span>
                </p>
            </div>
        </button>
    );
}
