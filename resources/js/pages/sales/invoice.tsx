import { Head, router } from '@inertiajs/react';
import { ArrowLeft, Printer, ReceiptText, Store } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { formatPrice } from '@/lib/formatPrice';

type SaleItem = {
    id: number;
    product_name: string;
    unit_price: string | number;
    unit_cost: string | number | null;
    quantity: number;
    subtotal: string | number;
};

type Sale = {
    id: number;
    created_at: string;
    total: string | number;
    cash_tendered: string | number;
    change_amount: string | number;
    status?: string;
    notes?: string | null;
    items: SaleItem[];
};

type Props = {
    sale: Sale;
};

function formatDate(value: string) {
    const date = new Date(value);

    if (Number.isNaN(date.getTime())) return value;

    return date.toLocaleString('fr-FR', {
        dateStyle: 'long',
        timeStyle: 'short',
    });
}

export default function Invoice({ sale }: Props) {
    const totalQuantity = sale.items.reduce(
        (sum, item) => sum + Number(item.quantity || 0),
        0,
    );

    return (
        <>
            <Head title={`Facture #${sale.id}`} />

            <main className="mx-auto flex w-full max-w-4xl flex-col gap-4 p-3 sm:p-6 print:block print:max-w-none print:p-0">
                <div className="flex flex-wrap items-center justify-between gap-3 print:hidden">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => router.visit('/sales/history')}
                    >
                        <ArrowLeft className="mr-2 size-4" />
                        Retour à l’historique
                    </Button>

                    <Button type="button" onClick={() => window.print()}>
                        <Printer className="mr-2 size-4" />
                        Imprimer la facture
                    </Button>
                </div>

                <Card className="mx-auto w-full max-w-[80mm] overflow-hidden rounded-lg border shadow-sm sm:max-w-[100mm] print:mx-0 print:max-w-none print:rounded-none print:border-0 print:shadow-none">
                    <CardContent className="p-0">
                        <div className="h-1.5 bg-primary print:bg-black" />

                        <div className="space-y-5 p-4 sm:space-y-6 sm:p-6 print:space-y-4 print:p-0">
                            <header className="flex flex-col justify-between gap-4">
                                <div className="flex items-start gap-3">
                                    <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary print:bg-gray-100 print:text-black">
                                        <Store className="size-5" />
                                    </div>
                                    <div>
                                        <h1 className="text-lg font-bold tracking-tight">
                                            FACTURE
                                        </h1>
                                        <p className="mt-1 text-xs text-muted-foreground">
                                            Reçu de transaction commerciale
                                        </p>
                                    </div>
                                </div>

                                <div className="border-t pt-3">
                                    <p className="text-sm font-medium text-muted-foreground">
                                        FACTURE N°
                                    </p>
                                    <p className="text-xl font-bold tracking-tight">
                                        N° {String(sale.id).padStart(6, '0')}
                                    </p>
                                    <p className="mt-1 text-sm text-muted-foreground">
                                        {formatDate(sale.created_at)}
                                    </p>
                                </div>
                            </header>

                            <div className="rounded-lg border bg-muted/20 p-3">
                                <div className="flex items-center gap-2 text-sm font-semibold">
                                    <ReceiptText className="size-4 text-primary" />
                                    Informations de la transaction
                                </div>
                                <div className="mt-3 grid grid-cols-2 gap-3 text-xs">
                                    <div>
                                        <p className="text-muted-foreground">Référence</p>
                                        <p className="mt-1 font-medium">Vente #{sale.id}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-muted-foreground">Articles</p>
                                        <p className="mt-1 font-medium">
                                            {totalQuantity} unité(s)
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <section>
                                <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide">
                                    Articles
                                </h2>

                                <div className="overflow-x-auto rounded-xl border">
                                    <table className="w-full table-fixed text-[11px] sm:text-xs">
                                        <thead className="bg-muted/50">
                                            <tr className="border-b text-left">
                                                <th className="w-[40%] px-2 py-2 text-left font-semibold">Produit</th>
                                                <th className="w-[23%] px-1 py-2 text-right font-semibold">Prix</th>
                                                <th className="w-[12%] px-1 py-2 text-right font-semibold">Qté</th>
                                                <th className="w-[25%] px-2 py-2 text-right font-semibold">Total</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {sale.items.map((item) => (
                                                <tr key={item.id} className="border-b last:border-0">
                                                    <td className="break-words px-2 py-2 font-medium">
                                                        {item.product_name}
                                                    </td>
                                                    <td className="break-words px-1 py-2 text-right tabular-nums">
                                                        {formatPrice(item.unit_price)}
                                                    </td>
                                                    <td className="px-1 py-2 text-right tabular-nums">
                                                        {item.quantity}
                                                    </td>
                                                    <td className="break-words px-2 py-2 text-right font-semibold tabular-nums">
                                                        {formatPrice(item.subtotal)}
                                                    </td>
                                                </tr>
                                            ))}
                                            {sale.items.length === 0 && (
                                                <tr>
                                                    <td colSpan={4} className="px-2 py-5 text-center text-muted-foreground">
                                                        Aucun article associé à cette vente.
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </section>

                            <section className="ml-auto w-full space-y-2">
                                <div className="flex items-center justify-between gap-4 text-sm">
                                    <span className="text-muted-foreground">Total à payer</span>
                                    <span className="text-base font-bold tabular-nums">
                                        {formatPrice(sale.total)}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between gap-4 text-sm">
                                    <span className="text-muted-foreground">Montant reçu</span>
                                    <span className="font-medium tabular-nums">
                                        {formatPrice(sale.cash_tendered)}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between gap-4 border-t pt-3 text-sm">
                                    <span className="text-muted-foreground">Monnaie rendue</span>
                                    <span className="font-semibold tabular-nums">
                                        {formatPrice(sale.change_amount)}
                                    </span>
                                </div>
                            </section>

                            {sale.notes && (
                                <section className="rounded-lg border p-3">
                                    <h2 className="text-sm font-semibold">Notes</h2>
                                    <p className="mt-1 whitespace-pre-wrap text-sm text-muted-foreground">
                                        {sale.notes}
                                    </p>
                                </section>
                            )}

                            <footer className="border-t pt-4 text-center text-xs text-muted-foreground">
                                <p className="font-semibold text-foreground">Merci pour votre achat !</p>
                                <p className="mt-1">Conservez ce reçu comme preuve de paiement.</p>
                            </footer>
                        </div>
                    </CardContent>
                </Card>
            </main>

            <style>{`
                @media print {
                    @page {
                        size: 80mm auto;
                        margin: 4mm;
                    }

                    body {
                        background: white !important;
                        print-color-adjust: exact;
                        -webkit-print-color-adjust: exact;
                    }

                    main {
                        max-width: 72mm !important;
                        padding: 0 !important;
                        margin: 0 !important;
                    }

                    main > div:first-child {
                        display: none !important;
                    }

                    article, section, table, tr {
                        break-inside: avoid;
                    }
                }
            `}</style>
        </>
    );
}
