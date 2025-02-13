<template>
    <v-dialog :max-width="dialogWidth" v-model="displayDialog">
        <template v-slot:default="{ isActive }">
            <v-row justify="center" align="center" class="justify-center card align-center ma-auto overflow-auto">
                <v-col md="12" cols="12" class="text-white">
                    <v-row>
                        <v-col md="10" cols="10">
                            <v-avatar
                                class="rounded mt-n4"
                                :rounded="false"
                                size="45"
                            >
                                <custom-icons icon="update" :size="38" color="white" class="mr-1"></custom-icons>
                            </v-avatar>
                            <span class="content-h4 ma-auto ml-2">{{ t('global_update_available') }}</span>
                        </v-col>
                    </v-row>
                </v-col>

                <v-col md="12" cols="12" class="text-white text-center mt-8">
                    <span>{{ t('global_update_message') }}</span>
                </v-col>

                <v-col md="6" cols="6" class="mt-8">
                    <choose-plain color="white" :placeholder="t('global_update_later')" @click="isActive.value = false"></choose-plain>
                </v-col>
                <v-col md="6" cols="6" class="mt-8">
                    <choose-plain color="white" :placeholder="t('global_update_ok')" @click="update"></choose-plain>
                </v-col>
            </v-row>
        </template>
    </v-dialog>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { useI18n } from "vue-i18n";
import { useDisplay } from "vuetify";
import ChoosePlain from "../button/choose-plain.vue";
import CustomIcons from "../custom-icons.vue";
const { t } = useI18n({ useScope: 'global' });

let displayDialog = ref(false);
const windowWidth = ref(useDisplay().width);
const dialogWidth = computed(() => (windowWidth.value < 1200 ? "90%" : "50%"));

const update = () => {
    if (window.ipcRenderer) {
        window.ipcRenderer.send('install-update');
    }
};

if (window.ipcRenderer) {
    window.ipcRenderer.on('update-available', () => {
        displayDialog.value = true;
    });
}
</script>

<style scoped>
.card {
    border: 1px solid rgb(var(--v-theme-black-black200));
    border-radius: 32px;
    background-color: rgb(var(--v-theme-black-black100));
}
</style>
