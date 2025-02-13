<template>
    <v-container
        class="fill-height"
        fluid
    >
        <v-row justify="center" align="center">
            <v-col md="12" cols="12" justify="center" align="center">
                <div class="animation-wrapper">
                    <Vue3Lottie
                        :animation-data="animation"
                        :height="300"
                        :loop="false"
                        :width="300"
                        @onComplete="handleAnimationComplete"
                    ></Vue3Lottie>
                </div>

                <div>
                    <v-progress-circular v-if="animationEnded" color="white" indeterminate></v-progress-circular>
                </div>
            </v-col>
        </v-row>
    </v-container>
</template>

<script setup lang="ts">
import { Vue3Lottie } from "vue3-lottie";
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useUserStore } from "../../stores/User.store";
import { useGlobalStore } from "../../stores/Global.store";
import animation from '../../animation/splash.json';

const animationEnded = ref(false);
const router = useRouter();
const userStore = useUserStore();

async function handleAnimationComplete() {
    animationEnded.value = true;

    if (await userStore.refreshUserWithRefreshToken()) {
        await useGlobalStore.init()
        await router.push('/app/')
    } else {
        await router.push('/onboarding');
    }

}
</script>


<style scoped>
.container {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    position: relative;
}

.animation-wrapper {
    flex-grow: 1;
    display: flex;
    justify-content: center;
    align-items: center;
}
</style>