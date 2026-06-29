<script setup lang="ts">

</script>

<template>
    <div class="group relative flex flex-col overflow-hidden rounded-xl border border-neutral-200 bg-white transition-shadow hover:shadow-md">
    <a href="product-detail.html?id=1" class="relative block aspect-square overflow-hidden bg-neutral-100">
        <img src="https://placehold.co/400x400" alt="Classic White Sneakers" loading="lazy"
             class="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105" />
        <span class="absolute left-3 top-3 rounded-full bg-red-600 px-2 py-0.5 text-xs font-medium text-white">-20%</span>
    </a>
    <button class="absolute right-3 top-3 grid size-9 place-items-center rounded-full bg-neutral-100 opacity-0 shadow-sm transition-opacity group-hover:opacity-100"
            aria-label="Add to wishlist">
        <i data-lucide="heart" class="size-4"></i>
    </button>
    <div class="flex flex-1 flex-col p-4">
        <p class="text-xs font-medium uppercase tracking-wide text-neutral-500">Footwear</p>
        <a href="product-detail.html?id=1" class="mt-1 line-clamp-2 text-sm font-semibold hover:underline">Classic White Sneakers</a>
        <div class="mt-2 flex items-center gap-1">
            <div class="flex text-yellow-400">
                <i data-lucide="star" class="size-3.5 fill-current"></i>
                <i data-lucide="star" class="size-3.5 fill-current"></i>
                <i data-lucide="star" class="size-3.5 fill-current"></i>
                <i data-lucide="star" class="size-3.5 fill-current"></i>
                <i data-lucide="star" class="size-3.5 fill-current opacity-30"></i>
            </div>
            <span class="text-xs text-neutral-400">(128)</span>
        </div>
        <div class="mt-auto flex items-end justify-between pt-4">
            <div class="flex items-baseline gap-2">
                <span class="text-lg font-bold">৳3,200</span>
                <span class="text-sm text-neutral-400 line-through">৳4,000</span>
            </div>
            <button class="grid size-9 place-items-center rounded-md bg-neutral-900 text-white transition-colors hover:bg-neutral-800"
                    aria-label="Add to cart">
                <i data-lucide="shopping-cart" class="size-4"></i>
            </button>
        </div>
    </div>
</div>

</template>
