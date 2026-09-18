<template>
    <section v-reveal class="contact">
        <div class="contact__content">
            <h1 class="contact__title">Thank you.</h1>
            <p class="contact__text">Thank you for your message. I will get back to you as soon as possible.</p>
            <cta-link label="Back" back :to="{ name: Name.CONTACT }" />
        </div>
    </section>
</template>

<script setup lang="ts">
import CtaLink from "@/app/component/CtaLink.vue";
import Name from "@/app/router/NameEnum";
</script>
