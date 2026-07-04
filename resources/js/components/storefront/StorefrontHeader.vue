<script setup lang="ts">
import { router } from '@inertiajs/vue3';
import {
    Heart,
    LogOut,
    Menu,
    Package,
    Search,
    ShoppingBag,
    ShoppingCart,
    User,
} from '@lucide/vue';
import { Link } from '@inertiajs/vue3';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from '@/components/ui/sheet';
import AppLogoIcon from '@/components/AppLogoIcon.vue';
import { useShopAuth } from '@/composables/useShopAuth';
import { useCart } from '@/composables/useCart';
import { useWishlist } from '@/composables/useWishlist';
import { useCurrentUrl } from '@/composables/useCurrentUrl';
import { getInitials } from '@/composables/useInitials';
import { categories, shopRoutes } from '@/lib/shop';
import { cn } from '@/lib/utils';

const { user, isLoggedIn, clearAuth } = useShopAuth();
const { itemCount } = useCart();
const { itemCount: wishlistCount } = useWishlist();
const { isCurrentUrl } = useCurrentUrl();

const navItems = [
    { title: 'Home', href: shopRoutes.home() },
    { title: 'Shop', href: shopRoutes.products() },
    { title: 'Wishlist', href: shopRoutes.wishlist() },
    { title: 'Orders', href: shopRoutes.orders() },
];

function logout() {
    clearAuth();
    router.visit(shopRoutes.home());
}
</script>

<template>
    <header
        class="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80"
    >
        <!-- Promo bar -->
        <div class="bg-primary text-center text-xs font-medium text-primary-foreground">
            <p class="py-2">
                Free shipping on orders over $100 · Use code
                <span class="font-bold">B11SHOP</span> for 10% off
            </p>
        </div>

        <div class="mx-auto flex h-16 max-w-7xl items-center gap-4 px-4">
            <!-- Mobile menu -->
            <div class="lg:hidden">
                <Sheet>
                    <SheetTrigger :as-child="true">
                        <Button variant="ghost" size="icon" class="-ml-2">
                            <Menu class="size-5" />
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="left" class="w-[300px] p-6">
                        <SheetHeader class="px-0 text-left">
                            <SheetTitle class="flex items-center gap-2">
                                <span
                                    class="flex size-8 items-center justify-center rounded-md bg-primary text-primary-foreground"
                                >
                                    <AppLogoIcon class="size-5 fill-current text-white dark:text-black" />
                                </span>
                                B11 Shop
                            </SheetTitle>
                        </SheetHeader>
                        <nav class="mt-6 flex flex-col gap-1">
                            <Link
                                v-for="item in navItems"
                                :key="item.title"
                                :href="item.href"
                                class="rounded-md px-3 py-2 text-sm font-medium hover:bg-accent"
                            >
                                {{ item.title }}
                            </Link>
                        </nav>
                        <p class="mt-6 mb-2 px-3 text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                            Categories
                        </p>
                        <nav class="flex flex-col gap-1">
                            <Link
                                v-for="category in categories"
                                :key="category"
                                :href="`${shopRoutes.products()}?category=${encodeURIComponent(category)}`"
                                class="rounded-md px-3 py-2 text-sm hover:bg-accent"
                            >
                                {{ category }}
                            </Link>
                        </nav>

                        <!-- Mobile auth links -->
                        <div class="mt-6 border-t pt-4">
                            <template v-if="isLoggedIn && user">
                                <p class="px-3 text-sm font-medium">{{ user.name }}</p>
                                <p class="px-3 text-xs text-muted-foreground">{{ user.email }}</p>
                                <button
                                    class="mt-3 w-full rounded-md px-3 py-2 text-left text-sm text-destructive hover:bg-accent"
                                    @click="logout"
                                >
                                    Log out
                                </button>
                            </template>
                            <template v-else>
                                <Link
                                    :href="shopRoutes.login()"
                                    class="block rounded-md px-3 py-2 text-sm font-medium hover:bg-accent"
                                >
                                    Sign in
                                </Link>
                                <Link
                                    :href="shopRoutes.register()"
                                    class="block rounded-md px-3 py-2 text-sm font-medium hover:bg-accent"
                                >
                                    Create account
                                </Link>
                            </template>
                        </div>
                    </SheetContent>
                </Sheet>
            </div>

            <!-- Logo -->
            <Link :href="shopRoutes.home()" class="flex shrink-0 items-center gap-2">
                <span class="flex size-9 items-center justify-center rounded-md bg-primary text-primary-foreground">
                    <ShoppingBag class="size-5" />
                </span>
                <span class="hidden text-lg font-bold tracking-tight sm:block">B11 Shop</span>
            </Link>

            <!-- Desktop nav -->
            <nav class="ml-4 hidden items-center gap-1 lg:flex">
                <Link
                    v-for="item in navItems"
                    :key="item.title"
                    :href="item.href"
                    :class="cn(
                        'rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground',
                        isCurrentUrl(item.href) && 'text-foreground',
                    )"
                >
                    {{ item.title }}
                </Link>
            </nav>

            <!-- Search -->
            <div class="relative ml-auto hidden max-w-sm flex-1 md:block">
                <Search class="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input type="search" placeholder="Search products..." class="pl-9" />
            </div>

            <!-- Actions -->
            <div class="flex items-center gap-1 md:ml-2">
                <Button variant="ghost" size="icon" class="md:hidden" aria-label="Search">
                    <Search class="size-5" />
                </Button>

                <Button variant="ghost" size="icon" as-child class="relative" aria-label="Wishlist">
                    <Link :href="shopRoutes.wishlist()">
                        <Heart class="size-5" />
                        <Badge
                            v-if="isLoggedIn && wishlistCount > 0"
                            class="absolute -top-1 -right-1 flex size-5 items-center justify-center rounded-full p-0 text-[10px]"
                        >
                            {{ wishlistCount > 99 ? '99+' : wishlistCount }}
                        </Badge>
                    </Link>
                </Button>

                <Button variant="ghost" size="icon" as-child class="relative" aria-label="Cart">
                    <Link :href="shopRoutes.cart()">
                        <ShoppingCart class="size-5" />
                        <Badge
                            v-if="isLoggedIn && itemCount > 0"
                            class="absolute -top-1 -right-1 flex size-5 items-center justify-center rounded-full p-0 text-[10px]"
                        >
                            {{ itemCount > 99 ? '99+' : itemCount }}
                        </Badge>
                    </Link>
                </Button>

                <!-- Logged-in user dropdown -->
                <DropdownMenu v-if="isLoggedIn && user">
                    <DropdownMenuTrigger :as-child="true">
                        <Button variant="ghost" size="icon" class="rounded-full">
                            <Avatar class="size-8">
                                <AvatarFallback class="bg-primary/10 text-xs font-semibold text-primary">
                                    {{ getInitials(user.name) }}
                                </AvatarFallback>
                            </Avatar>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" class="w-56">
                        <DropdownMenuLabel class="font-normal">
                            <p class="text-sm font-semibold">{{ user.name }}</p>
                            <p class="text-xs text-muted-foreground">{{ user.email }}</p>
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem as-child>
                            <Link :href="shopRoutes.orders()" class="flex cursor-pointer items-center gap-2">
                                <Package class="size-4" />
                                My Orders
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem as-child>
                            <Link :href="shopRoutes.wishlist()" class="flex cursor-pointer items-center gap-2">
                                <Heart class="size-4" />
                                Wishlist
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                            class="flex cursor-pointer items-center gap-2 text-destructive focus:text-destructive"
                            @click="logout"
                        >
                            <LogOut class="size-4" />
                            Log out
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>

                <!-- Guest actions -->
                <template v-else>
                    <Button variant="ghost" size="icon" as-child aria-label="Sign in">
                        <Link :href="shopRoutes.login()">
                            <User class="size-5" />
                        </Link>
                    </Button>
                    <Button as-child class="ml-1 hidden sm:flex">
                        <Link :href="shopRoutes.register()">Sign up</Link>
                    </Button>
                </template>
            </div>
        </div>
    </header>
</template>
