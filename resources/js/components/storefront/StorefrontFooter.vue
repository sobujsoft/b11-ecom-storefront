<script setup lang="ts">
import { Link } from '@inertiajs/vue3';
import { AtSign, MessageCircle, Send, Share2, ShoppingBag } from '@lucide/vue';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { categories, shopRoutes } from '@/lib/shop';

const year = new Date().getFullYear();

const shopLinks = [
    { title: 'All Products', href: shopRoutes.products() },
    { title: 'Wishlist', href: shopRoutes.wishlist() },
    { title: 'Cart', href: shopRoutes.cart() },
    { title: 'My Orders', href: shopRoutes.orders() },
];

const companyLinks = ['About Us', 'Careers', 'Contact', 'Blog'];
const socials = [Share2, AtSign, MessageCircle, Send];
</script>

<template>
    <footer class="mt-16 border-t bg-muted/30">
        <div class="mx-auto max-w-7xl px-4 py-12">
            <div class="grid gap-10 sm:grid-cols-2 lg:grid-cols-5">
                <div class="lg:col-span-2">
                    <Link
                        :href="shopRoutes.home()"
                        class="flex items-center gap-2"
                    >
                        <span
                            class="flex size-9 items-center justify-center rounded-md bg-primary text-primary-foreground"
                        >
                            <ShoppingBag class="size-5" />
                        </span>
                        <span class="text-lg font-bold">B11 Shop</span>
                    </Link>
                    <p class="mt-4 max-w-xs text-sm text-muted-foreground">
                        Your one-stop shop for electronics, fashion, and
                        lifestyle essentials — curated quality at fair prices.
                    </p>
                    <form class="mt-5 flex max-w-sm gap-2" @submit.prevent>
                        <Input type="email" placeholder="Enter your email" />
                        <Button type="submit">Subscribe</Button>
                    </form>
                </div>

                <div>
                    <h3 class="text-sm font-semibold">Shop</h3>
                    <ul class="mt-4 space-y-3 text-sm text-muted-foreground">
                        <li v-for="link in shopLinks" :key="link.title">
                            <Link
                                :href="link.href"
                                class="hover:text-foreground"
                                >{{ link.title }}</Link
                            >
                        </li>
                    </ul>
                </div>

                <div>
                    <h3 class="text-sm font-semibold">Categories</h3>
                    <ul class="mt-4 space-y-3 text-sm text-muted-foreground">
                        <li v-for="category in categories" :key="category">
                            <Link
                                :href="`${shopRoutes.products()}?category=${encodeURIComponent(category)}`"
                                class="hover:text-foreground"
                                >{{ category }}</Link
                            >
                        </li>
                    </ul>
                </div>

                <div>
                    <h3 class="text-sm font-semibold">Company</h3>
                    <ul class="mt-4 space-y-3 text-sm text-muted-foreground">
                        <li v-for="link in companyLinks" :key="link">
                            <a href="#" class="hover:text-foreground">{{
                                link
                            }}</a>
                        </li>
                    </ul>
                </div>
            </div>

            <div
                class="mt-10 flex flex-col items-center justify-between gap-4 border-t pt-6 sm:flex-row"
            >
                <p class="text-sm text-muted-foreground">
                    © {{ year }} B11 Shop. All rights reserved.
                </p>
                <div class="flex items-center gap-1">
                    <Button
                        v-for="(icon, index) in socials"
                        :key="index"
                        variant="ghost"
                        size="icon"
                        as-child
                    >
                        <a href="#" aria-label="Social link">
                            <component :is="icon" class="size-4" />
                        </a>
                    </Button>
                </div>
            </div>
        </div>
    </footer>
</template>
