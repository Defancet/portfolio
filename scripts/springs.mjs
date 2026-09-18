

const SETTLE_EPSILON = 0.001;

function springPosition(t, zeta, response) {
    const omega0 = (2 * Math.PI) / response;

    if (zeta >= 1) {
        return 1 - (1 + omega0 * t) * Math.exp(-omega0 * t);
    }

    const wd = omega0 * Math.sqrt(1 - zeta * zeta);
    const decay = Math.exp(-zeta * omega0 * t);

    return 1 - decay * (Math.cos(wd * t) + ((zeta * omega0) / wd) * Math.sin(wd * t));
}

function settleTime(zeta, response) {
    const step = 1 / 1000;
    let lastUnsettled = 0;

    for (let t = 0; t <= 5; t += step) {
        if (Math.abs(springPosition(t, zeta, response) - 1) > SETTLE_EPSILON) {
            lastUnsettled = t;
        }
    }

    return lastUnsettled + step;
}

function toLinear(zeta, response, samples = 24) {
    const duration = settleTime(zeta, response);
    const stops = [];

    for (let i = 0; i <= samples; i += 1) {
        const progress = i / samples;
        const value = springPosition(progress * duration, zeta, response);
        stops.push(`${value.toFixed(4).replace(/0+$/, "").replace(/\.$/, "")} ${(progress * 100).toFixed(2)}%`);
    }

    
    stops[0] = "0 0%";
    stops[stops.length - 1] = "1 100%";

    return { duration, css: `linear(${stops.join(", ")})` };
}

const SPRINGS = [
    ["springGentle", 1.0, 0.55, "large surfaces: scroll reveal"],
    ["spring", 1.0, 0.4, "default UI: move / reposition"],
    ["springSheet", 0.8, 0.3, "momentum: sheets, menus, flicks"],
    ["springMicro", 1.0, 0.22, "micro-interactions: press release, hover"],
];

for (const [name, zeta, response, note] of SPRINGS) {
    const { duration, css } = toLinear(zeta, response);
    const peak = Math.max(...Array.from({ length: 400 }, (_, i) => springPosition((i / 400) * duration, zeta, response)));
    console.log(`\n// ${name} — damping ${zeta.toFixed(1)}, response ${response}s (${note})`);
    console.log(`// settle ${(duration * 1000).toFixed(0)}ms, overshoot ${((peak - 1) * 100).toFixed(1)}%`);
    console.log(`duration: ${Math.round(duration * 1000)}ms`);
    console.log(css);
}
