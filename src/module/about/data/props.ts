import bemeve from "@/assets/images/bemeve.webp";
import dualsense from "@/assets/images/dualsense.webp";
import nanana from "@/assets/images/nanana.webp";

interface IProp {
    readonly name: string;
    readonly src: string;
    readonly alt: string;
    readonly width: number;
    readonly height: number;
}

const PROPS: readonly IProp[] = [
    { name: "car", src: bemeve, alt: "A dark green BMW M3, seen from the side", width: 914, height: 428 },
    { name: "record", src: nanana, alt: "Peggy Gou — It Goes Like Nanana, on vinyl", width: 1000, height: 1000 },
    { name: "controller", src: dualsense, alt: "A PlayStation DualSense controller", width: 985, height: 695 },
];

export default PROPS;
