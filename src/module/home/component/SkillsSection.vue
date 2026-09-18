<template>
    <section :id="Section.SKILLS" ref="sectionEl" v-reveal class="skills">
        <div class="skills__content">
            <h2 class="skills__title">My Skills.</h2>
            <p class="skills__intro">
                These are the technologies I know best and use most at work. I'm always learning new things.
            </p>
            <ul ref="flowEl" class="skills__list">
                <li
                    v-for="(skill, index) in SKILLS"
                    :key="skill"
                    :ref="(el) => setChip(index, el)"
                    class="skills__item"
                >
                    {{ skill }}
                </li>
            </ul>
        </div>
    </section>
</template>

<script setup lang="ts">
import SKILLS from "@/module/home/data/skills";
import Section from "@/app/router/SectionEnum";
import usePhysicsBodies from "@/app/composable/usePhysicsBodies";
import { ref, type ComponentPublicInstance } from "vue";

const sectionEl = ref<HTMLElement | null>(null);
const flowEl = ref<HTMLElement | null>(null);

const chips = ref<(HTMLElement | null)[]>([]);

function setChip(index: number, el: Element | ComponentPublicInstance | null): void {
    chips.value[index] = el instanceof HTMLElement ? el : null;
}

usePhysicsBodies({
    area: sectionEl,
    nodes: chips,
    activeClass: "skills__item--physics",
    heldClass: "skills__item--held",
    flow: flowEl,
    desktopOnly: true,
});
</script>
