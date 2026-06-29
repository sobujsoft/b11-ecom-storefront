<script setup lang="ts">
import { Star } from '@lucide/vue';
import { computed } from 'vue';
import { cn } from '@/lib/utils';

const props = withDefaults(
    defineProps<{
        rating?: number;
        count?: number;
        size?: 'sm' | 'md';
        showCount?: boolean;
    }>(),
    {
        rating: 0,
        size: 'sm',
        showCount: true,
    },
);

const stars = computed(() =>
    Array.from({ length: 5 }, (_, index) => index < Math.round(props.rating)),
);

const starSize = computed(() => (props.size === 'md' ? 'size-5' : 'size-4'));
</script>

<template>
    <div class="flex items-center gap-1.5">
        <div class="flex items-center">
            <Star
                v-for="(filled, index) in stars"
                :key="index"
                :class="
                    cn(
                        starSize,
                        filled
                            ? 'fill-amber-400 text-amber-400'
                            : 'fill-muted text-muted-foreground/40',
                    )
                "
            />
        </div>
        <span v-if="showCount" class="text-xs text-muted-foreground">
            {{ rating.toFixed(1) }}
            <template v-if="count != null">({{ count }})</template>
        </span>
    </div>
</template>
