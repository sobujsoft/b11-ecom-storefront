<script setup lang="ts">
import { Head, Link } from '@inertiajs/vue3';
import { CreditCard, Landmark, Lock, Truck } from '@lucide/vue';
import { computed, ref } from 'vue';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { cartItems, formatPrice, shopRoutes } from '@/lib/shop';
import { cn } from '@/lib/utils';

const subtotal = computed(() =>
    cartItems.reduce(
        (sum, item) => sum + item.product.price * item.quantity,
        0,
    ),
);
const shipping = computed(() => (subtotal.value > 100 ? 0 : 9.99));
const tax = computed(() => subtotal.value * 0.05);
const total = computed(() => subtotal.value + shipping.value + tax.value);

const paymentMethod = ref<'card' | 'cod' | 'bank'>('card');
const paymentOptions = [
    { key: 'card', label: 'Credit / Debit Card', icon: CreditCard },
    { key: 'cod', label: 'Cash on Delivery', icon: Truck },
    { key: 'bank', label: 'Bank Transfer', icon: Landmark },
] as const;
</script>

<template>
    <Head title="Checkout" />

    <div class="mx-auto max-w-7xl px-4 py-8">
        <h1 class="text-3xl font-bold tracking-tight">Checkout</h1>

        <form class="mt-8 grid gap-8 lg:grid-cols-3" @submit.prevent>
            <!-- Left: forms -->
            <div class="space-y-8 lg:col-span-2">
                <!-- Contact -->
                <section class="rounded-xl border p-6">
                    <h2 class="font-semibold">Contact information</h2>
                    <div class="mt-4 grid gap-4 sm:grid-cols-2">
                        <div class="space-y-1.5">
                            <Label for="name">Full name</Label>
                            <Input id="name" placeholder="John Doe" />
                        </div>
                        <div class="space-y-1.5">
                            <Label for="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="john@example.com"
                            />
                        </div>
                        <div class="space-y-1.5">
                            <Label for="phone">Phone</Label>
                            <Input id="phone" placeholder="+880 1XXX-XXXXXX" />
                        </div>
                    </div>
                </section>

                <!-- Shipping address -->
                <section class="rounded-xl border p-6">
                    <h2 class="font-semibold">Shipping address</h2>
                    <div class="mt-4 grid gap-4 sm:grid-cols-2">
                        <div class="space-y-1.5 sm:col-span-2">
                            <Label for="street">Street address</Label>
                            <Input id="street" placeholder="123 Main St" />
                        </div>
                        <div class="space-y-1.5">
                            <Label for="city">City</Label>
                            <Input id="city" placeholder="Dhaka" />
                        </div>
                        <div class="space-y-1.5">
                            <Label for="zip">Postal code</Label>
                            <Input id="zip" placeholder="1207" />
                        </div>
                        <div class="space-y-1.5 sm:col-span-2">
                            <Label for="country">Country</Label>
                            <Input id="country" placeholder="Bangladesh" />
                        </div>
                    </div>
                </section>

                <!-- Payment -->
                <section class="rounded-xl border p-6">
                    <h2 class="font-semibold">Payment method</h2>
                    <div class="mt-4 grid gap-3 sm:grid-cols-3">
                        <button
                            v-for="option in paymentOptions"
                            :key="option.key"
                            type="button"
                            :class="
                                cn(
                                    'flex items-center gap-2 rounded-lg border-2 p-3 text-sm font-medium transition-colors',
                                    paymentMethod === option.key
                                        ? 'border-primary bg-accent'
                                        : 'border-border hover:border-foreground/30',
                                )
                            "
                            @click="paymentMethod = option.key"
                        >
                            <component :is="option.icon" class="size-4" />
                            {{ option.label }}
                        </button>
                    </div>

                    <div
                        v-if="paymentMethod === 'card'"
                        class="mt-5 grid gap-4 sm:grid-cols-2"
                    >
                        <div class="space-y-1.5 sm:col-span-2">
                            <Label for="card">Card number</Label>
                            <Input
                                id="card"
                                placeholder="1234 5678 9012 3456"
                            />
                        </div>
                        <div class="space-y-1.5">
                            <Label for="exp">Expiry</Label>
                            <Input id="exp" placeholder="MM / YY" />
                        </div>
                        <div class="space-y-1.5">
                            <Label for="cvc">CVC</Label>
                            <Input id="cvc" placeholder="123" />
                        </div>
                    </div>
                    <p
                        v-else-if="paymentMethod === 'cod'"
                        class="mt-4 text-sm text-muted-foreground"
                    >
                        Pay with cash when your order is delivered.
                    </p>
                    <p v-else class="mt-4 text-sm text-muted-foreground">
                        Transfer details will be emailed after you place the
                        order.
                    </p>
                </section>
            </div>

            <!-- Right: summary -->
            <div>
                <div class="sticky top-24 rounded-xl border p-6">
                    <h2 class="font-semibold">Your order</h2>
                    <div class="mt-4 space-y-4">
                        <div
                            v-for="item in cartItems"
                            :key="item.id"
                            class="flex gap-3"
                        >
                            <div
                                class="relative size-14 shrink-0 overflow-hidden rounded-lg border bg-muted"
                            >
                                <img
                                    :src="item.product.product_image"
                                    :alt="item.product.name"
                                    class="h-full w-full object-cover"
                                />
                                <span
                                    class="absolute -top-1.5 -right-1.5 flex size-5 items-center justify-center rounded-full bg-primary text-[10px] font-semibold text-primary-foreground"
                                    >{{ item.quantity }}</span
                                >
                            </div>
                            <div
                                class="flex flex-1 items-center justify-between gap-2"
                            >
                                <p class="line-clamp-2 text-sm">
                                    {{ item.product.name }}
                                </p>
                                <p
                                    class="text-sm font-medium whitespace-nowrap"
                                >
                                    {{
                                        formatPrice(
                                            item.product.price * item.quantity,
                                        )
                                    }}
                                </p>
                            </div>
                        </div>
                    </div>

                    <Separator class="my-4" />
                    <div class="space-y-2 text-sm">
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
                    <Separator class="my-4" />
                    <div class="flex justify-between text-base font-semibold">
                        <span>Total</span>
                        <span>{{ formatPrice(total) }}</span>
                    </div>

                    <Button size="lg" type="submit" class="mt-6 w-full">
                        <Lock class="size-4" />
                        Place Order
                    </Button>
                    <Button variant="ghost" class="mt-2 w-full" as-child>
                        <Link :href="shopRoutes.cart()">Back to cart</Link>
                    </Button>
                </div>
            </div>
        </form>
    </div>
</template>
