<template>
    <section :id="Section.EXPERIENCE" v-reveal class="summary">
        <div class="summary__content">
            <h2 class="summary__title">My Experience.</h2>
            <p class="summary__intro">
                I work on a loan application. It reaches Czech and Slovak customers on the web and on an iPhone, and I
                build it on both.
            </p>
            <cta-link label="See the detail" :to="{ name: Name.EXPERIENCE }" />
        </div>
    </section>
</template>

<script setup lang="ts">
import CtaLink from "@/app/component/CtaLink.vue";
import Name from "@/app/router/NameEnum";
import Section from "@/app/router/SectionEnum";
</script>
