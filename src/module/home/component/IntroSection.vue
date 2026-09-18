<template>
    <section :id="Section.ABOUT" v-reveal class="intro">
        <div class="intro__content">
            <div class="intro__media">
                <img
                    class="intro__image"
                    src="@/assets/images/me.webp"
                    alt="Maksim Kalutski"
                    width="704"
                    height="1024"
                />
            </div>
            <div class="intro__body">
                <h2 class="intro__title">Software engineer.</h2>
                <cta-link label="Learn more" :to="{ name: Name.ABOUT }" />
                <social-links />
            </div>
        </div>
    </section>
</template>

<script setup lang="ts">
import CtaLink from "@/app/component/CtaLink.vue";
import Name from "@/app/router/NameEnum";
import Section from "@/app/router/SectionEnum";
import SocialLinks from "./SocialLinks.vue";
</script>
