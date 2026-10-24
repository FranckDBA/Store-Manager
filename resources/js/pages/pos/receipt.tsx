import { Head, Link } from '@inertiajs/react';
import type { Sale } from '@/types';
import { Button } from '@/components/ui/button';
import { Printer, ArrowLeft, Store, ReceiptText } from 'lucide-react';
import { formatPrice } from '@/lib/formatPrice';

interface Props {
    sale: Sale;
}

const formatReceiptDate = (value: string) => {
    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return value;
    }

    return date.toLocaleString('fr-FR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });
};

export default function Receipt({ sale }: Props) {
    return (
        <>
            <Head title={`Facture #${sale.id}`} />

            <style>{`
                @page {
                    size: 80mm auto;
                    margin: 4mm;
                }

                @media print {
                    body {
                        background: #fff !important;
                        color: #000 !important;
                    }

                    .no-print {
                        display: none !important;
                    }

                    .receipt-paper {
                        width: 72mm !important;
                        max-width: 72mm !important;
                        margin: 0 auto !important;
                        padding: 0 !important;
                        border: 0 !important;
                        box-shadow: none !important;
                        font-size: 10px !important;
                    }

                    .receipt-paper * {
                        color: #000 !important;
                        -webkit-print-color-adjust: exact;
                        print-color-adjust: exact;
                    }

                    .receipt-item {
                        break-inside: avoid;
                    }
                }
            `}</style>

            <main className="min-h-screen bg-slate-100 px-4 py-6 text-slate-900 sm:px-6">
                <div className="no-print mx-auto mb-5 flex w-full max-w-3xl flex-wrap items-center justify-between gap-3">
                    <Link href="/pos">
                        <Button variant="outline" className="gap-2 bg-white">
                            <ArrowLeft className="size-4" />
                            Retour à la caisse
                        </Button>
                    </Link>

                    <Button onClick={() => window.print()} className="gap-2">
                        <Printer className="size-4" />
                        Imprimer la facture
                    </Button>
                </div>

                <section className="receipt-paper mx-auto w-full max-w-[320px] border border-slate-200 bg-white p-5 font-mono text-xs shadow-sm sm:p-6">
                    <header className="border-b border-dashed border-slate-400 pb-4 text-center">
                        <div className="mx-auto mb-2 flex size-10 items-center justify-center rounded-xl bg-slate-900 text-white">
                            <Store className="size-5" />
                        </div>

                        <p className="text-lg font-extrabold tracking-wide">POS MARKET</p>
                        <p className="mt-1 text-[10px] uppercase tracking-[0.18em] text-slate-500">
                            Facture de vente
                        </p>

                        <div className="mt-3 flex items-center justify-center gap-2 text-[10px] text-slate-500">
                            <ReceiptText className="size-3" />
                            <span>Facture n° {sale.id}</span>
                        </div>

                        <p className="mt-1 text-[10px] text-slate-500">
                            {formatReceiptDate(sale.created_at)}
                        </p>
                    </header>

                    <div className="border-b border-dashed border-slate-300 py-3">
                        <div className="mb-2 grid grid-cols-[1fr_auto] gap-2 text-[9px] font-bold uppercase tracking-wider text-slate-500">
                            <span>Article</span>
                            <span className="text-right">Montant</span>
                        </div>

                        <div className="space-y-3">
                            {sale.items.map((item) => (
                                <div key={item.id} className="receipt-item">
                                    <div className="flex items-start justify-between gap-2">
                                        <span className="min-w-0 flex-1 break-words font-semibold">
                                            {item.product_name}
                                        </span>
                                        <span className="shrink-0 text-right font-semibold tabular-nums">
                                            {formatPrice(item.subtotal)}
                                        </span>
                                    </div>

                                    <p className="mt-1 text-[10px] text-slate-500">
                                        {item.quantity} × {formatPrice(item.unit_price)}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-2 border-b border-dashed border-slate-300 py-3">
                        <div className="flex items-center justify-between gap-3 text-sm font-extrabold">
                            <span>TOTAL</span>
                            <span className="text-right tabular-nums">{formatPrice(sale.total)}</span>
                        </div>

                        <div className="flex items-center justify-between gap-3">
                            <span className="text-slate-500">Montant reçu</span>
                            <span className="text-right tabular-nums">{formatPrice(sale.cash_tendered)}</span>
                        </div>

                        <div className="flex items-center justify-between gap-3">
                            <span className="text-slate-500">Monnaie rendue</span>
                            <span className="text-right tabular-nums">{formatPrice(sale.change_amount)}</span>
                        </div>
                    </div>

                    <footer className="pt-4 text-center">
                        <p className="font-bold">Merci pour votre achat !</p>
                        <p className="mt-1 text-[9px] text-slate-500">
                            Conservez cette facture pour référence.
                        </p>
                    </footer>
                </section>
            </main>
        </>
    );
}
