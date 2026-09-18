<template>
    <section v-reveal class="experience">
        <div class="experience__content">
            <h1 class="experience__title">My Experience.</h1>

            <div class="experience__block">
                <h2 class="experience__subtitle">Current role.</h2>
                <div class="experience__body">
                    <div class="experience__role">
                        <h3 class="experience__role-name">Software Engineer — Web &amp; iOS</h3>
                        <p class="experience__role-meta">Home Credit International · August 2024 — present</p>
                    </div>
                    <p class="experience__text">
                        Home Credit's loan origination platform is where a customer applies to finance a purchase,
                        borrow cash, take an operating lease or consolidate existing loans. It runs in Czechia and
                        Slovakia. There are two products: a .NET application on Blazor Server and ASP.NET Core MVC, and
                        a native Swift iOS app. The backend is Java.
                    </p>
                    <ul class="experience__list">
                        <li v-for="highlight in HIGHLIGHTS" :key="highlight.lead" class="experience__item">
                            <strong class="experience__lead">{{ highlight.lead }}.</strong>
                            {{ highlight.text }}
                        </li>
                    </ul>
                </div>
            </div>

            <div class="experience__block">
                <h2 class="experience__subtitle">Projects.</h2>
                <div class="experience__body">
                    <ul class="experience__projects">
                        <li v-for="project in PROJECTS" :key="project.name" class="experience__project">
                            <p class="experience__project-context">{{ project.context }}</p>
                            <h3 class="experience__project-name">{{ project.name }}</h3>
                            <p class="experience__project-text">{{ project.text }}</p>
                            <ul v-if="project.links !== undefined" class="experience__project-links">
                                <li v-for="link in project.links" :key="link.url">
                                    <a
                                        class="experience__project-link"
                                        :href="link.url"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        <span>{{ link.label }}</span>
                                        <svg viewBox="0 0 14 14" aria-hidden="true">
                                            <path d="M3.5 10.5 L10.5 3.5" />
                                            <polyline points="5 3.5 10.5 3.5 10.5 9" />
                                        </svg>
                                    </a>
                                </li>
                            </ul>
                        </li>
                    </ul>
                </div>
            </div>

            <div class="experience__block">
                <h2 class="experience__subtitle">Education.</h2>
                <div class="experience__body">
                    <div class="experience__role">
                        <h3 class="experience__role-name">Brno University of Technology</h3>
                        <p class="experience__role-meta">
                            Faculty of Information Technology · Bachelor's degree · September 2021 — 2025
                        </p>
                    </div>
                    <p class="experience__text">
                        Software engineering, computer networks, artificial intelligence and data analysis. Most of the
                        course was project work rather than lectures, done in teams and to deadlines.
                    </p>
                </div>
            </div>

            <cta-link label="Back" back :to="{ path: Path.HOME, hash: `#${Section.EXPERIENCE}` }" />
        </div>
    </section>
</template>

<script setup lang="ts">
import CtaLink from "@/app/component/CtaLink.vue";
import HIGHLIGHTS from "@/module/experience/data/highlights";
import PROJECTS from "@/module/experience/data/projects";
import Path from "@/app/router/PathEnum";
import Section from "@/app/router/SectionEnum";
</script>
