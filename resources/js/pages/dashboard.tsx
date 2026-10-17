import { Head } from '@inertiajs/react';
import {
    AlertTriangle,
    Boxes,
    ChartNoAxesCombined,
    Clock3,
    Package,
    ReceiptText,
    ShoppingBag,
    Wallet,
} from 'lucide-react';

import { dashboard } from '@/routes';
import type { Sale } from '@/types';
import { formatPrice } from '@/lib/formatPrice';

interface Stats {
    today_revenue: string;
    today_transactions: number;
    total_products: number;
    low_stock_count: number;
    out_of_stock_count: number;
}

interface TopProduct {
    product_name: string;
    total_qty: number;
    total_revenue: string;
}

interface Props {
    stats: Stats;
    top_products: TopProduct[];
    recent_sales: Sale[];
    low_stock_count: number;
    out_of_stock_count: number;
}

export default function Dashboard({
    stats,
    top_products,
    recent_sales,
}: Props) {
    return (
        <>
            <Head title="Dashboard" />

            <main className="mx-auto flex w-full max-w-[1600px] flex-col gap-6 p-4 sm:p-6 lg:gap-8 lg:p-8">
                <header className="relative overflow-hidden rounded-2xl border bg-gradient-to-br from-background via-background to-primary/10 p-5 shadow-sm sm:p-7">
                    <div className="absolute -right-12 -top-12 size-44 rounded-full bg-primary/10 blur-3xl" />
                    <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div className="space-y-3">
                            <div className="inline-flex items-center gap-2 rounded-full border bg-background/80 px-3 py-1 text-xs font-semibold tracking-wide text-primary shadow-sm">
                                <ChartNoAxesCombined className="size-3.5" />
                                VUE D’ENSEMBLE
                            </div>
                            <div className="space-y-1.5">
                                <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
                                    Dashboard
                                </h1>
                                <p className="max-w-2xl text-sm leading-6 text-muted-foreground sm:text-base">
                                    Suis les ventes, les produits et le niveau de stock de ton magasin en un coup d’œil.
                                </p>
                            </div>
                        </div>
                        <div className="flex size-14 shrink-0 items-center justify-center self-start rounded-2xl border bg-primary/10 text-primary sm:size-16">
                            <ChartNoAxesCombined className="size-7 sm:size-8" />
                        </div>
                    </div>
                </header>

                <section aria-label="Statistiques" className="space-y-4">
                    <div className="flex items-end justify-between gap-3">
                        <div className="space-y-1">
                            <h2 className="text-lg font-semibold tracking-tight">Indicateurs clés</h2>
                            <p className="text-sm text-muted-foreground">Résumé de l’activité du jour</p>
                        </div>
                        <div className="hidden items-center gap-1.5 text-xs text-muted-foreground sm:flex">
                            <Clock3 className="size-3.5" />
                            Aujourd’hui
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-4 min-[480px]:grid-cols-2 xl:grid-cols-4">
                        <StatCard
                            title="Chiffre d’affaires du jour"
                            value={formatPrice(stats.today_revenue)}
                            description="Revenus enregistrés aujourd’hui"
                            icon={Wallet}
                            color="emerald"
                        />
                        <StatCard
                            title="Transactions aujourd’hui"
                            value={stats.today_transactions.toLocaleString('fr-FR')}
                            description="Ventes réalisées aujourd’hui"
                            icon={ReceiptText}
                            color="blue"
                        />
                        <StatCard
                            title="Produits actifs"
                            value={stats.total_products.toLocaleString('fr-FR')}
                            description="Produits dans le catalogue"
                            icon={Package}
                            color="violet"
                        />
                        <StatCard
                            title="Stock faible"
                            value={stats.low_stock_count.toLocaleString('fr-FR')}
                            description={`${stats.out_of_stock_count.toLocaleString('fr-FR')} produit(s) en rupture`}
                            icon={AlertTriangle}
                            color={stats.low_stock_count > 0 || stats.out_of_stock_count > 0 ? 'orange' : 'emerald'}
                            highlight={stats.low_stock_count > 0 || stats.out_of_stock_count > 0}
                        />
                    </div>
                </section>

                {(stats.low_stock_count > 0 || stats.out_of_stock_count > 0) && (
                    <div className="flex flex-col gap-3 rounded-2xl border border-orange-500/30 bg-orange-500/5 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
                        <div className="flex items-start gap-3">
                            <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-orange-500/10 text-orange-600 dark:text-orange-400">
                                <AlertTriangle className="size-5" />
                            </div>
                            <div className="space-y-1">
                                <p className="font-semibold">Attention au niveau de stock</p>
                                <p className="text-sm text-muted-foreground">
                                    {stats.low_stock_count} produit(s) à faible stock et {stats.out_of_stock_count} produit(s) en rupture.
                                </p>
                            </div>
                        </div>
                        <span className="w-fit rounded-full border border-orange-500/30 bg-background px-3 py-1 text-xs font-semibold text-orange-700 dark:text-orange-400">
                            Action requise
                        </span>
                    </div>
                )}

                <section className="grid min-w-0 grid-cols-1 gap-5 xl:grid-cols-2">
                    <section className="min-w-0 overflow-hidden rounded-2xl border bg-card shadow-sm">
                        <div className="flex items-center gap-3 border-b bg-muted/20 px-4 py-4 sm:px-5">
                            <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-violet-500/10 text-violet-600 dark:text-violet-400">
                                <ShoppingBag className="size-5" />
                            </div>
                            <div className="min-w-0">
                                <h2 className="font-semibold tracking-tight">Top Products Today</h2>
                                <p className="mt-1 text-xs text-muted-foreground">Classement des produits vendus</p>
                            </div>
                        </div>

                        {top_products.length === 0 ? (
                            <div className="flex flex-col items-center justify-center px-4 py-12 text-center">
                                <div className="mb-3 flex size-12 items-center justify-center rounded-xl border bg-muted/40 text-muted-foreground">
                                    <Boxes className="size-5" />
                                </div>
                                <p className="font-medium">Aucune vente aujourd’hui</p>
                                <p className="mt-1 text-sm text-muted-foreground">Les produits les plus vendus apparaîtront ici.</p>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full min-w-[390px] text-sm">
                                    <thead className="bg-muted/40 text-xs uppercase tracking-wide text-muted-foreground">
                                        <tr>
                                            <th className="px-4 py-3 text-left font-semibold sm:px-5">Produit</th>
                                            <th className="px-4 py-3 text-right font-semibold">Unités</th>
                                            <th className="px-4 py-3 text-right font-semibold sm:pr-5">Revenu</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {top_products.map((product, index) => (
                                            <tr key={product.product_name} className="border-t transition-colors hover:bg-muted/30">
                                                <td className="px-4 py-3.5 sm:px-5">
                                                    <div className="flex items-center gap-3">
                                                        <span className={`flex size-8 shrink-0 items-center justify-center rounded-lg text-xs font-bold ${index === 0 ? 'bg-amber-500/10 text-amber-700 dark:text-amber-400' : 'bg-muted text-muted-foreground'}`}>
                                                            {index + 1}
                                                        </span>
                                                        <span className="max-w-48 break-words font-medium">{product.product_name}</span>
                                                    </div>
                                                </td>
                                                <td className="px-4 py-3.5 text-right font-medium tabular-nums">
                                                    {product.total_qty.toLocaleString('fr-FR')}
                                                </td>
                                                <td className="px-4 py-3.5 text-right font-semibold tabular-nums text-emerald-700 dark:text-emerald-400 sm:pr-5">
                                                    {formatPrice(product.total_revenue)}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </section>

                    <section className="min-w-0 overflow-hidden rounded-2xl border bg-card shadow-sm">
                        <div className="flex items-center gap-3 border-b bg-muted/20 px-4 py-4 sm:px-5">
                            <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400">
                                <ReceiptText className="size-5" />
                            </div>
                            <div className="min-w-0">
                                <h2 className="font-semibold tracking-tight">Recent Sales</h2>
                                <p className="mt-1 text-xs text-muted-foreground">Dernières transactions enregistrées</p>
                            </div>
                            <span className="ml-auto shrink-0 rounded-full bg-muted px-2.5 py-1 text-xs font-semibold tabular-nums">
                                {recent_sales.length}
                            </span>
                        </div>

                        {recent_sales.length === 0 ? (
                            <div className="flex flex-col items-center justify-center px-4 py-12 text-center">
                                <div className="mb-3 flex size-12 items-center justify-center rounded-xl border bg-muted/40 text-muted-foreground">
                                    <ReceiptText className="size-5" />
                                </div>
                                <p className="font-medium">Aucune vente enregistrée</p>
                                <p className="mt-1 text-sm text-muted-foreground">Les dernières transactions apparaîtront ici.</p>
                            </div>
                        ) : (
                            <div className="divide-y">
                                {recent_sales.map((sale) => (
                                    <div key={sale.id} className="flex min-w-0 items-start justify-between gap-3 px-4 py-4 transition-colors hover:bg-muted/20 sm:px-5">
                                        <div className="flex min-w-0 items-start gap-3">
                                            <div className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-xl border bg-background text-blue-600 dark:text-blue-400">
                                                <ReceiptText className="size-4" />
                                            </div>
                                            <div className="min-w-0 space-y-1">
                                                <p className="font-semibold tracking-tight">Sale #{sale.id}</p>
                                                <p className="line-clamp-2 break-words text-xs leading-5 text-muted-foreground">
                                                    {sale.items.map((item) => `${item.product_name} × ${item.quantity}`).join(', ')}
                                                </p>
                                                <p className="text-xs text-muted-foreground">
                                                    {new Date(sale.created_at).toLocaleDateString('fr-FR', {
                                                        day: '2-digit',
                                                        month: 'short',
                                                    })}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="shrink-0 text-right">
                                            <p className="text-sm font-bold tabular-nums text-emerald-700 dark:text-emerald-400">
                                                {formatPrice(sale.total)}
                                            </p>
                                            <div className="mt-1 inline-flex items-center gap-1 text-xs text-muted-foreground">
                                                <Clock3 className="size-3" />
                                                {new Date(sale.created_at).toLocaleTimeString('fr-FR', {
                                                    hour: '2-digit',
                                                    minute: '2-digit',
                                                })}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </section>
                </section>
            </main>
        </>
    );
}

Dashboard.layout = {
    breadcrumbs: [
        {
            title: 'Dashboard',
            href: dashboard(),
        },
    ],
};

function StatCard({
    title,
    value,
    description,
    icon: Icon,
    color,
    highlight = false,
}: {
    title: string;
    value: string;
    description?: string;
    icon: typeof Wallet;
    color: 'emerald' | 'blue' | 'violet' | 'orange';
    highlight?: boolean;
}) {
    const colors = {
        emerald: {
            bar: 'bg-emerald-500',
            icon: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
            value: 'text-emerald-700 dark:text-emerald-400',
        },
        blue: {
            bar: 'bg-blue-500',
            icon: 'bg-blue-500/10 text-blue-600 dark:text-blue-400',
            value: 'text-foreground',
        },
        violet: {
            bar: 'bg-violet-500',
            icon: 'bg-violet-500/10 text-violet-600 dark:text-violet-400',
            value: 'text-foreground',
        },
        orange: {
            bar: 'bg-orange-500',
            icon: 'bg-orange-500/10 text-orange-600 dark:text-orange-400',
            value: 'text-orange-700 dark:text-orange-400',
        },
    }[color];

    return (
        <article className={`group relative min-w-0 overflow-hidden rounded-2xl border bg-card shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md ${highlight ? 'border-orange-500/30' : ''}`}>
            <div className={`absolute inset-x-0 top-0 h-1 ${colors.bar}`} />
            <div className="p-4 pt-5 sm:p-5 sm:pt-6">
                <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0 space-y-2">
                        <p className="text-sm font-medium text-muted-foreground">{title}</p>
                        <p className={`break-words text-xl font-bold tracking-tight sm:text-2xl ${colors.value}`}>{value}</p>
                    </div>
                    <div className={`flex size-10 shrink-0 items-center justify-center rounded-xl transition-transform group-hover:scale-105 sm:size-11 ${colors.icon}`}>
                        <Icon className="size-5" />
                    </div>
                </div>
                {description && <p className="mt-4 text-xs leading-relaxed text-muted-foreground">{description}</p>}
            </div>
        </article>
    );
}
