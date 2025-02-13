<template>
    <v-container
        class="fill-height"
        fluid
    >
        <v-row justify="center" align="center" class="justify-center align-center ma-auto">
            <v-col md="6" cols="12" class="onboarding-card text-start">
                <v-row class="ma-3">
                    <template v-if="step === 1">
                        <v-col md="6" cols="12" class="text-white">
                            <v-row>
                                <v-col md="10" cols="10">
                                    <span class="content-h4">{{ t('onboarding_welcome') }} Evently</span>
                                </v-col>

                                <v-col md="2" cols="2">
                                    <v-avatar
                                        class="rounded"
                                        :rounded="false"
                                        size="35"
                                        image="./assets/logo.png"
                                    ></v-avatar>
                                </v-col>
                            </v-row>

                            <br/><br/>

                            <span>
                        {{ t('onboarding_textOne') }} <br/><br/>
                        {{ t('onboarding_textTwo') }} <br/><br/>
                        {{ t('onboarding_textThree') }} <br/><br/>
                    </span>
                        </v-col>

                        <v-col md="6" col="12">
                            <div class="justify-center align-center d-flex ma-9">
                                <v-img
                                    width="70%"
                                    src="./assets/onboarding/having-fun.png"
                                ></v-img>
                            </div>
                        </v-col>

                        <v-col md="12" cols="12">
                            <choose-plain @click="step = 2" :placeholder="t('global_continue')"></choose-plain>
                        </v-col>
                    </template>

                    <template v-if="step === 2">
                        <v-col md="6" cols="12" class="text-white">
                            <v-row>
                                <v-col md="10" cols="10">
                                    <span class="content-h4">{{ t('onboarding_welcome') }} Evently</span>
                                </v-col>

                                <v-col md="2" cols="2">
                                    <v-avatar
                                        class="rounded"
                                        :rounded="false"
                                        size="35"
                                        image="./assets/logo.png"
                                    ></v-avatar>
                                </v-col>
                            </v-row>

                            <br/><br/>

                            <span>
                        {{ t('onboarding_textFour') }}<br/><br/>
                        {{ t('onboarding_textFive') }}
                    </span>
                        </v-col>

                        <v-col md="6" col="6">
                            <div class="justify-center align-center d-flex ma-9">
                                <v-img
                                    width="70%"
                                    src="./assets/onboarding/organise-resume.png"
                                ></v-img>
                            </div>
                        </v-col>

                        <v-col md="12" cols="12">
                            <choose-plain @click="goToAuth" :placeholder="t('global_start')"></choose-plain>
                        </v-col>
                    </template>
                </v-row>
            </v-col>
        </v-row>
    </v-container>
</template>

<script setup lang="ts">
import ChoosePlain from "../../components/button/choose-plain.vue";
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useI18n } from "vue-i18n";

let step = ref(1);

const { t, locale } = useI18n({ useScope: 'global' });
const router = useRouter()

const goToAuth = async () => {
    await router.push('/auth');
}
</script>

<style scoped>
.onboarding-card {
    border: 1px solid rgb(var(--v-theme-black-black200));
    border-radius: 32px;
    background-color: rgb(var(--v-theme-black-black100));
}
</style>
