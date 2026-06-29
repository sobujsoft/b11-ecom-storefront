/* =========================================================================
 * B11 Shop — shared design assets (header, footer, mock data, helpers)
 * Pure static design reference. No framework, no API.
 * ========================================================================= */

const CATEGORIES = [
    'Electronics',
    'Fashion',
    'Home & Living',
    'Sports',
    'Beauty',
];

const PRODUCTS = [
    {
        id: 1,
        name: 'Aero Wireless Headphones',
        category: 'Electronics',
        brand: 'Aero',
        price: 129.99,
        old_price: 169.99,
        latest: true,
        rating: 4.6,
        reviews: 128,
        image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80',
    },
    {
        id: 2,
        name: 'Vertex Smart Watch Series 6',
        category: 'Electronics',
        brand: 'Vertex',
        price: 199.0,
        old_price: 249.0,
        latest: true,
        rating: 4.8,
        reviews: 96,
        image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80',
    },
    {
        id: 3,
        name: 'Nimbus Running Shoes',
        category: 'Sports',
        brand: 'Nimbus',
        price: 89.5,
        latest: true,
        rating: 4.4,
        reviews: 64,
        image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80',
    },
    {
        id: 4,
        name: 'Lumen Desk Lamp',
        category: 'Home & Living',
        brand: 'Lumen',
        price: 39.99,
        old_price: 54.99,
        latest: false,
        rating: 4.2,
        reviews: 41,
        image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=800&q=80',
    },
    {
        id: 5,
        name: 'Pulse Bluetooth Speaker',
        category: 'Electronics',
        brand: 'Pulse',
        price: 59.0,
        latest: true,
        rating: 4.5,
        reviews: 73,
        image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?auto=format&fit=crop&w=800&q=80',
    },
    {
        id: 6,
        name: 'Acme Leather Backpack',
        category: 'Fashion',
        brand: 'Acme',
        price: 149.0,
        old_price: 189.0,
        latest: false,
        rating: 4.7,
        reviews: 52,
        image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&q=80',
    },
    {
        id: 7,
        name: 'Aero Mechanical Keyboard',
        category: 'Electronics',
        brand: 'Aero',
        price: 109.99,
        latest: true,
        rating: 4.6,
        reviews: 88,
        image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=800&q=80',
    },
    {
        id: 8,
        name: 'Nimbus Yoga Mat',
        category: 'Sports',
        brand: 'Nimbus',
        price: 34.99,
        old_price: 44.99,
        latest: false,
        rating: 4.3,
        reviews: 29,
        image: 'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?auto=format&fit=crop&w=800&q=80',
    },
    {
        id: 9,
        name: 'Lumen Scented Candle Set',
        category: 'Home & Living',
        brand: 'Lumen',
        price: 28.0,
        latest: true,
        rating: 4.9,
        reviews: 37,
        image: 'https://images.unsplash.com/photo-1602874801007-bd458bb1b8b6?auto=format&fit=crop&w=800&q=80',
    },
    {
        id: 10,
        name: 'Vertex Sunglasses',
        category: 'Fashion',
        brand: 'Vertex',
        price: 74.5,
        old_price: 99.0,
        latest: false,
        rating: 4.1,
        reviews: 45,
        image: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&w=800&q=80',
    },
    {
        id: 11,
        name: 'Pulse Fitness Tracker',
        category: 'Sports',
        brand: 'Pulse',
        price: 49.99,
        latest: true,
        rating: 4.0,
        reviews: 33,
        image: 'https://images.unsplash.com/photo-1576243345690-4e4b79b63288?auto=format&fit=crop&w=800&q=80',
    },
    {
        id: 12,
        name: 'Acme Ceramic Cookware Set',
        category: 'Home & Living',
        brand: 'Acme',
        price: 159.0,
        old_price: 219.0,
        latest: false,
        rating: 4.5,
        reviews: 61,
        image: 'https://images.unsplash.com/photo-1584990347449-a2d4c2c9b2d8?auto=format&fit=crop&w=800&q=80',
    },
];

function formatPrice(value) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
    }).format(value);
}

function findProduct(id) {
    return PRODUCTS.find((p) => p.id === Number(id)) || PRODUCTS[0];
}

/* Star rating markup */
function starsHTML(rating, count) {
    let html = '<div class="flex items-center gap-1.5"><div class="flex items-center">';
    for (let i = 0; i < 5; i++) {
        const filled = i < Math.round(rating);
        html += `<i data-lucide="star" class="size-4 ${
            filled ? 'fill-amber-400 text-amber-400' : 'fill-neutral-200 text-neutral-300'
        }"></i>`;
    }
    html += '</div>';
    if (count != null) {
        html += `<span class="text-xs text-neutral-500">${rating.toFixed(1)} (${count})</span>`;
    }
    html += '</div>';
    return html;
}

/* Product card markup (matches ProductCard.vue) */
function productCardHTML(p) {
    let badge = '';
    if (p.old_price) {
        const off = Math.round((1 - p.price / p.old_price) * 100);
        badge = `<span class="absolute left-3 top-3 rounded-full bg-red-600 px-2 py-0.5 text-xs font-medium text-white">-${off}%</span>`;
    } else if (p.latest) {
        badge = `<span class="absolute left-3 top-3 rounded-full bg-neutral-900 px-2 py-0.5 text-xs font-medium text-white">New</span>`;
    }
    const old = p.old_price
        ? `<span class="text-sm text-neutral-400 line-through">${formatPrice(p.old_price)}</span>`
        : '';
    return `
    <div class="group relative flex flex-col overflow-hidden rounded-xl border border-neutral-200 bg-white transition-shadow hover:shadow-md">
        <a href="product-detail.html?id=${p.id}" class="relative block aspect-square overflow-hidden bg-neutral-100">
            <img src="${p.image}" alt="${p.name}" loading="lazy" class="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105" />
            ${badge}
        </a>
        <button class="absolute right-3 top-3 grid size-9 place-items-center rounded-full bg-neutral-100 opacity-0 shadow-sm transition-opacity group-hover:opacity-100" aria-label="Add to wishlist">
            <i data-lucide="heart" class="size-4"></i>
        </button>
        <div class="flex flex-1 flex-col p-4">
            <p class="text-xs font-medium uppercase tracking-wide text-neutral-500">${p.category}</p>
            <a href="product-detail.html?id=${p.id}" class="mt-1 line-clamp-2 text-sm font-semibold hover:underline">${p.name}</a>
            <div class="mt-2">${starsHTML(p.rating, p.reviews)}</div>
            <div class="mt-auto flex items-end justify-between pt-4">
                <div class="flex items-baseline gap-2">
                    <span class="text-lg font-bold">${formatPrice(p.price)}</span>
                    ${old}
                </div>
                <button class="grid size-9 place-items-center rounded-md bg-neutral-900 text-white transition-colors hover:bg-neutral-800" aria-label="Add to cart">
                    <i data-lucide="shopping-cart" class="size-4"></i>
                </button>
            </div>
        </div>
    </div>`;
}

function renderGrid(targetId, list) {
    const el = document.getElementById(targetId);
    if (el) {
        el.innerHTML = list.map(productCardHTML).join('');
    }
}

/* ---- Header ---- */
function headerHTML(active) {
    const nav = [
        { title: 'Home', href: 'index.html', key: 'home' },
        { title: 'Shop', href: 'products.html', key: 'shop' },
        { title: 'Wishlist', href: 'wishlist.html', key: 'wishlist' },
        { title: 'Orders', href: 'orders.html', key: 'orders' },
    ];
    const links = nav
        .map(
            (n) =>
                `<a href="${n.href}" class="rounded-md px-3 py-2 text-sm font-medium transition-colors hover:text-neutral-900 ${
                    active === n.key ? 'text-neutral-900' : 'text-neutral-500'
                }">${n.title}</a>`,
        )
        .join('');
    return `
    <header class="sticky top-0 z-40 w-full border-b border-neutral-200 bg-white/95 backdrop-blur">
        <div class="bg-neutral-900 text-center text-xs font-medium text-white">
            <p class="py-2">Free shipping on orders over $100 · Use code <span class="font-bold">B11SHOP</span> for 10% off</p>
        </div>
        <div class="mx-auto flex h-16 max-w-7xl items-center gap-4 px-4">
            <a href="index.html" class="flex shrink-0 items-center gap-2">
                <span class="grid size-9 place-items-center rounded-md bg-neutral-900 text-white">
                    <i data-lucide="shopping-bag" class="size-5"></i>
                </span>
                <span class="hidden text-lg font-bold tracking-tight sm:block">B11 Shop</span>
            </a>
            <nav class="ml-4 hidden items-center gap-1 lg:flex">${links}</nav>
            <div class="relative ml-auto hidden max-w-sm flex-1 md:block">
                <i data-lucide="search" class="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-neutral-400"></i>
                <input type="search" placeholder="Search products..." class="h-9 w-full rounded-md border border-neutral-200 bg-transparent pl-9 pr-3 text-sm outline-none focus:border-neutral-900" />
            </div>
            <div class="flex items-center gap-1 md:ml-2">
                <a href="wishlist.html" class="relative grid size-9 place-items-center rounded-md hover:bg-neutral-100" aria-label="Wishlist">
                    <i data-lucide="heart" class="size-5"></i>
                    <span class="absolute -right-0.5 -top-0.5 grid size-4 place-items-center rounded-full bg-neutral-900 text-[10px] font-semibold text-white">3</span>
                </a>
                <a href="cart.html" class="relative grid size-9 place-items-center rounded-md hover:bg-neutral-100" aria-label="Cart">
                    <i data-lucide="shopping-cart" class="size-5"></i>
                    <span class="absolute -right-0.5 -top-0.5 grid size-4 place-items-center rounded-full bg-neutral-900 text-[10px] font-semibold text-white">4</span>
                </a>
                <a href="#" class="grid size-9 place-items-center rounded-md hover:bg-neutral-100" aria-label="Account">
                    <i data-lucide="user" class="size-5"></i>
                </a>
                <a href="#" class="ml-1 hidden rounded-md bg-neutral-900 px-4 py-2 text-sm font-medium text-white hover:bg-neutral-800 sm:block">Sign up</a>
            </div>
        </div>
    </header>`;
}

/* ---- Footer ---- */
function footerHTML() {
    const cats = CATEGORIES.map(
        (c) =>
            `<li><a href="products.html" class="hover:text-neutral-900">${c}</a></li>`,
    ).join('');
    const company = ['About Us', 'Careers', 'Contact', 'Blog']
        .map((c) => `<li><a href="#" class="hover:text-neutral-900">${c}</a></li>`)
        .join('');
    const socials = ['share-2', 'at-sign', 'message-circle', 'send']
        .map(
            (s) =>
                `<a href="#" class="grid size-9 place-items-center rounded-md hover:bg-neutral-100"><i data-lucide="${s}" class="size-4"></i></a>`,
        )
        .join('');
    return `
    <footer class="mt-16 border-t border-neutral-200 bg-neutral-50">
        <div class="mx-auto max-w-7xl px-4 py-12">
            <div class="grid gap-10 sm:grid-cols-2 lg:grid-cols-5">
                <div class="lg:col-span-2">
                    <a href="index.html" class="flex items-center gap-2">
                        <span class="grid size-9 place-items-center rounded-md bg-neutral-900 text-white"><i data-lucide="shopping-bag" class="size-5"></i></span>
                        <span class="text-lg font-bold">B11 Shop</span>
                    </a>
                    <p class="mt-4 max-w-xs text-sm text-neutral-500">Your one-stop shop for electronics, fashion, and lifestyle essentials — curated quality at fair prices.</p>
                    <form class="mt-5 flex max-w-sm gap-2" onsubmit="return false">
                        <input type="email" placeholder="Enter your email" class="h-9 w-full rounded-md border border-neutral-200 bg-transparent px-3 text-sm outline-none focus:border-neutral-900" />
                        <button class="shrink-0 rounded-md bg-neutral-900 px-4 text-sm font-medium text-white hover:bg-neutral-800">Subscribe</button>
                    </form>
                </div>
                <div>
                    <h3 class="text-sm font-semibold">Shop</h3>
                    <ul class="mt-4 space-y-3 text-sm text-neutral-500">
                        <li><a href="products.html" class="hover:text-neutral-900">All Products</a></li>
                        <li><a href="wishlist.html" class="hover:text-neutral-900">Wishlist</a></li>
                        <li><a href="cart.html" class="hover:text-neutral-900">Cart</a></li>
                        <li><a href="orders.html" class="hover:text-neutral-900">My Orders</a></li>
                    </ul>
                </div>
                <div>
                    <h3 class="text-sm font-semibold">Categories</h3>
                    <ul class="mt-4 space-y-3 text-sm text-neutral-500">${cats}</ul>
                </div>
                <div>
                    <h3 class="text-sm font-semibold">Company</h3>
                    <ul class="mt-4 space-y-3 text-sm text-neutral-500">${company}</ul>
                </div>
            </div>
            <div class="mt-10 flex flex-col items-center justify-between gap-4 border-t border-neutral-200 pt-6 sm:flex-row">
                <p class="text-sm text-neutral-500">© ${new Date().getFullYear()} B11 Shop. All rights reserved.</p>
                <div class="flex items-center gap-1">${socials}</div>
            </div>
        </div>
    </footer>`;
}

/* ---- Bootstrap: inject header/footer, then render icons ---- */
function mountChrome() {
    const active = document.body.dataset.page || '';
    const header = document.getElementById('site-header');
    const footer = document.getElementById('site-footer');
    if (header) header.innerHTML = headerHTML(active);
    if (footer) footer.innerHTML = footerHTML();
}

document.addEventListener('DOMContentLoaded', () => {
    mountChrome();
    if (window.renderPage) window.renderPage();
    if (window.lucide) window.lucide.createIcons();
});
