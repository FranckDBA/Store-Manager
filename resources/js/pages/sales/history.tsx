import { Head, router } from '@inertiajs/react';
import { useState } from 'react';

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

const money = (value: number | string | null) =>
    `${Number(value ?? 0).toLocaleString('fr-FR')} CDF`;

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
            { preserveState: true, preserveScroll: true },
        );
    }

    return (
        <>
            <Head title="Historique des ventes" />

            <div className="space-y-6 p-6">
                <div>
                    <h1 className="text-2xl font-bold">
                        Historique des ventes
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        Consulte les ventes et le bénéfice brut de ton magasin.
                    </p>
                </div>

                <section className="rounded-xl border p-4">
                    <h2 className="mb-4 font-semibold">Période</h2>

                    <div className="flex flex-wrap items-end gap-4">
                        <label className="flex flex-col gap-1">
                            <span className="text-sm">Afficher par</span>
                            <select
                                className="rounded-md border bg-background p-2"
                                value={period}
                                onChange={(event) =>
                                    setPeriod(event.target.value as Filters['period'])
                                }
                            >
                                <option value="day">Jour</option>
                                <option value="month">Mois</option>
                                <option value="year">Année</option>
                            </select>
                        </label>

                        {period === 'day' && (
                            <label className="flex flex-col gap-1">
                                <span className="text-sm">Date</span>
                                <input
                                    type="date"
                                    className="rounded-md border bg-background p-2"
                                    value={date}
                                    onChange={(event) => setDate(event.target.value)}
                                />
                            </label>
                        )}

                        {period === 'month' && (
                            <label className="flex flex-col gap-1">
                                <span className="text-sm">Mois</span>
                                <input
                                    type="month"
                                    className="rounded-md border bg-background p-2"
                                    value={month}
                                    onChange={(event) => setMonth(event.target.value)}
                                />
                            </label>
                        )}

                        {period === 'year' && (
                            <label className="flex flex-col gap-1">
                                <span className="text-sm">Année</span>
                                <input
                                    type="number"
                                    min="2000"
                                    max="2100"
                                    className="w-32 rounded-md border bg-background p-2"
                                    value={year}
                                    onChange={(event) => setYear(event.target.value)}
                                />
                            </label>
                        )}

                        <button
                            type="button"
                            onClick={applyFilters}
                            className="rounded-md bg-primary px-4 py-2 text-primary-foreground"
                        >
                            Filtrer
                        </button>
                    </div>
                </section>

                <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                    <StatCard
                        title="Nombre de ventes"
                        value={stats.sales_count.toLocaleString('fr-FR')}
                    />
                    <StatCard
                        title="Chiffre d'affaires"
                        value={money(stats.revenue)}
                    />
                    <StatCard
                        title="Coût des produits vendus"
                        value={money(stats.cost)}
                    />
                    <StatCard
                        title="Bénéfice brut"
                        value={
                            stats.profit === null
                                ? 'Indisponible'
                                : money(stats.profit)
                        }
                    />
                </section>

                {stats.missing_cost_count > 0 && (
                    <div className="rounded-lg border border-amber-500 p-4 text-sm">
                        Attention : {stats.missing_cost_count} ligne(s) de vente
                        n'ont pas de coût d'achat enregistré. Le bénéfice brut
                        ne peut donc pas être calculé de façon fiable pour cette
                        période.
                    </div>
                )}

                <section className="overflow-hidden rounded-xl border">
                    <div className="border-b p-4">
                        <h2 className="font-semibold">Détail des ventes</h2>
                    </div>

                    {sales.data.length === 0 ? (
                        <p className="p-6 text-center text-muted-foreground">
                            Aucune vente trouvée pour cette période.
                        </p>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm">
                                <thead className="bg-muted/50">
                                    <tr>
                                        <th className="p-3">N° vente</th>
                                        <th className="p-3">Date</th>
                                        <th className="p-3">Articles</th>
                                        <th className="p-3">Total</th>
                                        <th className="p-3">Montant reçu</th>
                                        <th className="p-3">Monnaie rendue</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {sales.data.map((sale) => (
                                        <tr key={sale.id} className="border-t">
                                            <td className="p-3">#{sale.id}</td>
                                            <td className="p-3">
                                                {new Date(sale.created_at).toLocaleString(
                                                    'fr-FR',
                                                )}
                                            </td>
                                            <td className="p-3">
                                                <ul className="space-y-1">
                                                    {sale.items.map((item) => (
                                                        <li key={item.id}>
                                                            {item.product_name} ×{' '}
                                                            {item.quantity}
                                                        </li>
                                                    ))}
                                                </ul>
                                            </td>
                                            <td className="p-3 font-medium">
                                                {money(sale.total)}
                                            </td>
                                            <td className="p-3">
                                                {money(sale.cash_tendered)}
                                            </td>
                                            <td className="p-3">
                                                {money(sale.change_amount)}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}

                    <div className="flex items-center justify-between gap-3 border-t p-4">
                        <span className="text-sm text-muted-foreground">
                            Page {sales.current_page} sur {sales.last_page}
                        </span>

                        <div className="flex gap-2">
                            <button
                                type="button"
                                disabled={!sales.prev_page_url}
                                onClick={() =>
                                    sales.prev_page_url &&
                                    router.visit(sales.prev_page_url, {
                                        preserveScroll: true,
                                    })
                                }
                                className="rounded-md border px-3 py-2 disabled:opacity-50"
                            >
                                Précédent
                            </button>
                            <button
                                type="button"
                                disabled={!sales.next_page_url}
                                onClick={() =>
                                    sales.next_page_url &&
                                    router.visit(sales.next_page_url, {
                                        preserveScroll: true,
                                    })
                                }
                                className="rounded-md border px-3 py-2 disabled:opacity-50"
                            >
                                Suivant
                            </button>
                        </div>
                    </div>
                </section>
            </div>
        </>
    );
}

function StatCard({ title, value }: { title: string; value: string }) {
    return (
        <div className="rounded-xl border p-4">
            <p className="text-sm text-muted-foreground">{title}</p>
            <p className="mt-2 text-xl font-bold">{value}</p>
        </div>
    );
}

