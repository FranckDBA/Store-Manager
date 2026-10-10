<?php

namespace App\Services;
use Carbon\Carbon;

class WhatsAppReportFormatter
{
    public function daily(array $report): string
    {
        $date = Carbon::parse($report['date'])->locale('fr');

        $message = "📊 *RAPPORT JOURNALIER DES VENTES*\n";
        $message .= "📅 " . $date->translatedFormat('d F Y') . "\n\n";

        // Résumé
        $message .= "💰 *Chiffre d'affaires*\n";
        $message .= number_format($report['revenue'], 0, ',', ' ') . " FC\n\n";

        $message .= "🧾 *Transactions*\n";
        $message .= $report['transactions'] . "\n\n";

        $message .= "📦 *Articles vendus*\n";
        $message .= $report['items_sold'] . "\n\n";

        // Top produits
        $message .= "🏆 *TOP PRODUITS*\n";

        if ($report['top_products']->isEmpty()) {
            $message .= "Aucune vente aujourd'hui.\n";
        } else {
            foreach ($report['top_products'] as $index => $product) {
                $position = $index + 1;

                $message .= "{$position}. ";
                $message .= $product->product_name;
                $message .= " — {$product->total_qty} unités\n";
            }
        }

        $message .= "\n";

        // Stock faible
        $message .= "⚠️ *STOCK FAIBLE*\n";

        if ($report['low_stock_products']->isEmpty()) {
            $message .= "Aucun produit en stock faible.\n";
        } else {
            foreach ($report['low_stock_products'] as $product) {
                $message .= "• {$product->name} — {$product->stock} restant(s)\n";
            }
        }

        $message .= "\n";

        // Rupture
        $message .= "❌ *RUPTURE DE STOCK*\n";

        if ($report['out_of_stock_products']->isEmpty()) {
            $message .= "Aucune rupture de stock.\n";
        } else {
            foreach ($report['out_of_stock_products'] as $product) {
                $message .= "• {$product->name}\n";
            }
        }

        $message .= "\n";
        $message .= "━━━━━━━━━━━━━━━━\n";
        $message .= "🤖 Rapport généré automatiquement";

        return $message;
    }
}
