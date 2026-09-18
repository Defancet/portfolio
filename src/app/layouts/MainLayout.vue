<template>
    <div class="app">
        <route-progress />
        <site-header :light="!hasHero" :scrolled="isScrolled" :active-section="activeId" />
        <main>
            <slot />
        </main>
        <scroll-up-button :visible="canScrollUp" />
        <site-footer :show-contact="showFooterContact" />
    </div>
</template>

<script setup lang="ts">
import NAV_ITEMS from "@/app/data/navItems";
import RouteProgress from "@/app/component/RouteProgress.vue";
import ScrollUpButton from "@/app/component/ScrollUpButton.vue";
import SiteFooter from "./SiteFooter.vue";
import SiteHeader from "./SiteHeader.vue";
import useActiveSection from "@/app/composable/useActiveSection";
import useScrollPosition from "@/app/composable/useScrollPosition";
import { SCROLL_THRESHOLD } from "@/app/util/breakpoint";
import { computed, nextTick, watch } from "vue";
import { useRoute } from "vue-router";

const route = useRoute();
const { scrollY } = useScrollPosition();
const { activeId, measure } = useActiveSection(
    NAV_ITEMS.map((item) => item.section),
    scrollY,
);

const isScrolled = computed(() => scrollY.value > SCROLL_THRESHOLD);
const canScrollUp = computed(() => scrollY.value > window.innerHeight);
const hasHero = computed(() => route.meta.hasHero === true);
const showFooterContact = computed(() => route.meta.showFooterContact === true);

watch(
    () => route.fullPath,
    () => {
        void nextTick(measure);
    },
);
</script>
