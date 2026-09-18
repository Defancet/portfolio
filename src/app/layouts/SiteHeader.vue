<template>
    <header class="header" :class="{ 'header--scrolled': scrolled, 'header--light': light }">
        <button
            class="hamburger"
            :class="{ 'hamburger--open': isOpen }"
            type="button"
            aria-controls="site-nav"
            aria-label="Toggle navigation"
            :aria-expanded="isOpen"
            @click="toggle"
        >
            <svg class="hamburger__glyph" viewBox="0 0 24 24" aria-hidden="true">
                <path v-if="isOpen" d="M6 6 L18 18 M18 6 L6 18" />
                <path v-else d="M4 7h16 M4 12h16 M4 17h16" />
            </svg>
        </button>
        <nav id="site-nav" class="header__nav" :class="{ 'header__nav--open': isOpen }" aria-label="Main">
            <ul
                ref="list"
                class="header__list"
                :class="{
                    'header__list--marked': marked,
                    'header__list--placing': placing,
                    'header__list--appearing': appearing,
                }"
                :style="capsule"
            >
                <li
                    v-for="(item, position) in NAV_ITEMS"
                    :key="item.section"
                    class="header__item"
                    :class="{ 'header__item--active': current === item.section }"
                    :style="{ '--i': position }"
                >
                    <router-link
                        class="header__link"
                        :aria-current="current === item.section ? 'true' : undefined"
                        :to="sectionRoute(item.section)"
                        @click="select(item.section)"
                    >
                        {{ item.label }}
                    </router-link>
                </li>
            </ul>
        </nav>
    </header>
</template>

<script setup lang="ts">
import NAV_ITEMS from "@/app/data/navItems";
import Path from "@/app/router/PathEnum";
import type Section from "@/app/router/SectionEnum";
import useMobileMenu from "@/app/composable/useMobileMenu";
import useNavIndicator from "@/app/composable/useNavIndicator";
import { isScrolling } from "@/app/util/scroll";
import { computed, onBeforeUnmount, ref, watch } from "vue";
import type { RouteLocationRaw } from "vue-router";

const {
    light = false,
    scrolled = false,
    activeSection = null,
} = defineProps<{
    light?: boolean;
    scrolled?: boolean;
    activeSection?: string | null;
}>();

const { isOpen, toggle, close } = useMobileMenu();

const requested = ref<Section | null>(null);
const current = computed(() => requested.value ?? activeSection);

function select(section: Section): void {
    requested.value = section;
    close();
}

function release(): void {
    if (isScrolling()) {
        return;
    }

    requested.value = null;
}

watch(
    () => activeSection,
    (section) => {
        if (section === requested.value) {
            release();
        }
    },
);

window.addEventListener("scrollend", release);
onBeforeUnmount(() => window.removeEventListener("scrollend", release));

const list = ref<HTMLElement | null>(null);
const { style: capsule, marked, placing, appearing, measure } = useNavIndicator(list);

watch(current, () => measure(), { flush: "post" });
watch(isOpen, () => measure(true), { flush: "post" });

function sectionRoute(section: Section): RouteLocationRaw {
    return { path: Path.HOME, hash: `#${section}` };
}
</script>
