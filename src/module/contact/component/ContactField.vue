<template>
    <div class="form__group">
        <span class="form__message" :class="{ 'form__message--valid': valid }">
            <svg v-if="valid" class="form__check" viewBox="0 0 24 24" aria-hidden="true">
                <circle cx="12" cy="12" r="9" />
                <path d="M8 12.5l2.75 2.75L16 9.5" />
            </svg>
            <template v-else>{{ error }}</template>
        </span>
        <textarea
            v-if="multiline"
            :id="id"
            v-model="model"
            class="form__input"
            :class="{ 'form__input--valid': valid }"
            :name="name"
            :placeholder="placeholder"
            :maxlength="maxlength"
            rows="5"
            @blur="emit('blur')"
        />
        <input
            v-else
            :id="id"
            v-model="model"
            class="form__input"
            :class="{ 'form__input--valid': valid }"
            :type="type"
            :name="name"
            :placeholder="placeholder"
            :maxlength="maxlength"
            @blur="emit('blur')"
        />
    </div>
</template>

<script setup lang="ts">
const {
    id,
    name,
    placeholder,
    maxlength,
    type = "text",
    multiline = false,
    error = null,
    valid = false,
} = defineProps<{
    id: string;
    name: string;
    placeholder: string;
    maxlength: number;
    type?: string;
    multiline?: boolean;
    error?: string | null;
    valid?: boolean;
}>();

const emit = defineEmits<{ blur: [] }>();

const model = defineModel<string>({ required: true });
</script>
