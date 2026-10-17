import { Head, router } from '@inertiajs/react';
import { useState } from 'react';
import {
    CalendarDays,
    ChartNoAxesCombined,
    ChevronLeft,
    ChevronRight,
    CircleAlert,
    Package,
    ReceiptText,
    Wallet,
} from 'lucide-react';

import {
    Alert,
    AlertDescription,
    AlertTitle,
} from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
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
    items: SaleItem[];
};

type Filters = {
    period: 'day' | 'month' | 'year';
    date: string;
    month: string;
    year: string;
};

type Stats = {
    sales_count: number;
    revenue: number;
    cost: number;
    profit: number | null;
    missing_cost_count: number;
};

type Props = {
    filters: Filters;
    stats: Stats;
    sales: {
        data: Sale[];
        current_page: number;
        last_page: number;
        prev_page_url: string | null;
        next_page_url: string | null;
    };
};

const formatDate = (value: string) => {
    const date = new Date(value);

    if (Number.isNaN(date.getTime())) return value;

    return date.toLocaleString('fr-FR', {
        dateStyle: 'medium',
        timeStyle: 'short',
    });
};

const formatDateOnly = (value: string) => {
    const date = new Date(value);

    if (Number.isNaN(date.getTime())) return value;

    return date.toLocaleDateString('fr-FR', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
    });
};

const formatTimeOnly = (value: string) => {
    const date = new Date(value);

    if (Number.isNaN(date.getTime())) return '';

    return date.toLocaleTimeString('fr-FR', {
        hour: '2-digit',
        minute: '2-digit',
    });
};

export default function SalesHistory({ filters, stats, sales }: Props) {
    const [period, setPeriod] = useState<Filters['period']>(filters.period);
    const [date, setDate] = useState(filters.date);
    const [month, setMonth] = useState(filters.month);
    const [year, setYear] = useState(filters.year);

    function applyFilters() {
        router.get(
            '/sales/history',
            {
                period,
                ...(period === 'day' ? { date } : {}),
                ...(period === 'month' ? { month } : {}),
                ...(period === 'year' ? { year } : {}),
            },
            {
                preserveScroll: true,
                preserveState: true,
            },
        );
    }

    const statCards = [
        {
            title: 'Nombre de ventes',
            value: stats.sales_count.toLocaleString('fr-FR'),
            description: 'Transactions terminées',
            icon: ReceiptText,
            accent: 'border-t-blue-500',
            iconClass: 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300',
            valueClass: 'text-blue-700 dark:text-blue-300',
        },
        {
            title: "Chiffre d’affaires",
            value: formatPrice(stats.revenue),
            description: 'Montant total vendu',
            icon: Wallet,
            accent: 'border-t-emerald-500',
            iconClass: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300',
            valueClass: 'text-emerald-700 dark:text-emerald-300',
        },
        {
            title: 'Coût des produits',
            value: formatPrice(stats.cost),
            description: "Coût d’achat des articles vendus",
            icon: Package,
            accent: 'border-t-orange-500',
            iconClass: 'bg-orange-100 text-orange-700 dark:bg-orange-950 dark:text-orange-300',
            valueClass: 'text-orange-700 dark:text-orange-300',
        },
        {
            title: 'Bénéfice brut',
            value: stats.profit === null ? 'Indisponible' : formatPrice(stats.profit),
            description:
                stats.profit === null
                    ? 'Coûts historiques incomplets'
                    : 'Ventes moins coût des produits',
            icon: ChartNoAxesCombined,
            accent:
                stats.profit === null
                    ? 'border-t-slate-400'
                    : stats.profit >= 0
                      ? 'border-t-violet-500'
                      : 'border-t-red-500',
            iconClass:
                stats.profit === null
                    ? 'bg-muted text-muted-foreground'
                    : stats.profit >= 0
                      ? 'bg-violet-100 text-violet-700 dark:bg-violet-950 dark:text-violet-300'
                      : 'bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300',
            valueClass:
                stats.profit === null
                    ? 'text-muted-foreground'
                    : stats.profit >= 0
                      ? 'text-violet-700 dark:text-violet-300'
                      : 'text-red-700 dark:text-red-300',
        },
    ];

    return (
        <>
            <Head title="Historique des ventes" />

            <main className="mx-auto flex w-full max-w-[1600px] flex-col gap-6 p-4 sm:p-6 lg:p-8">
                {/* En-tête de page */}
                <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-3">
                        <div className="flex size-12 shrink-0 items-center justify-center rounded-xl border bg-primary/10 text-primary shadow-sm">
                            <ChartNoAxesCombined className="size-6" />
                        </div>
                        <div className="min-w-0 space-y-1">
                            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
                                Historique des ventes
                            </h1>
                            <p className="text-sm text-muted-foreground sm:text-base">
                                Analyse commerciale et rentabilité de ton magasin
                            </p>
                        </div>
                    </div>
                    <div className="inline-flex w-fit items-center gap-2 rounded-full border bg-background px-3 py-1.5 text-xs font-medium text-muted-foreground">
                        <ReceiptText className="size-3.5 text-primary" />
                        Gestion commerciale
                    </div>
                </header>

                {/* Filtres */}
                <Card className="overflow-hidden rounded-2xl border shadow-sm">
                    <CardHeader className="border-b bg-muted/30 px-4 py-4 sm:px-6">
                        <div className="flex items-center gap-3">
                            <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                                <CalendarDays className="size-5" />
                            </div>
                            <div>
                                <CardTitle className="text-base">Période d’analyse</CardTitle>
                                <CardDescription>Sélectionne la période à consulter.</CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="p-4 sm:p-6">
                        <div className="grid grid-cols-1 items-end gap-4 sm:grid-cols-2 lg:grid-cols-4">
                            <div className="grid gap-2">
                                <Label htmlFor="sales-period">Regrouper par</Label>
                                <Select
                                    value={period}
                                    onValueChange={(value) => setPeriod(value as Filters['period'])}
                                >
                                    <SelectTrigger id="sales-period" className="w-full">
                                        <SelectValue placeholder="Choisir une période" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="day">Par jour</SelectItem>
                                        <SelectItem value="month">Par mois</SelectItem>
                                        <SelectItem value="year">Par année</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            {period === 'day' && (
                                <div className="grid gap-2">
                                    <Label htmlFor="sales-date">Date</Label>
                                    <Input
                                        id="sales-date"
                                        type="date"
                                        value={date}
                                        onChange={(event) => setDate(event.target.value)}
                                    />
                                </div>
                            )}

                            {period === 'month' && (
                                <div className="grid gap-2">
                                    <Label htmlFor="sales-month">Mois</Label>
                                    <Input
                                        id="sales-month"
                                        type="month"
                                        value={month}
                                        onChange={(event) => setMonth(event.target.value)}
                                    />
                                </div>
                            )}

                            {period === 'year' && (
                                <div className="grid gap-2">
                                    <Label htmlFor="sales-year">Année</Label>
                                    <Input
                                        id="sales-year"
                                        type="number"
                                        min="2000"
                                        max="2100"
                                        value={year}
                                        onChange={(event) => setYear(event.target.value)}
                                    />
                                </div>
                            )}

                            <Button onClick={applyFilters} className="w-full shadow-sm transition-all hover:shadow-md">
                                <CalendarDays className="mr-2 size-4" />
                                Appliquer les filtres
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                {/* Indicateurs financiers */}
                <section aria-label="Résumé des ventes" className="space-y-4">
                    <div>
                        <h2 className="text-lg font-semibold tracking-tight">Vue d’ensemble</h2>
                        <p className="text-sm text-muted-foreground">Résultats de la période sélectionnée</p>
                    </div>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        {statCards.map((stat) => {
                            const Icon = stat.icon;

                            return (
                                <Card
                                    key={stat.title}
                                    className="group min-w-0 overflow-hidden rounded-2xl border bg-card shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
                                >
                                    <CardContent className="p-4 sm:p-5">
                                        <div className="flex items-start justify-between gap-3">
                                            <div className="min-w-0 space-y-2">
                                                <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                                                <p className={`break-words text-xl font-bold tracking-tight sm:text-2xl ${stat.valueClass}`}>
                                                    {stat.value}
                                                </p>
                                            </div>
                                            <div className={`flex size-11 shrink-0 items-center justify-center rounded-xl ${stat.iconClass}`}>
                                                <Icon className="size-5" />
                                            </div>
                                        </div>
                                        <p className="mt-4 text-xs leading-relaxed text-muted-foreground">{stat.description}</p>
                                        <div className={`mt-4 h-1 w-full rounded-full ${stat.title === 'Nombre de ventes' ? 'bg-blue-500' : stat.title === 'Chiffre d’affaires' ? 'bg-emerald-500' : stat.title === 'Coût des produits' ? 'bg-orange-500' : stats.profit === null ? 'bg-slate-400' : stats.profit >= 0 ? 'bg-violet-500' : 'bg-red-500'}`} />
                                    </CardContent>
                                </Card>
                            );
                        })}
                    </div>
                </section>

                {/* Alerte de données incomplètes */}
                {stats.missing_cost_count > 0 && (
                    <Alert className="border-amber-500/40 bg-amber-500/5">
                        <CircleAlert className="size-4 text-amber-600" />
                        <AlertTitle>Calcul du bénéfice incomplet</AlertTitle>
                        <AlertDescription>
                            {stats.missing_cost_count} ligne(s) de vente n’ont pas de coût d’achat historique. Le bénéfice brut est masqué pour éviter d’afficher un résultat trompeur.
                        </AlertDescription>
                    </Alert>
                )}

                {/* Historique des transactions */}
                <Card className="overflow-hidden rounded-2xl border shadow-sm">
                    <CardHeader className="gap-4 border-b bg-gradient-to-r from-slate-50 via-background to-emerald-50/60 px-4 py-5 dark:from-slate-950/40 dark:via-background dark:to-emerald-950/20 sm:flex-row sm:items-center sm:justify-between sm:px-6">
                        <div className="flex items-center gap-3">
                            <div className="flex size-11 shrink-0 items-center justify-center rounded-xl border bg-background text-emerald-600 shadow-sm dark:text-emerald-400">
                                <ReceiptText className="size-5" />
                            </div>
                            <div className="space-y-1">
                                <CardTitle className="text-lg tracking-tight">Transactions</CardTitle>
                                <CardDescription>Historique détaillé des ventes terminées.</CardDescription>
                            </div>
                        </div>
                        <div className="inline-flex w-fit items-center gap-2 rounded-full border bg-background px-3 py-1.5 text-sm shadow-sm">
                            <span className="size-2 rounded-full bg-emerald-500" />
                            <span className="font-semibold tabular-nums text-foreground">
                                {stats.sales_count.toLocaleString('fr-FR')}
                            </span>
                            <span className="text-muted-foreground">vente(s)</span>
                        </div>
                    </CardHeader>

                    <CardContent className="p-0">
                        {sales.data.length === 0 ? (
                            <div className="flex flex-col items-center justify-center px-4 py-16 text-center">
                                <div className="mb-4 flex size-16 items-center justify-center rounded-2xl border bg-gradient-to-br from-primary/10 to-emerald-500/10 text-primary shadow-sm">
                                    <ReceiptText className="size-7" />
                                </div>
                                <h3 className="font-semibold">Aucune vente trouvée</h3>
                                <p className="mt-1 max-w-sm text-sm text-muted-foreground">
                                    Aucune transaction ne correspond à la période choisie. Essaie une autre date.
                                </p>
                            </div>
                        ) : (
                            <>
                                {/* Affichage mobile : une carte par vente */}
                                <div className="divide-y md:hidden">
                                    {sales.data.map((sale) => (
                                        <article key={sale.id} className="space-y-4 p-4 transition-colors hover:bg-muted/20 sm:p-5">
                                            <div className="flex items-start justify-between gap-3">
                                                <div className="min-w-0">
                                                    <div className="flex items-center gap-2">
                                                    <span className="flex size-9 items-center justify-center rounded-xl border bg-primary/10 text-primary">
                                                        <ReceiptText className="size-4" />
                                                    </span>
                                                    <div>
                                                        <p className="font-semibold tracking-tight">Vente #{sale.id}</p>
                                                        <p className="text-xs text-muted-foreground">Transaction terminée</p>
                                                    </div>
                                                </div>
                                                    <p className="mt-1 text-xs text-muted-foreground">{formatDate(sale.created_at)}</p>
                                                </div>
                                                <div className="shrink-0 text-right">
                                                    <p className="font-bold tabular-nums text-emerald-700 dark:text-emerald-400">{formatPrice(sale.total)}</p>
                                                    <p className="text-xs text-muted-foreground">Total de la vente</p>
                                                </div>
                                            </div>

                                            <div className="space-y-3 rounded-xl border bg-muted/20 p-3 sm:p-4">
                                                <div className="flex items-center justify-between gap-2">
                                                    <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Détail des articles</p>
                                                    <span className="rounded-full border bg-background px-2.5 py-1 text-xs font-medium tabular-nums text-muted-foreground">
                                                        {sale.items.reduce((sum, item) => sum + Number(item.quantity || 0), 0)} unité(s)
                                                    </span>
                                                </div>
                                                {sale.items.map((item) => (
                                                    <div key={item.id} className="flex items-start justify-between gap-3 text-sm">
                                                        <span className="min-w-0 break-words">
                                                            {item.product_name}
                                                            <span className="text-muted-foreground"> × {item.quantity}</span>
                                                        </span>
                                                        <span className="shrink-0 font-medium tabular-nums">{formatPrice(item.subtotal)}</span>
                                                    </div>
                                                ))}
                                            </div>

                                            <div className="grid grid-cols-2 gap-3 rounded-xl border p-3 text-sm">
                                                <div className="min-w-0">
                                                    <p className="text-xs text-muted-foreground">Montant reçu</p>
                                                    <p className="mt-1 break-words font-semibold tabular-nums">{formatPrice(sale.cash_tendered)}</p>
                                                </div>
                                                <div className="min-w-0 text-right">
                                                    <p className="text-xs text-muted-foreground">Monnaie rendue</p>
                                                    <p className="mt-1 break-words font-semibold tabular-nums text-blue-700 dark:text-blue-400">{formatPrice(sale.change_amount)}</p>
                                                </div>
                                            </div>
                                        </article>
                                    ))}
                                </div>

                                {/* Affichage tablette et ordinateur */}
                                <div className="hidden overflow-x-auto md:block">
                                    <Table className="min-w-[1050px]">
                                        <TableHeader className="bg-muted/50">
                                            <TableRow className="border-b hover:bg-transparent">
                                                <TableHead className="h-12 pl-6 text-[11px] font-bold uppercase tracking-[0.12em] text-muted-foreground">Transaction</TableHead>
                                                <TableHead className="h-12 text-[11px] font-bold uppercase tracking-[0.12em] text-muted-foreground">Date et heure</TableHead>
                                                <TableHead className="h-12 text-[11px] font-bold uppercase tracking-[0.12em] text-muted-foreground">Articles vendus</TableHead>
                                                <TableHead className="h-12 text-right text-[11px] font-bold uppercase tracking-[0.12em] text-muted-foreground">Total</TableHead>
                                                <TableHead className="h-12 text-right text-[11px] font-bold uppercase tracking-[0.12em] text-muted-foreground">Reçu</TableHead>
                                                <TableHead className="h-12 pr-6 text-right text-[11px] font-bold uppercase tracking-[0.12em] text-muted-foreground">Monnaie rendue</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {sales.data.map((sale) => (
                                                <TableRow key={sale.id} className="align-top transition-colors even:bg-muted/[0.16] hover:bg-primary/[0.04]">
                                                    <TableCell className="py-4 pl-6">
                                                    <div className="flex items-center gap-2.5">
                                                        <span className="flex size-9 shrink-0 items-center justify-center rounded-xl border bg-primary/10 text-primary">
                                                            <ReceiptText className="size-4" />
                                                        </span>
                                                        <div>
                                                            <p className="font-semibold tracking-tight">#{sale.id}</p>
                                                            <p className="mt-0.5 text-xs text-muted-foreground">Vente</p>
                                                        </div>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="whitespace-nowrap py-4">
                                                    <div className="space-y-1">
                                                        <p className="text-sm font-medium text-foreground">{formatDateOnly(sale.created_at)}</p>
                                                        <p className="text-xs text-muted-foreground">{formatTimeOnly(sale.created_at)}</p>
                                                    </div>
                                                </TableCell>
                                                    <TableCell className="py-4">
                                                        <div className="flex min-w-64 max-w-[420px] flex-col gap-2.5">
                                                            {sale.items.map((item) => (
                                                                <div key={item.id} className="flex items-start justify-between gap-4 text-sm">
                                                                    <div className="flex min-w-0 items-start gap-2">
                                                                        <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-emerald-500" />
                                                                        <span className="min-w-0 break-words font-medium text-foreground">
                                                                            {item.product_name}
                                                                            <span className="ml-1.5 whitespace-nowrap text-xs font-medium text-muted-foreground">× {item.quantity}</span>
                                                                        </span>
                                                                    </div>
                                                                    <span className="shrink-0 whitespace-nowrap text-xs font-medium tabular-nums text-muted-foreground">{formatPrice(item.subtotal)}</span>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </TableCell>
                                                    <TableCell className="whitespace-nowrap py-4 text-right">
                                                    <span className="inline-flex rounded-lg bg-emerald-500/10 px-2.5 py-1.5 text-sm font-bold tabular-nums text-emerald-700 dark:text-emerald-400">
                                                        {formatPrice(sale.total)}
                                                    </span>
                                                </TableCell>
                                                <TableCell className="whitespace-nowrap py-4 text-right text-sm font-medium tabular-nums">
                                                    {formatPrice(sale.cash_tendered)}
                                                </TableCell>
                                                <TableCell className="whitespace-nowrap py-4 pr-6 text-right text-sm font-semibold tabular-nums text-blue-700 dark:text-blue-400">
                                                    {formatPrice(sale.change_amount)}
                                                </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </div>
                            </>
                        )}

                        {/* Pagination */}
                        <div className="flex flex-col gap-3 border-t bg-muted/20 p-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
                            <p className="text-sm text-muted-foreground">
                                Page <span className="font-medium text-foreground">{sales.current_page}</span> sur{' '}
                                <span className="font-medium text-foreground">{sales.last_page}</span>
                            </p>
                            <div className="flex gap-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    disabled={!sales.prev_page_url}
                                    onClick={() => {
                                        if (sales.prev_page_url) {
                                            router.visit(sales.prev_page_url, { preserveScroll: true });
                                        }
                                    }}
                                >
                                    <ChevronLeft className="mr-1 size-4" />
                                    Précédent
                                </Button>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    disabled={!sales.next_page_url}
                                    onClick={() => {
                                        if (sales.next_page_url) {
                                            router.visit(sales.next_page_url, { preserveScroll: true });
                                        }
                                    }}
                                >
                                    Suivant
                                    <ChevronRight className="ml-1 size-4" />
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </main>
        </>
    );
}
