import { Head } from '@inertiajs/react';
import { dashboard } from '@/routes';
import type { Sale } from '@/types';
import {formatPrice} from '@/lib/formatPrice';

interface Stats {
    today_revenue: string;
    today_transactions: number;
    total_products: number;
    low_stock_count: number;
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
    console.log(stats.low_stock_count);

    return (
        <>
            <Head title="Dashboard" />

            <div className="p-6 space-y-6">
                <h1 className="text-2xl font-bold">
                    Dashboard
                </h1>

                {/* Stats row */}
                <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
                    <StatCard
                        title="Today's Revenue"
                        value={formatPrice(stats.today_revenue)}
                    />

                    <StatCard
                        title="Transactions Today"
                        value={stats.today_transactions.toString()}
                    />

                    <StatCard
                        title="Active Products"
                        value={stats.total_products.toString()}
                    />

                    <StatCard
                        title="Low Stock"
                        value={stats.low_stock_count.toString()}
                        description={`${stats.out_of_stock_count} out of stock`}
                        highlight={stats.low_stock_count > 0 || stats.out_of_stock_count > 0}
                    />
                </div>
                <div className='grid gap-6 lg:grid-cols-2'>
                    {/*Top product */}
                    <div className='rounded-lg border'>
                        <div className='px-4 py-3 border-b'>
                            <h2 className='font-semibold'> Top Products Today</h2>
                        </div>
                        <table className='w-full text-sm'>
                            <thead className='bg-muted/50'>
                                <tr>
                                    <th className='px-4 py-2 text-left'>Product</th>
                                    <th className='px-4 py-2 text-right'>Units</th>
                                    <th className='px-4 py-2 text-right'>Revenue</th>
                                </tr>
                            </thead>
                            <tbody>
                                {top_products.length === 0 ? (
                                    <tr>
                                        <td colSpan={3} className='px-4 py-6 text-center text-muted-foreground'>No sales today yet.</td>
                                    </tr>
                                ) : (
                                    top_products.map(p =>(
                                        <tr key={p.product_name} className='border-t'>
                                            <td className='px-4 py-2'>{p.product_name}</td>
                                            <td className='px-4 py-2 text-right'>{p.total_qty}</td>
                                            <td className='px-4 py-2 text-right'>{formatPrice(p.total_revenue)}</td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                    <div className='rounded-lg border'>
                        <div className='px-4 py-3 border-b'>
                            <h2 className='font-semibold'>Recent Sales</h2>
                        </div>
                        <div className='divide-y'>
                            {recent_sales.length === 0  ? (
                                <p className='px-4 py-6 text-center text-sm text-muted-foreground'>No sales recorded yet.</p>
                            ):(
                                recent_sales.map( sale => (
                                    <div key={sale.id} className='flex items-center justify-between px-4 py-3'>
                                        <div>
                                            <p className='text-sm font-medium'>Sale #{sale.id}</p>
                                            <p className='text-xs text-muted-foreground'>
                                                {sale.items.map( i => `${i.product_name} x ${i.quantity}`).join(', ')}
                                            </p>
                                        </div>
                                        <div className='text-right'>
                                            <p className='font-semibold'>{formatPrice(sale.total)}</p>
                                            <p className='text-xs text-muted-foreground'>
                                                {new Date(sale.created_at).toLocaleTimeString()}
                                            </p>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </div>
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
                      highlight = false,
                  }: {
    title: string;
    value: string;
    description?: string;
    highlight?: boolean;
}) {
    return (
        <div
            className={`rounded-xl border p-4 ${
                highlight
                    ? 'border-orange-400 bg-orange-50 dark:bg-orange-950/20'
                    : 'bg-card'
            }`}
        >
            <p className="text-sm text-muted-foreground">
                {title}
            </p>

            <p
                className={`mt-1 text-2xl font-bold ${
                    highlight ? 'text-orange-600' : ''
                }`}
            >
                {value}
            </p>

            {description && (
                <p className="mt-1 text-xs text-muted-foreground">
                    {description}
                </p>
            )}
        </div>
    );
}
