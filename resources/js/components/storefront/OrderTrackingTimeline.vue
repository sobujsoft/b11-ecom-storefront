<script setup lang="ts">
import { CheckCircle2, Package } from '@lucide/vue';
import { computed } from 'vue';
import { cn } from '@/lib/utils';
import type { OrderStatus } from '@/types';

const props = defineProps<{
    status: OrderStatus;
}>();

const steps: { key: OrderStatus; label: string }[] = [
    { key: 'pending', label: 'Order placed' },
    { key: 'processing', label: 'Processing' },
    { key: 'shipped', label: 'Shipped' },
    { key: 'completed', label: 'Delivered' },
];

const STATUS_ORDER: OrderStatus[] = [
    'pending',
    'processing',
    'shipped',
    'completed',
];

const stageIndex = computed(() => {
    if (props.status === 'cancelled') {
        return -1;
    }

    const index = STATUS_ORDER.indexOf(props.status);

    return index === -1 ? 0 : index;
});

function isStepReached(index: number): boolean {
    return index <= stageIndex.value;
}

function isConnectorFilled(index: number): boolean {
    return index < stageIndex.value;
}
</script>

<template>
    <div
        v-if="status === 'cancelled'"
        class="mt-8 rounded-xl border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive"
    >
        This order was cancelled and the payment was refunded.
    </div>

    <div v-else class="mt-8 rounded-xl border p-6">
        <div class="flex items-start">
            <template v-for="(step, index) in steps" :key="step.key">
                <div class="flex shrink-0 flex-col items-center">
                    <span
                        :class="
                            cn(
                                'flex size-9 items-center justify-center rounded-full border-2 bg-background transition-colors',
                                isStepReached(index)
                                    ? 'border-primary bg-primary text-primary-foreground'
                                    : 'border-border text-muted-foreground',
                            )
                        "
                    >
                        <CheckCircle2
                            v-if="isStepReached(index)"
                            class="size-4"
                        />
                        <Package v-else class="size-4" />
                    </span>
                    <p
                        :class="
                            cn(
                                'mt-2 max-w-[4.5rem] text-center text-xs font-medium',
                                isStepReached(index)
                                    ? 'text-foreground'
                                    : 'text-muted-foreground',
                            )
                        "
                    >
                        {{ step.label }}
                    </p>
                </div>

                <div
                    v-if="index < steps.length - 1"
                    :class="
                        cn(
                            'mx-1 mt-[18px] h-0.5 min-w-4 flex-1 -translate-y-1/2',
                            isConnectorFilled(index)
                                ? 'bg-primary'
                                : 'bg-border',
                        )
                    "
                    aria-hidden="true"
                />
            </template>
        </div>
    </div>
</template>
