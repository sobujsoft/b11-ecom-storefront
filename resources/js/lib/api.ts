const BASE_URL = import.meta.env.VITE_API_BASE_URL as string;

export class ApiError extends Error {
    constructor(
        public status: number,
        message: string,
        public errors?: Record<string, string[]>,
    ) {
        super(message);
        this.name = 'ApiError';
    }
}

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
        let body: { message?: string; errors?: Record<string, string[]> } = {};
        try { body = await res.json(); } catch { /* empty */ }
        throw new ApiError(res.status, body.message ?? `API error ${res.status}`, body.errors);
    }
    return res.json() as Promise<T>;
}
