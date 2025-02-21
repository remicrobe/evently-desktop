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
import {Vue3Lottie} from "vue3-lottie";
import {ref} from "vue";
import {useRouter} from "vue-router";
import {useUserStore} from "../../stores/User.store";
import {useGlobalStore} from "../../stores/Global.store";
import animation from '../../animation/splash.json';
import {useToastStore} from "../../stores/Toast.store";
import {useEventStore} from "../../stores/Event.store";

const animationEnded = ref(false);
const router = useRouter();
const userStore = useUserStore();

const token = ref(router.currentRoute.value.params.token)

if (token.value) {
    window.location.href = `evently://invite?inviteToken=${token.value}`;
}

async function handleAnimationComplete() {
    animationEnded.value = true;

    if (await userStore.refreshUserWithRefreshToken()) {
        await useGlobalStore.init()

        if (token.value) {
            await useEventStore().joinEvent(token.value as string)
        }

        await router.push('/app/')
    } else {
        if (token.value) {
            useToastStore().success({ key: 'toast_error_joining_no_log' });
        }

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