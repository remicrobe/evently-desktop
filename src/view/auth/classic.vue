<template>
    <v-container
        class="fill-height"
        fluid
    >
        <v-row justify="center" align="center" class="justify-center align-center ma-auto" >
            <v-col md="4" cols="12" class="onboarding-card text-start">
                <v-row class="ma-3">
                    <v-col md="12" cols="12">
                        <span>{{ t('auth_email') }}</span>
                        <completed v-model="email" class="mb-6 mt-1" placeholder="theo@gmail.com"></completed>
                    </v-col>

                    <template v-if="needLogin">
                        <v-col md="12" cols="12" class="mt-n8">
                            <span>{{ t('auth_password') }}</span>
                            <completed v-model="password" class="mb-6 mt-1" placeholder="P@ssword"
                                       type="password"></completed>
                        </v-col>
                    </template>

                    <template v-if="needRegister">
                        <v-col md="12" cols="12" class="mt-n8">
                            <span>{{ t('auth_last_name') }}</span>
                            <completed v-model="lastName" class="mb-6 mt-1" placeholder="SEMENTA"></completed>
                        </v-col>

                        <v-col md="12" cols="12" class="mt-n8">
                            <span>{{ t('auth_first_name') }}</span>
                            <completed v-model="firstName" class="mb-6 mt-1" placeholder="Theo"></completed>
                        </v-col>

                        <v-col md="12" cols="12" class="mt-n8">
                            <span>{{ t('auth_password') }}</span>
                            <completed v-model="password" class="mb-6 mt-1" placeholder="P@ssword"
                                       type="password"></completed>
                        </v-col>

                        <v-col md="12" cols="12" class="mt-n8">
                            <span>{{ t('auth_confirm_password') }}</span>
                            <completed v-model="confirmPassword" class="mb-6 mt-1" placeholder="P@ssword"
                                       type="password"></completed>
                        </v-col>
                    </template>

                    <v-col md="12" cols="12">
                        <choose-plain
                            v-if="needLogin"
                            @click="login"
                            :placeholder="t('auth_connection')"
                            icon="sparkes"
                            :class="email?.length > 0 && password?.length > 0 ? 'content-l-bold' : 'content-l-bold text-black-black500'"
                            :color="email?.length > 0 && password?.length > 0 ? 'white' : 'black-black200'"
                            :icon-color="email?.length > 0 && password?.length > 0 ? 'black' : 'black-black500'"
                            position="prepend"
                        ></choose-plain>

                        <choose-plain
                            v-else-if="needRegister"
                            @click="register"
                            placeholder="S'inscrire"
                            icon="sparkes"
                            class="content-l-bold"
                            position="prepend"
                        ></choose-plain>

                        <choose-plain
                            v-else
                            @click="submit"
                            :placeholder="t('auth_confirm')"
                            icon="sparkes"
                            class="content-l-bold"
                            position="prepend"
                        ></choose-plain>
                    </v-col>

                    <v-col md="12" cols="12" v-if="!needRegister" class="mt-2 mb-2 text-center">
                        <v-divider></v-divider>

                        <div class="content-l-medium mt-15">{{ t('auth_new_evently') }}</div>

                        <choose-clear
                            class="mt-5"
                            position="prepend"
                            icon="sparkes"
                            :placeholder="t('auth_create_account')"
                            @click="switchMode"
                        ></choose-clear>
                    </v-col>
                </v-row>
            </v-col>
        </v-row>
    </v-container>

    <choose-clear class="cancel-button border-0 hide-mobile-icon" color="black-black100 pa-6" icon="xmark" position="prepend" @click="router.back()">
        {{t('global_back')}}
    </choose-clear>
</template>

<script setup lang="ts">
import Completed from "../../components/text-field/completed.vue";
import ChoosePlain from "../../components/button/choose-plain.vue";
import { useUserStore } from "../../stores/User.store";
import { ref, watch } from "vue";
import { useRouter } from "vue-router";
import { useApiService } from "../../services/api.services";
import { useToastStore } from "../../stores/Toast.store";
import { useGlobalStore } from "../../stores/Global.store";
import { useI18n } from "vue-i18n";
import { useDisplay } from "vuetify";
import ChooseClear from "../../components/button/choose-clear.vue";

const { t, locale } = useI18n({ useScope: 'global' });
const router = useRouter();
const userStore = useUserStore();
const toast = useToastStore();
const firstName = ref();
const password = ref();
const confirmPassword = ref();
const lastName = ref();
const email = ref();
const needRegister = ref(false);
const needLogin = ref(true);

const switchMode = () => {
    needLogin.value = !needLogin.value;
    needRegister.value = !needRegister.value;
}

const submit = async () => {
    if (!email.value || !email.value.includes("@")) {
        toast.success({key: 'toast_email_required'});
        return;
    }

    const res = await useApiService.get(`/user/available/${email.value}`);
    if (res.data.available) {
        needRegister.value = true;
        needLogin.value = false;
    } else {
        needRegister.value = false;
        needLogin.value = true;
    }
}

const register = async () => {
    if (!firstName.value || !lastName.value || !password.value || !confirmPassword.value) {
        toast.success({key: 'toast_all_fields_required'});
        return;
    }

    if (password.value !== confirmPassword.value) {
        toast.success({key: 'toast_passwords_do_not_match'});
        return;
    }

    try {
        let res = await userStore.registerUser({
            email: email.value,
            password: password.value,
            firstName: firstName.value,
            lastName: lastName.value
        });

        if (res.success) {
            await useGlobalStore.init()
            await router.push('/app');
            toast.success({key: 'toast_register_success'});
        } else {
            toast.success({key: 'toast_register_error'});
        }
    } catch (e) {
        toast.success({key: 'toast_general_error'});
    }
}

const login = async () => {
    if (!email.value || !password.value) {
        toast.success({key: 'toast_email_password_required'});
        return;
    }

    try {
        let res = await userStore.loginUser({
            email: email.value,
            password: password.value,
        });

        if (res.success) {
            await useGlobalStore.init()
            await router.push('/app');
            toast.success({key: 'toast_login_success'});
        } else {
            toast.success({key: 'toast_login_error'});
        }
    } catch (e) {
        toast.success({key: 'toast_general_error'});
    }
}
</script>


<style scoped>
.onboarding-card {
    border: 1px solid rgb(var(--v-theme-black-black200));
    border-radius: 32px;
    background-color: rgb(var(--v-theme-black-black100));
}

.cancel-button {
    position: fixed;
    top: 25px;
    right: 20px;
    border: none;
    max-width: 275px;
    font-size: 24px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
}
</style>
