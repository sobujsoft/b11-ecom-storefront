import { computed, ref } from 'vue';

export type ShopUser = {
    id: number;
    name: string;
    email: string;
    role?: string;
};

// Module-level singletons — shared reactively across all component instances.
const token = ref<string | null>(
    typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null,
);
const user = ref<ShopUser | null>(
    typeof window !== 'undefined'
        ? JSON.parse(localStorage.getItem('auth_user') ?? 'null')
        : null,
);

export function useShopAuth() {
    const isLoggedIn = computed(() => !!token.value);

    function setAuth(newToken: string, newUser: ShopUser) {
        token.value = newToken;
        user.value = newUser;
        localStorage.setItem('auth_token', newToken);
        localStorage.setItem('auth_user', JSON.stringify(newUser));
    }

    function clearAuth() {
        token.value = null;
        user.value = null;
        localStorage.removeItem('auth_token');
        localStorage.removeItem('auth_user');
    }

    return { token, user, isLoggedIn, setAuth, clearAuth };
}
