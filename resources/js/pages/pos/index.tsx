import { useMemo, useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import {
    ArrowLeft,
    LayoutGrid,
    Search,
    ShoppingBag,
    X,
} from 'lucide-react';

import type { Product } from '@/types';
import { Input } from '@/components/ui/input';
import ProductsGrid from './product-grid';
import CardPanel from './cart-panel';
import { useCart } from '@/pages/pos/use-cart';
import CheckoutDialog from './checkout-dialog';

interface Props {
    products: Product[];
}

export default function PosIndex({ products }: Props) {
    const [search, setSearch] = useState('');
    const { items, subtotal, addItem, removeItem, setQuantity, clear } = useCart();
    const [showCheckout, setShowCheckout] = useState(false);

    const filtered = useMemo(() => {
        const query = search.trim().toLocaleLowerCase();

        if (!query) return products;

        return products.filter((product) => {
            const productName = product.name?.toLocaleLowerCase() ?? '';
            const categoryName = product.category?.name?.toLocaleLowerCase() ?? '';

            return productName.includes(query) || categoryName.includes(query);
        });
    }, [products, search]);

    return (
        <>
            <Head title="Point de vente" />

            <main className="flex h-dvh min-h-0 flex-col overflow-hidden bg-muted/30">
                {/* Barre supérieure */}
                <header className="z-20 shrink-0 border-b bg-background/95 shadow-sm backdrop-blur">
                    <div className="mx-auto flex w-full max-w-[1800px] flex-col gap-3 px-3 py-3 sm:px-5 lg:flex-row lg:items-center lg:gap-5 lg:px-6">
                        <div className="flex min-w-0 items-center gap-3">
                            <Link
                                href="/dashboard"
                                aria-label="Retour au tableau de bord"
                                className="flex size-10 shrink-0 items-center justify-center rounded-xl border bg-background text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                            >
                                <ArrowLeft className="size-4" />
                            </Link>

                            <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                                <ShoppingBag className="size-5" />
                            </div>

                            <div className="min-w-0">
                                <h1 className="truncate text-base font-bold tracking-tight sm:text-lg">
                                    Point de vente
                                </h1>
                                <p className="hidden text-xs text-muted-foreground sm:block">
                                    Gestion rapide des ventes
                                </p>
                            </div>
                        </div>

                        <div className="flex min-w-0 flex-1 items-center gap-3 lg:justify-end">
                            <div className="relative w-full min-w-0 lg:max-w-xl">
                                <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                                <Input
                                    aria-label="Rechercher un produit ou une catégorie"
                                    className="h-11 rounded-xl border bg-muted/40 pl-9 pr-9 shadow-none transition-colors focus-visible:bg-background"
                                    placeholder="Rechercher un produit ou une catégorie…"
                                    value={search}
                                    onChange={(event) => setSearch(event.target.value)}
                                />
                                {search && (
                                    <button
                                        type="button"
                                        aria-label="Effacer la recherche"
                                        onClick={() => setSearch('')}
                                        className="absolute right-2 top-1/2 flex size-7 -translate-y-1/2 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground"
                                    >
                                        <X className="size-4" />
                                    </button>
                                )}
                            </div>

                            <div className="hidden shrink-0 items-center gap-2 rounded-xl border bg-background px-3 py-2 text-sm text-muted-foreground lg:flex">
                                <LayoutGrid className="size-4 text-primary" />
                                <span>
                                    <span className="font-semibold text-foreground">{filtered.length}</span>{' '}
                                    produit(s)
                                </span>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Zone principale */}
                <div className="mx-auto flex min-h-0 w-full max-w-[1800px] flex-1 flex-col gap-3 overflow-hidden p-3 sm:gap-4 sm:p-4 lg:flex-row lg:gap-5 lg:p-5">
                    <section className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden rounded-2xl border bg-background shadow-sm">
                        <div className="flex shrink-0 items-center justify-between gap-3 border-b bg-background px-4 py-3 sm:px-5">
                            <div className="min-w-0">
                                <h2 className="font-semibold tracking-tight">Catalogue des produits</h2>
                                <p className="mt-0.5 text-xs text-muted-foreground">
                                    {filtered.length} résultat(s)
                                    {search.trim() ? ` pour « ${search.trim()} »` : ''}
                                </p>
                            </div>
                            <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                                <LayoutGrid className="size-4" />
                            </span>
                        </div>

                        <div className="min-h-0 flex-1 overflow-y-auto">
                            {filtered.length > 0 ? (
                                <ProductsGrid products={filtered} onAdd={addItem} />
                            ) : (
                                <div className="flex min-h-64 flex-col items-center justify-center px-5 py-12 text-center">
                                    <div className="mb-3 flex size-12 items-center justify-center rounded-xl border bg-muted/40 text-muted-foreground">
                                        <Search className="size-5" />
                                    </div>
                                    <h3 className="font-semibold">Aucun produit trouvé</h3>
                                    <p className="mt-1 max-w-sm text-sm text-muted-foreground">
                                        Essaie un autre nom de produit ou une autre catégorie.
                                    </p>
                                    {search && (
                                        <button
                                            type="button"
                                            onClick={() => setSearch('')}
                                            className="mt-4 rounded-lg px-3 py-2 text-sm font-medium text-primary transition-colors hover:bg-primary/10"
                                        >
                                            Effacer la recherche
                                        </button>
                                    )}
                                </div>
                            )}
                        </div>
                    </section>

                    <aside className="flex min-h-[280px] min-w-0 flex-col overflow-hidden rounded-2xl border bg-background shadow-sm lg:min-h-0 lg:w-[360px] lg:shrink-0 xl:w-[400px] 2xl:w-[440px]">
                        <div className="flex shrink-0 items-center gap-3 border-b bg-gradient-to-r from-primary/5 via-background to-background px-4 py-3 sm:px-5">
                            <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                                <ShoppingBag className="size-5" />
                            </div>
                            <div className="min-w-0 flex-1">
                                <h2 className="font-semibold tracking-tight">Panier</h2>
                                <p className="text-xs text-muted-foreground">
                                    {items.reduce((total, item) => total + Number(item.quantity || 0), 0)} article(s)
                                </p>
                            </div>
                        </div>

                        <div className="min-h-0 flex-1 overflow-y-auto">
                            <CardPanel
                                items={items}
                                subtotal={subtotal}
                                onRemove={removeItem}
                                onSetQuantity={setQuantity}
                                onClear={clear}
                                onCheckout={() => setShowCheckout(true)}
                            />
                        </div>
                    </aside>
                </div>
            </main>

            <CheckoutDialog
                open={showCheckout}
                items={items}
                subtotal={subtotal}
                onSuccess={clear}
                onClose={() => setShowCheckout(false)}
            />
        </>
    );
}
