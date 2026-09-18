import Section from "@/app/router/SectionEnum";

export interface INavItem {
    readonly label: string;
    readonly section: Section;
}

const NAV_ITEMS: readonly INavItem[] = [
    { label: "About.", section: Section.ABOUT },
    { label: "Experience.", section: Section.EXPERIENCE },
    { label: "Skills.", section: Section.SKILLS },
];

export default NAV_ITEMS;
