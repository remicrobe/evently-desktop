<template>
    <default></default>

    <v-row justify="center" align="center" class="mr-5 ml-5 mb-15">
        <v-col md="8" cols="12" class="text-lg-center text-left mt-10">
            <v-avatar
                class="rounded mt-n4"
                :rounded="false"
                size="35"
                image="./assets/logo.png"
            >
                <custom-icons icon="folder" :size="38" color="white" class="mr-1"></custom-icons>
            </v-avatar>

            <span class="content-h4 ma-auto ml-2">{{ folder.id ? t('home_update_folder') : t('home_add_folder') }}</span>
        </v-col>

        <v-col md="8" cols="12" class="text-white text-start justify-end d-flex flex-row" align-self="end">
            <div class="mr-4" style="flex-grow: 1;">
                <span>{{ t('global_name') }}</span>
                <completed v-model="folder.name" :placeholder="t('add_folder_placeholder')" style="width: 100%;"></completed>
            </div>

            <div style="flex-grow: 1;">
                <span>{{ t('global_friends') }}</span>
                <choose-friends
                    :selected-friend-username="folder.friends"
                    @friend-added="(username) => folder.friends.push(username)"
                    @friend-removed="(username) => folder.friends = folder.friends.filter(f => f !== username)"
                ></choose-friends>
            </div>
        </v-col>

        <v-col md="8" cols="12" class="bottom-0 position-absolute pr-8 pl-8">
            <choose-plain
                class="mb-10"
                @click="create"
                :placeholder="t('global_validate')"
                icon="sparkes"
                :class="(folder?.name?.length ?? 0 > 0) ? 'content-l-bold' : 'content-l-bold text-black-black500'"
                :color="(folder?.name?.length ?? 0 > 0) ? 'white' : 'black-black200'"
                :icon-color="(folder?.name?.length ?? 0 > 0) ? 'black' : 'black-black500'"
                position="prepend"
            ></choose-plain>
        </v-col>
    </v-row>

    <choose-clear class="cancel-button border-0 hide-mobile-icon" color="black-black100 pa-6" icon="xmark" position="prepend" @click="router.push('/app')">
        {{t('add_event_cancel')}}
    </choose-clear>
</template>
<script setup lang="ts">
import Default from "../../../components/layout/default.vue";
import CustomIcons from "../../../components/custom-icons.vue";
import ChooseClear from "../../../components/button/choose-clear.vue";
import ChoosePlain from "../../../components/button/choose-plain.vue";
import {useRouter} from "vue-router";
import {useToastStore} from "../../../stores/Toast.store";
import { useI18n } from "vue-i18n";
import { ref } from "vue";
import { Folder } from "../../../models/Folder.model";
import { useFolderStore } from "../../../stores/Folder.store";
import ChooseFriends from "../../../components/dialog/choose-friends.vue";
import Completed from "../../../components/text-field/completed.vue";

const toast = useToastStore();
const { t, locale } = useI18n({ useScope: 'global' });

const folder = ref(new Folder());
const folderStore = useFolderStore()
const router = useRouter()

const folderId = ref(router.currentRoute.value.params.id)

if (folderId.value) {
    folder.value = new Folder(folderStore.getFolderById(Number(folderId.value)))
}

const create = async () => {
    if (folder.value.id) {
        await folderStore.updateFolder(folder.value.id, folder.value);
    } else {
        await folderStore.createFolder(folder.value);
    }
    router.back();
}
</script>


<style>
.cancel-button {
    position: fixed;
    top: 95px;
    right: 20px;
    border: none;
    max-width: 175px;
    font-size: 24px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
}

@media (max-width: 1100px) {
    .fixed-bottom {
        width: 92% !important;
    }
}

.onboarding-card {
    border: 1px solid rgb(var(--v-theme-black-black200));
    border-radius: 32px;
    background-color: rgb(var(--v-theme-black-black100));
}

.progress {
    border-radius: 10px;
}

.v-progress-linear__content {
    justify-content: start !important;
}
</style>