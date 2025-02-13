<template>
    <div class="text-field-container">
        <input
            type="text"
            v-model="value"
            class="text-field content-l-semibold"
            placeholder="Dupont"
        />
    </div>
</template>


<script setup lang="ts">
import { ref, watch } from "vue";
import { useI18n } from "vue-i18n";
const { t, locale } = useI18n({ useScope: 'global' });

const props = defineProps(['modelValue'])

const emits = defineEmits(['update:modelValue'])

let value = ref('');

watch(() => value.value, () => {
    emits('update:modelValue', value.value)
})
</script>

<style scoped>
.text-field-container {
    box-sizing: border-box;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    padding: 16px;
    gap: 10px;
    border: 2px solid rgb(var(--v-theme-black-black0));
    border-radius: 16px;
}

.text-field {
    flex: 1;
    background: transparent;
    border: none;
    outline: none;
    color: white;
    font-size: 16px;
}

.text-field::placeholder {
    color: rgb(var(--v-theme-black-black500));
}
</style>
