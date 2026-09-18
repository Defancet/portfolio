/// <reference types="vite/client" />

interface NetworkInformation {
    readonly saveData?: boolean;
}

interface Navigator {
    readonly connection?: NetworkInformation;
}
