<template>
    <Teleport to="body">
        <v-container class="toaster__wrapper" v-if="toastStore.toasts.length">
            <div
                v-for="toast in toastStore.toasts"
                :key="toast.text"
                class="toaster__inner"
                v-bind:style="{ animation: 'fadeOut 1s ease-out forwards' }"
            >
                <span class="toaster__inner-text text-white mt-5 mb-5">{{ toast.text }}</span>
            </div>
        </v-container>
    </Teleport>
</template>

<script setup lang="ts">
import { useToastStore } from "../../stores/Toast.store";

const toastStore = useToastStore();
</script>

<style scoped lang="scss">
.toaster__wrapper {
    position: fixed;
    top: 0;
    left: 50%;
    transform: translateX(-50%);
    z-index: 99999999999999;
    display: flex;
    flex-direction: column;
    gap: 1rem;
    width: 500px;
    padding: 10px;
}

@media (max-width: 1200px) {
    .toaster__wrapper {
        width: 90% !important;
    }
}

.toaster__inner {
    width: 100%; /* Prend toute la largeur de son conteneur */
    border: 1px solid rgb(var(--v-theme-black-black200));
    border-radius: 32px;
    background-color: rgb(var(--v-theme-black-black100));
    display: flex;
    justify-content: center;
    align-items: center;
}

.toaster__inner-text {
    text-align: center; /* Centre le texte */
}

/* Animation pour fade-out */
@keyframes fadeOut {
    0% {
        opacity: 1;
    }
    100% {
        opacity: 0;
        transform: translateY(-20px);
    }
}
</style>
