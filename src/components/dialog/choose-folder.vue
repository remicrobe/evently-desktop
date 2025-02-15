<template>
    <v-dialog :max-width="dialogWidth">
        <template v-slot:activator="{ props: activatorProps }">
            <choose-plain
                v-bind="activatorProps"
                class="mr-n5"
                :icon="selectedFolder ? 'folder' : 'plusCircle'"
                position="prepend"
                icon-color="black"
            >
                {{ selectedFolder ? selectedFolder.name : t('add_event_choose_folder') }}
            </choose-plain>
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
                            <span class="content-h4 ma-auto ml-2">
                                {{ t('add_event_choose_folder') }}
                            </span>
                        </v-col>
                    </v-row>
                </v-col>

                <v-col md="12" cols="12" class="text-white">
                    <completed v-model="search" :placeholder="t('add_folder_search_placeholder')"></completed>
                    <v-divider class="mt-5"></v-divider>
                </v-col>

                <v-col md="12" cols="12" class="text-white text-center">
                    <span>
                        {{ t('add_folder_can_create') }}
                    </span>
                    <create-folder>
                        <template v-slot:activator="{ props: activatorProps }">
                            <choose-plain
                                v-bind="activatorProps"
                                class="mt-2"
                                color="white"
                                icon="folderPlus"
                                icon-color="black"
                                position="prepend"
                                :placeholder="t('create_folder_title')"
                            ></choose-plain>
                        </template>
                    </create-folder>
                    <v-divider class="mt-5"></v-divider>
                </v-col>

                <v-col cols="12" md="12">
                    <v-row>
                        <v-col md="6" cols="12" v-for="folder in filteredFolders" :key="folder.id">
                            <choose-plain
                                icon="folder"
                                :color="selectedFolderId === folder.id ? 'white' : 'black-black200'"
                                :icon-color="selectedFolderId === folder.id ? 'black' : 'white'"
                                :class="selectedFolderId === folder.id ? 'text-black' : 'text-white'"
                                position="prepend"
                                @click="selectFolder(folder.id!)"
                            >
                                {{ folder.name }}
                            </choose-plain>
                        </v-col>
                    </v-row>
                </v-col>

                <v-col md="12" cols="12" class="mt-8">
                    <choose-plain color="white" :placeholder="t('global_continue')" @click="isActive.value = false"></choose-plain>
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
import { useFolderStore } from "../../stores/Folder.store";
import { useI18n } from "vue-i18n";
import { useDisplay } from "vuetify";
import CreateFolder from "./create-folder.vue";

const folderStore = useFolderStore();
const search = ref("");
const selectedFolderId = ref();
const selectedFolder = ref();
const emit = defineEmits(["folderSelected"]);
const { t, locale } = useI18n({ useScope: 'global' });

const windowWidth = ref(useDisplay().width);

const dialogWidth = computed(() => (windowWidth.value < 1200 ? "90%" : "50%"));

const props = defineProps<{ selectedFolderId?: number }>();

if (props.selectedFolderId) {
    selectedFolderId.value = props.selectedFolderId;
    selectedFolder.value = folderStore.getFolderById(props.selectedFolderId);
}

const filteredFolders = computed(() => {
    return folderStore.folders.filter(folder =>
        folder.name?.toLowerCase().includes(search.value.toLowerCase())
    );
});

const selectFolder = (folderId:  number) => {
    if (selectedFolderId.value === folderId) {
        selectedFolderId.value = undefined;
        selectedFolder.value = undefined;
        emit("folderSelected", undefined);
    } else {
        selectedFolderId.value = folderId;
        selectedFolder.value = folderStore.getFolderById(folderId);
        emit("folderSelected", folderId);
    }
};
</script>

<style scoped>
.card {
    border: 1px solid rgb(var(--v-theme-black-black200));
    border-radius: 32px;
    background-color: rgb(var(--v-theme-black-black100));
}
</style>