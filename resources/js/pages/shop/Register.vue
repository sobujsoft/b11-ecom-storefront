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

if (isLoggedIn.value) {
    router.visit(shopRoutes.home());
}

type RegisterResponse = { token: string; user: ShopUser };

const name = ref('');
const email = ref('');
const password = ref('');
const passwordConfirmation = ref('');
const loading = ref(false);
const generalError = ref<string | null>(null);
const fieldErrors = ref<Record<string, string>>({});

async function submit() {
    if (password.value !== passwordConfirmation.value) {
        fieldErrors.value = { password_confirmation: 'Passwords do not match.' };
        return;
    }

    loading.value = true;
    generalError.value = null;
    fieldErrors.value = {};

    try {
        const data = await apiFetch<RegisterResponse>('/register', {
            method: 'POST',
            body: JSON.stringify({
                name: name.value,
                email: email.value,
                password: password.value,
                role: 'user',
            }),
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
    <Head title="Create Account" />

    <div class="flex min-h-[calc(100vh-10rem)] items-center justify-center px-4 py-12">
        <div class="w-full max-w-sm">
            <!-- Heading -->
            <div class="mb-8 text-center">
                <h1 class="text-2xl font-bold tracking-tight">Create an account</h1>
                <p class="mt-2 text-sm text-muted-foreground">
                    Join B11 Shop and start shopping today
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
                    <Label for="name">Full name</Label>
                    <Input
                        id="name"
                        v-model="name"
                        type="text"
                        required
                        autofocus
                        autocomplete="name"
                        placeholder="John Doe"
                        :class="fieldErrors.name ? 'border-destructive' : ''"
                    />
                    <p v-if="fieldErrors.name" class="text-xs text-destructive">
                        {{ fieldErrors.name }}
                    </p>
                </div>

                <div class="space-y-2">
                    <Label for="email">Email address</Label>
                    <Input
                        id="email"
                        v-model="email"
                        type="email"
                        required
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
                        autocomplete="new-password"
                        placeholder="Choose a password"
                        :class="fieldErrors.password ? 'border-destructive' : ''"
                    />
                    <p v-if="fieldErrors.password" class="text-xs text-destructive">
                        {{ fieldErrors.password }}
                    </p>
                </div>

                <div class="space-y-2">
                    <Label for="password_confirmation">Confirm password</Label>
                    <PasswordInput
                        id="password_confirmation"
                        v-model="passwordConfirmation"
                        required
                        autocomplete="new-password"
                        placeholder="Repeat your password"
                        :class="fieldErrors.password_confirmation ? 'border-destructive' : ''"
                    />
                    <p v-if="fieldErrors.password_confirmation" class="text-xs text-destructive">
                        {{ fieldErrors.password_confirmation }}
                    </p>
                </div>

                <Button type="submit" class="w-full" :disabled="loading">
                    <Spinner v-if="loading" />
                    {{ loading ? 'Creating account…' : 'Create account' }}
                </Button>
            </form>

            <p class="mt-6 text-center text-sm text-muted-foreground">
                Already have an account?
                <a
                    :href="shopRoutes.login()"
                    class="font-medium text-primary hover:underline"
                >
                    Sign in
                </a>
            </p>
        </div>
    </div>
</template>
