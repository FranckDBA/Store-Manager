import { useState } from 'react';
import { router } from '@inertiajs/react';
import { toast } from 'sonner';
import type { CartItem } from '@/types';
import {formatPrice} from '@/lib/formatPrice';

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface Props {
    open: boolean;
    items: CartItem[];
    subtotal: number;
    onSuccess: () => void;
    onClose: () => void;
}

export default function CheckoutDialog({
    open,
    items,
    subtotal,
    onSuccess,
    onClose,
}: Props) {
    const [cashInput, setCashInput] = useState('');
    const [processing, setProcessing] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const cash = parseFloat(cashInput) || 0;
    const change = cash - subtotal;

    /**
     * Réinitialise complètement le contenu du Dialog
     */
    function resetDialog() {
        setCashInput('');
        setError(null);
        setProcessing(false);
    }

    /**
     * Ferme et réinitialise le Dialog
     */
    function closeDialog() {
        if (processing) {
            return;
        }

        resetDialog();
        onClose();
    }

    function handleCheckout() {
        // Vérification du montant
        if (cash < subtotal) {
            setError('Cash amount is less than the total.');
            return;
        }

        setError(null);
        setProcessing(true);

        router.post(
            '/checkout',
            {
                items: items.map((i) => ({
                    product_id: i.product.id,
                    quantity: i.quantity,
                })),
                cash_tendered: cash,
            },
            {
                /**
                 * Vente réussie
                 */
                onSuccess: () => {
                    toast.success('Sale completed successfully.');

                    // Réinitialiser le Dialog
                    resetDialog();

                    // Fermer le Dialog
                    onClose();

                    // Informer le parent
                    onSuccess();
                },

                /**
                 * Erreur de validation Laravel
                 */
                onError: (errors) => {
                    const firstError = Object.values(errors)[0];

                    setError(
                        typeof firstError === 'string'
                            ? firstError
                            : 'Checkout failed. Please check the errors.'
                    );

                    toast.error(
                        'Checkout failed. Please check the errors.'
                    );
                },

                /**
                 * Toujours exécuté à la fin de la requête
                 */
                onFinish: () => {
                    setProcessing(false);
                },
            }
        );
    }

    return (
        <Dialog
            open={open}
            onOpenChange={(value) => {
                if (!value) {
                    closeDialog();
                }
            }}
        >
            <DialogContent className="max-w-sm">
                <DialogHeader>
                    <DialogTitle>Checkout</DialogTitle>
                </DialogHeader>

                <div className="space-y-4">

                    {/* Produits */}
                    <div className="rounded-lg bg-muted p-4 space-y-1">
                        {items.map((item) => (
                            <div
                                key={item.product.id}
                                className="flex justify-between text-sm"
                            >
                                <span>
                                    {item.product.name} x {item.quantity}
                                </span>

                                <span>

                                 {formatPrice(
                                     parseFloat(item.product.price.toString()) * item.quantity
                                 )}
                                </span>
                            </div>
                        ))}

                        {/* Total */}
                        <div className="flex justify-between font-bold pt-2 border-t mt-2">
                            <span>Total</span>

                            <span>
                                {formatPrice(subtotal.toFixed(2))}
                            </span>
                        </div>
                    </div>

                    {/* Cash */}
                    <div>
                        <Label htmlFor="cash">
                            Cash Tendered
                        </Label>

                        <Input
                            id="cash"
                            type="number"
                            step="0.01"
                            min={subtotal.toFixed(2)}
                            placeholder="0.00"
                            value={cashInput}
                            disabled={processing}
                            onChange={(e) => {
                                setCashInput(e.target.value);
                                setError(null);
                            }}
                            autoFocus
                        />
                    </div>

                    {/* Change */}
                    {cashInput && (
                        <div className="flex justify-between text-lg font-bold">
                            <span>Change</span>

                            <span
                                className={
                                    change >= 0
                                        ? 'text-green-600'
                                        : 'text-destructive'
                                }
                            >
                                {formatPrice(change.toFixed(2))}
                            </span>
                        </div>
                    )}

                    {/* Error */}
                    {error && (
                        <p className="text-sm text-destructive">
                            {error}
                        </p>
                    )}

                    {/* Submit */}
                    <Button
                        className="w-full"
                        size="lg"
                        disabled={
                            processing ||
                            !cashInput ||
                            cash < subtotal
                        }
                        onClick={handleCheckout}
                    >
                        {processing
                            ? 'Processing...'
                            : 'Complete Sale'}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}

