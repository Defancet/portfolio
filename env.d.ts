/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_FORMSUBMIT_ENDPOINT: string;
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}

interface NetworkInformation {
    readonly saveData?: boolean;
}

interface Navigator {
    readonly connection?: NetworkInformation;
}
