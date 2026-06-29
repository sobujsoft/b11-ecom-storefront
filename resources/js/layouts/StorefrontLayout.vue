<script setup lang="ts">
import StorefrontFooter from '@/components/storefront/StorefrontFooter.vue';
import StorefrontHeader from '@/components/storefront/StorefrontHeader.vue';
import { Toaster } from '@/components/ui/sonner';
</script>

<template>
    <div class="flex min-h-screen flex-col bg-background text-foreground">
        <StorefrontHeader />
        <main class="flex-1">
            <slot />
        </main>
        <StorefrontFooter />
        <Toaster />
    </div>
</template>
