export interface IProjectLink {
    readonly label: string;
    readonly url: string;
}

export interface IProject {
    readonly name: string;
    readonly context: string;
    readonly text: string;
    readonly links?: readonly IProjectLink[];
}

const PROJECTS: readonly IProject[] = [
    {
        name: "MyLoan",
        context: "Home Credit · C#, Blazor Server, ASP.NET MVC, Sass",
        text: "The app Czech and Slovak customers use to finance a purchase, borrow cash, take an operating lease or consolidate their loans. Most of the steps a customer goes through are ones I own, and it’s where the migration, the accessibility work and the A/B tests happened.",
        links: [
            { label: "Home Credit CZ", url: "https://www.homecredit.cz/pujcky" },
            { label: "Home Credit SK", url: "https://www.homecredit.sk/pozicky" },
        ],
    },
    {
        name: "HomeCredit iOS",
        context: "Home Credit · Swift, SwiftUI, UIKit, MVVM + Coordinator",
        text: "The native iOS app for Czechia and Slovakia, shipping in both stores. I work in the part where a customer applies for a loan, and I ship there on my own: features from spec to release, unit tests on the view models, and the automated UI tests.",
        links: [
            { label: "App Store — CZ", url: "https://apps.apple.com/cz/app/home-credit-cz/id1465789992" },
            { label: "App Store — SK", url: "https://apps.apple.com/sk/app/home-credit-sk/id1468057834" },
        ],
    },
];

export default PROJECTS;
