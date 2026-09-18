import { onBeforeUnmount, onMounted, type Ref } from "vue";
import {
    areaPoint,
    beginGrab,
    createWorld,
    destroyWorld,
    fitToArea,
    isResting,
    releaseGrab,
    render,
    pressPoint,
    replayPress,
    step,
    steadyHeld,
    type IChip,
    type IPhysicsWorld,
    type IPoint,
} from "@/app/service/PhysicsWorld";

const MEASURE_TIMEOUT = 2000;

interface IPhysicsBodiesOptions {
    readonly area: Readonly<Ref<HTMLElement | null>>;
    readonly nodes: Readonly<Ref<readonly (HTMLElement | null)[]>>;
    readonly activeClass: string;
    readonly heldClass: string;
    readonly flow?: Readonly<Ref<HTMLElement | null>>;
}

interface ISession {
    readonly world: IPhysicsWorld;
    readonly resize: ResizeObserver;
    held: IChip | null;
    press: IPoint | null;
    finger: number | null;
}

export default function usePhysicsBodies({ area, nodes, activeClass, heldClass, flow }: IPhysicsBodiesOptions): void {
    let session: ISession | null = null;
    let observer: IntersectionObserver | null = null;
    let sizing: ResizeObserver | null = null;
    let frame = 0;
    let starting = false;

    function isSupported(): boolean {
        return !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    }

    function unmeasured(): HTMLElement[] {
        return nodes.value.filter(
            (node): node is HTMLElement =>
                node !== null &&
                window.getComputedStyle(node).display !== "none" &&
                (node.offsetWidth === 0 || node.offsetHeight === 0),
        );
    }

    function whenMeasurable(): Promise<void> {
        const waiting = unmeasured();

        if (waiting.length === 0) {
            return Promise.resolve();
        }

        return new Promise((resolve) => {
            const done = (): void => {
                window.clearTimeout(timer);
                sizing?.disconnect();
                sizing = null;
                resolve();
            };
            const timer = window.setTimeout(done, MEASURE_TIMEOUT);

            sizing = new ResizeObserver(() => {
                if (unmeasured().length === 0) {
                    done();
                }
            });

            for (const node of waiting) {
                sizing.observe(node);
            }
        });
    }

    function setHeld(chip: IChip | null): void {
        if (session === null || session.held === chip) {
            return;
        }

        session.held?.node.classList.remove(heldClass);
        chip?.node.classList.add(heldClass);
        session.held = chip;
    }

    function tick(): void {
        if (session === null) {
            return;
        }

        frame = window.requestAnimationFrame(tick);

        const { world, press } = session;

        if (press === null && isResting(world)) {
            return;
        }

        const held = steadyHeld(world);

        if (held === null && press !== null) {
            replayPress(world, press);
        }

        session.press = null;
        setHeld(held);
        step(world);

        for (const chip of world.chips) {
            render(chip);
        }
    }

    function play(): void {
        if (frame === 0 && session !== null) {
            frame = window.requestAnimationFrame(tick);
        }
    }

    function pause(): void {
        if (frame !== 0) {
            window.cancelAnimationFrame(frame);
            frame = 0;
        }
    }

    function onPointerDown(event: MouseEvent): void {
        if (session !== null) {
            session.press = pressPoint(session.world, event);
        }
    }

    function onWindowUp(): void {
        if (session !== null) {
            releaseGrab(session.world);
        }
    }

    function onFingerDown(event: PointerEvent): void {
        if (session === null || event.pointerType === "mouse" || session.finger !== null) {
            return;
        }

        const point = pressPoint(session.world, event);

        if (point === null) {
            return;
        }

        session.finger = event.pointerId;
        session.press = point;
        beginGrab(session.world);

        if (event.target instanceof Element) {
            event.target.setPointerCapture(event.pointerId);
        }
    }

    function onFingerMove(event: PointerEvent): void {
        if (session !== null && session.finger === event.pointerId) {
            replayPress(session.world, areaPoint(session.world, event));
        }
    }

    function onFingerUp(event: PointerEvent): void {
        if (session === null || session.finger !== event.pointerId) {
            return;
        }

        session.finger = null;
        releaseGrab(session.world);
    }

    async function start(): Promise<void> {
        const el = area.value;

        if (starting || session !== null || el === null) {
            return;
        }

        starting = true;

        const [matter] = await Promise.all([import("matter-js").then((module) => module.default), whenMeasurable()]);

        if (area.value !== el) {
            starting = false;
            return;
        }

        const world = createWorld(matter, el, nodes.value);

        starting = false;

        if (world === null) {
            return;
        }

        const resize = new ResizeObserver(() => fitToArea(world));

        resize.observe(el);
        session = { world, resize, held: null, press: null, finger: null };

        const flowEl = flow?.value ?? null;

        if (flowEl !== null) {
            flowEl.style.height = `${flowEl.getBoundingClientRect().height}px`;
        }

        for (const chip of world.chips) {
            chip.node.classList.add(activeClass);
            render(chip);
        }

        el.addEventListener("mousedown", onPointerDown, { passive: true });
        el.addEventListener("pointerdown", onFingerDown, { passive: true });
        el.addEventListener("pointermove", onFingerMove, { passive: true });
        window.addEventListener("mouseup", onWindowUp, { passive: true });
        window.addEventListener("pointerup", onFingerUp, { passive: true });
        window.addEventListener("pointercancel", onFingerUp, { passive: true });
        window.addEventListener("blur", onWindowUp);

        play();
    }

    function stop(): void {
        pause();

        if (session === null) {
            return;
        }

        const { world, resize } = session;

        window.removeEventListener("mouseup", onWindowUp);
        window.removeEventListener("pointerup", onFingerUp);
        window.removeEventListener("pointercancel", onFingerUp);
        window.removeEventListener("blur", onWindowUp);

        world.area.removeEventListener("mousedown", onPointerDown);
        world.area.removeEventListener("pointerdown", onFingerDown);
        world.area.removeEventListener("pointermove", onFingerMove);
        resize.disconnect();

        setHeld(null);
        destroyWorld(world);

        for (const { node } of world.chips) {
            node.style.transform = "";
            node.classList.remove(activeClass);
        }

        const flowEl = flow?.value ?? null;

        if (flowEl !== null) {
            flowEl.style.height = "";
        }

        session = null;
    }

    onMounted(() => {
        const el = area.value;

        if (el === null || !isSupported()) {
            return;
        }

        observer = new IntersectionObserver((entries) => {
            if (!entries.some((entry) => entry.isIntersecting)) {
                pause();
            } else if (session === null) {
                void start();
            } else {
                play();
            }
        });

        observer.observe(el);
    });

    onBeforeUnmount(() => {
        observer?.disconnect();
        observer = null;
        sizing?.disconnect();
        sizing = null;
        stop();
    });
}
