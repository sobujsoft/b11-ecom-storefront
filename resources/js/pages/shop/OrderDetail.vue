<script setup lang="ts">
import { Head, Link } from '@inertiajs/vue3';
import { ArrowLeft, ChevronRight, MapPin } from '@lucide/vue';
import { computed, onMounted, ref } from 'vue';
import OrderStatusBadge from '@/components/storefront/OrderStatusBadge.vue';
import OrderTrackingTimeline from '@/components/storefront/OrderTrackingTimeline.vue';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { useOrders } from '@/composables/useOrders';
import { useShopAuth } from '@/composables/useShopAuth';
import { formatPrice, shopRoutes } from '@/lib/shop';
import type { Order } from '@/types';

const { isLoggedIn } = useShopAuth();
const { fetchOrder } = useOrders();

const orderId = computed(() => {
    const path =
        typeof window !== 'undefined' ? window.location.pathname : '/orders/1';

    return Number(path.split('/').filter(Boolean).pop());
});

const order = ref<Order | null>(null);
const loading = ref(true);
const error = ref<string | null>(null);

onMounted(async () => {
    if (!isLoggedIn.value) {
        loading.value = false;
        return;
    }

    try {
        order.value = await fetchOrder(orderId.value);
    } catch (e) {
        error.value = e instanceof Error ? e.message : 'Failed to load order';
    } finally {
        loading.value = false;
    }
});

const itemsSubtotal = computed(() =>
    order.value
        ? order.value.items.reduce(
              (sum, item) => sum + item.price * item.quantity,
              0,
          )
        : 0,
);
const shipping = computed(() =>
    order.value
        ? Math.max(0, order.value.total_amount - itemsSubtotal.value)
        : 0,
);

function formatDate(value: string): string {
    return new Date(value).toLocaleString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });
}
</script>

<template>
    <Head :title="order ? `Order #${order.id}` : 'Order'" />

    <div class="mx-auto max-w-5xl px-4 py-8">
        <!-- Not logged in -->
        <div
            v-if="!isLoggedIn"
            class="flex flex-col items-center justify-center rounded-xl border border-dashed py-20 text-center"
        >
            <p class="text-lg font-semibold">Sign in to view this order</p>
            <Button class="mt-6" as-child>
                <Link :href="shopRoutes.login()">Sign in</Link>
            </Button>
        </div>

        <!-- Error -->
        <div
            v-else-if="error"
            class="flex flex-col items-center justify-center rounded-xl border border-dashed py-20 text-center"
        >
            <p class="font-medium text-destructive">{{ error }}</p>
            <Button class="mt-4" variant="outline" as-child>
                <Link :href="shopRoutes.orders()">Back to orders</Link>
            </Button>
        </div>

        <!-- Loading -->
        <template v-else-if="loading">
            <Skeleton class="mb-6 h-4 w-48 rounded" />
            <Skeleton class="h-10 w-64 rounded" />
            <Skeleton class="mt-8 h-40 w-full rounded-xl" />
            <Skeleton class="mt-8 h-64 w-full rounded-xl" />
        </template>

        <template v-else-if="order">
            <!-- Breadcrumb -->
            <nav class="mb-6 flex items-center gap-1 text-sm text-muted-foreground">
                <Link :href="shopRoutes.orders()" class="hover:text-foreground">
                    My Orders
                </Link>
                <ChevronRight class="size-4" />
                <span class="text-foreground">#{{ order.id }}</span>
            </nav>

            <div class="flex flex-wrap items-center justify-between gap-4">
                <div>
                    <h1 class="text-3xl font-bold tracking-tight">
                        Order #{{ order.id }}
                    </h1>
                    <p class="mt-1 text-sm text-muted-foreground">
                        Placed on {{ formatDate(order.created_at) }}
                    </p>
                </div>
                <div class="flex items-center gap-2">
                    <OrderStatusBadge :status="order.status" />
                    <OrderStatusBadge :status="order.payment_status" />
                </div>
            </div>

            <OrderTrackingTimeline :status="order.status" />

            <div class="mt-8 grid gap-8 lg:grid-cols-3">
                <!-- Items -->
                <div class="lg:col-span-2">
                    <div class="rounded-xl border">
                        <div class="border-b px-5 py-4">
                            <h2 class="font-semibold">
                                Items ({{ order.items.length }})
                            </h2>
                        </div>
                        <div class="divide-y">
                            <div
                                v-for="item in order.items"
                                :key="item.id"
                                class="flex gap-4 p-5"
                            >
                                <Link
                                    :href="shopRoutes.product(item.product.id)"
                                    class="size-20 shrink-0 overflow-hidden rounded-lg border bg-muted"
                                >
                                    <img
                                        :src="item.product.product_image"
                                        :alt="item.product.name"
                                        class="h-full w-full object-cover"
                                    />
                                </Link>
                                <div class="flex flex-1 justify-between gap-4">
                                    <div>
                                        <Link
                                            :href="
                                                shopRoutes.product(
                                                    item.product.id,
                                                )
                                            "
                                            class="font-medium hover:underline"
                                        >
                                            {{ item.product.name }}
                                        </Link>
                                        <p
                                            class="mt-0.5 text-sm text-muted-foreground"
                                        >
                                            {{ item.product.brand }} · Qty
                                            {{ item.quantity }}
                                        </p>
                                        <p
                                            class="mt-0.5 text-sm text-muted-foreground"
                                        >
                                            {{ formatPrice(item.price) }} each
                                        </p>
                                    </div>
                                    <p class="font-semibold whitespace-nowrap">
                                        {{
                                            formatPrice(
                                                item.price * item.quantity,
                                            )
                                        }}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <Button variant="ghost" class="mt-4" as-child>
                        <Link :href="shopRoutes.orders()">
                            <ArrowLeft class="size-4" />
                            Back to orders
                        </Link>
                    </Button>
                </div>

                <!-- Summary -->
                <div class="space-y-6">
                    <div class="rounded-xl border p-5">
                        <h2 class="flex items-center gap-2 font-semibold">
                            <MapPin class="size-4" />
                            Shipping address
                        </h2>
                        <p class="mt-3 text-sm text-muted-foreground">
                            {{ order.shipping_address }}
                        </p>
                    </div>

                    <div class="rounded-xl border p-5">
                        <h2 class="font-semibold">Payment summary</h2>
                        <p class="mt-1 text-xs text-muted-foreground">
                            Cash on Delivery
                        </p>
                        <div class="mt-3 space-y-2 text-sm">
                            <div class="flex justify-between">
                                <span class="text-muted-foreground"
                                    >Subtotal</span
                                >
                                <span>{{ formatPrice(itemsSubtotal) }}</span>
                            </div>
                            <div class="flex justify-between">
                                <span class="text-muted-foreground"
                                    >Shipping & tax</span
                                >
                                <span>{{ formatPrice(shipping) }}</span>
                            </div>
                            <Separator class="my-2" />
                            <div class="flex justify-between font-semibold">
                                <span>Total</span>
                                <span>{{
                                    formatPrice(order.total_amount)
                                }}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </template>
    </div>
</template>
