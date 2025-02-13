<template>
    <v-container
        class="fill-height"
        fluid
    >
        <v-row justify="center" align="center" class="justify-center align-center ma-auto">
            <v-col md="4" cols="12" class="onboarding-card text-start">
                <v-row class="ma-3">
                    <v-col md="12">
                        <span class="text-white content-l-medium">
                            {{ t('auth_step_two') }}
                        </span>

                        <v-divider class="mt-7 mb-7">
                        </v-divider>

                        <span>
                            {{ t('auth_last_name') }}
                        </span>
                        <completed
                            v-model="lastName"
                            class="mb-6 mt-1"
                            placeholder="Dupont"
                        ></completed>

                        <span>
                            {{ t('auth_first_name') }}
                        </span>
                        <completed
                            v-model="firstName"
                            class="mt-1 mb-10"
                            placeholder="Thomas"
                        ></completed>

                        <choose-plain
                            @click="submit"
                            :placeholder="t('auth_end_button')"
                            icon="sparkes"
                            class="content-l-bold"
                            position="prepend"
                        ></choose-plain>
                    </v-col>
                </v-row>
            </v-col>
        </v-row>
    </v-container>
</template>

<script setup lang="ts">
import Completed from "../../components/text-field/completed.vue";
import ChoosePlain from "../../components/button/choose-plain.vue";
import { useUserStore } from "../../stores/User.store";
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useGlobalStore } from "../../stores/Global.store";
import { useI18n } from "vue-i18n";

const userStore = useUserStore();
const firstName = ref();
const lastName = ref();
const router = useRouter();
const { t, locale } = useI18n({ useScope: 'global' });

const submit = async () => {
    const success = await userStore.completeUserRegistration({firstname: firstName.value, lastname: lastName.value});

    if (success) {
        await useGlobalStore.init()
        await router.push('/app')
    }
}
</script>

<style scoped>
.onboarding-card {
    border: 1px solid rgb(var(--v-theme-black-black200));
    border-radius: 32px;
    background-color: rgb(var(--v-theme-black-black100));
}
</style>