import { apiFetch } from '@/lib/api';
import { useShopAuth } from '@/composables/useShopAuth';
import type { Payment } from '@/types';

type PaymentApiResponse = {
    id: number;
    user_id: number;
    order_id: number;
    transaction_id: string;
    amount: number | string;
    currency: string;
    status: string;
    created_at: string;
    updated_at: string;
};

type InitiatePaymentResponse = {
    message: string;
    payment: PaymentApiResponse;
    gateway_url: string;
};

function mapPayment(payment: PaymentApiResponse): Payment {
    return {
        id: payment.id,
        order_id: payment.order_id,
        transaction_id: payment.transaction_id,
        amount:
            typeof payment.amount === 'string'
                ? parseFloat(payment.amount)
                : payment.amount,
        currency: payment.currency,
        status: payment.status,
        created_at: payment.created_at,
    };
}

export function usePayments() {
    const { token } = useShopAuth();

    async function fetchPayments(): Promise<Payment[]> {
        if (!token.value) {
            return [];
        }

        const data = await apiFetch<PaymentApiResponse[]>('/payments', {
            token: token.value,
        });

        return data.map(mapPayment);
    }

    async function findPaymentByTransactionId(
        transactionId: string,
    ): Promise<Payment | null> {
        const payments = await fetchPayments();

        return (
            payments.find((p) => p.transaction_id === transactionId) ?? null
        );
    }

    async function initiatePayment(orderId: number): Promise<{
        payment: Payment;
        gatewayUrl: string;
    }> {
        if (!token.value) {
            throw new Error('Please log in to initiate payment.');
        }

        const data = await apiFetch<InitiatePaymentResponse>('/payments', {
            method: 'POST',
            token: token.value,
            body: JSON.stringify({ order_id: orderId }),
        });

        if (!data.gateway_url) {
            throw new Error('Payment gateway URL was not returned.');
        }

        return {
            payment: mapPayment(data.payment),
            gatewayUrl: data.gateway_url,
        };
    }

    async function fetchPayment(paymentId: number): Promise<Payment> {
        if (!token.value) {
            throw new Error('Please log in to view this payment.');
        }

        const data = await apiFetch<PaymentApiResponse>(
            `/payments/${paymentId}`,
            { token: token.value },
        );

        return mapPayment(data);
    }

    async function retryPayment(orderId: number): Promise<void> {
        sessionStorage.setItem('pending_payment_order_id', String(orderId));

        const { gatewayUrl } = await initiatePayment(orderId);

        window.location.href = gatewayUrl;
    }

    return {
        fetchPayments,
        findPaymentByTransactionId,
        initiatePayment,
        fetchPayment,
        retryPayment,
    };
}
