const BASE_URL = import.meta.env.VITE_API_BASE_URL as string;

export async function apiFetch<T>(
    path: string,
    options?: RequestInit & { token?: string },
): Promise<T> {
    const { token, ...init } = options ?? {};
    const headers: Record<string, string> = {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...(init.headers as Record<string, string>),
    };
    const res = await fetch(`${BASE_URL}${path}`, { ...init, headers });
    if (!res.ok) {
        const body = await res.text().catch(() => '');
        throw new Error(`API ${res.status}: ${body}`);
    }
    return res.json() as Promise<T>;
}
