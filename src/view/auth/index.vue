<template>
    <v-container
        class="fill-height"
        fluid
    >
        <v-row justify="center" align="center" class="justify-center align-center ma-auto">
            <v-col md="7" cols="12" class="onboarding-card text-start">
                <v-row class="ma-3">
                    <template v-if="step === 1">
                        <v-col md="6" cols="12" class="text-white">
                            <v-row>
                                <v-col md="12" cols="12">
                                    <v-avatar
                                        class="rounded mt-n4"
                                        :rounded="false"
                                        size="35"
                                        image="./assets/logo.png"
                                    ></v-avatar>
                                    <span class="content-h4 ma-auto"> Evently</span>
                                </v-col>
                            </v-row>
                            <br/>
                            <span>
                        {{ t('auth_nevermiss') }} <br/><br/>
                        {{ t('auth_letus') }}
                        </span>
                            <login method="apple" @click="loginWithApple" class="mt-4"></login>
                            <login method="google" @click="loginWithGoogle" class="mt-4"></login>
                            <login method="guest" class="mt-4" @click="router.push('/auth/classic')"></login>
                        </v-col>
                        <v-col md="1" cols="1" class="text-center only-pc">
                            <v-divider
                                style="height: 100%"
                                vertical
                                :thickness="3"
                            ></v-divider>
                        </v-col>
                        <v-col md="5" col="5" class="text-center d-flex only-pc flex-column align-center">
                            <div class="mt-10">
                                {{ t('auth_openapp') }}
                            </div>
                            <qr-code-login
                                @logged="loggedFromClient"
                            ></qr-code-login>
                        </v-col>
                    </template>
                </v-row>
            </v-col>
        </v-row>
    </v-container>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import Login from "../../components/button/login.vue";
import { useUserStore } from "../../stores/User.store";
import QrCodeLogin from "../../components/auth/qr-code-login.vue";
import { useGlobalStore } from "../../stores/Global.store";
import { useI18n } from "vue-i18n";
import { useDisplay } from "vuetify";
let step = ref(1);
const userStore = useUserStore();
const router = useRouter()
const { t, locale } = useI18n({ useScope: 'global' });
const display = useDisplay()

const goToAuth = async () => {
    await router.push('/auth');
}
const isElectron = () => {
    return !!window.ipcRenderer;
}
const loginWithApple = () => {
    const clientId = 'sementa.com.evently.website';
    const redirectUri = 'https://theodev.myftp.org:89/auth/apple-callback';
    const scope = 'name email';
    const responseType = 'code id_token';
    const state = isElectron() ? 'desktop' : 'web';
    const oauthUrl = `https://appleid.apple.com/auth/authorize?response_type=${responseType}&client_id=${encodeURIComponent(clientId)}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${encodeURIComponent(scope)}&state=${encodeURIComponent(state)}&response_mode=form_post`;
    if (isElectron()) {
        window.ipcRenderer.send("auth", oauthUrl);
    } else {
        window.location.href = oauthUrl;
    }
}
const loginWithGoogle = () => {
    const clientId = '1090154088660-9houd9gk2isnkfquk1l6srfc2i8ld2aa.apps.googleusercontent.com';
    const redirectUri = 'https://api.evently-app.fr/auth/google-callback';
    const scope = 'openid profile email';
    const responseType = 'code';
    const state = isElectron() ? 'desktop' : 'web';
    const oauthUrl = `https://accounts.google.com/o/oauth2/v2/auth?scope=${encodeURIComponent(scope)}&response_type=${responseType}&redirect_uri=${encodeURIComponent(redirectUri)}&client_id=${clientId}&state=${encodeURIComponent(state)}`;
    if (isElectron()) {
        window.ipcRenderer.send("auth", oauthUrl);
    } else {
        window.location.href = oauthUrl;
    }
}
const stepTwo = async (userData: any) => {
    const needStepTwo = userData.needStepTwo;
    await userStore.setUser(userData.user, !needStepTwo);
    if (needStepTwo) {
        await router.push('/auth/step-two');
    } else {
        await useGlobalStore.init()
        await router.push('/app');
    }
}
const loggedFromClient = async (token: string) => {
    if (await userStore.refreshUserWithRefreshToken(token)) {
        await useGlobalStore.init()
        await router.push('/app')
    }
}
if (window.ipcRenderer) {
    window.ipcRenderer.on('auth', (event, message) => {
        stepTwo(message);
    });
}

onMounted(async () => {
    const base64Data = router.currentRoute.value.query?.data;
    if (base64Data) {
        try {
            const decodedData = atob(base64Data as string);
            const userData = JSON.parse(decodedData);
            await stepTwo(userData);
        } catch (error) {
            console.error('Failed to decode or parse Base64 data:', error);
        }
    }
});

</script>
<style scoped>
.onboarding-card {
    border: 1px solid rgb(var(--v-theme-black-black200));
    border-radius: 32px;
    background-color: rgb(var(--v-theme-black-black100));
}

@media (max-width: 960px) {
    .only-pc {
        display: none !important;
    }
}
</style>