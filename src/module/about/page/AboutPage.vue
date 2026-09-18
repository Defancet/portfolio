<template>
    <section ref="sectionEl" v-reveal class="about">
        <span
            v-for="(prop, index) in PROPS"
            :key="prop.src"
            :ref="(el) => setProp(index, el)"
            :class="['about__prop', `about__prop--${prop.name}`]"
        >
            <img
                class="about__prop-image"
                :alt="prop.alt"
                :src="prop.src"
                :width="prop.width"
                :height="prop.height"
                draggable="false"
            />
        </span>
        <div class="about__content">
            <h1 class="about__title">About Me.</h1>
            <p class="about__text">
                I'm a software engineer at Home Credit, working on the software Czech and Slovak customers use to
                finance a purchase, take out a cash loan, or consolidate their debts. I own features end to end, on the
                .NET/Blazor web app and on the native Swift iOS app. Usually both, because most of what we ship has to
                land on both at once. I studied Computer Science at Brno University of Technology.
            </p>
            <p class="about__text">Outside of work I split my time between cars, house music, and gaming.</p>
            <cta-link label="Back" back :to="{ path: Path.HOME, hash: `#${Section.ABOUT}` }" />
        </div>
    </section>
</template>

<script setup lang="ts">
import CtaLink from "@/app/component/CtaLink.vue";
import PROPS from "@/module/about/data/props";
import Path from "@/app/router/PathEnum";
import Section from "@/app/router/SectionEnum";
import usePhysicsBodies from "@/app/composable/usePhysicsBodies";
import { ref, type ComponentPublicInstance } from "vue";

const sectionEl = ref<HTMLElement | null>(null);
const props = ref<(HTMLElement | null)[]>([]);

function setProp(index: number, el: Element | ComponentPublicInstance | null): void {
    props.value[index] = el instanceof HTMLElement ? el : null;
}

usePhysicsBodies({
    area: sectionEl,
    nodes: props,
    activeClass: "about__prop--physics",
    heldClass: "about__prop--held",
});
</script>
