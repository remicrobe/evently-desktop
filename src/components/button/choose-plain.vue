<template>
    <v-btn
        :style="`background-color: ${vuetifyColor}; border: 2px solid ${borderColor ?? vuetifyColor}; justify-content: ${justify} !important`"
        class="custom-button content-l-bold"
    >
        <template v-slot:prepend v-if="position === 'prepend'">
            <custom-icons
                v-if="icon"
                :size="iconSize"
                class="mr-n3"
                :icon="icon"
                :color="iconColor"
            >
            </custom-icons>
        </template>

        <template v-slot:append v-if="position === 'append'">
            <custom-icons
                v-if="icon"
                :size="iconSize"
                class="mr-n3"
                :icon="icon"
                :style="justify === 'start' ? 'position: absolute; right: 0; margin-right: 25px !important' : ''"
                :color="iconColor"
            >
            </custom-icons>
        </template>

        <slot>
            {{ placeholder }}
        </slot>
    </v-btn>
</template>

<style scoped>
.custom-button {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    gap: 12px;
    width: 100%;
    padding-top: 25px;
    padding-bottom: 25px;
    background: #FFFFFF;
    border-radius: 16px;
    cursor: pointer;
    text-transform: none;
    letter-spacing: -0.2px;
}

.custom-button:focus,
.custom-button:active {
    outline: none;
    box-shadow: none;
}
</style>

<script setup lang="ts">
import CustomIcons from "../custom-icons.vue"
import { defineProps, defineEmits, computed } from "vue"
import { useTheme } from "vuetify"

const props = defineProps({
    icon: {
        type: String,
        required: false
    },
    placeholder: {
        type: String,
        default: "Choisir une catégorie"
    },
    position: {
        type: String,
        default: 'preprend'
    },
    color: {
        type: String,
        default: 'white'
    },
    iconColor: {
        type: String,
        default: 'black'
    },
    borderColor: {
        type: String,
        default: null
    },
    iconSize: {
        type: Number,
        default: 24
    },
    justify: {
        type: String,
        default: 'center'
    },
    modelValue: Boolean
})

const vuetifyColor = computed(() => {
    return useTheme().global.current.value.colors[props.color] || props.color
})

const emit = defineEmits(["update:modelValue"])
</script>
