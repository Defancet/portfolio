import type { Directive } from "vue";

const REVEAL_CLASS = "reveal";
const VISIBLE_CLASS = "reveal--visible";
const ROOT_MARGIN = "0px 0px -100px 0px";

let observer: IntersectionObserver | null = null;

function getObserver(): IntersectionObserver {
    observer ??= new IntersectionObserver(
        (entries) => {
            for (const entry of entries) {
                if (!entry.isIntersecting) {
                    continue;
                }

                entry.target.classList.add(VISIBLE_CLASS);
                observer?.unobserve(entry.target);
            }
        },
        { rootMargin: ROOT_MARGIN },
    );

    return observer;
}

const reveal: Directive<HTMLElement> = {
    mounted(el) {
        el.classList.add(REVEAL_CLASS);
        getObserver().observe(el);
    },
    unmounted(el) {
        observer?.unobserve(el);
    },
};

export default reveal;
