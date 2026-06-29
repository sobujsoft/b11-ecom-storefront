/* Shared mock orders + status badge helper (used by orders + order detail) */

const ORDERS = [
    {
        id: 1024,
        date: 'Jun 20, 2026',
        total: 318.98,
        status: 'processing',
        payment: 'paid',
        address: '123 Main St, Dhaka 1207, Bangladesh',
        items: [
            { id: 1, qty: 1, price: 129.99 },
            { id: 2, qty: 1, price: 199.0 },
        ],
    },
    {
        id: 1019,
        date: 'Jun 11, 2026',
        total: 89.5,
        status: 'shipped',
        payment: 'paid',
        address: '88 Lake Road, Chattogram 4000, Bangladesh',
        items: [{ id: 3, qty: 1, price: 89.5 }],
    },
    {
        id: 1007,
        date: 'May 29, 2026',
        total: 67.99,
        status: 'completed',
        payment: 'paid',
        address: '12 Garden Ave, Sylhet 3100, Bangladesh',
        items: [{ id: 9, qty: 1, price: 28.0 }],
    },
    {
        id: 1001,
        date: 'May 15, 2026',
        total: 49.99,
        status: 'cancelled',
        payment: 'refunded',
        address: '5 Hill View, Rajshahi 6000, Bangladesh',
        items: [{ id: 11, qty: 1, price: 49.99 }],
    },
];

const STATUS_STYLES = {
    pending: 'bg-amber-100 text-amber-700',
    processing: 'bg-blue-100 text-blue-700',
    shipped: 'bg-indigo-100 text-indigo-700',
    completed: 'bg-green-100 text-green-700',
    cancelled: 'bg-red-100 text-red-700',
    paid: 'bg-green-100 text-green-700',
    unpaid: 'bg-amber-100 text-amber-700',
    refunded: 'bg-neutral-100 text-neutral-600',
};

function statusBadge(status) {
    const cls = STATUS_STYLES[status] || STATUS_STYLES.pending;
    return `<span class="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${cls}">${status}</span>`;
}

function findOrder(id) {
    return ORDERS.find((o) => o.id === Number(id)) || ORDERS[0];
}
