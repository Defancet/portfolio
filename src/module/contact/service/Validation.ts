export interface IContactForm {
    name: string;
    email: string;
    subject: string;
    message: string;
}

export type ContactFieldKey = keyof IContactForm;

const EMAIL_PATTERN = /^[\w.+-]+@[\w-]+(?:\.[\w-]+)+$/;

const REQUIRED_MESSAGE: Record<ContactFieldKey, string> = {
    name: "* What is your name?",
    email: "* What is your email?",
    subject: "* What is the subject?",
    message: "* Write a message.",
};

const INVALID_EMAIL_MESSAGE = "* Please enter a valid email address.";

export function validateField(key: ContactFieldKey, value: string): string | null {
    const trimmed = value.trim();

    if (trimmed.length === 0) {
        return REQUIRED_MESSAGE[key];
    }

    if (key === "email" && !EMAIL_PATTERN.test(trimmed)) {
        return INVALID_EMAIL_MESSAGE;
    }

    return null;
}

export function createEmptyForm(): IContactForm {
    return { name: "", email: "", subject: "", message: "" };
}
