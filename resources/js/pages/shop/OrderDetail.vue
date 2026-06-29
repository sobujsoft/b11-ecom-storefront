<script setup lang="ts">
import { Head, Link } from '@inertiajs/vue3';
import {
    ArrowLeft,
    CheckCircle2,
    ChevronRight,
    MapPin,
    Package,
} from '@lucide/vue';
import { computed } from 'vue';
import OrderStatusBadge from '@/components/storefront/OrderStatusBadge.vue';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { formatPrice, orders, shopRoutes } from '@/lib/shop';
import { cn } from '@/lib/utils';
import type { OrderStatus } from '@/types';

const currentId = computed(() => {
    const path =
        typeof window !== 'undefined'
            ? window.location.pathname
            : '/orders/1024';

    return Number(path.split('/').filter(Boolean).pop());
});

const order = computed(
    () => orders.find((o) => o.id === currentId.value) ?? orders[0],
);

const itemsSubtotal = computed(() =>
    order.value.items.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0,
    ),
);
const shipping = computed(() =>
    Math.max(0, order.value.total_amount - itemsSubtotal.value),
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

const timeline: { key: OrderStatus; label: string }[] = [
    { key: 'pending', label: 'Order placed' },
    { key: 'processing', label: 'Processing' },
    { key: 'shipped', label: 'Shipped' },
    { key: 'completed', label: 'Delivered' },
];

const stageIndex = computed(() => {
    if (order.value.status === 'cancelled') {
return -1;
}

    return timeline.findIndex((step) => step.key === order.value.status);
});
</script>

<template>
    <Head :title="`Order #${order.id}`" />

    <div class="mx-auto max-w-5xl px-4 py-8">
        <!-- Breadcrumb -->
        <nav class="mb-6 flex items-center gap-1 text-sm text-muted-foreground">
            <Link :href="shopRoutes.orders()" class="hover:text-foreground"
                >My Orders</Link
            >
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

        <!-- Timeline -->
        <div
            v-if="order.status !== 'cancelled'"
            class="mt-8 rounded-xl border p-6"
        >
            <div class="flex items-center justify-between">
                <div
                    v-for="(step, index) in timeline"
                    :key="step.key"
                    class="flex flex-1 flex-col items-center text-center"
                >
                    <div class="flex w-full items-center">
                        <div
                            :class="
                                cn(
                                    'h-0.5 flex-1',
                                    index === 0
                                        ? 'bg-transparent'
                                        : index <= stageIndex
                                          ? 'bg-primary'
                                          : 'bg-border',
                                )
                            "
                        ></div>
                        <span
                            :class="
                                cn(
                                    'flex size-9 shrink-0 items-center justify-center rounded-full border-2',
                                    index <= stageIndex
                                        ? 'border-primary bg-primary text-primary-foreground'
                                        : 'border-border bg-background text-muted-foreground',
                                )
                            "
                        >
                            <CheckCircle2
                                v-if="index <= stageIndex"
                                class="size-4"
                            />
                            <Package v-else class="size-4" />
                        </span>
                        <div
                            :class="
                                cn(
                                    'h-0.5 flex-1',
                                    index === timeline.length - 1
                                        ? 'bg-transparent'
                                        : index < stageIndex
                                          ? 'bg-primary'
                                          : 'bg-border',
                                )
                            "
                        ></div>
                    </div>
                    <p
                        :class="
                            cn(
                                'mt-2 text-xs font-medium',
                                index <= stageIndex
                                    ? 'text-foreground'
                                    : 'text-muted-foreground',
                            )
                        "
                    >
                        {{ step.label }}
                    </p>
                </div>
            </div>
        </div>
        <div
            v-else
            class="mt-8 rounded-xl border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive"
        >
            This order was cancelled and the payment was refunded.
        </div>

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
                                            shopRoutes.product(item.product.id)
                                        "
                                        class="font-medium hover:underline"
                                        >{{ item.product.name }}</Link
                                    >
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
                                        formatPrice(item.price * item.quantity)
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
                    <div class="mt-3 space-y-2 text-sm">
                        <div class="flex justify-between">
                            <span class="text-muted-foreground">Subtotal</span>
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
                            <span>{{ formatPrice(order.total_amount) }}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
