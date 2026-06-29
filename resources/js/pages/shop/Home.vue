<script setup lang="ts">
import { Head, Link } from '@inertiajs/vue3';
import {
    ArrowRight,
    Headphones,
    RotateCcw,
    ShieldCheck,
    Truck,
} from '@lucide/vue';
import { computed, onMounted, ref } from 'vue';
import ProductCard from '@/components/storefront/ProductCard.vue';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { apiFetch } from '@/lib/api';
import { shopRoutes } from '@/lib/shop';
import type { Product } from '@/types';

const products = ref<Product[]>([]);
const loading = ref(true);
const error = ref<string | null>(null);

onMounted(async () => {
    try {
        const data = await apiFetch<Product[]>('/products');
        products.value = data;
    } catch (e) {
        error.value = e instanceof Error ? e.message : 'Failed to load products';
    } finally {
        loading.value = false;
    }
});

const heroProduct = computed(
    () =>
        products.value.find((p) => p.on_slider && p.featured) ??
        products.value[0],
);
const featured = computed(() =>
    products.value.filter((p) => p.featured).slice(0, 4),
);
const latest = computed(() =>
    products.value.filter((p) => p.latest_product).slice(0, 4),
);
const popular = computed(() =>
    products.value.filter((p) => p.popular_product).slice(0, 8),
);

const perks = [
    { icon: Truck, title: 'Free Shipping', desc: 'On orders over $100' },
    { icon: RotateCcw, title: '30-Day Returns', desc: 'Hassle-free refunds' },
    { icon: ShieldCheck, title: 'Secure Payment', desc: '100% protected' },
    { icon: Headphones, title: '24/7 Support', desc: 'Always here to help' },
];
</script>

<template>
    <Head title="Home" />

    <!-- Hero -->
    <section class="border-b bg-muted/30">
        <div
            class="mx-auto grid max-w-7xl items-center gap-8 px-4 py-12 lg:grid-cols-2 lg:py-20"
        >
            <div>
                <Badge variant="secondary" class="mb-4"
                    >New Season Arrivals</Badge
                >
                <h1
                    class="text-4xl font-bold tracking-tight text-balance sm:text-5xl lg:text-6xl"
                >
                    Quality products at
                    <span class="text-primary">honest prices</span>
                </h1>
                <p class="mt-5 max-w-md text-lg text-muted-foreground">
                    Discover thousands of handpicked items across electronics,
                    fashion, and home essentials — delivered fast.
                </p>
                <div class="mt-8 flex flex-wrap gap-3">
                    <Button size="lg" as-child>
                        <Link :href="shopRoutes.products()">
                            Shop Now
                            <ArrowRight class="size-4" />
                        </Link>
                    </Button>
                    <Button size="lg" variant="outline" as-child>
                        <Link :href="`${shopRoutes.products()}?filter=latest`"
                            >New Arrivals</Link
                        >
                    </Button>
                </div>
            </div>
            <div class="relative">
                <div
                    class="aspect-[4/3] overflow-hidden rounded-2xl border bg-card shadow-sm"
                >
                    <Skeleton v-if="loading" class="h-full w-full" />
                    <img
                        v-else-if="heroProduct"
                        :src="heroProduct.product_image"
                        :alt="heroProduct.name"
                        class="h-full w-full object-cover"
                    />
                </div>
                <div
                    v-if="!loading && heroProduct"
                    class="absolute bottom-4 left-4 rounded-xl border bg-background/95 p-4 shadow-lg backdrop-blur"
                >
                    <p class="text-xs text-muted-foreground">Featured</p>
                    <p class="font-semibold">{{ heroProduct.name }}</p>
                    <Link
                        :href="shopRoutes.product(heroProduct.id)"
                        class="mt-1 inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
                    >
                        View product <ArrowRight class="size-3.5" />
                    </Link>
                </div>
            </div>
        </div>
    </section>

    <!-- Perks -->
    <section class="border-b">
        <div
            class="mx-auto grid max-w-7xl grid-cols-2 gap-6 px-4 py-8 lg:grid-cols-4"
        >
            <div
                v-for="perk in perks"
                :key="perk.title"
                class="flex items-center gap-3"
            >
                <span
                    class="flex size-11 shrink-0 items-center justify-center rounded-full bg-muted"
                >
                    <component :is="perk.icon" class="size-5" />
                </span>
                <div>
                    <p class="text-sm font-semibold">{{ perk.title }}</p>
                    <p class="text-xs text-muted-foreground">{{ perk.desc }}</p>
                </div>
            </div>
        </div>
    </section>

    <!-- Error state -->
    <div
        v-if="error"
        class="mx-auto max-w-7xl px-4 py-8 text-center text-destructive"
    >
        {{ error }}
    </div>

    <!-- Featured -->
    <section class="mx-auto max-w-7xl px-4 py-6">
        <div class="mb-6 flex items-end justify-between">
            <h2 class="text-2xl font-bold tracking-tight">Featured Products</h2>
            <Link
                :href="shopRoutes.products()"
                class="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
            >
                View all <ArrowRight class="size-4" />
            </Link>
        </div>
        <div class="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
            <template v-if="loading">
                <Skeleton
                    v-for="n in 4"
                    :key="n"
                    class="aspect-[3/4] rounded-xl"
                />
            </template>
            <ProductCard
                v-else
                v-for="product in featured"
                :key="product.id"
                :product="product"
            />
        </div>
    </section>

    <!-- Promo banner -->
    <section class="mx-auto max-w-7xl px-4 py-12">
        <div
            class="overflow-hidden rounded-2xl bg-primary px-6 py-12 text-center text-primary-foreground sm:px-12"
        >
            <h2 class="text-3xl font-bold">Members save more</h2>
            <p class="mx-auto mt-3 max-w-lg text-primary-foreground/80">
                Sign up today and get 10% off your first order plus early access
                to seasonal sales.
            </p>
            <Button size="lg" variant="secondary" class="mt-6" as-child>
                <Link :href="shopRoutes.products()">Start shopping</Link>
            </Button>
        </div>
    </section>

    <!-- Latest -->
    <section class="mx-auto max-w-7xl px-4 py-6">
        <div class="mb-6 flex items-end justify-between">
            <h2 class="text-2xl font-bold tracking-tight">New Arrivals</h2>
            <Link
                :href="`${shopRoutes.products()}?filter=latest`"
                class="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
            >
                View all <ArrowRight class="size-4" />
            </Link>
        </div>
        <div class="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
            <template v-if="loading">
                <Skeleton
                    v-for="n in 4"
                    :key="n"
                    class="aspect-[3/4] rounded-xl"
                />
            </template>
            <ProductCard
                v-else
                v-for="product in latest"
                :key="product.id"
                :product="product"
            />
        </div>
    </section>

    <!-- Popular -->
    <section class="mx-auto max-w-7xl px-4 py-6 pb-12">
        <div class="mb-6 flex items-end justify-between">
            <h2 class="text-2xl font-bold tracking-tight">Popular Right Now</h2>
        </div>
        <div class="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
            <template v-if="loading">
                <Skeleton
                    v-for="n in 8"
                    :key="n"
                    class="aspect-[3/4] rounded-xl"
                />
            </template>
            <ProductCard
                v-else
                v-for="product in popular"
                :key="product.id"
                :product="product"
            />
        </div>
    </section>
</template>
