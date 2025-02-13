<template>
    <v-app>
        <v-main>
            <toast></toast>
            <update-modal></update-modal>

            <router-view v-slot="{ Component }">
                <!--                    <transition name="fade" mode="out-in">-->
                <component :is="Component"/>
                <!--                    </transition>-->
            </router-view>
        </v-main>
    </v-app>
</template>

<script setup lang="ts">
import Default from "./components/layout/default.vue";
import { useRouter } from "vue-router";
import { computed } from "vue";
import Toast from "./components/global/toast.vue";
import UpdateModal from "./components/dialog/update-modal.vue";

const router = useRouter()

if (window.ipcRenderer) {
    window.ipcRenderer.invoke('ready');
}
</script>

<style>
::-webkit-scrollbar {
    display: none;
}

* {
    -webkit-user-drag: none; /* Pour les navigateurs WebKit (Chrome, Safari) */
    user-drag: none; /* Pour les autres navigateurs */
    -webkit-user-select: none; /* Pour les navigateurs WebKit (Chrome, Safari) */
    user-select: none; /* Pour les autres navigateurs */
}

.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}

</style>