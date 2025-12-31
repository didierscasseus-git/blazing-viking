import { useState } from 'react';
import { useStripe, useElements, PaymentElement } from '@stripe/react-stripe-js';
import { functions } from '../../lib/firebase';
import { httpsCallable } from 'firebase/functions';
import { motion } from 'framer-motion';
import { Loader2, Lock, CreditCard } from 'lucide-react';

interface PaymentFormProps {
    orderId: string;
    amount: number; // For display only, actual calculation is server-side
    onSuccess: (paymentId: string) => void;
}

const PaymentForm: React.FC<PaymentFormProps> = ({ orderId, amount, onSuccess }) => {
    const stripe = useStripe();
    const elements = useElements();

    const [error, setError] = useState<string | null>(null);
    const [processing, setProcessing] = useState(false);

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        if (!stripe || !elements) {
            return;
        }

        setProcessing(true);
        setError(null);

        // 1. Submit the form to Stripe
        const { error: submitError } = await elements.submit();
        if (submitError) {
            setError(submitError.message || "An unexpected error occurred.");
            setProcessing(false);
            return;
        }

        try {
            // 2. Fetch Client Secret from Backend
            // In a real flow, you might fetch this earlier on mount if the amount is fixed
            // But for dynamic tips, we do it here or via a separate step. 
            // For this implementation, we assume the Intent is created JUST IN TIME.

            const createPaymentIntent = httpsCallable(functions, 'createPaymentIntent');
            const { data }: any = await createPaymentIntent({ orderId });

            const { clientSecret } = data;

            // 3. Confirm Payment
            const { error: confirmError, paymentIntent } = await stripe.confirmPayment({
                elements,
                clientSecret,
                confirmParams: {
                    return_url: `${window.location.origin}/payment-success`,
                },
                redirect: 'if_required'
            });

            if (confirmError) {
                setError(confirmError.message || "Payment Failed.");
            } else if (paymentIntent && paymentIntent.status === 'succeeded') {
                onSuccess(paymentIntent.id);
            }

        } catch (err: any) {
            console.error(err);
            setError(err.message || "Server Error");
        } finally {
            setProcessing(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="bg-[#161616] p-6 rounded-xl border border-[#333]">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-[#EDEDED] font-display text-xl">Payment Method</h3>
                    <div className="flex items-center gap-2 text-[#D4AF37] text-sm">
                        <Lock className="w-4 h-4" />
                        <span>Encrypted & Secure</span>
                    </div>
                </div>

                <PaymentElement
                    options={{
                        layout: 'tabs'
                    }}
                />
            </div>

            {error && (
                <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="p-4 bg-[rgba(176,0,32,0.2)] border border-[#B00020] text-[#ffb4ab] rounded-lg text-sm"
                >
                    {error}
                </motion.div>
            )}

            <button
                type="submit"
                disabled={!stripe || processing}
                className="w-full h-14 bg-[#EDEDED] text-[#0A0A0A] font-interface font-medium text-lg rounded-lg hover:bg-white transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
            >
                {processing ? (
                    <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Processing...
                    </>
                ) : (
                    <>
                        <CreditCard className="w-5 h-5" />
                        Pay ${(amount / 100).toFixed(2)}
                    </>
                )}
            </button>
        </form>
    );
};

export default PaymentForm;
