<script setup lang="ts">
import { Head, Link } from '@inertiajs/vue3';
import { ChevronRight, Package } from '@lucide/vue';
import { onMounted, ref } from 'vue';
import OrderStatusBadge from '@/components/storefront/OrderStatusBadge.vue';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useOrders } from '@/composables/useOrders';
import { useShopAuth } from '@/composables/useShopAuth';
import { formatPrice, shopRoutes } from '@/lib/shop';
import type { Order } from '@/types';

const { isLoggedIn } = useShopAuth();
const { fetchOrders } = useOrders();

const orders = ref<Order[]>([]);
const loading = ref(true);
const error = ref<string | null>(null);

onMounted(async () => {
    if (!isLoggedIn.value) {
        loading.value = false;
        return;
    }

    try {
        orders.value = await fetchOrders();
    } catch (e) {
        error.value = e instanceof Error ? e.message : 'Failed to load orders';
    } finally {
        loading.value = false;
    }
});

function formatDate(value: string): string {
    return new Date(value).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    });
}
</script>

<template>
    <Head title="My Orders" />

    <div class="mx-auto max-w-5xl px-4 py-8">
        <h1 class="text-3xl font-bold tracking-tight">My Orders</h1>
        <p class="mt-1 text-sm text-muted-foreground">
            Track and manage your purchases
        </p>

        <!-- Not logged in -->
        <div
            v-if="!isLoggedIn"
            class="mt-8 flex flex-col items-center justify-center rounded-xl border border-dashed py-20 text-center"
        >
            <p class="text-lg font-semibold">Sign in to view your orders</p>
            <p class="mt-1 text-sm text-muted-foreground">
                Your order history is linked to your account.
            </p>
            <Button class="mt-6" as-child>
                <Link :href="shopRoutes.login()">Sign in</Link>
            </Button>
        </div>

        <!-- Error -->
        <div
            v-else-if="error"
            class="mt-8 flex flex-col items-center justify-center rounded-xl border border-dashed py-20 text-center"
        >
            <p class="font-medium text-destructive">{{ error }}</p>
            <p class="mt-1 text-sm text-muted-foreground">
                Make sure the backend server is running.
            </p>
        </div>

        <!-- Loading -->
        <div v-else-if="loading" class="mt-8 space-y-4">
            <Skeleton v-for="n in 3" :key="n" class="h-36 w-full rounded-xl" />
        </div>

        <div v-else-if="orders.length" class="mt-8 space-y-4">
            <div
                v-for="order in orders"
                :key="order.id"
                class="rounded-xl border"
            >
                <!-- Header -->
                <div
                    class="flex flex-wrap items-center justify-between gap-4 border-b bg-muted/30 px-5 py-4"
                >
                    <div class="flex flex-wrap items-center gap-x-6 gap-y-1">
                        <div>
                            <p class="text-xs text-muted-foreground">Order</p>
                            <p class="text-sm font-semibold">#{{ order.id }}</p>
                        </div>
                        <div>
                            <p class="text-xs text-muted-foreground">Placed</p>
                            <p class="text-sm font-medium">
                                {{ formatDate(order.created_at) }}
                            </p>
                        </div>
                        <div>
                            <p class="text-xs text-muted-foreground">Total</p>
                            <p class="text-sm font-semibold">
                                {{ formatPrice(order.total_amount) }}
                            </p>
                        </div>
                    </div>
                    <div class="flex items-center gap-2">
                        <OrderStatusBadge :status="order.status" />
                        <OrderStatusBadge :status="order.payment_status" />
                    </div>
                </div>

                <!-- Items preview -->
                <div class="flex items-center justify-between gap-4 px-5 py-4">
                    <div class="flex items-center gap-3">
                        <div class="flex -space-x-3">
                            <div
                                v-for="item in order.items.slice(0, 3)"
                                :key="item.id"
                                class="size-12 overflow-hidden rounded-lg border-2 border-background bg-muted"
                            >
                                <img
                                    :src="item.product.product_image"
                                    :alt="item.product.name"
                                    class="h-full w-full object-cover"
                                />
                            </div>
                        </div>
                        <p class="text-sm text-muted-foreground">
                            {{ order.items.length }} item{{
                                order.items.length === 1 ? '' : 's'
                            }}
                        </p>
                    </div>
                    <Button variant="outline" size="sm" as-child>
                        <Link :href="shopRoutes.order(order.id)">
                            View details
                            <ChevronRight class="size-4" />
                        </Link>
                    </Button>
                </div>
            </div>
        </div>

        <!-- Empty -->
        <div
            v-else
            class="mt-8 flex flex-col items-center justify-center rounded-xl border border-dashed py-20 text-center"
        >
            <span
                class="flex size-16 items-center justify-center rounded-full bg-muted"
            >
                <Package class="size-7 text-muted-foreground" />
            </span>
            <p class="mt-4 text-lg font-semibold">No orders yet</p>
            <p class="mt-1 text-sm text-muted-foreground">
                When you place an order it will show up here.
            </p>
            <Button class="mt-6" as-child>
                <Link :href="shopRoutes.products()">Start shopping</Link>
            </Button>
        </div>
    </div>
</template>
