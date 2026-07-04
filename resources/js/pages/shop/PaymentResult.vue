<script setup lang="ts">
import { Head, Link } from '@inertiajs/vue3';
import {
    AlertCircle,
    CheckCircle2,
    Home,
    RefreshCw,
    ShoppingBag,
    XCircle,
} from '@lucide/vue';
import { computed, onMounted, ref } from 'vue';
import { toast } from 'vue-sonner';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { useOrders } from '@/composables/useOrders';
import { usePayments } from '@/composables/usePayments';
import { useShopAuth } from '@/composables/useShopAuth';
import {
    resolveOrderIdFromUrl,
    resolvePaymentStatusFromUrl,
    resolveTransactionIdFromUrl,
    sleep,
} from '@/lib/paymentResult';
import { formatPrice, shopRoutes } from '@/lib/shop';
import type { Order, PaymentResultStatus } from '@/types';

const { isLoggedIn } = useShopAuth();
const { fetchOrder } = useOrders();
const { findPaymentByTransactionId, retryPayment } = usePayments();

const urlStatus = ref<PaymentResultStatus>('success');
const orderId = ref<number | null>(null);
const transactionId = ref<string | null>(null);
const order = ref<Order | null>(null);
const loading = ref(true);
const retrying = ref(false);
const verifying = ref(false);

const isPaid = computed(() => order.value?.payment_status === 'paid');

/** Final status considers both URL hint and verified order state. */
const displayStatus = computed((): PaymentResultStatus | 'pending' => {
    if (urlStatus.value === 'success' && order.value && !isPaid.value) {
        return verifying.value ? 'pending' : urlStatus.value;
    }

    if (urlStatus.value === 'success' && isPaid.value) {
        return 'success';
    }

    return urlStatus.value;
});

const title = computed(() => {
    switch (displayStatus.value) {
        case 'success':
            return 'Payment successful';
        case 'failed':
            return 'Payment failed';
        case 'cancelled':
            return 'Payment cancelled';
        case 'pending':
            return 'Confirming payment…';
        default:
            return 'Payment status';
    }
});

const description = computed(() => {
    switch (displayStatus.value) {
        case 'success':
            return 'Your payment was processed successfully. Thank you for your order!';
        case 'failed':
            return 'Your payment could not be completed. You can retry below or view your order details.';
        case 'cancelled':
            return 'You cancelled the payment. Your order is saved and still awaiting payment.';
        case 'pending':
            return 'We received your return from the payment gateway and are confirming your payment status.';
        default:
            return '';
    }
});

const showRetry = computed(
    () =>
        orderId.value &&
        !isPaid.value &&
        (urlStatus.value === 'failed' || urlStatus.value === 'cancelled'),
);

async function loadOrder(id: number): Promise<Order | null> {
    try {
        return await fetchOrder(id);
    } catch {
        return null;
    }
}

async function pollUntilPaid(id: number, attempts = 5): Promise<Order | null> {
    verifying.value = true;

    for (let i = 0; i < attempts; i++) {
        const result = await loadOrder(id);

        if (result?.payment_status === 'paid') {
            verifying.value = false;
            return result;
        }

        if (i < attempts - 1) {
            await sleep(2000);
        }
    }

    verifying.value = false;
    return loadOrder(id);
}

onMounted(async () => {
    urlStatus.value = resolvePaymentStatusFromUrl();
    transactionId.value = resolveTransactionIdFromUrl();
    orderId.value = resolveOrderIdFromUrl();

    sessionStorage.removeItem('pending_payment_order_id');

    if (!isLoggedIn.value) {
        loading.value = false;
        return;
    }

    if (!orderId.value && transactionId.value) {
        const payment = await findPaymentByTransactionId(transactionId.value);
        if (payment) {
            orderId.value = payment.order_id;
        }
    }

    if (!orderId.value) {
        loading.value = false;
        return;
    }

    if (urlStatus.value === 'success') {
        order.value = await pollUntilPaid(orderId.value);
    } else {
        order.value = await loadOrder(orderId.value);
    }

    loading.value = false;
});

async function handleRetry() {
    if (!orderId.value) {
        return;
    }

    retrying.value = true;

    try {
        await retryPayment(orderId.value);
    } catch (e) {
        toast.error(
            e instanceof Error ? e.message : 'Failed to retry payment.',
        );
        retrying.value = false;
    }
}
</script>

<template>
    <Head :title="title" />

    <div class="mx-auto max-w-lg px-4 py-16">
        <div class="rounded-xl border p-8 text-center">
            <span
                :class="[
                    'mx-auto flex size-16 items-center justify-center rounded-full',
                    displayStatus === 'success'
                        ? 'bg-green-100 text-green-600 dark:bg-green-500/15'
                        : displayStatus === 'pending'
                          ? 'bg-amber-100 text-amber-600 dark:bg-amber-500/15'
                          : 'bg-destructive/10 text-destructive',
                ]"
            >
                <Spinner
                    v-if="loading || displayStatus === 'pending'"
                    class="size-8"
                />
                <CheckCircle2
                    v-else-if="displayStatus === 'success'"
                    class="size-8"
                />
                <XCircle v-else class="size-8" />
            </span>

            <h1 class="mt-6 text-2xl font-bold tracking-tight">{{ title }}</h1>
            <p class="mt-2 text-sm text-muted-foreground">{{ description }}</p>

            <div v-if="orderId" class="mt-4 space-y-1 text-sm">
                <p class="font-medium">Order #{{ orderId }}</p>
                <p v-if="transactionId" class="text-xs text-muted-foreground">
                    Transaction: {{ transactionId }}
                </p>
                <p v-if="order" class="text-muted-foreground">
                    Total: {{ formatPrice(order.total_amount) }}
                    <span
                        :class="
                            isPaid
                                ? 'text-green-600'
                                : 'text-amber-600'
                        "
                    >
                        · {{ isPaid ? 'Paid' : order.payment_status }}
                    </span>
                </p>
            </div>

            <div
                v-if="!isLoggedIn"
                class="mt-6 rounded-lg bg-muted/50 p-3 text-sm text-muted-foreground"
            >
                Please
                <Link :href="shopRoutes.login()" class="font-medium underline">
                    sign in
                </Link>
                to view your order details.
            </div>

            <div
                v-else-if="!orderId && !loading"
                class="mt-6 flex items-start gap-2 rounded-lg bg-amber-50 p-3 text-left text-sm text-amber-800 dark:bg-amber-500/10 dark:text-amber-300"
            >
                <AlertCircle class="mt-0.5 size-4 shrink-0" />
                <p>
                    We could not identify your order. Make sure the backend
                    redirects here with
                    <code class="text-xs">?order_id=</code> or
                    <code class="text-xs">?tran_id=</code> after payment.
                </p>
            </div>

            <div
                v-else-if="
                    urlStatus === 'success' && order && !isPaid && !verifying
                "
                class="mt-6 flex items-start gap-2 rounded-lg bg-amber-50 p-3 text-left text-sm text-amber-800 dark:bg-amber-500/10 dark:text-amber-300"
            >
                <AlertCircle class="mt-0.5 size-4 shrink-0" />
                <p>
                    Payment confirmation is still pending. This can take a few
                    moments. Check your order page shortly or retry payment if
                    needed.
                </p>
            </div>

            <div class="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
                <Button
                    v-if="showRetry"
                    :disabled="retrying"
                    @click="handleRetry"
                >
                    <RefreshCw class="size-4" />
                    {{ retrying ? 'Redirecting…' : 'Retry payment' }}
                </Button>
                <Button v-if="orderId && isLoggedIn" as-child>
                    <Link :href="shopRoutes.order(orderId)">
                        <ShoppingBag class="size-4" />
                        View order
                    </Link>
                </Button>
                <Button variant="outline" as-child>
                    <Link :href="shopRoutes.home()">
                        <Home class="size-4" />
                        Back to home
                    </Link>
                </Button>
            </div>
        </div>
    </div>
</template>
