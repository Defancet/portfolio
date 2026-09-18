import type * as MatterType from "matter-js";

const FIXED_STEP = 1000 / 60;
const WALL_THICKNESS = 400;
const BODY_CHAMFER = 6;
const HELD_SPIN_DAMPING = 0.9;

const BODY_OPTIONS = {
    friction: 0.06,
    frictionAir: 0.035,
    frictionStatic: 0.25,
    restitution: 0.28,
} as const;

const DRAG_OPTIONS = {
    angularStiffness: 0,
    damping: 0.02,
    render: { visible: false },
    stiffness: 0.06,
} satisfies MatterType.IConstraintDefinition & { angularStiffness: number };

type MouseWithHandlers = MatterType.Mouse & {
    readonly mousemove: EventListener;
    readonly mousedown: EventListener;
    readonly mouseup: EventListener;
    readonly mousewheel: EventListener;
};

export interface IPoint {
    readonly x: number;
    readonly y: number;
}

export interface IChip {
    readonly node: HTMLElement;
    readonly body: MatterType.Body;
    readonly width: number;
    readonly height: number;
}

export interface IPhysicsWorld {
    readonly chips: readonly IChip[];
    readonly area: HTMLElement;
    readonly matter: typeof MatterType;
    readonly engine: MatterType.Engine;
    readonly mouse: MouseWithHandlers;
    readonly drag: MatterType.MouseConstraint;
    walls: MatterType.Body[];
}

function clamp(value: number, min: number, max: number): number {
    return Math.min(Math.max(value, min), max);
}

function readAngle(node: HTMLElement): number {
    const { transform } = window.getComputedStyle(node);

    if (transform === "none") {
        return 0;
    }

    const matrix = new DOMMatrixReadOnly(transform);

    return Math.atan2(matrix.b, matrix.a);
}

function createChip(matter: typeof MatterType, node: HTMLElement, areaRect: DOMRect): IChip {
    const rect = node.getBoundingClientRect();
    const width = node.offsetWidth;
    const height = node.offsetHeight;
    const body = matter.Bodies.rectangle(
        rect.left + rect.width / 2 - areaRect.left,
        rect.top + rect.height / 2 - areaRect.top,
        width,
        height,
        { ...BODY_OPTIONS, angle: readAngle(node), chamfer: { radius: Math.min(BODY_CHAMFER, height / 2) } },
    );

    return { node, body, width, height };
}

function buildWalls(matter: typeof MatterType, width: number, height: number): MatterType.Body[] {
    const deep = WALL_THICKNESS;
    const options = { isStatic: true };
    const wall = (x: number, y: number, w: number, h: number): MatterType.Body =>
        matter.Bodies.rectangle(x, y, w, h, options);

    return [
        wall(width / 2, height + deep / 2, width + deep * 2, deep),
        wall(width / 2, -deep / 2, width + deep * 2, deep),
        wall(-deep / 2, height / 2, deep, height + deep * 2),
        wall(width + deep / 2, height / 2, deep, height + deep * 2),
    ];
}

export function createWorld(
    matter: typeof MatterType,
    area: HTMLElement,
    nodes: readonly (HTMLElement | null)[],
): IPhysicsWorld | null {
    const areaRect = area.getBoundingClientRect();
    const chips = nodes
        .filter((node): node is HTMLElement => node !== null && node.offsetWidth > 0 && node.offsetHeight > 0)
        .map((node) => createChip(matter, node, areaRect));

    if (chips.length === 0) {
        return null;
    }

    const engine = matter.Engine.create();

    engine.gravity.y = 0;
    engine.enableSleeping = true;

    const mouse = matter.Mouse.create(area) as MouseWithHandlers;

    area.removeEventListener("wheel", mouse.mousewheel);
    area.removeEventListener("touchmove", mouse.mousemove);
    area.removeEventListener("touchstart", mouse.mousedown);
    area.removeEventListener("touchend", mouse.mouseup);

    const drag = matter.MouseConstraint.create(engine, { constraint: { ...DRAG_OPTIONS }, mouse });
    const walls = buildWalls(matter, area.clientWidth, area.clientHeight);

    matter.Composite.add(engine.world, [...chips.map((chip) => chip.body), ...walls]);
    matter.Composite.add(engine.world, drag);

    return { chips, area, matter, engine, mouse, drag, walls };
}

export function isResting(world: IPhysicsWorld): boolean {
    return world.drag.body === null && world.chips.every((chip) => chip.body.isSleeping);
}

export function step(world: IPhysicsWorld): void {
    world.matter.Engine.update(world.engine, FIXED_STEP);
}

export function render({ node, body, width, height }: IChip): void {
    const x = body.position.x - width / 2;
    const y = body.position.y - height / 2;
    node.style.transform = `translate(${x}px, ${y}px) rotate(${body.angle}rad)`;
}

export function steadyHeld(world: IPhysicsWorld): IChip | null {
    const body: MatterType.Body | null = world.drag.body;

    if (body === null) {
        return null;
    }

    world.matter.Sleeping.set(body, false);
    world.matter.Body.setAngularVelocity(body, body.angularVelocity * HELD_SPIN_DAMPING);

    return world.chips.find((chip) => chip.body === body) ?? null;
}

export function areaPoint(world: IPhysicsWorld, event: MouseEvent): IPoint {
    const rect = world.area.getBoundingClientRect();

    return { x: event.clientX - rect.left, y: event.clientY - rect.top };
}

export function pressPoint(world: IPhysicsWorld, event: MouseEvent): IPoint | null {
    const point = areaPoint(world, event);
    const bodies = world.chips.map((chip) => chip.body);

    return world.matter.Query.point(bodies, point).length > 0 ? point : null;
}

export function replayPress(world: IPhysicsWorld, point: IPoint): void {
    world.mouse.position.x = point.x;
    world.mouse.position.y = point.y;
}

export function beginGrab(world: IPhysicsWorld): void {
    world.mouse.button = 0;
}

export function releaseGrab(world: IPhysicsWorld): void {
    world.mouse.button = -1;
}

export function fitToArea(world: IPhysicsWorld): void {
    const { matter, engine, area, chips } = world;
    const { clientWidth: width, clientHeight: height } = area;

    matter.Composite.remove(engine.world, world.walls);
    world.walls = buildWalls(matter, width, height);
    matter.Composite.add(engine.world, world.walls);

    for (const { body } of chips) {
        const halfWidth = (body.bounds.max.x - body.bounds.min.x) / 2;
        const halfHeight = (body.bounds.max.y - body.bounds.min.y) / 2;
        const x = clamp(body.position.x, halfWidth, Math.max(width - halfWidth, halfWidth));
        const y = clamp(body.position.y, halfHeight, Math.max(height - halfHeight, halfHeight));

        if (x !== body.position.x || y !== body.position.y) {
            matter.Body.setPosition(body, { x, y });
            matter.Body.setVelocity(body, { x: 0, y: 0 });
        }
    }
}

export function destroyWorld(world: IPhysicsWorld): void {
    const { matter, engine, mouse, area } = world;

    area.removeEventListener("mousemove", mouse.mousemove);
    area.removeEventListener("mousedown", mouse.mousedown);
    area.removeEventListener("mouseup", mouse.mouseup);

    matter.Composite.clear(engine.world, false, true);
    matter.Engine.clear(engine);
}
