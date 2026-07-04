<script setup lang="ts">
import { Head, Link } from '@inertiajs/vue3';
import { CheckCircle2, Home, ShoppingBag, XCircle } from '@lucide/vue';
import { computed, onMounted, ref } from 'vue';
import { Button } from '@/components/ui/button';
import { useOrders } from '@/composables/useOrders';
import { useShopAuth } from '@/composables/useShopAuth';
import { shopRoutes } from '@/lib/shop';
import type { Order, PaymentResultStatus } from '@/types';

const { isLoggedIn } = useShopAuth();
const { fetchOrder } = useOrders();

const params = new URLSearchParams(
    typeof window !== 'undefined' ? window.location.search : '',
);

const status = computed(
    () => (params.get('status') ?? 'success') as PaymentResultStatus,
);
const orderId = computed(() => {
    const fromQuery = params.get('order_id');
    if (fromQuery) {
        return Number(fromQuery);
    }

    const stored =
        typeof window !== 'undefined'
            ? sessionStorage.getItem('pending_payment_order_id')
            : null;

    return stored ? Number(stored) : null;
});

const order = ref<Order | null>(null);
const loading = ref(false);

onMounted(async () => {
    sessionStorage.removeItem('pending_payment_order_id');

    if (!isLoggedIn.value || !orderId.value) {
        return;
    }

    loading.value = true;

    try {
        order.value = await fetchOrder(orderId.value);
    } catch {
        order.value = null;
    } finally {
        loading.value = false;
    }
});

const title = computed(() => {
    switch (status.value) {
        case 'success':
            return 'Payment successful';
        case 'failed':
            return 'Payment failed';
        case 'cancelled':
            return 'Payment cancelled';
        default:
            return 'Payment status';
    }
});

const description = computed(() => {
    switch (status.value) {
        case 'success':
            return 'Your payment was processed successfully. Thank you for your order!';
        case 'failed':
            return 'Your payment could not be completed. You can retry from your order details or choose another payment method.';
        case 'cancelled':
            return 'You cancelled the payment. Your order is saved and still awaiting payment.';
        default:
            return '';
    }
});
</script>

<template>
    <Head :title="title" />

    <div class="mx-auto max-w-lg px-4 py-16">
        <div class="rounded-xl border p-8 text-center">
            <span
                :class="[
                    'mx-auto flex size-16 items-center justify-center rounded-full',
                    status === 'success'
                        ? 'bg-green-100 text-green-600'
                        : 'bg-destructive/10 text-destructive',
                ]"
            >
                <CheckCircle2 v-if="status === 'success'" class="size-8" />
                <XCircle v-else class="size-8" />
            </span>

            <h1 class="mt-6 text-2xl font-bold tracking-tight">{{ title }}</h1>
            <p class="mt-2 text-sm text-muted-foreground">{{ description }}</p>

            <p
                v-if="orderId"
                class="mt-4 text-sm font-medium"
            >
                Order #{{ orderId }}
                <span
                    v-if="order && status === 'success'"
                    class="ml-2 text-green-600"
                >
                    · Paid
                </span>
                <span
                    v-else-if="order"
                    class="ml-2 text-amber-600"
                >
                    · {{ order.payment_status }}
                </span>
            </p>

            <p v-if="loading" class="mt-2 text-xs text-muted-foreground">
                Loading order details…
            </p>

            <div class="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
                <Button v-if="orderId" as-child>
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
