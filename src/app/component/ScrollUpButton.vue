<template>
    <button
        class="scroll-up"
        :class="{ 'scroll-up--visible': visible }"
        type="button"
        aria-label="Scroll to top"
        @click="scrollToTop"
    >
        <svg
            class="scroll-up__icon"
            viewBox="0 0 25 40"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            aria-hidden="true"
        >
            <path d="M12.5 39 L12.5 3" />
            <polyline points="4 10 12.5 2 21 10" />
        </svg>
        <span class="scroll-up__label">Top</span>
    </button>
</template>

<script setup lang="ts">
import { scrollToY } from "@/app/util/scroll";

const { visible = false } = defineProps<{ visible?: boolean }>();

function scrollToTop(): void {
    scrollToY(0);
}
</script>
