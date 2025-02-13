<template>
    <v-app-bar color="black-black100" class="border">
        <v-app-bar-title>
            <v-row>
                <v-col
                    md="6" cols="6"
                    class="text-start content-h5 ma-auto"
                >
                    Evently
                </v-col>

                <v-col
                    v-if="showButton && router.currentRoute.value.path=== '/app'"
                    md="6" cols="6"
                    class="text-end"
                >
                    <div class="d-inline-flex mr-3" v-if="folderStore.selectedFolderId !== -1">
                        <create-folder :id="folderStore.selectedFolderId">
                            <template v-slot:activator="{ openDialog }">
                                <choose-clear
                                    @click="openDialog"
                                    style="order: -1"
                                    icon="edit"
                                    position="prepend"
                                    class="mr-2 w-auto pa-5 hide-mobile-icon content-l-bold"
                                >
                                    {{t('detail_edit')}}
                                </choose-clear>
                            </template>
                        </create-folder>

                        <choose-plain
                            icon="trash"
                            position="prepend"
                            color="red"
                            icon-color="white"
                            class="mr-2 w-auto pa-5 hide-mobile-icon content-l-bold"
                        >
                            {{ t('detail_delete') }}
                        </choose-plain>
                    </div>

                    <div class="d-inline-flex mr-3" v-if="categoryStore.selectedCategoryId !== -1 && !categoryStore.selectedCategory?.default">
                        <create-category :id="categoryStore.selectedCategoryId">
                            <template v-slot:activator="{ openDialog }">
                                <choose-clear
                                    @click="openDialog"
                                    style="order: -1"
                                    icon="edit"
                                    position="prepend"
                                    class="mr-2 w-auto pa-5 hide-mobile-icon content-l-bold"
                                >
                                    {{t('detail_edit')}}
                                </choose-clear>
                            </template>
                        </create-category>

                        <choose-plain
                            icon="trash"
                            position="prepend"
                            color="red"
                            icon-color="white"
                            class="mr-2 w-auto pa-5 hide-mobile-icon content-l-bold"
                        >
                            {{ t('detail_delete') }}
                        </choose-plain>
                    </div>
                </v-col>

                <v-col
                    v-else
                    md="6" cols="6"
                    class="text-end content-xl-semibold black-black500 ma-auto"
                >
                    <p class="mr-5 text-black-black500">
                        {{ DateTime.now().toFormat("ccc d LLLL yyyy") }}
                    </p>
                </v-col>
            </v-row>
        </v-app-bar-title>
    </v-app-bar>
</template>

<script setup lang="ts">
import { useCategoryStore } from "../../stores/Category.store";
import ChoosePlain from "../button/choose-plain.vue";
import ChooseClear from "../button/choose-clear.vue";
import { useFolderStore } from "../../stores/Folder.store";
import { computed } from "vue";
import { DateTime } from "luxon";
import { useI18n } from "vue-i18n";
import CreateCategory from "../dialog/create-category.vue";
import CreateFolder from "../dialog/create-folder.vue";
import { useRouter } from "vue-router";
const { t, locale } = useI18n({ useScope: 'global' });

const categoryStore = useCategoryStore()
const folderStore = useFolderStore()
const router = useRouter()

const showButton = computed(() => {
    return (folderStore.selectedFolderId === -1 && categoryStore.selectedCategoryId !== -1) ||
        (folderStore.selectedFolderId !== -1 && categoryStore.selectedCategoryId === -1);
})
</script>

<style scoped>
.border {
    border: 1px solid rgb(var(--v-theme-black-black200)) !important;
}
</style>