import { ACTIVE_SECTION_OFFSET } from "@/app/util/breakpoint";
import { onMounted, readonly, ref, watch, type Ref } from "vue";

export interface UseActiveSection {
    readonly activeId: Readonly<Ref<string | null>>;
    readonly measure: () => void;
}

export default function useActiveSection(ids: readonly string[], scrollY: Readonly<Ref<number>>): UseActiveSection {
    const activeId = ref<string | null>(null);

    function crossesLine(id: string): boolean {
        const element = document.getElementById(id);

        if (element === null) {
            return false;
        }

        const { top, bottom } = element.getBoundingClientRect();

        return top <= ACTIVE_SECTION_OFFSET && bottom >= ACTIVE_SECTION_OFFSET;
    }

    function measure(): void {
        activeId.value = ids.find(crossesLine) ?? null;
    }

    onMounted(measure);
    watch(scrollY, measure);

    return { activeId: readonly(activeId), measure };
}
