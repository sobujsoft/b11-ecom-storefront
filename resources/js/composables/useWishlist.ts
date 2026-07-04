import { router } from '@inertiajs/vue3';
import { computed, ref, watch } from 'vue';
import { toast } from 'vue-sonner';
import { useShopAuth } from '@/composables/useShopAuth';
import { apiFetch } from '@/lib/api';
import { shopRoutes } from '@/lib/shop';
import type { Product, WishlistItem } from '@/types';

type WishlistApiItem = {
    id: number;
    product_id: number;
    product?: Product & { price: number | string };
};

function normalizeProduct(product: Product & { price?: number | string }): Product {
    return {
        ...product,
        price:
            typeof product.price === 'string'
                ? parseFloat(product.price)
                : product.price,
    };
}

function mapWishlistItem(item: WishlistApiItem): WishlistItem {
    return {
        id: item.id,
        product: item.product
            ? normalizeProduct(item.product)
            : ({
                  id: item.product_id,
                  name: 'Product',
                  category: '',
                  details: '',
                  brand: '',
                  latest_product: false,
                  popular_product: false,
                  featured: false,
                  on_slider: false,
                  product_image: '',
                  price: 0,
              } satisfies Product),
    };
}

const items = ref<WishlistItem[]>([]);
const loading = ref(false);
const error = ref<string | null>(null);
const toggleLoading = ref<number | null>(null);
let watcherInitialized = false;

async function fetchWishlist(
    token: string | null,
    options: { silent?: boolean } = {},
): Promise<void> {
    if (!token) {
        items.value = [];
        return;
    }

    if (!options.silent) {
        loading.value = true;
    }

    error.value = null;

    try {
        const data = await apiFetch<WishlistApiItem[]>('/wishlists', { token });
        items.value = data.map(mapWishlistItem);
    } catch (e) {
        if (!options.silent) {
            error.value =
                e instanceof Error ? e.message : 'Failed to load wishlist';
            items.value = [];
        }
    } finally {
        if (!options.silent) {
            loading.value = false;
        }
    }
}

function clearLocalWishlist(): void {
    items.value = [];
    error.value = null;
}

export function useWishlist() {
    const { token } = useShopAuth();

    if (!watcherInitialized && typeof window !== 'undefined') {
        watcherInitialized = true;
        watch(
            token,
            (newToken) => {
                if (newToken) {
                    fetchWishlist(newToken);
                } else {
                    clearLocalWishlist();
                }
            },
            { immediate: true },
        );
    }

    const itemCount = computed(() => items.value.length);

    const productIds = computed(() =>
        new Set(items.value.map((item) => item.product.id)),
    );

    function isInWishlist(productId: number): boolean {
        return productIds.value.has(productId);
    }

    function findByProductId(productId: number): WishlistItem | undefined {
        return items.value.find((item) => item.product.id === productId);
    }

    async function addToWishlist(
        productId: number,
    ): Promise<{ success: boolean; error?: string }> {
        if (!token.value) {
            return {
                success: false,
                error: 'Please log in to save items to your wishlist.',
            };
        }

        if (isInWishlist(productId)) {
            return { success: true };
        }

        toggleLoading.value = productId;

        try {
            await apiFetch('/wishlists', {
                method: 'POST',
                token: token.value,
                body: JSON.stringify({ product_id: productId }),
            });
            await fetchWishlist(token.value, { silent: true });

            toast.success('Added to wishlist', {
                action: {
                    label: 'View wishlist',
                    onClick: () => router.visit(shopRoutes.wishlist()),
                },
            });

            return { success: true };
        } catch (e) {
            const message =
                e instanceof Error ? e.message : 'Failed to add to wishlist.';

            toast.error(message);

            return { success: false, error: message };
        } finally {
            toggleLoading.value = null;
        }
    }

    async function removeFromWishlist(
        wishlistId: number,
    ): Promise<void> {
        if (!token.value) {
            return;
        }

        const index = items.value.findIndex((item) => item.id === wishlistId);
        if (index === -1) {
            return;
        }

        const removedItem = items.value[index];
        items.value = items.value.filter((item) => item.id !== wishlistId);

        try {
            await apiFetch(`/wishlists/${wishlistId}`, {
                method: 'DELETE',
                token: token.value,
            });

            toast.success('Removed from wishlist');
        } catch (e) {
            items.value.splice(index, 0, removedItem);

            toast.error(
                e instanceof Error
                    ? e.message
                    : 'Failed to remove from wishlist',
            );
        }
    }

    async function toggleWishlist(
        productId: number,
    ): Promise<{ success: boolean; error?: string }> {
        if (!token.value) {
            return {
                success: false,
                error: 'Please log in to save items to your wishlist.',
            };
        }

        const existing = findByProductId(productId);

        if (existing) {
            toggleLoading.value = productId;
            await removeFromWishlist(existing.id);
            toggleLoading.value = null;
            return { success: true };
        }

        return addToWishlist(productId);
    }

    return {
        items,
        itemCount,
        loading,
        error,
        toggleLoading,
        isInWishlist,
        addToWishlist,
        removeFromWishlist,
        toggleWishlist,
    };
}
