<script setup lang="ts">
import { Head, Link, router } from '@inertiajs/vue3';
import { CreditCard, Lock, ShoppingCart, Truck } from '@lucide/vue';
import { computed, ref, watch } from 'vue';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { useCart } from '@/composables/useCart';
import { useOrders } from '@/composables/useOrders';
import { useShopAuth } from '@/composables/useShopAuth';
import { ApiError } from '@/lib/api';
import { formatPrice, shopRoutes } from '@/lib/shop';
import { cn } from '@/lib/utils';
import type { PaymentMethod } from '@/types';
import { toast } from 'vue-sonner';

const { isLoggedIn, user } = useShopAuth();
const { items, loading: cartLoading, clearCart } = useCart();
const { createOrder } = useOrders();

const name = ref(user.value?.name ?? '');
const email = ref(user.value?.email ?? '');
const phone = ref('');
const street = ref('');
const city = ref('');
const zip = ref('');
const country = ref('Bangladesh');

watch(user, (currentUser) => {
    if (currentUser) {
        name.value = currentUser.name;
        email.value = currentUser.email;
    }
});

const paymentMethod = ref<PaymentMethod>('cod');
const placingOrder = ref(false);
const fieldErrors = ref<Record<string, string>>({});
const generalError = ref<string | null>(null);

const paymentOptions = [
    { key: 'cod' as const, label: 'Cash on Delivery', icon: Truck },
    {
        key: 'sslcommerz' as const,
        label: 'SSL Commerz',
        icon: CreditCard,
        disabled: true,
    },
];

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

function buildShippingAddress(): string {
    const parts = [
        street.value.trim(),
        city.value.trim(),
        zip.value.trim(),
        country.value.trim(),
    ].filter(Boolean);

    return parts.join(', ');
}

function validate(): boolean {
    const errors: Record<string, string> = {};

    if (!name.value.trim()) {
        errors.name = 'Full name is required.';
    }
    if (!email.value.trim()) {
        errors.email = 'Email is required.';
    }
    if (!phone.value.trim()) {
        errors.phone = 'Phone number is required.';
    }
    if (!street.value.trim()) {
        errors.street = 'Street address is required.';
    }
    if (!city.value.trim()) {
        errors.city = 'City is required.';
    }

    fieldErrors.value = errors;
    return Object.keys(errors).length === 0;
}

async function placeOrder() {
    generalError.value = null;

    if (!isLoggedIn.value) {
        router.visit(shopRoutes.login());
        return;
    }

    if (!items.value.length) {
        toast.error('Your cart is empty.');
        return;
    }

    if (paymentMethod.value === 'sslcommerz') {
        toast.info('SSL Commerz payments are coming soon. Please use Cash on Delivery.');
        return;
    }

    if (!validate()) {
        return;
    }

    placingOrder.value = true;

    try {
        const order = await createOrder({
            total_amount: total.value,
            shipping_address: buildShippingAddress(),
            items: items.value.map((item) => ({
                product_id: item.product.id,
                quantity: item.quantity,
                price: item.product.price,
            })),
        });

        await clearCart();

        toast.success('Order placed successfully!', {
            description: `Order #${order.id} · Cash on Delivery`,
        });

        router.visit(shopRoutes.order(order.id));
    } catch (e) {
        if (e instanceof ApiError && e.errors) {
            const flat: Record<string, string> = {};
            for (const [field, msgs] of Object.entries(e.errors)) {
                flat[field] = msgs[0];
            }
            fieldErrors.value = flat;
        } else {
            generalError.value =
                e instanceof Error ? e.message : 'Failed to place order.';
            toast.error(generalError.value);
        }
    } finally {
        placingOrder.value = false;
    }
}
</script>

<template>
    <Head title="Checkout" />

    <div class="mx-auto max-w-7xl px-4 py-8">
        <h1 class="text-3xl font-bold tracking-tight">Checkout</h1>

        <!-- Not logged in -->
        <div
            v-if="!isLoggedIn"
            class="mt-8 flex flex-col items-center justify-center rounded-xl border border-dashed py-20 text-center"
        >
            <p class="text-lg font-semibold">Sign in to checkout</p>
            <p class="mt-1 text-sm text-muted-foreground">
                You need an account to place an order.
            </p>
            <Button class="mt-6" as-child>
                <Link :href="shopRoutes.login()">Sign in</Link>
            </Button>
        </div>

        <!-- Empty cart -->
        <div
            v-else-if="!cartLoading && !items.length"
            class="mt-8 flex flex-col items-center justify-center rounded-xl border border-dashed py-20 text-center"
        >
            <span
                class="flex size-16 items-center justify-center rounded-full bg-muted"
            >
                <ShoppingCart class="size-7 text-muted-foreground" />
            </span>
            <p class="mt-4 text-lg font-semibold">Your cart is empty</p>
            <p class="mt-1 text-sm text-muted-foreground">
                Add products before checking out.
            </p>
            <Button class="mt-6" as-child>
                <Link :href="shopRoutes.products()">Browse products</Link>
            </Button>
        </div>

        <form
            v-else
            class="mt-8 grid gap-8 lg:grid-cols-3"
            @submit.prevent="placeOrder"
        >
            <!-- Left: forms -->
            <div class="space-y-8 lg:col-span-2">
                <div
                    v-if="generalError"
                    class="rounded-lg bg-destructive/10 p-3 text-sm text-destructive"
                >
                    {{ generalError }}
                </div>

                <!-- Contact -->
                <section class="rounded-xl border p-6">
                    <h2 class="font-semibold">Contact information</h2>
                    <div class="mt-4 grid gap-4 sm:grid-cols-2">
                        <div class="space-y-1.5">
                            <Label for="name">Full name</Label>
                            <Input
                                id="name"
                                v-model="name"
                                placeholder="John Doe"
                                :aria-invalid="!!fieldErrors.name"
                            />
                            <p
                                v-if="fieldErrors.name"
                                class="text-xs text-destructive"
                            >
                                {{ fieldErrors.name }}
                            </p>
                        </div>
                        <div class="space-y-1.5">
                            <Label for="email">Email</Label>
                            <Input
                                id="email"
                                v-model="email"
                                type="email"
                                placeholder="john@example.com"
                                :aria-invalid="!!fieldErrors.email"
                            />
                            <p
                                v-if="fieldErrors.email"
                                class="text-xs text-destructive"
                            >
                                {{ fieldErrors.email }}
                            </p>
                        </div>
                        <div class="space-y-1.5">
                            <Label for="phone">Phone</Label>
                            <Input
                                id="phone"
                                v-model="phone"
                                placeholder="+880 1XXX-XXXXXX"
                                :aria-invalid="!!fieldErrors.phone"
                            />
                            <p
                                v-if="fieldErrors.phone"
                                class="text-xs text-destructive"
                            >
                                {{ fieldErrors.phone }}
                            </p>
                        </div>
                    </div>
                </section>

                <!-- Shipping address -->
                <section class="rounded-xl border p-6">
                    <h2 class="font-semibold">Shipping address</h2>
                    <div class="mt-4 grid gap-4 sm:grid-cols-2">
                        <div class="space-y-1.5 sm:col-span-2">
                            <Label for="street">Street address</Label>
                            <Input
                                id="street"
                                v-model="street"
                                placeholder="123 Main St"
                                :aria-invalid="!!fieldErrors.street"
                            />
                            <p
                                v-if="fieldErrors.street"
                                class="text-xs text-destructive"
                            >
                                {{ fieldErrors.street }}
                            </p>
                        </div>
                        <div class="space-y-1.5">
                            <Label for="city">City</Label>
                            <Input
                                id="city"
                                v-model="city"
                                placeholder="Dhaka"
                                :aria-invalid="!!fieldErrors.city"
                            />
                            <p
                                v-if="fieldErrors.city"
                                class="text-xs text-destructive"
                            >
                                {{ fieldErrors.city }}
                            </p>
                        </div>
                        <div class="space-y-1.5">
                            <Label for="zip">Postal code</Label>
                            <Input
                                id="zip"
                                v-model="zip"
                                placeholder="1207"
                            />
                        </div>
                        <div class="space-y-1.5 sm:col-span-2">
                            <Label for="country">Country</Label>
                            <Input
                                id="country"
                                v-model="country"
                                placeholder="Bangladesh"
                            />
                        </div>
                    </div>
                </section>

                <!-- Payment -->
                <section class="rounded-xl border p-6">
                    <h2 class="font-semibold">Payment method</h2>
                    <div class="mt-4 grid gap-3 sm:grid-cols-2">
                        <button
                            v-for="option in paymentOptions"
                            :key="option.key"
                            type="button"
                            :disabled="option.disabled"
                            :class="
                                cn(
                                    'flex items-center gap-2 rounded-lg border-2 p-4 text-sm font-medium transition-colors',
                                    option.disabled &&
                                        'cursor-not-allowed opacity-60',
                                    paymentMethod === option.key
                                        ? 'border-primary bg-accent'
                                        : 'border-border hover:border-foreground/30',
                                    !option.disabled &&
                                        paymentMethod !== option.key &&
                                        'hover:bg-muted/50',
                                )
                            "
                            @click="
                                !option.disabled &&
                                    (paymentMethod = option.key)
                            "
                        >
                            <component :is="option.icon" class="size-4 shrink-0" />
                            <span class="text-left">
                                {{ option.label }}
                                <span
                                    v-if="option.disabled"
                                    class="mt-0.5 block text-xs font-normal text-muted-foreground"
                                >
                                    Coming soon
                                </span>
                            </span>
                        </button>
                    </div>

                    <p
                        v-if="paymentMethod === 'cod'"
                        class="mt-4 rounded-lg bg-muted/50 p-3 text-sm text-muted-foreground"
                    >
                        Pay with cash when your order is delivered. No online
                        payment required.
                    </p>
                    <p
                        v-else
                        class="mt-4 rounded-lg bg-muted/50 p-3 text-sm text-muted-foreground"
                    >
                        Pay securely online via SSL Commerz. This option will be
                        available soon.
                    </p>
                </section>
            </div>

            <!-- Right: summary -->
            <div>
                <div class="sticky top-24 rounded-xl border p-6">
                    <h2 class="font-semibold">Your order</h2>

                    <div v-if="cartLoading" class="mt-4 space-y-4">
                        <Skeleton
                            v-for="n in 2"
                            :key="n"
                            class="h-14 w-full rounded-lg"
                        />
                    </div>

                    <div v-else class="mt-4 space-y-4">
                        <div
                            v-for="item in items"
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
                                >
                                    {{ item.quantity }}
                                </span>
                            </div>
                            <div
                                class="flex flex-1 items-center justify-between gap-2"
                            >
                                <p class="line-clamp-2 text-sm">
                                    {{ item.product.name }}
                                </p>
                                <p class="text-sm font-medium whitespace-nowrap">
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

                    <Button
                        size="lg"
                        type="submit"
                        class="mt-6 w-full"
                        :disabled="
                            placingOrder ||
                            cartLoading ||
                            !items.length ||
                            paymentMethod !== 'cod'
                        "
                    >
                        <Lock class="size-4" />
                        {{
                            placingOrder
                                ? 'Placing order…'
                                : 'Place Order (COD)'
                        }}
                    </Button>
                    <Button variant="ghost" class="mt-2 w-full" as-child>
                        <Link :href="shopRoutes.cart()">Back to cart</Link>
                    </Button>
                </div>
            </div>
        </form>
    </div>
</template>
