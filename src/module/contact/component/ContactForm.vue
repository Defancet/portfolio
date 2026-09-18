<template>
    <form class="form" action="/api/contact" method="POST" @submit="onSubmit">
        <input type="text" name="_honey" style="display: none" tabindex="-1" autocomplete="off" />

        <contact-field
            v-for="field in FIELDS"
            :key="field.key"
            v-model="form[field.key]"
            :id="field.id"
            :name="field.key"
            :placeholder="field.placeholder"
            :maxlength="field.maxlength"
            :type="field.type"
            :multiline="field.multiline"
            :error="errors[field.key]"
            :valid="isValid(field.key)"
            @blur="validate(field.key)"
        />

        <div class="form__actions">
            <slot name="secondary" />
            <button :class="['form__submit', { 'form__submit--sending': sending }]" type="submit">
                <span>Send Message</span>
                <svg class="form__send" viewBox="0 -960 960 960" aria-hidden="true">
                    <path
                        d="M120-160v-640l760 320-760 320Zm60-93 544-227-544-230v168l242 62-242 60v167Zm0 0v-457 457Z"
                    />
                </svg>
            </button>
        </div>
        <span v-if="showSubmitError" class="form__message">* Please fill in every field.</span>
    </form>
</template>

<script setup lang="ts">
import ContactField from "./ContactField.vue";
import { onBeforeUnmount, reactive, ref } from "vue";
import { createEmptyForm, validateField, type ContactFieldKey } from "@/module/contact/service/Validation";

interface IFieldDescriptor {
    readonly key: ContactFieldKey;
    readonly id: string;
    readonly placeholder: string;
    readonly maxlength: number;
    readonly type?: string;
    readonly multiline?: boolean;
}

const FIELDS: readonly IFieldDescriptor[] = [
    { key: "name", id: "contact-name", placeholder: "Your Name", maxlength: 50 },
    { key: "email", id: "contact-email", placeholder: "Your Email", maxlength: 254, type: "email" },
    { key: "subject", id: "contact-subject", placeholder: "Subject", maxlength: 100 },
    { key: "message", id: "contact-message", placeholder: "Message", maxlength: 500, multiline: true },
];

const SUBMIT_ERROR_TIMEOUT = 3000;

const form = reactive(createEmptyForm());
const errors = reactive<Record<ContactFieldKey, string | null>>({
    name: null,
    email: null,
    subject: null,
    message: null,
});
const touched = reactive<Record<ContactFieldKey, boolean>>({
    name: false,
    email: false,
    subject: false,
    message: false,
});
const showSubmitError = ref(false);
const sending = ref(false);
let submitErrorTimer = 0;

function validate(key: ContactFieldKey): void {
    touched[key] = true;
    errors[key] = validateField(key, form[key]);
}

function isValid(key: ContactFieldKey): boolean {
    return touched[key] && errors[key] === null;
}

function flashSubmitError(): void {
    showSubmitError.value = true;

    window.clearTimeout(submitErrorTimer);
    submitErrorTimer = window.setTimeout(() => {
        showSubmitError.value = false;
    }, SUBMIT_ERROR_TIMEOUT);
}

function onSubmit(event: Event): void {
    for (const field of FIELDS) {
        validate(field.key);
    }

    if (FIELDS.every((field) => errors[field.key] === null)) {
        sending.value = true;

        return;
    }

    event.preventDefault();
    flashSubmitError();
}

onBeforeUnmount(() => window.clearTimeout(submitErrorTimer));
</script>
