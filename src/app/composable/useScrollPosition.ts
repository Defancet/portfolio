import { onBeforeUnmount, onMounted, readonly, ref, type Ref } from "vue";

export interface UseScrollPosition {
    readonly scrollY: Readonly<Ref<number>>;
}

export default function useScrollPosition(): UseScrollPosition {
    const scrollY = ref(0);
    let frame = 0;

    function onScroll(): void {
        if (frame !== 0) {
            return;
        }

        frame = window.requestAnimationFrame(() => {
            frame = 0;
            scrollY.value = window.scrollY;
        });
    }

    onMounted(() => {
        scrollY.value = window.scrollY;
        window.addEventListener("scroll", onScroll, { passive: true });
    });

    onBeforeUnmount(() => {
        if (frame !== 0) {
            window.cancelAnimationFrame(frame);
        }

        window.removeEventListener("scroll", onScroll);
    });

    return { scrollY: readonly(scrollY) };
}
