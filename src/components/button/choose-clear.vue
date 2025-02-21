<template>
    <v-btn
        class="custom-button content-l-bold"
        :style="`justify-content: ${justify} !important`"
    >
        <template
            v-slot:prepend
            v-if="position === 'prepend'"
        >
            <custom-icons
                v-if="icon"
                :size="iconSize"
                class="mr-n2"
                :icon="icon"
                color="white"
            >
            </custom-icons>
        </template>

        <template
            v-slot:append
            v-if="position === 'append'"
        >
            <custom-icons
                v-if="icon"
                :size="iconSize"
                class="mr-n2"
                :icon="icon"
                :style="justify === 'start' ? 'position: absolute; right: 0; margin-right: 25px !important' : ''"
                color="white"
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
    background: transparent;
    border-radius: 16px;
    border: 2px solid #FFFFFF;
    cursor: pointer;
    text-transform: none;
    letter-spacing: -0.2px;
    color: white;
    box-sizing: border-box;
    flex: none;
    order: 1;
    align-self: stretch;
    flex-grow: 0;
}

.custom-button:focus,
.custom-button:active {
    outline: none;
    box-shadow: none;
}
</style>

<script setup lang="ts">
import CustomIcons from "../custom-icons.vue"
import { defineProps, defineEmits } from "vue"

const props = defineProps({
    icon: {
        type: String,
        default: 'plusCircle'
    },
    iconSize: {
        type: Number,
        default: 24
    },
    position: {
        type: String,
        default: 'preprend'
    },
    placeholder: {
        type: String,
        default: "Choisir une catégorie"
    },
    justify: {
        type: String,
        default: 'center'
    },
})
</script>
