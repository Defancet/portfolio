const MIN_DURATION = 320;
const MAX_DURATION = 900;
const BASE_DURATION = 240;
const PER_PIXEL = 0.22;
const SPRING_RATE = 7;
const SETTLED = 1 - (1 + SPRING_RATE) * Math.exp(-SPRING_RATE);
const INTERRUPTS = ["wheel", "touchstart", "keydown"] as const;

let stopCurrent: (() => void) | null = null;

function eased(fraction: number): number {
    const t = fraction * SPRING_RATE;

    return (1 - (1 + t) * Math.exp(-t)) / SETTLED;
}

function durationFor(distance: number): number {
    return Math.min(MAX_DURATION, Math.max(MIN_DURATION, BASE_DURATION + distance * PER_PIXEL));
}

export function scrollToY(target: number): void {
    stopCurrent?.();

    const start = window.scrollY;
    const distance = target - start;

    if (Math.abs(distance) < 1 || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        window.scrollTo({ top: target });

        return;
    }

    const duration = durationFor(Math.abs(distance));
    const startedAt = performance.now();
    let frame = 0;

    function stop(): void {
        window.cancelAnimationFrame(frame);

        for (const type of INTERRUPTS) {
            window.removeEventListener(type, stop);
        }

        stopCurrent = null;
    }

    function tick(now: number): void {
        const fraction = Math.min(1, (now - startedAt) / duration);

        window.scrollTo({ top: start + distance * eased(fraction) });

        if (fraction < 1) {
            frame = window.requestAnimationFrame(tick);
        } else {
            stop();
        }
    }

    stopCurrent = stop;

    for (const type of INTERRUPTS) {
        window.addEventListener(type, stop, { passive: true, once: true });
    }

    frame = window.requestAnimationFrame(tick);
}

export function scrollToElement(element: Element): void {
    scrollToY(window.scrollY + element.getBoundingClientRect().top);
}

export function isScrolling(): boolean {
    return stopCurrent !== null;
}
