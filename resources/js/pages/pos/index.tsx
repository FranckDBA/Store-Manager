import { Product, CartItem } from '@/types';
import { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import { LayoutGrid, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import ProductsGrid from './product-grid';
import CardPanel from './cart-panel';
import {useCart} from "@/pages/pos/use-cart";
import CheckoutDialog from './checkout-dialog';

interface Props {
    products: Product[];
}

export default function PosIndex({ products }: Props) {
    const [search, setSearch] = useState('');
    const {items, subtotal, addItem, removeItem, setQuantity, clear }= useCart();
    const [showCheckout, setShowCheckout] = useState(false);

    const filtered = products.filter(
        (p) =>
            p.name.toLowerCase().includes(search.toLowerCase()) ||
            p.category.name.toLowerCase().includes(search.toLowerCase())
    );



    return (
        <>
            <Head title="Point" />
            <div className="flex h-screen flex-col bg-background">
                {/* Top Bar */}
                <div className="flex items-center gap-4 border-b px-4 py-3">
                    <Link
                        href="/dashboard"
                        className="flex items-center gap-2 text-muted-foreground hover:text-foreground"
                    >
                        <LayoutGrid className="h-5 w-5" />
                    </Link>

                    <span className="font-semibold">Point of Sale</span>

                    <div className="relative ml-4 flex-1 max-w-sm">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

                        <Input
                            className="pl-9"
                            placeholder="Search products..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                </div>

                {/* Main area */}
                <div className="flex flex-1 overflow-hidden">
                    <ProductsGrid
                        products={filtered}
                        onAdd={addItem}
                    />
                    <CardPanel
                        items={items}
                        subtotal={subtotal}
                        onRemove={removeItem}
                        onSetQuantity = {setQuantity}
                        onClear={clear}
                        onCheckout={() => setShowCheckout(true)}
                    />
                </div>
            </div>
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
