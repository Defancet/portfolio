<template>
    <section v-reveal class="contact">
        <div class="contact__content">
            <h1 class="contact__title">Contact me.</h1>
            <p class="contact__text">If you have any questions or want to work with me, feel free to contact me.</p>
            <contact-form>
                <template #secondary>
                    <cta-link label="Back" back :to="{ name: Name.HOME }" @click.capture="goBack" />
                </template>
            </contact-form>
        </div>
    </section>
</template>

<script setup lang="ts">
import ContactForm from "../component/ContactForm.vue";
import CtaLink from "@/app/component/CtaLink.vue";
import Name from "@/app/router/NameEnum";
import { useRouter } from "vue-router";

const router = useRouter();

function goBack(event: MouseEvent): void {
    const state = window.history.state as { back?: string | null } | null;

    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
        return;
    }

    if (state === null || state.back === null || state.back === undefined) {
        return;
    }

    event.preventDefault();
    router.back();
}
</script>
