<script setup lang="ts">
import { Head, router } from '@inertiajs/vue3';
import { ref } from 'vue';
import PasswordInput from '@/components/PasswordInput.vue';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { useShopAuth, type ShopUser } from '@/composables/useShopAuth';
import { ApiError, apiFetch } from '@/lib/api';
import { shopRoutes } from '@/lib/shop';

const { isLoggedIn, setAuth } = useShopAuth();

// Redirect if already logged in
if (isLoggedIn.value) {
    router.visit(shopRoutes.home());
}

type LoginResponse = { token: string; user: ShopUser; role?: string };

const email = ref('');
const password = ref('');
const loading = ref(false);
const generalError = ref<string | null>(null);
const fieldErrors = ref<Record<string, string>>({});

async function submit() {
    loading.value = true;
    generalError.value = null;
    fieldErrors.value = {};

    try {
        const data = await apiFetch<LoginResponse>('/login', {
            method: 'POST',
            body: JSON.stringify({ email: email.value, password: password.value }),
        });
        setAuth(data.token, data.user);
        router.visit(shopRoutes.home());
    } catch (e) {
        if (e instanceof ApiError) {
            if (e.errors) {
                const flat: Record<string, string> = {};
                for (const [field, msgs] of Object.entries(e.errors)) {
                    flat[field] = msgs[0];
                }
                fieldErrors.value = flat;
            } else {
                generalError.value = e.message;
            }
        } else {
            generalError.value = 'Something went wrong. Please try again.';
        }
    } finally {
        loading.value = false;
    }
}
</script>

<template>
    <Head title="Sign In" />

    <div class="flex min-h-[calc(100vh-10rem)] items-center justify-center px-4 py-12">
        <div class="w-full max-w-sm">
            <!-- Heading -->
            <div class="mb-8 text-center">
                <h1 class="text-2xl font-bold tracking-tight">Welcome back</h1>
                <p class="mt-2 text-sm text-muted-foreground">
                    Sign in to your account to continue shopping
                </p>
            </div>

            <!-- General error -->
            <div
                v-if="generalError"
                class="mb-4 rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive"
            >
                {{ generalError }}
            </div>

            <form class="space-y-5" @submit.prevent="submit">
                <div class="space-y-2">
                    <Label for="email">Email address</Label>
                    <Input
                        id="email"
                        v-model="email"
                        type="email"
                        required
                        autofocus
                        autocomplete="email"
                        placeholder="you@example.com"
                        :class="fieldErrors.email ? 'border-destructive' : ''"
                    />
                    <p v-if="fieldErrors.email" class="text-xs text-destructive">
                        {{ fieldErrors.email }}
                    </p>
                </div>

                <div class="space-y-2">
                    <Label for="password">Password</Label>
                    <PasswordInput
                        id="password"
                        v-model="password"
                        required
                        autocomplete="current-password"
                        placeholder="Your password"
                        :class="fieldErrors.password ? 'border-destructive' : ''"
                    />
                    <p v-if="fieldErrors.password" class="text-xs text-destructive">
                        {{ fieldErrors.password }}
                    </p>
                </div>

                <Button type="submit" class="w-full" :disabled="loading">
                    <Spinner v-if="loading" />
                    {{ loading ? 'Signing in…' : 'Sign in' }}
                </Button>
            </form>

            <p class="mt-6 text-center text-sm text-muted-foreground">
                Don't have an account?
                <a
                    :href="shopRoutes.register()"
                    class="font-medium text-primary hover:underline"
                >
                    Sign up
                </a>
            </p>
        </div>
    </div>
</template>
