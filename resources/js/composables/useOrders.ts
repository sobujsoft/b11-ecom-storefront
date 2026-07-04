import { apiFetch } from '@/lib/api';
import { useShopAuth } from '@/composables/useShopAuth';
import type { Order, OrderItem, OrderStatus, PaymentStatus, Product } from '@/types';

type OrderApiItem = {
    id: number;
    order_id: number;
    product_id: number;
    quantity: number;
    price: number | string;
    product?: Product & { price: number | string };
};

type OrderApiResponse = {
    id: number;
    total_amount: number | string;
    shipping_address: string;
    status: OrderStatus;
    payment_status: PaymentStatus;
    created_at: string;
    updated_at: string;
    items: OrderApiItem[];
};

export type CreateOrderPayload = {
    total_amount: number;
    shipping_address: string;
    items: Array<{
        product_id: number;
        quantity: number;
        price: number;
    }>;
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

function mapOrderItem(item: OrderApiItem): OrderItem {
    return {
        id: item.id,
        quantity: item.quantity,
        price: typeof item.price === 'string' ? parseFloat(item.price) : item.price,
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
                  price:
                      typeof item.price === 'string'
                          ? parseFloat(item.price)
                          : item.price,
              } satisfies Product),
    };
}

function mapOrder(order: OrderApiResponse): Order {
    return {
        id: order.id,
        total_amount:
            typeof order.total_amount === 'string'
                ? parseFloat(order.total_amount)
                : order.total_amount,
        shipping_address: order.shipping_address,
        status: order.status,
        payment_status: order.payment_status,
        created_at: order.created_at,
        items: order.items.map(mapOrderItem),
    };
}

export function useOrders() {
    const { token } = useShopAuth();

    async function fetchOrders(): Promise<Order[]> {
        if (!token.value) {
            return [];
        }

        const data = await apiFetch<OrderApiResponse[]>('/orders', {
            token: token.value,
        });

        return data.map(mapOrder);
    }

    async function fetchOrder(orderId: number): Promise<Order> {
        if (!token.value) {
            throw new Error('Please log in to view this order.');
        }

        const data = await apiFetch<OrderApiResponse>(`/orders/${orderId}`, {
            token: token.value,
        });

        return mapOrder(data);
    }

    async function createOrder(payload: CreateOrderPayload): Promise<Order> {
        if (!token.value) {
            throw new Error('Please log in to place an order.');
        }

        const data = await apiFetch<OrderApiResponse>('/orders', {
            method: 'POST',
            token: token.value,
            body: JSON.stringify(payload),
        });

        return mapOrder(data);
    }

    return {
        fetchOrders,
        fetchOrder,
        createOrder,
    };
}
