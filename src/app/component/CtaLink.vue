<template>
    <component :is="href === undefined ? RouterLink : 'a'" class="cta" :class="{ 'cta--back': back }" v-bind="attrs">
        <span>{{ label }}</span>
        <svg width="25" height="15" viewBox="0 0 13 10" aria-hidden="true">
            <path d="M1,5 L11,5" />
            <polyline points="8 1 12 5 8 9" />
        </svg>
    </component>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { RouterLink, type RouteLocationRaw } from "vue-router";

const {
    label,
    to,
    href,
    back = false,
} = defineProps<{
    label: string;
    to?: RouteLocationRaw;
    href?: string;
    back?: boolean;
}>();

const attrs = computed(() =>
    href === undefined ? { to: to as RouteLocationRaw } : { href, target: "_blank", rel: "noopener noreferrer" },
);
</script>
