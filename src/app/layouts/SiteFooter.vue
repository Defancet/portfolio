<template>
    <footer class="footer">
        <div class="footer__wrapper">
            <div v-if="showContact" class="footer__contact">
                <cta-link label="Contact me" :to="{ name: Name.CONTACT }" />
            </div>
            <div class="footer__content">
                <p class="footer__copyright">&copy; {{ year }} Maksim Kalutski</p>
                <ul class="footer__links">
                    <li v-for="link in SOCIAL_LINKS" :key="link.label">
                        <a :href="link.url" :title="link.label" target="_blank" rel="noopener noreferrer">
                            <svg class="brand-mark" :viewBox="link.viewBox" fill="currentColor" aria-hidden="true">
                                <path :d="link.mark" />
                            </svg>
                            <span class="vhide">{{ link.label }}</span>
                        </a>
                    </li>
                </ul>
            </div>
        </div>
    </footer>
</template>

<script setup lang="ts">
import CtaLink from "@/app/component/CtaLink.vue";
import Name from "@/app/router/NameEnum";
import SOCIAL_LINKS from "@/app/data/socialLinks";

const { showContact = false } = defineProps<{
    showContact?: boolean;
}>();

const year = new Date().getFullYear();
</script>
