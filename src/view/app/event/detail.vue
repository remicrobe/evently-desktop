<template>
    <default></default>

    <v-container
        class="fill-height"
        fluid
    >
        <v-row justify="center" align="center" class="justify-center align-center ma-auto" >
            <v-col md="5" cols="12" class="onboarding-card text-start">
                <v-row class="ma-3">
                    <v-col md="12" cols="12">
                        {{router.currentRoute.value.params.id}}
                    </v-col>
                </v-row>
            </v-col>
        </v-row>
    </v-container>

    <choose-clear class="cancel-button border-0 hide-mobile-icon" color="black-black100 pa-6" icon="chevronBack" position="prepend" @click="router.back()">
        {{t('global_back')}}
    </choose-clear>

    <div class="d-inline-flex edit-button mr-md-4 mr-0">
        <choose-clear
            style="order: -1"
            icon="edit"
            position="prepend"
            class="mr-2 w-auto border-0 pa-5 hide-mobile-icon content-l-bold"
            color="black-black100"
            @click="router.push(`/app/event/edit/${eventId}`)"
        >
            {{ t('detail_edit') }}
        </choose-clear>

        <choose-plain
            icon="trash"
            position="prepend"
            color="#B72A12"
            icon-color="white"
            class="mr-2 w-auto pa-5 hide-mobile-icon content-l-bold text-white border-0"
            style="background: linear-gradient(180deg, #E53517 0%, #B72A12 100%);"
        >
            {{ t('detail_delete') }}
        </choose-plain>
    </div>
</template>
<script setup lang="ts">
import Default from "../../../components/layout/default.vue";
import ChooseClear from "../../../components/button/choose-clear.vue";
import {useI18n} from "vue-i18n";
import {useRouter} from "vue-router";
import ChoosePlain from "../../../components/button/choose-plain.vue";
import CreateCategory from "../../../components/dialog/create-category.vue";
import {ref} from "vue";

const { t, locale } = useI18n({ useScope: 'global' });
const router = useRouter();

const eventId = ref(router.currentRoute.value.params.id)
</script>


<style scoped>
.onboarding-card {
    border: 1px solid rgb(var(--v-theme-black-black200));
    border-radius: 32px;
    background-color: rgb(var(--v-theme-black-black100));
}

.cancel-button {
    position: fixed;
    top: 95px;
    left: 20px;
    border: none;
    max-width: 275px;
    font-size: 24px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
}
.edit-button {
    position: fixed;
    top: 95px;
    right: 10px;
    border: none;
    max-width: 275px;
    font-size: 24px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
}
</style>
