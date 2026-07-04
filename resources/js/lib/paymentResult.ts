import type { PaymentResultStatus } from '@/types';

/**
 * Resolve payment result status from the storefront URL path or query string.
 * Supports backend redirects to /payment/success|failed|cancel as well as
 * /payment/result?status=...
 */
export function resolvePaymentStatusFromUrl(): PaymentResultStatus {
    if (typeof window === 'undefined') {
        return 'success';
    }

    const path = window.location.pathname;

    if (path.endsWith('/payment/success')) {
        return 'success';
    }

    if (path.endsWith('/payment/failed') || path.endsWith('/payment/failure')) {
        return 'failed';
    }

    if (
        path.endsWith('/payment/cancel') ||
        path.endsWith('/payment/cancelled')
    ) {
        return 'cancelled';
    }

    const status = new URLSearchParams(window.location.search).get('status');

    if (status === 'failed' || status === 'failure') {
        return 'failed';
    }

    if (status === 'cancel' || status === 'cancelled') {
        return 'cancelled';
    }

    return 'success';
}

/**
 * Resolve order id from redirect query params, SSL Commerz value fields,
 * or sessionStorage fallback.
 */
export function resolveOrderIdFromUrl(): number | null {
    if (typeof window === 'undefined') {
        return null;
    }

    const params = new URLSearchParams(window.location.search);

    for (const key of ['order_id', 'value_a', 'orderId']) {
        const value = params.get(key);
        if (value && !Number.isNaN(Number(value))) {
            return Number(value);
        }
    }

    const stored = sessionStorage.getItem('pending_payment_order_id');

    return stored ? Number(stored) : null;
}

export function resolveTransactionIdFromUrl(): string | null {
    if (typeof window === 'undefined') {
        return null;
    }

    const params = new URLSearchParams(window.location.search);

    return params.get('tran_id') ?? params.get('transaction_id');
}

export async function sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
}
