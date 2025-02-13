<template>
    <v-navigation-drawer
        color="black-black100"
        location="start"
        class="border"
        name="drawer"
        :width="currentWidth"
        permanent
    >
        <div class="list-container align-center mt-8">
            <nav-item
                icon="person"
                :text="userStore.user.fullName"
                @click="router.currentRoute.value.path === '/app/profile' ? router.push('/app') : router.push('/app/profile')"
                :selected-background="'white'"
                :selected="router.currentRoute.value.path === '/app/profile'"
                :color="router.currentRoute.value.path=== '/app/profile' ? 'black' : 'black-black500'"
            ></nav-item>

            <nav-item
                icon="sparkes"
                text="Mes événements"
                :selected="eventStore.onlyMine"
                :color="eventStore.onlyMine ? 'black' : 'black-black500'"
                :selected-background="'white'"
                @click="eventStore.onlyMine = !eventStore.onlyMine"
            ></nav-item>
        </div>

        <v-divider class="mt-5 mb-5 mr-4 ml-4"></v-divider>

        <div class="list-container align-center">
            <create-folder>
                <template v-slot:activator="{ openDialog }">
                    <nav-item
                        @click="openDialog"
                        icon="folderPlus"
                        text="Créer un dossier"
                        color="black-black500"
                    ></nav-item>
                </template>
            </create-folder>

            <create-category>
                <template v-slot:activator="{ openDialog }">
                    <nav-item
                        @click="openDialog"
                        icon="plusCircle"
                        text="Créer une catégorie"
                        color="black-black500"
                    ></nav-item>
                </template>
            </create-category>
        </div>

        <template v-if="folderStore.folders.length > 0">
            <v-divider class="mt-5 mb-5 mr-4 ml-4"></v-divider>

            <div class="list-container align-center mb-2">
                <nav-item
                    v-for="(item, index) in folderStore.folders"
                    :key="index"
                    icon="folder"
                    :text="item.name!"
                    :selected="folderStore.selectedFolderId === item.id"
                    :color="folderStore.selectedFolderId === item.id ? 'black-black100' : 'black-black500'"
                    :selected-background="'white'"
                    @click="selectFolder(item)"
                ></nav-item>
            </div>
        </template>

        <v-divider class="mt-5 mb-5 mr-4 ml-4"></v-divider>

        <div class="list-container align-center mb-2">
            <nav-item
                v-for="(item, index) in categoryStore.categories"
                :key="index"
                :icon="item.icon!"
                :text="item.default ? t(item.name!) : item.name!"
                selected-text-color="white"
                :selected="categoryStore.selectedCategoryId === item.id"
                :color="categoryStore.selectedCategoryId === item.id ? 'white' : 'black-black500'"
                :custom-style="categoryStore.selectedCategoryId === item.id
                    ? `background: linear-gradient(180deg, ${item.color} 0%, ${makeItFade(item.color!!)} 100%);`
                    : ''"
                @click="selectCategory(item)"
            ></nav-item>
        </div>
    </v-navigation-drawer>
</template>

<script setup lang="ts">
import { useI18n } from "vue-i18n";
import { useCategoryStore } from "../../stores/Category.store";
import { computed, onMounted, ref } from "vue";
import { Category } from "../../models/Category.model";
import { ColorUtils } from "../../utils/color.utils";
import { useUserStore } from "../../stores/User.store";
import { useDisplay } from "vuetify";
import { useFolderStore } from "../../stores/Folder.store";
import { Folder } from "../../models/Folder.model";
import { useEventStore } from "../../stores/Event.store";
import NavItem from "./nav/nav-item.vue";
import CreateFolder from "../dialog/create-folder.vue";
import CreateCategory from "../dialog/create-category.vue";
import { useRouter } from "vue-router";

const categoryStore = useCategoryStore()
const folderStore = useFolderStore()
const userStore = useUserStore()
const eventStore = useEventStore()
const { t, locale } = useI18n({ useScope: 'global' });

let selectCategory = (cat: Category) => {
    if (cat.id === categoryStore.selectedCategoryId) {
        categoryStore.selectCategory(-1);
    } else {
        categoryStore.selectCategory(cat.id!!);
    }
}

let selectFolder = (f: Folder) => {
    if (f.id === folderStore.selectedFolderId) {
        folderStore.selectFolder(-1);
    } else {
        folderStore.selectFolder(f.id!!);
    }
}

const router = useRouter();
const windowWidth = ref(useDisplay().width);

// To trick the vue navigation drawer ..... hopefully i will not touch anymore this fucking ugly drawer
const currentWidth = computed(() => {
    return windowWidth.value < 1200 ? 100 : windowWidth.value * 0.17;
})

const makeItFade = (originalColor: string) => {
    return ColorUtils.adjustLightness(originalColor, -10)
}
</script>

<style scoped>
.border {
    border: 1px solid rgb(var(--v-theme-black-black200)) !important;
}

.v-navigation-drawer {
    width: 17% !important;
    transition: width 0.3s ease;
}

.list-container {
    display: flex;
    flex-direction: column;
    gap: 12px;
}
/* Gérer la réactivité pour les tailles d'écrans plus petites */
@media (max-width: 1200px) {
    .v-navigation-drawer {
        width: 100px !important; /* Réduit encore la largeur pour les petits écrans */
    }

    .list-item span {
        display: none; /* Cache le texte */
    }

    .list-item {
        width: auto; /* Utilise la largeur disponible */
        gap: 8px; /* Réduit l'espacement entre les éléments */
    }

    .icon-container {
        width: 18px;
        height: 18px; /* Réduit la taille des icônes */
    }
}
</style>
