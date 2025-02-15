<template>
    <v-dialog :max-width="dialogWidth">
        <template v-slot:activator="{ props: activatorProps }">
            <choose-plain
                v-bind="activatorProps"
                class="mr-n5"
                v-if="!selectedCategory"
                icon="plusCircle"
                position="prepend"
                icon-color="black"
            >
                {{ t('add_event_choose_category') }}
            </choose-plain>

            <choose-plain
                v-else
                v-bind="activatorProps"
                :icon="selectedCategory.icon"
                :style="`background: linear-gradient(180deg, ${selectedCategory?.color} 0%, ${makeItFade(selectedCategory?.color!)} 100%)`"
                icon-color="white"
                class="text-white"
                position="prepend"
            >
                {{ selectedCategory.default ? t(selectedCategory.name!) : selectedCategory.name! }}
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
                                <custom-icons icon="tag" :size="38" color="white" class="mr-1"></custom-icons>
                            </v-avatar>
                            <span class="content-h4 ma-auto ml-2">{{ t('add_event_choose_category') }}</span>
                        </v-col>
                    </v-row>
                </v-col>

                <v-col md="12" cols="12" class="text-white">
                    <completed v-model="search" :placeholder="t('global_search_category')"></completed>
                    <v-divider class="mt-5"></v-divider>
                </v-col>

                <v-col md="12" cols="12" class="text-white text-center">
                    <span>{{ t('add_category_can_create') }}</span>
                    <create-category>
                        <template v-slot:activator="{ props: activatorProps }">
                            <choose-plain
                                class="mt-2"
                                v-bind="activatorProps"
                                color="white"
                                icon="plusCircle"
                                icon-color="black"
                                position="prepend"
                                :placeholder="t('create_cat_title')"
                            ></choose-plain>
                        </template>
                    </create-category>
                    <v-divider class="mt-5"></v-divider>
                </v-col>

                <v-col cols="12" md="12">
                    <v-row>
                        <v-col md="6" cols="12" v-for="category in filteredCategories" :key="category.id">
                            <choose-plain
                                :icon="category.icon"
                                :style="`background: linear-gradient(180deg, ${category?.color} 0%, ${makeItFade(category?.color!)} 100%)`"
                                icon-color="white"
                                class="text-white"
                                position="prepend"
                                :class="{
                                    'border-white': selectedCategoryId === category.id,
                                    'border-none': selectedCategoryId !== category.id,
                                }"
                                @click="selectCategory(category.id!)">{{
                                    category.default ? t(category.name!) : category.name!
                                }}</choose-plain>
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
import { useCategoryStore } from "../../stores/Category.store";
import {ColorUtils} from "../../utils/color.utils";
import { useI18n } from "vue-i18n";
import { useDisplay } from "vuetify";
import CreateCategory from "./create-category.vue"; // Importer le store des catégories
const { t, locale } = useI18n({ useScope: 'global' });

const categoryStore = useCategoryStore();
const search = ref("");
const selectedCategoryId = ref<number | undefined>();
const selectedCategory = ref<any>(); // La catégorie sélectionnée
const emit = defineEmits(["categorySelected"]);

const props = defineProps<{
    selectedCategoryId?: number
}>();

if (props.selectedCategoryId) {
    selectedCategoryId.value = props.selectedCategoryId;
    selectedCategory.value = categoryStore.getCategoryById(props.selectedCategoryId);
}

const makeItFade = (originalColor: string) => {
    return ColorUtils.adjustLightness(originalColor, -10)
}
const windowWidth = ref(useDisplay().width);

const dialogWidth = computed(() => (windowWidth.value < 1200 ? "90%" : "50%"));

const filteredCategories = computed(() => {
    return categoryStore.categories.filter(category =>
        category.name?.toLowerCase().includes(search.value.toLowerCase())
    );
});

const selectCategory = (categoryId: number) => {
    if (selectedCategoryId.value === categoryId) {
        selectedCategoryId.value = undefined;
        selectedCategory.value = undefined;
    } else {
        selectedCategoryId.value = categoryId;
        selectedCategory.value = categoryStore.getCategoryById(categoryId);
    }
    emit("categorySelected", categoryId); // Émettre l'événement pour la catégorie sélectionnée
};
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