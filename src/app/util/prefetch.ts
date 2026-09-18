import type { Router } from "vue-router";

const IDLE_TIMEOUT = 1500;

type ComponentLoader = () => Promise<unknown>;

function loaders(router: Router): ComponentLoader[] {
    return router
        .getRoutes()
        .map((route) => route.components?.default)
        .filter((component): component is ComponentLoader => typeof component === "function");
}

export default function warmRoutes(router: Router): void {
    if (navigator.connection?.saveData === true) {
        return;
    }

    function warm(): void {
        for (const load of loaders(router)) {
            void load().catch(() => undefined);
        }
    }

    function schedule(): void {
        if (typeof window.requestIdleCallback === "function") {
            window.requestIdleCallback(warm, { timeout: IDLE_TIMEOUT });
        } else {
            window.setTimeout(warm, IDLE_TIMEOUT);
        }
    }

    if (document.readyState === "complete") {
        schedule();
    } else {
        window.addEventListener("load", schedule, { once: true });
    }
}
