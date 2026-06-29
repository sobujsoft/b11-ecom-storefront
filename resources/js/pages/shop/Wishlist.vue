<script setup lang="ts">
import { Head, Link } from '@inertiajs/vue3';
import { Heart, ShoppingCart, Trash2 } from '@lucide/vue';
import { ref } from 'vue';
import ProductRating from '@/components/storefront/ProductRating.vue';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    formatPrice,
    shopRoutes,
    wishlistItems as initialWishlist,
} from '@/lib/shop';
import type { WishlistItem } from '@/types';

const items = ref<WishlistItem[]>(initialWishlist.map((item) => ({ ...item })));

function remove(id: number) {
    items.value = items.value.filter((item) => item.id !== id);
}
</script>

<template>
    <Head title="Wishlist" />

    <div class="mx-auto max-w-7xl px-4 py-8">
        <h1 class="text-3xl font-bold tracking-tight">My Wishlist</h1>
        <p class="mt-1 text-sm text-muted-foreground">
            {{ items.length }} saved item{{ items.length === 1 ? '' : 's' }}
        </p>

        <div
            v-if="items.length"
            class="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
        >
            <div
                v-for="item in items"
                :key="item.id"
                class="flex gap-4 rounded-xl border p-4"
            >
                <Link
                    :href="shopRoutes.product(item.product.id)"
                    class="size-28 shrink-0 overflow-hidden rounded-lg border bg-muted"
                >
                    <img
                        :src="item.product.product_image"
                        :alt="item.product.name"
                        class="h-full w-full object-cover"
                    />
                </Link>
                <div class="flex flex-1 flex-col">
                    <Badge variant="secondary" class="mb-1 w-fit">{{
                        item.product.category
                    }}</Badge>
                    <Link
                        :href="shopRoutes.product(item.product.id)"
                        class="line-clamp-2 text-sm font-semibold hover:underline"
                        >{{ item.product.name }}</Link
                    >
                    <ProductRating
                        :rating="item.product.rating ?? 0"
                        :count="item.product.reviews_count"
                        class="mt-1"
                    />
                    <p class="mt-1 font-bold">
                        {{ formatPrice(item.product.price) }}
                    </p>
                    <div class="mt-auto flex items-center gap-2 pt-3">
                        <Button size="sm" class="flex-1">
                            <ShoppingCart class="size-4" />
                            Add to cart
                        </Button>
                        <Button
                            size="icon-sm"
                            variant="outline"
                            class="text-muted-foreground hover:text-destructive"
                            aria-label="Remove from wishlist"
                            @click="remove(item.id)"
                        >
                            <Trash2 class="size-4" />
                        </Button>
                    </div>
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
                <Heart class="size-7 text-muted-foreground" />
            </span>
            <p class="mt-4 text-lg font-semibold">Your wishlist is empty</p>
            <p class="mt-1 text-sm text-muted-foreground">
                Save items you love to find them here later.
            </p>
            <Button class="mt-6" as-child>
                <Link :href="shopRoutes.products()">Browse products</Link>
            </Button>
        </div>
    </div>
</template>
