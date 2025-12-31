import { useState } from 'react';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import PaymentForm from '../components/features/PaymentForm';
import { motion } from 'framer-motion';

// Initialize with Public Key (Dev)
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

const CheckoutPage = () => {
    const [success, setSuccess] = useState(false);

    // Mock Order Data
    const mockOrder = {
        id: 'order_123_abc',
        total: 14550 // $145.50
    };

    if (success) {
        return (
            <div className="h-screen flex items-center justify-center">
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="text-center p-12 bg-[#161616] rounded-2xl border border-[#333]"
                >
                    <h1 className="font-display text-4xl text-[#EDEDED] mb-4">Payment Confirmed</h1>
                    <p className="text-[#888]">Thank you for dining with us.</p>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="max-w-xl mx-auto py-12">
            <h1 className="font-display text-3xl text-[#EDEDED] mb-8">Secure Checkout</h1>

            <Elements stripe={stripePromise} options={{
                mode: 'payment',
                amount: mockOrder.total,
                currency: 'cad',
                appearance: { theme: 'night' }
            }}>
                <PaymentForm
                    orderId={mockOrder.id}
                    amount={mockOrder.total}
                    onSuccess={() => setSuccess(true)}
                />
            </Elements>
        </div>
    );
};

export default CheckoutPage;
