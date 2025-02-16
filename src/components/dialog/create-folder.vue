<template>
    <v-dialog :max-width="dialogWidth" v-model="dialog">
        <template v-slot:activator="{ props: activatorProps }">
            <slot
                name="activator"
                :props="activatorProps"
                :openDialog="() => dialog = true"
            ></slot>
        </template>

        <template v-slot:default="{ isActive }">
            <v-row justify="center" align="center" class="justify-center card align-center ma-auto overflow-auto">
                <v-col md="12" cols="12" class="text-white">
                    <v-row>
                        <v-col md="10" cols="10">
                            <v-avatar
                                class="rounded mt-n4"
                                :rounded="false"
                                size="35"
                                image="./assets/logo.png"
                            >
                                <custom-icons icon="folder" :size="38" color="white" class="mr-1"></custom-icons>
                            </v-avatar>
                            <span class="content-h4 ma-auto ml-2">{{ folder.id ? t('edit_folder') : t('create_folder') }}</span>
                        </v-col>
                    </v-row>
                </v-col>

                <v-col md="12" cols="12" class="text-white text-start justify-end d-flex flex-row" align-self="end">
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

                <v-col md="12" cols="12" class="mt-2">
                    <choose-plain
                        color="black-black200"
                        class="text-white"
                        :placeholder="folder.id ? t('add_folder_save') : t('add_folder_create')"
                        @click="save"
                    ></choose-plain>
                </v-col>
            </v-row>
        </template>
    </v-dialog>
</template>


<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, defineEmits } from "vue";
import ChoosePlain from "../button/choose-plain.vue";
import CustomIcons from "../custom-icons.vue";
import Completed from "../text-field/completed.vue";
import {ColorUtils} from "../../utils/color.utils";
import { useI18n } from "vue-i18n";
import { useDisplay } from "vuetify";
import { Category } from "../../models/Category.model";
import { useFolderStore } from "../../stores/Folder.store";
import { Folder } from "../../models/Folder.model";
import ChooseFriends from "./choose-friends.vue";
const { t, locale } = useI18n({ useScope: 'global' });

const props = defineProps({
    id: {
        type: Number,
        required: false,
    },
})

onMounted(() => {
    if (props.id) {
        folder.value = new Folder(folderStore.getFolderById(props.id));
    }
})

const folderStore = useFolderStore();

let dialog = ref(false);
let folder = ref(new Folder());

const makeItFade = (originalColor: string) => {
    return ColorUtils.adjustLightness(originalColor, -10)
}
const windowWidth = ref(useDisplay().width);

const dialogWidth = computed(() => (windowWidth.value < 1200 ? "90%" : "50%"));

const save = async () => {
    if (folder.value.id) {
        await folderStore.updateFolder(folder.value.id, folder.value);
    } else {
        await folderStore.createFolder(folder.value);
    }
    dialog.value = false;
}
</script>

<style scoped>
.card {
    border: 1px solid rgb(var(--v-theme-black-black200));
    border-radius: 32px;
    background-color: rgb(var(--v-theme-black-black100));
}

.border-white {
    border: 2px solid white; /* Applique une bordure blanche de 2px */
    border-radius: 12px; /* Ajoute un arrondi si nécessaire */
}
</style>