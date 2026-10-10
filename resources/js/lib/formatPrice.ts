
// src/lib/formatPrice.ts

export function formatPrice(price: number | string): string {
    const value = Number(String(price).replace(/,/g, ""));

    return new Intl.NumberFormat("fr-CD", {
        style: "currency",
        currency: "CDF",
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(value);
}
