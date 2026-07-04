import { router } from '@inertiajs/vue3';
import { computed, ref, watch } from 'vue';
import { toast } from 'vue-sonner';
import { useShopAuth } from '@/composables/useShopAuth';
import { apiFetch } from '@/lib/api';
import { shopRoutes } from '@/lib/shop';
import type { CartItem, Product } from '@/types';

type CartApiItem = {
    id: number;
    product_id: number;
    quantity: number;
    product: Product & { price: number | string };
};

type CartResponse = {
    items: CartApiItem[];
    total_price: number | string;
};

type AddToCartResponse = {
    message: string;
    cart: CartApiItem;
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

function mapCartItem(item: CartApiItem): CartItem {
    return {
        id: item.id,
        product: normalizeProduct(item.product),
        quantity: item.quantity,
    };
}

const items = ref<CartItem[]>([]);
const totalPrice = ref(0);
const loading = ref(false);
const error = ref<string | null>(null);
const addLoading = ref<number | null>(null);
let watcherInitialized = false;

async function fetchCart(token: string | null): Promise<void> {
    if (!token) {
        items.value = [];
        totalPrice.value = 0;
        return;
    }

    loading.value = true;
    error.value = null;

    try {
        const data = await apiFetch<CartResponse>('/cart', { token });
        items.value = data.items.map(mapCartItem);
        totalPrice.value =
            typeof data.total_price === 'string'
                ? parseFloat(data.total_price)
                : data.total_price;
    } catch (e) {
        error.value = e instanceof Error ? e.message : 'Failed to load cart';
        items.value = [];
        totalPrice.value = 0;
    } finally {
        loading.value = false;
    }
}

function clearLocalCart(): void {
    items.value = [];
    totalPrice.value = 0;
    error.value = null;
}

export function useCart() {
    const { token } = useShopAuth();

    if (!watcherInitialized && typeof window !== 'undefined') {
        watcherInitialized = true;
        watch(
            token,
            (newToken) => {
                if (newToken) {
                    fetchCart(newToken);
                } else {
                    clearLocalCart();
                }
            },
            { immediate: true },
        );
    }

    const itemCount = computed(() =>
        items.value.reduce((sum, item) => sum + item.quantity, 0),
    );

    async function refreshCart(): Promise<void> {
        await fetchCart(token.value);
    }

    async function addToCart(
        productId: number,
        quantity = 1,
    ): Promise<{ success: boolean; error?: string }> {
        if (!token.value) {
            return {
                success: false,
                error: 'Please log in to add items to your cart.',
            };
        }

        addLoading.value = productId;

        try {
            const data = await apiFetch<AddToCartResponse>('/cart', {
                method: 'POST',
                token: token.value,
                body: JSON.stringify({ product_id: productId, quantity }),
            });
            await fetchCart(token.value);

            const productName = normalizeProduct(data.cart.product).name;
            toast.success('Added to cart', {
                description:
                    quantity > 1
                        ? `${productName} · Qty ${quantity}`
                        : productName,
                action: {
                    label: 'View cart',
                    onClick: () => router.visit(shopRoutes.cart()),
                },
            });

            return { success: true };
        } catch (e) {
            const message =
                e instanceof Error ? e.message : 'Failed to add to cart.';

            toast.error(message);

            return { success: false, error: message };
        } finally {
            addLoading.value = null;
        }
    }

    async function updateQuantity(cartId: number, quantity: number): Promise<void> {
        if (!token.value) {
            return;
        }

        try {
            await apiFetch(`/cart/${cartId}`, {
                method: 'PUT',
                token: token.value,
                body: JSON.stringify({ quantity }),
            });
            await fetchCart(token.value);
        } catch (e) {
            error.value =
                e instanceof Error ? e.message : 'Failed to update cart item';
        }
    }

    async function removeItem(cartId: number): Promise<void> {
        if (!token.value) {
            return;
        }

        try {
            await apiFetch(`/cart/${cartId}`, {
                method: 'DELETE',
                token: token.value,
            });
            await fetchCart(token.value);
        } catch (e) {
            error.value =
                e instanceof Error ? e.message : 'Failed to remove cart item';
        }
    }

    return {
        items,
        totalPrice,
        itemCount,
        loading,
        error,
        addLoading,
        refreshCart,
        addToCart,
        updateQuantity,
        removeItem,
    };
}
