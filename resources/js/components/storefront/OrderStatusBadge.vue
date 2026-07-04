<script setup lang="ts">
import { computed } from 'vue';
import { cn } from '@/lib/utils';
import type { OrderStatus, PaymentStatus } from '@/types';

const props = defineProps<{
    status: OrderStatus | PaymentStatus;
}>();

const styles: Record<string, string> = {
    pending:
        'bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-400',
    processing:
        'bg-blue-100 text-blue-700 dark:bg-blue-500/15 dark:text-blue-400',
    shipped:
        'bg-indigo-100 text-indigo-700 dark:bg-indigo-500/15 dark:text-indigo-400',
    completed:
        'bg-green-100 text-green-700 dark:bg-green-500/15 dark:text-green-400',
    cancelled: 'bg-red-100 text-red-700 dark:bg-red-500/15 dark:text-red-400',
    paid: 'bg-green-100 text-green-700 dark:bg-green-500/15 dark:text-green-400',
    unpaid: 'bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-400',
    refunded:
        'bg-neutral-100 text-neutral-600 dark:bg-neutral-500/15 dark:text-neutral-300',
};

const labels: Record<string, string> = {
    completed: 'Delivered',
    unpaid: 'Unpaid',
    paid: 'Paid',
    refunded: 'Refunded',
};

const cls = computed(() => styles[props.status] ?? styles.pending);
const label = computed(
    () => labels[props.status] ?? props.status.replace(/_/g, ' '),
);
</script>

<template>
    <span
        :class="
            cn(
                'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium capitalize',
                cls,
            )
        "
    >
        {{ label }}
    </span>
</template>
