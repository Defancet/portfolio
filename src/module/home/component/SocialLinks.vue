<template>
    <ul class="social-links">
        <li v-for="link in featured" :key="link.label">
            <a :href="link.url" target="_blank" rel="noopener noreferrer">
                <svg class="brand-mark" :viewBox="link.viewBox" fill="currentColor" aria-hidden="true">
                    <path :d="link.mark" />
                </svg>
                <span>{{ link.label }}</span>
            </a>
        </li>
    </ul>
</template>

<script setup lang="ts">
import SOCIAL_LINKS from "@/app/data/socialLinks";

const featured = SOCIAL_LINKS.filter((link) => link.featured);
</script>
