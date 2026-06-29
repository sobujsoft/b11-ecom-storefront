import type {
    CartItem,
    Order,
    Product,
    ProductReview,
    WishlistItem,
} from '@/types';

/**
 * Static mock data used to build out the storefront design.
 * Shapes mirror the Auth Laravel Backend API so wiring the real
 * endpoints later only means swapping the data source.
 */

export const categories = [
    'Electronics',
    'Fashion',
    'Home & Living',
    'Sports',
    'Beauty',
] as const;

export const brands = [
    'Acme',
    'Nimbus',
    'Vertex',
    'Lumen',
    'Aero',
    'Pulse',
] as const;

export const products: Product[] = [
    {
        id: 1,
        name: 'Aero Wireless Headphones',
        category: 'Electronics',
        brand: 'Aero',
        details:
            'Immersive over-ear headphones with active noise cancellation, 40h battery life, and plush memory-foam ear cups for all-day comfort.',
        price: 129.99,
        old_price: 169.99,
        latest_product: true,
        popular_product: true,
        featured: true,
        on_slider: true,
        product_image:
            'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80',
        rating: 4.6,
        reviews_count: 128,
    },
    {
        id: 2,
        name: 'Vertex Smart Watch Series 6',
        category: 'Electronics',
        brand: 'Vertex',
        details:
            'Track workouts, heart rate, and sleep with a bright always-on AMOLED display and 7-day battery life.',
        price: 199.0,
        old_price: 249.0,
        latest_product: true,
        popular_product: true,
        featured: true,
        on_slider: true,
        product_image:
            'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80',
        rating: 4.8,
        reviews_count: 96,
    },
    {
        id: 3,
        name: 'Nimbus Running Shoes',
        category: 'Sports',
        brand: 'Nimbus',
        details:
            'Lightweight breathable mesh upper with responsive cushioning engineered for long-distance comfort.',
        price: 89.5,
        latest_product: true,
        popular_product: false,
        featured: true,
        on_slider: false,
        product_image:
            'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80',
        rating: 4.4,
        reviews_count: 64,
    },
    {
        id: 4,
        name: 'Lumen Desk Lamp',
        category: 'Home & Living',
        brand: 'Lumen',
        details:
            'Adjustable LED desk lamp with 5 brightness levels, touch control, and a built-in USB charging port.',
        price: 39.99,
        old_price: 54.99,
        latest_product: false,
        popular_product: true,
        featured: false,
        on_slider: true,
        product_image:
            'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=800&q=80',
        rating: 4.2,
        reviews_count: 41,
    },
    {
        id: 5,
        name: 'Pulse Bluetooth Speaker',
        category: 'Electronics',
        brand: 'Pulse',
        details:
            'Portable waterproof speaker with deep bass, 360° sound, and 24 hours of playback on a single charge.',
        price: 59.0,
        latest_product: true,
        popular_product: true,
        featured: false,
        on_slider: false,
        product_image:
            'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?auto=format&fit=crop&w=800&q=80',
        rating: 4.5,
        reviews_count: 73,
    },
    {
        id: 6,
        name: 'Acme Leather Backpack',
        category: 'Fashion',
        brand: 'Acme',
        details:
            'Handcrafted full-grain leather backpack with a padded laptop sleeve and water-resistant lining.',
        price: 149.0,
        old_price: 189.0,
        latest_product: false,
        popular_product: true,
        featured: true,
        on_slider: true,
        product_image:
            'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&q=80',
        rating: 4.7,
        reviews_count: 52,
    },
    {
        id: 7,
        name: 'Aero Mechanical Keyboard',
        category: 'Electronics',
        brand: 'Aero',
        details:
            'Hot-swappable mechanical keyboard with per-key RGB, aluminium frame, and tactile brown switches.',
        price: 109.99,
        latest_product: true,
        popular_product: false,
        featured: false,
        on_slider: false,
        product_image:
            'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=800&q=80',
        rating: 4.6,
        reviews_count: 88,
    },
    {
        id: 8,
        name: 'Nimbus Yoga Mat',
        category: 'Sports',
        brand: 'Nimbus',
        details:
            'Extra-thick non-slip yoga mat made from eco-friendly TPE with alignment markings and a carry strap.',
        price: 34.99,
        old_price: 44.99,
        latest_product: false,
        popular_product: false,
        featured: true,
        on_slider: false,
        product_image:
            'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?auto=format&fit=crop&w=800&q=80',
        rating: 4.3,
        reviews_count: 29,
    },
    {
        id: 9,
        name: 'Lumen Scented Candle Set',
        category: 'Home & Living',
        brand: 'Lumen',
        details:
            'Set of three hand-poured soy candles with calming lavender, vanilla, and sandalwood fragrances.',
        price: 28.0,
        latest_product: true,
        popular_product: true,
        featured: false,
        on_slider: false,
        product_image:
            'https://images.unsplash.com/photo-1602874801007-bd458bb1b8b6?auto=format&fit=crop&w=800&q=80',
        rating: 4.9,
        reviews_count: 37,
    },
    {
        id: 10,
        name: 'Vertex Sunglasses',
        category: 'Fashion',
        brand: 'Vertex',
        details:
            'Polarized UV400 sunglasses with a lightweight acetate frame and scratch-resistant lenses.',
        price: 74.5,
        old_price: 99.0,
        latest_product: false,
        popular_product: true,
        featured: true,
        on_slider: false,
        product_image:
            'https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&w=800&q=80',
        rating: 4.1,
        reviews_count: 45,
    },
    {
        id: 11,
        name: 'Pulse Fitness Tracker',
        category: 'Sports',
        brand: 'Pulse',
        details:
            'Slim fitness band with SpO2 monitoring, 14-day battery, and 20+ sport modes.',
        price: 49.99,
        latest_product: true,
        popular_product: false,
        featured: false,
        on_slider: false,
        product_image:
            'https://images.unsplash.com/photo-1576243345690-4e4b79b63288?auto=format&fit=crop&w=800&q=80',
        rating: 4.0,
        reviews_count: 33,
    },
    {
        id: 12,
        name: 'Acme Ceramic Cookware Set',
        category: 'Home & Living',
        brand: 'Acme',
        details:
            'Non-stick ceramic-coated cookware set of 8 pieces, oven-safe and free of PFOA and lead.',
        price: 159.0,
        old_price: 219.0,
        latest_product: false,
        popular_product: true,
        featured: true,
        on_slider: true,
        product_image:
            'https://images.unsplash.com/photo-1584990347449-a2d4c2c9b2d8?auto=format&fit=crop&w=800&q=80',
        rating: 4.5,
        reviews_count: 61,
    },
];

export const reviews: ProductReview[] = [
    {
        id: 1,
        product_id: 1,
        user: { id: 2, name: 'Sarah Johnson' },
        rating: 5,
        comment:
            'Sound quality is incredible and the noise cancellation is a game changer on flights. Worth every penny.',
        created_at: '2026-05-12T09:24:00Z',
    },
    {
        id: 2,
        product_id: 1,
        user: { id: 3, name: 'Michael Chen' },
        rating: 4,
        comment:
            'Very comfortable for long sessions. Battery lasts forever. Wish the case was a bit smaller.',
        created_at: '2026-05-28T16:10:00Z',
    },
    {
        id: 3,
        product_id: 1,
        user: { id: 4, name: 'Aisha Rahman' },
        rating: 5,
        comment: 'Best headphones I have owned. The fit is perfect.',
        created_at: '2026-06-03T11:45:00Z',
    },
];

export const cartItems: CartItem[] = [
    { id: 1, product: products[0], quantity: 1 },
    { id: 2, product: products[3], quantity: 2 },
    { id: 3, product: products[8], quantity: 1 },
];

export const wishlistItems: WishlistItem[] = [
    { id: 1, product: products[1] },
    { id: 2, product: products[5] },
    { id: 3, product: products[9] },
    { id: 4, product: products[11] },
];

export const orders: Order[] = [
    {
        id: 1024,
        total_amount: 318.98,
        shipping_address: '123 Main St, Dhaka 1207, Bangladesh',
        status: 'processing',
        payment_status: 'paid',
        created_at: '2026-06-20T14:30:00Z',
        items: [
            { id: 1, product: products[0], quantity: 1, price: 129.99 },
            { id: 2, product: products[1], quantity: 1, price: 199.0 },
        ],
    },
    {
        id: 1019,
        total_amount: 89.5,
        shipping_address: '88 Lake Road, Chattogram 4000, Bangladesh',
        status: 'shipped',
        payment_status: 'paid',
        created_at: '2026-06-11T10:05:00Z',
        items: [{ id: 3, product: products[2], quantity: 1, price: 89.5 }],
    },
    {
        id: 1007,
        total_amount: 67.99,
        shipping_address: '12 Garden Ave, Sylhet 3100, Bangladesh',
        status: 'completed',
        payment_status: 'paid',
        created_at: '2026-05-29T18:42:00Z',
        items: [{ id: 4, product: products[8], quantity: 1, price: 28.0 }],
    },
    {
        id: 1001,
        total_amount: 49.99,
        shipping_address: '5 Hill View, Rajshahi 6000, Bangladesh',
        status: 'cancelled',
        payment_status: 'refunded',
        created_at: '2026-05-15T08:15:00Z',
        items: [{ id: 5, product: products[10], quantity: 1, price: 49.99 }],
    },
];

/**
 * Plain path helpers for storefront links. Kept as strings so the design
 * works without backend route generation; swap for Wayfinder helpers later.
 */
export const shopRoutes = {
    home: () => '/',
    products: () => '/products',
    product: (id: number) => `/products/${id}`,
    cart: () => '/cart',
    wishlist: () => '/wishlist',
    checkout: () => '/checkout',
    orders: () => '/orders',
    order: (id: number) => `/orders/${id}`,
    login: () => '/account/login',
    register: () => '/account/register',
};

export function formatPrice(value: number): string {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
    }).format(value);
}

export function findProduct(id: number): Product | undefined {
    return products.find((product) => product.id === id);
}

export function reviewsFor(productId: number): ProductReview[] {
    return reviews.filter((review) => review.product_id === productId);
}

export const cartTotal = cartItems.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0,
);
