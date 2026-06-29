<script setup lang="ts">
import { Head, Link } from '@inertiajs/vue3';
import { ArrowLeft, Minus, Plus, ShoppingCart, Trash2 } from '@lucide/vue';
import { computed, ref } from 'vue';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { cartItems as initialCart, formatPrice, shopRoutes } from '@/lib/shop';
import type { CartItem } from '@/types';

const items = ref<CartItem[]>(initialCart.map((item) => ({ ...item })));

const subtotal = computed(() =>
    items.value.reduce(
        (sum, item) => sum + item.product.price * item.quantity,
        0,
    ),
);
const shipping = computed(() =>
    subtotal.value > 100 || subtotal.value === 0 ? 0 : 9.99,
);
const tax = computed(() => subtotal.value * 0.05);
const total = computed(() => subtotal.value + shipping.value + tax.value);

function changeQty(item: CartItem, delta: number) {
    item.quantity = Math.max(1, item.quantity + delta);
}
function remove(id: number) {
    items.value = items.value.filter((item) => item.id !== id);
}
</script>

<template>
    <Head title="Cart" />

    <div class="mx-auto max-w-7xl px-4 py-8">
        <h1 class="text-3xl font-bold tracking-tight">Shopping Cart</h1>
        <p class="mt-1 text-sm text-muted-foreground">
            {{ items.length }} item{{ items.length === 1 ? '' : 's' }} in your
            cart
        </p>

        <div v-if="items.length" class="mt-8 grid gap-8 lg:grid-cols-3">
            <!-- Items -->
            <div class="lg:col-span-2">
                <div class="divide-y rounded-xl border">
                    <div
                        v-for="item in items"
                        :key="item.id"
                        class="flex gap-4 p-4"
                    >
                        <Link
                            :href="shopRoutes.product(item.product.id)"
                            class="size-24 shrink-0 overflow-hidden rounded-lg border bg-muted"
                        >
                            <img
                                :src="item.product.product_image"
                                :alt="item.product.name"
                                class="h-full w-full object-cover"
                            />
                        </Link>

                        <div class="flex flex-1 flex-col">
                            <div class="flex justify-between gap-4">
                                <div>
                                    <p
                                        class="text-xs text-muted-foreground uppercase"
                                    >
                                        {{ item.product.category }}
                                    </p>
                                    <Link
                                        :href="
                                            shopRoutes.product(item.product.id)
                                        "
                                        class="font-semibold hover:underline"
                                        >{{ item.product.name }}</Link
                                    >
                                    <p
                                        class="mt-0.5 text-sm text-muted-foreground"
                                    >
                                        {{ item.product.brand }}
                                    </p>
                                </div>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    class="text-muted-foreground hover:text-destructive"
                                    aria-label="Remove item"
                                    @click="remove(item.id)"
                                >
                                    <Trash2 class="size-4" />
                                </Button>
                            </div>

                            <div
                                class="mt-auto flex items-center justify-between pt-3"
                            >
                                <div
                                    class="flex items-center rounded-lg border"
                                >
                                    <Button
                                        variant="ghost"
                                        size="icon-sm"
                                        class="rounded-r-none"
                                        aria-label="Decrease"
                                        @click="changeQty(item, -1)"
                                    >
                                        <Minus class="size-3.5" />
                                    </Button>
                                    <span
                                        class="w-10 text-center text-sm font-medium"
                                        >{{ item.quantity }}</span
                                    >
                                    <Button
                                        variant="ghost"
                                        size="icon-sm"
                                        class="rounded-l-none"
                                        aria-label="Increase"
                                        @click="changeQty(item, 1)"
                                    >
                                        <Plus class="size-3.5" />
                                    </Button>
                                </div>
                                <p class="font-semibold">
                                    {{
                                        formatPrice(
                                            item.product.price * item.quantity,
                                        )
                                    }}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <Button variant="ghost" class="mt-4" as-child>
                    <Link :href="shopRoutes.products()">
                        <ArrowLeft class="size-4" />
                        Continue shopping
                    </Link>
                </Button>
            </div>

            <!-- Summary -->
            <div>
                <div class="sticky top-24 rounded-xl border p-6">
                    <h2 class="font-semibold">Order Summary</h2>
                    <div class="mt-4 space-y-3 text-sm">
                        <div class="flex justify-between">
                            <span class="text-muted-foreground">Subtotal</span>
                            <span>{{ formatPrice(subtotal) }}</span>
                        </div>
                        <div class="flex justify-between">
                            <span class="text-muted-foreground">Shipping</span>
                            <span>{{
                                shipping === 0 ? 'Free' : formatPrice(shipping)
                            }}</span>
                        </div>
                        <div class="flex justify-between">
                            <span class="text-muted-foreground">Tax (5%)</span>
                            <span>{{ formatPrice(tax) }}</span>
                        </div>
                    </div>

                    <div class="mt-4 flex gap-2">
                        <Input placeholder="Promo code" />
                        <Button variant="outline">Apply</Button>
                    </div>

                    <Separator class="my-4" />
                    <div class="flex justify-between text-base font-semibold">
                        <span>Total</span>
                        <span>{{ formatPrice(total) }}</span>
                    </div>

                    <Button size="lg" class="mt-6 w-full" as-child>
                        <Link :href="shopRoutes.checkout()"
                            >Proceed to Checkout</Link
                        >
                    </Button>
                    <p class="mt-3 text-center text-xs text-muted-foreground">
                        Secure checkout · Taxes calculated at checkout
                    </p>
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
                <ShoppingCart class="size-7 text-muted-foreground" />
            </span>
            <p class="mt-4 text-lg font-semibold">Your cart is empty</p>
            <p class="mt-1 text-sm text-muted-foreground">
                Add some products to get started.
            </p>
            <Button class="mt-6" as-child>
                <Link :href="shopRoutes.products()">Browse products</Link>
            </Button>
        </div>
    </div>
</template>
