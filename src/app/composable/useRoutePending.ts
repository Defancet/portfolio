import { onBeforeUnmount, readonly, ref, type Ref } from "vue";
import { useRouter } from "vue-router";

const SHOW_AFTER = 150;

export interface UseRoutePending {
    readonly isPending: Readonly<Ref<boolean>>;
}

export default function useRoutePending(): UseRoutePending {
    const isPending = ref(false);
    const router = useRouter();
    let timer = 0;

    function settle(): void {
        if (timer !== 0) {
            window.clearTimeout(timer);
            timer = 0;
        }

        isPending.value = false;
    }

    function hold(): void {
        settle();
        timer = window.setTimeout(() => {
            isPending.value = true;
        }, SHOW_AFTER);
    }

    const stopWatching = [
        router.beforeEach((to, from) => {
            if (to.path !== from.path) {
                hold();
            }
        }),
        router.afterEach(settle),
        router.onError(settle),
    ];

    if (router.currentRoute.value.matched.length === 0) {
        hold();
    }

    onBeforeUnmount(() => {
        settle();

        for (const stop of stopWatching) {
            stop();
        }
    });

    return { isPending: readonly(isPending) };
}
