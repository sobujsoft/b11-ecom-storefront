export type Product = {
    id: number;
    name: string;
    category: string;
    details: string;
    brand: string;
    latest_product: boolean;
    popular_product: boolean;
    featured: boolean;
    on_slider: boolean;
    product_image: string;
    price: number;
    /** Optional UI-only fields used by the design (not part of the API payload). */
    old_price?: number;
    rating?: number;
    reviews_count?: number;
};

export type ProductReview = {
    id: number;
    product_id: number;
    user: {
        id: number;
        name: string;
    };
    rating: number;
    comment: string;
    created_at: string;
};

export type CartItem = {
    id: number;
    product: Product;
    quantity: number;
};

export type WishlistItem = {
    id: number;
    product: Product;
};

export type OrderItem = {
    id: number;
    product: Product;
    quantity: number;
    price: number;
};

export type OrderStatus =
    'pending' | 'processing' | 'shipped' | 'completed' | 'cancelled';
export type PaymentStatus = 'unpaid' | 'paid' | 'refunded';

export type Order = {
    id: number;
    total_amount: number;
    shipping_address: string;
    status: OrderStatus;
    payment_status: PaymentStatus;
    items: OrderItem[];
    created_at: string;
};
