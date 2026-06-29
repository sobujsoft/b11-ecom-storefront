<script setup lang="ts">
import { Head, Link } from '@inertiajs/vue3';
import {
    Check,
    ChevronRight,
    Heart,
    Minus,
    Plus,
    RotateCcw,
    ShoppingCart,
    Star,
    Truck,
} from '@lucide/vue';
import { computed, onMounted, ref } from 'vue';
import ProductCard from '@/components/storefront/ProductCard.vue';
import ProductRating from '@/components/storefront/ProductRating.vue';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { getInitials } from '@/composables/useInitials';
import { apiFetch } from '@/lib/api';
import { formatPrice, shopRoutes } from '@/lib/shop';
import { cn } from '@/lib/utils';
import type { Product, ProductReview } from '@/types';

// ── Product ID from URL ───────────────────────────────────────────────────────
const productId = computed(() => {
    const path = typeof window !== 'undefined' ? window.location.pathname : '/products/1';
    return Number(path.split('/').filter(Boolean).pop());
});

// ── API state ─────────────────────────────────────────────────────────────────
const product = ref<Product | null>(null);
const reviews = ref<ProductReview[]>([]);
const related = ref<Product[]>([]);
const loading = ref(true);
const error = ref<string | null>(null);

onMounted(async () => {
    try {
        const [prod, allReviews, allProducts] = await Promise.all([
            apiFetch<Product>(`/products/${productId.value}`),
            apiFetch<ProductReview[]>('/product-reviews'),
            apiFetch<Product[]>('/products'),
        ]);
        product.value = prod;
        reviews.value = allReviews.filter((r) => r.product_id === prod.id);
        related.value = allProducts
            .filter((p) => p.category === prod.category && p.id !== prod.id)
            .slice(0, 4);
    } catch (e) {
        error.value = e instanceof Error ? e.message : 'Failed to load product';
    } finally {
        loading.value = false;
    }
});

// ── Computed from real reviews ────────────────────────────────────────────────
const avgRating = computed(() => {
    if (!reviews.value.length) return 0;
    return reviews.value.reduce((sum, r) => sum + r.rating, 0) / reviews.value.length;
});

// ── UI state ──────────────────────────────────────────────────────────────────
const quantity = ref(1);
const activeTab = ref<'details' | 'reviews'>('details');

function inc() { quantity.value++; }
function dec() { if (quantity.value > 1) quantity.value--; }

// ── Review submission ─────────────────────────────────────────────────────────
const newRating = ref(5);
const newComment = ref('');
const submitLoading = ref(false);
const submitError = ref<string | null>(null);
const submitSuccess = ref(false);

async function submitReview() {
    if (!product.value) return;
    const token = localStorage.getItem('auth_token');
    if (!token) {
        submitError.value = 'Please log in to submit a review.';
        return;
    }
    submitLoading.value = true;
    submitError.value = null;
    submitSuccess.value = false;
    try {
        const review = await apiFetch<ProductReview>('/product-reviews', {
            method: 'POST',
            token,
            body: JSON.stringify({
                product_id: product.value.id,
                rating: newRating.value,
                comment: newComment.value,
            }),
        });
        reviews.value.push(review);
        submitSuccess.value = true;
        newComment.value = '';
        newRating.value = 5;
    } catch (e) {
        submitError.value = e instanceof Error ? e.message : 'Failed to submit review.';
    } finally {
        submitLoading.value = false;
    }
}
</script>

<template>
    <Head :title="product?.name ?? 'Product'" />

    <div class="mx-auto max-w-7xl px-4 py-8">
        <!-- Breadcrumbs -->
        <nav class="mb-6 flex items-center gap-1 text-sm text-muted-foreground">
            <Link :href="shopRoutes.home()" class="hover:text-foreground">Home</Link>
            <ChevronRight class="size-4" />
            <Link :href="shopRoutes.products()" class="hover:text-foreground">Shop</Link>
            <ChevronRight class="size-4" />
            <Skeleton v-if="loading" class="h-4 w-32 rounded" />
            <span v-else class="text-foreground">{{ product?.name }}</span>
        </nav>

        <!-- Error state -->
        <div
            v-if="error"
            class="flex flex-col items-center justify-center rounded-xl border border-dashed py-20 text-center"
        >
            <p class="font-medium text-destructive">{{ error }}</p>
            <p class="mt-1 text-sm text-muted-foreground">Make sure the backend server is running.</p>
            <Button class="mt-4" variant="outline" as-child>
                <Link :href="shopRoutes.products()">Back to shop</Link>
            </Button>
        </div>

        <template v-else>
            <div class="grid gap-10 lg:grid-cols-2">
                <!-- Gallery -->
                <div class="flex flex-col gap-4">
                    <div class="aspect-square overflow-hidden rounded-2xl border bg-muted">
                        <Skeleton v-if="loading" class="h-full w-full" />
                        <img
                            v-else-if="product"
                            :src="product.product_image"
                            :alt="product.name"
                            class="h-full w-full object-cover"
                        />
                    </div>
                </div>

                <!-- Info -->
                <div>
                    <template v-if="loading">
                        <Skeleton class="h-6 w-24 rounded" />
                        <Skeleton class="mt-3 h-9 w-3/4 rounded" />
                        <Skeleton class="mt-3 h-5 w-40 rounded" />
                        <Skeleton class="mt-6 h-10 w-32 rounded" />
                        <Skeleton class="mt-5 h-20 w-full rounded" />
                    </template>

                    <template v-else-if="product">
                        <div class="flex items-center gap-2">
                            <Badge variant="secondary">{{ product.category }}</Badge>
                            <span class="text-sm text-muted-foreground">by {{ product.brand }}</span>
                        </div>
                        <h1 class="mt-3 text-3xl font-bold tracking-tight">{{ product.name }}</h1>

                        <div class="mt-3 flex items-center gap-3">
                            <ProductRating
                                :rating="avgRating"
                                :count="reviews.length"
                                size="md"
                            />
                        </div>

                        <div class="mt-6 flex items-baseline gap-3">
                            <span class="text-3xl font-bold">{{ formatPrice(product.price) }}</span>
                            <span
                                v-if="product.old_price"
                                class="text-lg text-muted-foreground line-through"
                            >{{ formatPrice(product.old_price) }}</span>
                            <Badge v-if="product.old_price" variant="destructive">
                                Save {{ formatPrice(product.old_price - product.price) }}
                            </Badge>
                        </div>

                        <p class="mt-5 text-muted-foreground">{{ product.details }}</p>

                        <div class="mt-4 flex items-center gap-2 text-sm text-green-600">
                            <Check class="size-4" />
                            In stock and ready to ship
                        </div>

                        <Separator class="my-6" />

                        <!-- Quantity + actions -->
                        <div class="flex flex-wrap items-center gap-4">
                            <div class="flex items-center rounded-lg border">
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    class="rounded-r-none"
                                    aria-label="Decrease quantity"
                                    @click="dec"
                                >
                                    <Minus class="size-4" />
                                </Button>
                                <span class="w-12 text-center text-sm font-medium">{{ quantity }}</span>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    class="rounded-l-none"
                                    aria-label="Increase quantity"
                                    @click="inc"
                                >
                                    <Plus class="size-4" />
                                </Button>
                            </div>
                            <Button size="lg" class="flex-1">
                                <ShoppingCart class="size-4" />
                                Add to Cart
                            </Button>
                            <Button size="lg" variant="outline" aria-label="Add to wishlist">
                                <Heart class="size-4" />
                            </Button>
                        </div>

                        <!-- Shipping perks -->
                        <div class="mt-6 grid gap-3 rounded-xl border p-4 sm:grid-cols-2">
                            <div class="flex items-center gap-3">
                                <Truck class="size-5 text-muted-foreground" />
                                <div>
                                    <p class="text-sm font-medium">Free shipping</p>
                                    <p class="text-xs text-muted-foreground">On orders over $100</p>
                                </div>
                            </div>
                            <div class="flex items-center gap-3">
                                <RotateCcw class="size-5 text-muted-foreground" />
                                <div>
                                    <p class="text-sm font-medium">30-day returns</p>
                                    <p class="text-xs text-muted-foreground">Money-back guarantee</p>
                                </div>
                            </div>
                        </div>
                    </template>
                </div>
            </div>

            <!-- Tabs -->
            <div class="mt-14">
                <div class="flex gap-6 border-b">
                    <button
                        type="button"
                        :class="cn(
                            '-mb-px border-b-2 px-1 pb-3 text-sm font-medium transition-colors',
                            activeTab === 'details'
                                ? 'border-primary text-foreground'
                                : 'border-transparent text-muted-foreground hover:text-foreground',
                        )"
                        @click="activeTab = 'details'"
                    >
                        Description
                    </button>
                    <button
                        type="button"
                        :class="cn(
                            '-mb-px border-b-2 px-1 pb-3 text-sm font-medium transition-colors',
                            activeTab === 'reviews'
                                ? 'border-primary text-foreground'
                                : 'border-transparent text-muted-foreground hover:text-foreground',
                        )"
                        @click="activeTab = 'reviews'"
                    >
                        Reviews ({{ reviews.length }})
                    </button>
                </div>

                <!-- Description tab -->
                <div v-if="activeTab === 'details'" class="max-w-3xl py-6">
                    <Skeleton v-if="loading" class="h-20 w-full rounded" />
                    <template v-else-if="product">
                        <p class="text-muted-foreground">{{ product.details }}</p>
                        <ul class="mt-4 space-y-2 text-sm text-muted-foreground">
                            <li class="flex items-center gap-2">
                                <Check class="size-4 text-foreground" />
                                Premium build quality and materials
                            </li>
                            <li class="flex items-center gap-2">
                                <Check class="size-4 text-foreground" />
                                Backed by a 12-month manufacturer warranty
                            </li>
                            <li class="flex items-center gap-2">
                                <Check class="size-4 text-foreground" />
                                Brand: {{ product.brand }} · Category: {{ product.category }}
                            </li>
                        </ul>
                    </template>
                </div>

                <!-- Reviews tab -->
                <div v-else class="grid gap-10 py-6 lg:grid-cols-3">
                    <div class="lg:col-span-2">
                        <template v-if="loading">
                            <div class="space-y-6">
                                <div v-for="n in 3" :key="n" class="flex gap-4">
                                    <Skeleton class="size-10 shrink-0 rounded-full" />
                                    <div class="flex-1 space-y-2">
                                        <Skeleton class="h-4 w-32 rounded" />
                                        <Skeleton class="h-4 w-24 rounded" />
                                        <Skeleton class="h-12 w-full rounded" />
                                    </div>
                                </div>
                            </div>
                        </template>
                        <div v-else-if="reviews.length" class="space-y-6">
                            <div v-for="review in reviews" :key="review.id" class="flex gap-4">
                                <div
                                    class="flex size-10 shrink-0 items-center justify-center rounded-full bg-muted text-sm font-semibold"
                                >
                                    {{ getInitials(review.user.name) }}
                                </div>
                                <div class="flex-1">
                                    <div class="flex items-center justify-between">
                                        <p class="text-sm font-semibold">{{ review.user.name }}</p>
                                        <p class="text-xs text-muted-foreground">
                                            {{ new Date(review.created_at).toLocaleDateString() }}
                                        </p>
                                    </div>
                                    <ProductRating :rating="review.rating" :show-count="false" class="mt-1" />
                                    <p class="mt-2 text-sm text-muted-foreground">{{ review.comment }}</p>
                                </div>
                            </div>
                        </div>
                        <p v-else class="text-sm text-muted-foreground">
                            No reviews yet. Be the first to review this product.
                        </p>
                    </div>

                    <!-- Write a review -->
                    <div class="rounded-xl border p-5">
                        <h3 class="font-semibold">Write a review</h3>
                        <p class="mt-1 text-xs text-muted-foreground">
                            Share your experience with this product
                        </p>

                        <div
                            v-if="submitSuccess"
                            class="mt-4 rounded-lg bg-green-50 p-3 text-sm text-green-700"
                        >
                            Review submitted successfully!
                        </div>

                        <div
                            v-if="submitError"
                            class="mt-4 rounded-lg bg-destructive/10 p-3 text-sm text-destructive"
                        >
                            {{ submitError }}
                        </div>

                        <form class="mt-4 space-y-4" @submit.prevent="submitReview">
                            <div>
                                <p class="mb-1.5 text-sm font-medium">Rating</p>
                                <div class="flex gap-1">
                                    <button
                                        v-for="n in 5"
                                        :key="n"
                                        type="button"
                                        aria-label="Set rating"
                                        @click="newRating = n"
                                    >
                                        <Star
                                            :class="cn(
                                                'size-6 transition-colors',
                                                n <= newRating
                                                    ? 'fill-amber-400 text-amber-400'
                                                    : 'fill-muted text-muted-foreground/40',
                                            )"
                                        />
                                    </button>
                                </div>
                            </div>
                            <div>
                                <p class="mb-1.5 text-sm font-medium">Comment</p>
                                <textarea
                                    v-model="newComment"
                                    rows="4"
                                    placeholder="What did you like or dislike?"
                                    class="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
                                />
                            </div>
                            <Button type="submit" class="w-full" :disabled="submitLoading">
                                {{ submitLoading ? 'Submitting…' : 'Submit Review' }}
                            </Button>
                        </form>
                    </div>
                </div>
            </div>

            <!-- Related products -->
            <div class="mt-14">
                <h2 class="mb-6 text-2xl font-bold tracking-tight">You may also like</h2>
                <div class="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
                    <template v-if="loading">
                        <Skeleton v-for="n in 4" :key="n" class="aspect-[3/4] rounded-xl" />
                    </template>
                    <ProductCard
                        v-else
                        v-for="item in related"
                        :key="item.id"
                        :product="item"
                    />
                </div>
                <p
                    v-if="!loading && !related.length"
                    class="text-sm text-muted-foreground"
                >
                    No related products found.
                </p>
            </div>
        </template>
    </div>
</template>
