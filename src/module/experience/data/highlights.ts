export interface IHighlight {
    readonly lead: string;
    readonly text: string;
}

const HIGHLIGHTS: readonly IHighlight[] = [
    {
        lead: "A/B tests, from the idea to the rollout",
        text: "I build the variant, ship it, and wait for the numbers. Then either it goes out to everyone or the whole thing gets deleted. One of mine put funnel throughput up two points in Slovakia and made applications quicker to get through.",
    },
    {
        lead: "I own whole features, not just the front of them",
        text: "A requirement comes in and it stays mine until a customer can complete it. That means the screens, the validation, the rules about which step comes next, the Czech and Slovak text, and the logging the analysts read.",
    },
    {
        lead: "Migrating legacy code while still shipping",
        text: "The parts of the app I own moved onto the new framework as I worked on them, a feature at a time. The old hand-written JavaScript went with them, replaced by components the next screen can reuse.",
    },
    {
        lead: "Regulatory deadlines in two countries",
        text: "When the law changes, both apps have to change with it by a fixed date. I’ve done that on the web side and then on iOS, and got the two to behave the same way.",
    },
    {
        lead: "Native iOS, not just web",
        text: "I ship iOS features on my own, with unit tests on the view models and the automated UI tests that go with them. I learned the platform in about four months.",
    },
    {
        lead: "Production support",
        text: "When something breaks for a customer halfway through an application, I’m usually the one who picks it up.",
    },
];

export default HIGHLIGHTS;
