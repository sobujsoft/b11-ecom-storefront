<script setup lang="ts">
import { Head, Link, router } from '@inertiajs/vue3';
import { Heart, ShoppingCart, Trash2 } from '@lucide/vue';
import { ref } from 'vue';
import ProductRating from '@/components/storefront/ProductRating.vue';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useCart } from '@/composables/useCart';
import { useShopAuth } from '@/composables/useShopAuth';
import { useWishlist } from '@/composables/useWishlist';
import { formatPrice, shopRoutes } from '@/lib/shop';

const { isLoggedIn } = useShopAuth();
const { items, loading, error, removeFromWishlist } = useWishlist();
const { addToCart, addLoading } = useCart();

const removingId = ref<number | null>(null);

async function handleRemove(wishlistId: number) {
    removingId.value = wishlistId;
    await removeFromWishlist(wishlistId);
    removingId.value = null;
}

async function handleAddToCart(productId: number) {
    const result = await addToCart(productId);

    if (!result.success && result.error?.includes('log in')) {
        router.visit(shopRoutes.login());
    }
}
</script>

<template>
    <Head title="Wishlist" />

    <div class="mx-auto max-w-7xl px-4 py-8">
        <h1 class="text-3xl font-bold tracking-tight">My Wishlist</h1>
        <p class="mt-1 text-sm text-muted-foreground">
            <template v-if="loading">Loading your wishlist…</template>
            <template v-else>
                {{ items.length }} saved item{{ items.length === 1 ? '' : 's' }}
            </template>
        </p>

        <!-- Not logged in -->
        <div
            v-if="!isLoggedIn"
            class="mt-8 flex flex-col items-center justify-center rounded-xl border border-dashed py-20 text-center"
        >
            <span
                class="flex size-16 items-center justify-center rounded-full bg-muted"
            >
                <Heart class="size-7 text-muted-foreground" />
            </span>
            <p class="mt-4 text-lg font-semibold">Sign in to view your wishlist</p>
            <p class="mt-1 text-sm text-muted-foreground">
                Save items you love to find them here later.
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
            <Button class="mt-4" variant="outline" as-child>
                <Link :href="shopRoutes.products()">Back to shop</Link>
            </Button>
        </div>

        <!-- Loading -->
        <div
            v-else-if="loading"
            class="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
        >
            <Skeleton
                v-for="n in 3"
                :key="n"
                class="h-36 w-full rounded-xl"
            />
        </div>

        <div
            v-else-if="items.length"
            class="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
        >
            <div
                v-for="item in items"
                :key="item.id"
                class="flex gap-4 rounded-xl border p-4 transition-opacity duration-150"
                :class="{ 'opacity-50': removingId === item.id }"
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
                    >
                        {{ item.product.name }}
                    </Link>
                    <ProductRating
                        :rating="item.product.rating ?? 0"
                        :count="item.product.reviews_count"
                        class="mt-1"
                    />
                    <p class="mt-1 font-bold">
                        {{ formatPrice(item.product.price) }}
                    </p>
                    <div class="mt-auto flex items-center gap-2 pt-3">
                        <Button
                            size="sm"
                            class="flex-1"
                            :disabled="addLoading === item.product.id"
                            @click="handleAddToCart(item.product.id)"
                        >
                            <ShoppingCart class="size-4" />
                            {{
                                addLoading === item.product.id
                                    ? 'Adding…'
                                    : 'Add to cart'
                            }}
                        </Button>
                        <Button
                            size="icon-sm"
                            variant="outline"
                            class="text-muted-foreground hover:text-destructive"
                            aria-label="Remove from wishlist"
                            :disabled="removingId === item.id"
                            @click="handleRemove(item.id)"
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
