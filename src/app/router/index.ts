import Name from "./NameEnum";
import Path from "./PathEnum";
import { scrollToElement } from "@/app/util/scroll";
import { createRouter, createWebHistory, type RouterScrollBehavior } from "vue-router";

declare module "vue-router" {
    interface RouteMeta {
        readonly hasHero?: boolean;
        readonly showFooterContact?: boolean;
    }
}

const scrollBehavior: RouterScrollBehavior = (to, from, savedPosition) => {
    if (to.hash) {
        const target = document.querySelector(to.hash);

        if (target === null) {
            return false;
        }

        if (from.matched.length === 0) {
            return { el: to.hash };
        }

        scrollToElement(target);

        return false;
    }

    return savedPosition ?? { top: 0 };
};

export default createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    scrollBehavior,
    routes: [
        {
            path: Path.HOME,
            name: Name.HOME,
            component: () => import("@/module/home/page/HomePage.vue"),
            meta: { hasHero: true, showFooterContact: true },
        },
        {
            path: Path.ABOUT,
            name: Name.ABOUT,
            component: () => import("@/module/about/page/AboutPage.vue"),
            meta: { showFooterContact: true },
        },
        {
            path: Path.EXPERIENCE,
            name: Name.EXPERIENCE,
            component: () => import("@/module/experience/page/ExperiencePage.vue"),
            meta: { showFooterContact: true },
        },
        {
            path: Path.CONTACT,
            name: Name.CONTACT,
            component: () => import("@/module/contact/page/ContactPage.vue"),
        },
        {
            path: Path.FORM_SUBMITTED,
            name: Name.FORM_SUBMITTED,
            component: () => import("@/module/contact/page/FormSubmittedPage.vue"),
        },
        {
            path: Path.NOT_FOUND,
            name: Name.NOT_FOUND,
            redirect: { name: Name.HOME },
        },
    ],
});
