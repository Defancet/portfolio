<template>
    <section class="hero">
        <div class="hero__name">
            <h1 class="hero__title">
                <span class="hero__name-part">Maksim</span>
                {{ " " }}
                <span class="hero__name-part">Kalutski</span>
            </h1>
        </div>
        <router-link class="hero__arrow" :to="{ path: Path.HOME, hash: `#${Section.ABOUT}` }" aria-label="Scroll down">
            <svg class="hero__chevron" viewBox="0 0 16 11" aria-hidden="true">
                <path d="M2 2l6 7 6-7" />
            </svg>
        </router-link>
    </section>
</template>

<script setup lang="ts">
import Path from "@/app/router/PathEnum";
import Section from "@/app/router/SectionEnum";
</script>
