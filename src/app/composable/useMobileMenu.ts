import { MOBILE_BREAKPOINT } from "@/app/util/breakpoint";
import { onBeforeUnmount, onMounted, readonly, ref, watch, type Ref } from "vue";

const NO_SCROLL_CLASS = "no-scroll";

export interface UseMobileMenu {
    readonly isOpen: Readonly<Ref<boolean>>;
    readonly toggle: () => void;
    readonly close: () => void;
}

export default function useMobileMenu(): UseMobileMenu {
    const isOpen = ref(false);
    const desktop = window.matchMedia(`(min-width: ${MOBILE_BREAKPOINT + 1}px)`);

    function close(): void {
        isOpen.value = false;
    }

    function toggle(): void {
        isOpen.value = !isOpen.value;
    }

    function onBreakpointChange(event: MediaQueryListEvent): void {
        if (event.matches) {
            close();
        }
    }

    watch(isOpen, (open) => {
        document.body.classList.toggle(NO_SCROLL_CLASS, open);
    });

    onMounted(() => desktop.addEventListener("change", onBreakpointChange));

    onBeforeUnmount(() => {
        desktop.removeEventListener("change", onBreakpointChange);
        document.body.classList.remove(NO_SCROLL_CLASS);
    });

    return { isOpen: readonly(isOpen), toggle, close };
}
