<script setup lang="ts">
import { Link } from '@inertiajs/vue3';
import { Heart, ShoppingCart } from '@lucide/vue';
import ProductRating from '@/components/storefront/ProductRating.vue';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { formatPrice, shopRoutes } from '@/lib/shop';
import type { Product } from '@/types';

defineProps<{
    product: Product;
}>();
</script>

<template>
    <div
        class="group relative flex flex-col overflow-hidden rounded-xl border bg-card transition-shadow hover:shadow-md"
    >
        <Link
            :href="shopRoutes.product(product.id)"
            class="relative block aspect-square overflow-hidden bg-muted"
        >
            <img
                :src="product.product_image"
                :alt="product.name"
                loading="lazy"
                class="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
            <Badge
                v-if="product.old_price"
                variant="destructive"
                class="absolute top-3 left-3"
            >
                -{{
                    Math.round((1 - product.price / product.old_price) * 100)
                }}%
            </Badge>
            <Badge
                v-else-if="product.latest_product"
                class="absolute top-3 left-3"
            >
                New
            </Badge>
        </Link>

        <Button
            variant="secondary"
            size="icon"
            class="absolute top-3 right-3 rounded-full opacity-0 shadow-sm transition-opacity group-hover:opacity-100"
            aria-label="Add to wishlist"
        >
            <Heart class="size-4" />
        </Button>

        <div class="flex flex-1 flex-col p-4">
            <p
                class="text-xs font-medium tracking-wide text-muted-foreground uppercase"
            >
                {{ product.category }}
            </p>
            <Link
                :href="shopRoutes.product(product.id)"
                class="mt-1 line-clamp-2 text-sm font-semibold hover:underline"
            >
                {{ product.name }}
            </Link>

            <div class="mt-2">
                <ProductRating
                    :rating="product.rating ?? 0"
                    :count="product.reviews_count"
                />
            </div>

            <div class="mt-auto flex items-end justify-between pt-4">
                <div class="flex items-baseline gap-2">
                    <span class="text-lg font-bold">{{
                        formatPrice(product.price)
                    }}</span>
                    <span
                        v-if="product.old_price"
                        class="text-sm text-muted-foreground line-through"
                    >
                        {{ formatPrice(product.old_price) }}
                    </span>
                </div>
                <Button size="icon" aria-label="Add to cart">
                    <ShoppingCart class="size-4" />
                </Button>
            </div>
        </div>
    </div>
</template>
