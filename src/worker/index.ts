import Path from "@/app/router/PathEnum";
import {
    createEmptyForm,
    validateField,
    type ContactFieldKey,
    type IContactForm,
} from "@/module/contact/service/Validation";

interface IEnv {
    readonly RESEND_API_KEY: string;
    readonly CONTACT_TO: string;
    readonly CONTACT_FROM: string;
}

const CONTACT_ENDPOINT = "/api/contact";
const RESEND_ENDPOINT = "https://api.resend.com/emails";
const HONEYPOT_FIELD = "_honey";

const FIELD_LIMIT: Record<ContactFieldKey, number> = {
    name: 50,
    email: 254,
    subject: 100,
    message: 500,
};

const FIELDS = Object.keys(FIELD_LIMIT) as readonly ContactFieldKey[];

function redirectTo(request: Request, path: string): Response {
    return Response.redirect(new URL(path, request.url).toString(), 303);
}

function readForm(data: FormData): IContactForm {
    const form = createEmptyForm();

    for (const key of FIELDS) {
        const value = data.get(key);

        form[key] = typeof value === "string" ? value.trim().slice(0, FIELD_LIMIT[key]) : "";
    }

    return form;
}

function isComplete(form: IContactForm): boolean {
    return FIELDS.every((key) => validateField(key, form[key]) === null);
}

function composeText(form: IContactForm): string {
    return `${form.message}\n\n—\n${form.name} <${form.email}>\nSent from kalutski.com`;
}

async function sendEmail(form: IContactForm, env: IEnv): Promise<boolean> {
    const response = await fetch(RESEND_ENDPOINT, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${env.RESEND_API_KEY}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            from: env.CONTACT_FROM,
            to: env.CONTACT_TO,
            reply_to: `${form.name} <${form.email}>`,
            subject: `kalutski.com — ${form.subject}`,
            text: composeText(form),
        }),
    });

    if (!response.ok) {
        console.error(`Resend refused the message: ${response.status} ${await response.text()}`);
    }

    return response.ok;
}

function undeliverable(env: IEnv): Response {
    return new Response(
        `<!doctype html><meta charset="utf-8"><title>Message not sent</title>` +
            `<p>The message could not be sent. Please write to <a href="mailto:${env.CONTACT_TO}">${env.CONTACT_TO}</a> directly.</p>`,
        { status: 502, headers: { "Content-Type": "text/html; charset=utf-8" } },
    );
}

export default {
    async fetch(request: Request, env: IEnv): Promise<Response> {
        const { pathname } = new URL(request.url);

        if (pathname !== CONTACT_ENDPOINT) {
            return new Response("Not found", { status: 404 });
        }

        if (request.method !== "POST") {
            return new Response("Method not allowed", { status: 405, headers: { Allow: "POST" } });
        }

        const data = await request.formData();

        if (String(data.get(HONEYPOT_FIELD) ?? "").length > 0) {
            return redirectTo(request, Path.FORM_SUBMITTED);
        }

        const form = readForm(data);

        if (!isComplete(form)) {
            return redirectTo(request, Path.CONTACT);
        }

        if (!(await sendEmail(form, env))) {
            return undeliverable(env);
        }

        return redirectTo(request, Path.FORM_SUBMITTED);
    },
};
