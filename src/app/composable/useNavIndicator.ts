import { computed, onBeforeUnmount, onMounted, ref, type ComputedRef, type Ref } from "vue";

const CURRENT_LINK = ".header__item--active .header__link";

function offsetWithin(node: HTMLElement, container: HTMLElement): { x: number; y: number } {
    let x = 0;
    let y = 0;
    let current: HTMLElement | null = node;

    while (current !== null && current !== container) {
        x += current.offsetLeft;
        y += current.offsetTop;
        current = current.offsetParent as HTMLElement | null;
    }

    return { x, y };
}

interface IBox {
    readonly x: number;
    readonly y: number;
    readonly width: number;
    readonly height: number;
}

export interface UseNavIndicator {
    readonly style: ComputedRef<Record<string, string>>;
    readonly marked: Readonly<Ref<boolean>>;
    readonly placing: Readonly<Ref<boolean>>;
    readonly appearing: Readonly<Ref<boolean>>;
    readonly measure: (instant?: boolean) => void;
}

export default function useNavIndicator(list: Readonly<Ref<HTMLElement | null>>): UseNavIndicator {
    const box = ref<IBox>({ x: 0, y: 0, width: 0, height: 0 });
    const marked = ref(false);
    const placing = ref(false);
    const appearing = ref(false);
    let observer: ResizeObserver | null = null;
    let frame = 0;

    function suppressMove(appear: boolean): void {
        placing.value = true;
        appearing.value = appear;
        cancelAnimationFrame(frame);
        frame = requestAnimationFrame(() => {
            frame = requestAnimationFrame(() => {
                placing.value = false;
                appearing.value = false;
            });
        });
    }

    function measure(instant = false): void {
        const element = list.value;
        const current = element?.querySelector<HTMLElement>(CURRENT_LINK) ?? null;

        const appear = !marked.value;
        const jump = instant || appear;
        marked.value = current !== null;

        if (element === null || current === null) {
            return;
        }

        if (jump) {
            suppressMove(appear);
        }

        const { x, y } = offsetWithin(current, element);

        box.value = { x, y, width: current.offsetWidth, height: current.offsetHeight };
    }

    const style = computed(() => ({
        "--capsule-x": `${box.value.x}px`,
        "--capsule-y": `${box.value.y}px`,
        "--capsule-w": `${box.value.width}px`,
        "--capsule-h": `${box.value.height}px`,
    }));

    onMounted(() => {
        measure(true);

        void document.fonts.ready.then(() => measure(true));

        if (list.value !== null) {
            observer = new ResizeObserver(() => measure(true));
            observer.observe(list.value);
        }
    });

    onBeforeUnmount(() => {
        cancelAnimationFrame(frame);
        observer?.disconnect();
        observer = null;
    });

    return { style, marked, placing, appearing, measure };
}
