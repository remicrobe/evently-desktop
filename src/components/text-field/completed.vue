<template>
    <div class="text-field-container">
        <input
            :type="type ?? 'text'"
            v-model="value"
            class="text-field content-l-semibold"
            :placeholder="placeholder"
        />
    </div>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";

const props = defineProps(['modelValue', 'placeholder', 'type'])

const emits = defineEmits(['update:modelValue'])

let value = ref('');

watch(() => value.value, () => {
    emits('update:modelValue', value.value)
})

value.value = props.modelValue;
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
    border: 2px solid #FFFFFF;
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
    color: #b8b6b6;
}
</style>
