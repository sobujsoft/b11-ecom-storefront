<script setup lang="ts">
import { Head } from '@inertiajs/vue3';
import { SlidersHorizontal, X } from '@lucide/vue';
import { computed, onMounted, ref, watch } from 'vue';
import ProductCard from '@/components/storefront/ProductCard.vue';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from '@/components/ui/sheet';
import { Skeleton } from '@/components/ui/skeleton';
import { apiFetch } from '@/lib/api';
import type { Product } from '@/types';

type SortKey = 'featured' | 'price-asc' | 'price-desc' | 'rating' | 'newest';

// ── API state ────────────────────────────────────────────────────────────────
const allProducts = ref<Product[]>([]);
const loading = ref(true);
const error = ref<string | null>(null);

onMounted(async () => {
    try {
        const data = await apiFetch<Product[]>('/products');
        allProducts.value = data;
        // initialise price ceiling once data arrives
        maxPrice.value = priceMax.value;
    } catch (e) {
        error.value = e instanceof Error ? e.message : 'Failed to load products';
    } finally {
        loading.value = false;
    }
});

// ── Derived filter options from real data ─────────────────────────────────────
const categories = computed(() => [
    ...new Set(allProducts.value.map((p) => p.category).filter(Boolean)),
].sort());

const brands = computed(() => [
    ...new Set(allProducts.value.map((p) => p.brand).filter(Boolean)),
].sort());

const priceMax = computed(() =>
    allProducts.value.length
        ? Math.ceil(Math.max(...allProducts.value.map((p) => p.price)))
        : 500,
);

// ── Filter/sort state ─────────────────────────────────────────────────────────
const params = new URLSearchParams(
    typeof window !== 'undefined' ? window.location.search : '',
);

const selectedCategories = ref<string[]>(
    params.get('category') ? [params.get('category') as string] : [],
);
const selectedBrands = ref<string[]>([]);
const onlyLatest = ref(params.get('filter') === 'latest');
const sort = ref<SortKey>('featured');
const maxPrice = ref(500);

// keep slider in sync if priceMax changes after load
watch(priceMax, (val) => {
    if (maxPrice.value > val) maxPrice.value = val;
});

function toggle(list: string[], value: string): string[] {
    return list.includes(value)
        ? list.filter((item) => item !== value)
        : [...list, value];
}

// ── Client-side filtering + sorting ──────────────────────────────────────────
const filtered = computed(() => {
    let result = allProducts.value.filter((product) => {
        if (
            selectedCategories.value.length &&
            !selectedCategories.value.includes(product.category)
        ) return false;

        if (
            selectedBrands.value.length &&
            !selectedBrands.value.includes(product.brand)
        ) return false;

        if (onlyLatest.value && !product.latest_product) return false;

        if (product.price > maxPrice.value) return false;

        return true;
    });

    return [...result].sort((a, b) => {
        switch (sort.value) {
            case 'price-asc':
                return a.price - b.price;
            case 'price-desc':
                return b.price - a.price;
            case 'rating':
                return (b.rating ?? 0) - (a.rating ?? 0);
            case 'newest':
                return Number(b.latest_product) - Number(a.latest_product);
            default:
                return Number(b.featured) - Number(a.featured);
        }
    });
});

const activeFilterCount = computed(
    () =>
        selectedCategories.value.length +
        selectedBrands.value.length +
        (onlyLatest.value ? 1 : 0),
);

function clearFilters() {
    selectedCategories.value = [];
    selectedBrands.value = [];
    onlyLatest.value = false;
    maxPrice.value = priceMax.value;
}
</script>

<template>
    <Head title="Shop" />

    <div class="mx-auto max-w-7xl px-4 py-8">
        <!-- Page heading -->
        <div class="mb-6">
            <h1 class="text-3xl font-bold tracking-tight">All Products</h1>
            <p class="mt-1 text-sm text-muted-foreground">
                <template v-if="loading">Loading products…</template>
                <template v-else-if="error">{{ error }}</template>
                <template v-else>{{ filtered.length }} products available</template>
            </p>
        </div>

        <div class="flex gap-8">
            <!-- Sidebar filters (desktop) -->
            <aside class="hidden w-64 shrink-0 lg:block">
                <div class="sticky top-24 space-y-6">
                    <div class="flex items-center justify-between">
                        <h2 class="font-semibold">Filters</h2>
                        <Button
                            v-if="activeFilterCount"
                            variant="ghost"
                            size="sm"
                            class="h-auto p-0 text-xs text-muted-foreground"
                            @click="clearFilters"
                        >
                            Clear all
                        </Button>
                    </div>

                    <!-- Category -->
                    <div>
                        <h3 class="mb-3 text-sm font-medium">Category</h3>
                        <template v-if="loading">
                            <div class="space-y-2.5">
                                <Skeleton v-for="n in 5" :key="n" class="h-5 w-32 rounded" />
                            </div>
                        </template>
                        <div v-else class="space-y-2.5">
                            <div
                                v-for="category in categories"
                                :key="category"
                                class="flex items-center gap-2"
                            >
                                <Checkbox
                                    :id="`cat-${category}`"
                                    :model-value="selectedCategories.includes(category)"
                                    @update:model-value="selectedCategories = toggle(selectedCategories, category)"
                                />
                                <Label
                                    :for="`cat-${category}`"
                                    class="text-sm font-normal text-muted-foreground"
                                >{{ category }}</Label>
                            </div>
                        </div>
                    </div>

                    <!-- Brand -->
                    <div>
                        <h3 class="mb-3 text-sm font-medium">Brand</h3>
                        <template v-if="loading">
                            <div class="space-y-2.5">
                                <Skeleton v-for="n in 5" :key="n" class="h-5 w-28 rounded" />
                            </div>
                        </template>
                        <div v-else class="space-y-2.5">
                            <div
                                v-for="brand in brands"
                                :key="brand"
                                class="flex items-center gap-2"
                            >
                                <Checkbox
                                    :id="`brand-${brand}`"
                                    :model-value="selectedBrands.includes(brand)"
                                    @update:model-value="selectedBrands = toggle(selectedBrands, brand)"
                                />
                                <Label
                                    :for="`brand-${brand}`"
                                    class="text-sm font-normal text-muted-foreground"
                                >{{ brand }}</Label>
                            </div>
                        </div>
                    </div>

                    <!-- Price -->
                    <div>
                        <h3 class="mb-3 text-sm font-medium">
                            Max price: ${{ maxPrice }}
                        </h3>
                        <input
                            v-model.number="maxPrice"
                            type="range"
                            min="0"
                            :max="priceMax"
                            step="5"
                            :disabled="loading"
                            class="w-full accent-primary disabled:opacity-50"
                        />
                    </div>

                    <!-- New only -->
                    <div class="flex items-center gap-2">
                        <Checkbox id="latest" v-model="onlyLatest" :disabled="loading" />
                        <Label
                            for="latest"
                            class="text-sm font-normal text-muted-foreground"
                        >New arrivals only</Label>
                    </div>
                </div>
            </aside>

            <!-- Product grid -->
            <div class="flex-1">
                <!-- Toolbar -->
                <div class="mb-6 flex items-center justify-between gap-3 border-b pb-4">
                    <!-- Mobile filter trigger -->
                    <Sheet>
                        <SheetTrigger :as-child="true">
                            <Button variant="outline" size="sm" class="lg:hidden">
                                <SlidersHorizontal class="size-4" />
                                Filters
                                <Badge
                                    v-if="activeFilterCount"
                                    class="ml-1 size-5 rounded-full p-0"
                                >
                                    {{ activeFilterCount }}
                                </Badge>
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="left" class="w-[300px] overflow-y-auto p-6">
                            <SheetHeader class="px-0 text-left">
                                <SheetTitle>Filters</SheetTitle>
                            </SheetHeader>
                            <div class="mt-4 space-y-6">
                                <div>
                                    <h3 class="mb-3 text-sm font-medium">Category</h3>
                                    <div class="space-y-2.5">
                                        <div
                                            v-for="category in categories"
                                            :key="category"
                                            class="flex items-center gap-2"
                                        >
                                            <Checkbox
                                                :id="`m-cat-${category}`"
                                                :model-value="selectedCategories.includes(category)"
                                                @update:model-value="selectedCategories = toggle(selectedCategories, category)"
                                            />
                                            <Label
                                                :for="`m-cat-${category}`"
                                                class="text-sm font-normal text-muted-foreground"
                                            >{{ category }}</Label>
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <h3 class="mb-3 text-sm font-medium">Brand</h3>
                                    <div class="space-y-2.5">
                                        <div
                                            v-for="brand in brands"
                                            :key="brand"
                                            class="flex items-center gap-2"
                                        >
                                            <Checkbox
                                                :id="`m-brand-${brand}`"
                                                :model-value="selectedBrands.includes(brand)"
                                                @update:model-value="selectedBrands = toggle(selectedBrands, brand)"
                                            />
                                            <Label
                                                :for="`m-brand-${brand}`"
                                                class="text-sm font-normal text-muted-foreground"
                                            >{{ brand }}</Label>
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <h3 class="mb-3 text-sm font-medium">
                                        Max price: ${{ maxPrice }}
                                    </h3>
                                    <input
                                        v-model.number="maxPrice"
                                        type="range"
                                        min="0"
                                        :max="priceMax"
                                        step="5"
                                        class="w-full accent-primary"
                                    />
                                </div>
                                <div class="flex items-center gap-2">
                                    <Checkbox id="m-latest" v-model="onlyLatest" />
                                    <Label
                                        for="m-latest"
                                        class="text-sm font-normal text-muted-foreground"
                                    >New arrivals only</Label>
                                </div>
                                <Button variant="outline" class="w-full" @click="clearFilters">
                                    Clear all
                                </Button>
                            </div>
                        </SheetContent>
                    </Sheet>

                    <Select v-model="sort">
                        <SelectTrigger class="w-[180px]">
                            <SelectValue placeholder="Sort by" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="featured">Featured</SelectItem>
                            <SelectItem value="newest">Newest</SelectItem>
                            <SelectItem value="price-asc">Price: Low to High</SelectItem>
                            <SelectItem value="price-desc">Price: High to Low</SelectItem>
                            <SelectItem value="rating">Top Rated</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <!-- Active filter chips -->
                <div v-if="activeFilterCount" class="mb-4 flex flex-wrap gap-2">
                    <Badge
                        v-for="category in selectedCategories"
                        :key="`chip-${category}`"
                        variant="secondary"
                        class="cursor-pointer gap-1"
                        @click="selectedCategories = toggle(selectedCategories, category)"
                    >
                        {{ category }} <X class="size-3" />
                    </Badge>
                    <Badge
                        v-for="brand in selectedBrands"
                        :key="`chipb-${brand}`"
                        variant="secondary"
                        class="cursor-pointer gap-1"
                        @click="selectedBrands = toggle(selectedBrands, brand)"
                    >
                        {{ brand }} <X class="size-3" />
                    </Badge>
                    <Badge
                        v-if="onlyLatest"
                        variant="secondary"
                        class="cursor-pointer gap-1"
                        @click="onlyLatest = false"
                    >
                        New arrivals only <X class="size-3" />
                    </Badge>
                </div>

                <!-- Skeleton grid -->
                <div v-if="loading" class="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-4">
                    <Skeleton v-for="n in 12" :key="n" class="aspect-[3/4] rounded-xl" />
                </div>

                <!-- Error state -->
                <div
                    v-else-if="error"
                    class="flex flex-col items-center justify-center rounded-xl border border-dashed py-20 text-center"
                >
                    <p class="font-medium text-destructive">{{ error }}</p>
                    <p class="mt-1 text-sm text-muted-foreground">
                        Make sure the backend server is running.
                    </p>
                </div>

                <!-- Results -->
                <div
                    v-else-if="filtered.length"
                    class="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-4"
                >
                    <ProductCard
                        v-for="product in filtered"
                        :key="product.id"
                        :product="product"
                    />
                </div>

                <!-- Empty state -->
                <div
                    v-else
                    class="flex flex-col items-center justify-center rounded-xl border border-dashed py-20 text-center"
                >
                    <p class="font-medium">No products match your filters</p>
                    <p class="mt-1 text-sm text-muted-foreground">
                        Try adjusting or clearing your filters.
                    </p>
                    <Button class="mt-4" variant="outline" @click="clearFilters">
                        Clear filters
                    </Button>
                </div>
            </div>
        </div>
    </div>
</template>
