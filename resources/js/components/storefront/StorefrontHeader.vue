<script setup lang="ts">
import { Link, usePage } from '@inertiajs/vue3';
import {
    Heart,
    Menu,
    Search,
    ShoppingBag,
    ShoppingCart,
    User,
} from '@lucide/vue';
import { computed } from 'vue';
import AppLogoIcon from '@/components/AppLogoIcon.vue';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
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
import UserMenuContent from '@/components/UserMenuContent.vue';
import { useCurrentUrl } from '@/composables/useCurrentUrl';
import { getInitials } from '@/composables/useInitials';
import { cartItems, categories, shopRoutes, wishlistItems } from '@/lib/shop';
import { cn } from '@/lib/utils';
import { login, register } from '@/routes';

const page = usePage();
const auth = computed(() => page.props.auth);
const { isCurrentUrl } = useCurrentUrl();

const navItems = [
    { title: 'Home', href: shopRoutes.home() },
    { title: 'Shop', href: shopRoutes.products() },
    { title: 'Wishlist', href: shopRoutes.wishlist() },
    { title: 'Orders', href: shopRoutes.orders() },
];

const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
const wishlistCount = wishlistItems.length;
</script>

<template>
    <header
        class="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80"
    >
        <!-- Promo bar -->
        <div
            class="bg-primary text-center text-xs font-medium text-primary-foreground"
        >
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
                                    <AppLogoIcon
                                        class="size-5 fill-current text-white dark:text-black"
                                    />
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
                        <p
                            class="mt-6 mb-2 px-3 text-xs font-semibold tracking-wide text-muted-foreground uppercase"
                        >
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
                    </SheetContent>
                </Sheet>
            </div>

            <!-- Logo -->
            <Link
                :href="shopRoutes.home()"
                class="flex shrink-0 items-center gap-2"
            >
                <span
                    class="flex size-9 items-center justify-center rounded-md bg-primary text-primary-foreground"
                >
                    <ShoppingBag class="size-5" />
                </span>
                <span class="hidden text-lg font-bold tracking-tight sm:block"
                    >B11 Shop</span
                >
            </Link>

            <!-- Desktop nav -->
            <nav class="ml-4 hidden items-center gap-1 lg:flex">
                <Link
                    v-for="item in navItems"
                    :key="item.title"
                    :href="item.href"
                    :class="
                        cn(
                            'rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground',
                            isCurrentUrl(item.href) && 'text-foreground',
                        )
                    "
                >
                    {{ item.title }}
                </Link>
            </nav>

            <!-- Search -->
            <div class="relative ml-auto hidden max-w-sm flex-1 md:block">
                <Search
                    class="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
                />
                <Input
                    type="search"
                    placeholder="Search products..."
                    class="pl-9"
                />
            </div>

            <!-- Actions -->
            <div class="flex items-center gap-1 md:ml-2">
                <Button
                    variant="ghost"
                    size="icon"
                    class="md:hidden"
                    aria-label="Search"
                >
                    <Search class="size-5" />
                </Button>

                <Button
                    variant="ghost"
                    size="icon"
                    as-child
                    class="relative"
                    aria-label="Wishlist"
                >
                    <Link :href="shopRoutes.wishlist()">
                        <Heart class="size-5" />
                        <Badge
                            v-if="wishlistCount"
                            class="absolute -top-0.5 -right-0.5 size-4 rounded-full p-0 text-[10px] tabular-nums"
                        >
                            {{ wishlistCount }}
                        </Badge>
                    </Link>
                </Button>

                <Button
                    variant="ghost"
                    size="icon"
                    as-child
                    class="relative"
                    aria-label="Cart"
                >
                    <Link :href="shopRoutes.cart()">
                        <ShoppingCart class="size-5" />
                        <Badge
                            v-if="cartCount"
                            class="absolute -top-0.5 -right-0.5 size-4 rounded-full p-0 text-[10px] tabular-nums"
                        >
                            {{ cartCount }}
                        </Badge>
                    </Link>
                </Button>

                <!-- Account -->
                <DropdownMenu v-if="auth.user">
                    <DropdownMenuTrigger :as-child="true">
                        <Button
                            variant="ghost"
                            size="icon"
                            class="rounded-full"
                        >
                            <Avatar class="size-8">
                                <AvatarImage
                                    v-if="auth.user.avatar"
                                    :src="auth.user.avatar"
                                    :alt="auth.user.name"
                                />
                                <AvatarFallback
                                    class="bg-neutral-200 text-xs font-semibold text-black dark:bg-neutral-700 dark:text-white"
                                >
                                    {{ getInitials(auth.user.name) }}
                                </AvatarFallback>
                            </Avatar>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" class="w-56">
                        <UserMenuContent :user="auth.user" />
                    </DropdownMenuContent>
                </DropdownMenu>

                <Button
                    v-else
                    variant="ghost"
                    size="icon"
                    as-child
                    aria-label="Sign in"
                >
                    <Link :href="login()">
                        <User class="size-5" />
                    </Link>
                </Button>

                <Button v-if="!auth.user" as-child class="ml-1 hidden sm:flex">
                    <Link :href="register()">Sign up</Link>
                </Button>
            </div>
        </div>
    </header>
</template>
