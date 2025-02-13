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
                                <custom-icons icon="tag" :size="38" color="white" class="mr-1"></custom-icons>
                            </v-avatar>
                            <span class="content-h4 ma-auto ml-2">{{ category.id ? t('edit_category') : t('create_category') }}</span>
                        </v-col>
                    </v-row>
                </v-col>

                <v-col md="12" cols="12" class="text-white text-start justify-end d-flex flex-row" align-self="end">

                    <div class="mr-4 align-end align-self-end">
                        <v-menu>
                            <template v-slot:activator="{ props }">
                                <v-avatar
                                    class="pa-auto"
                                    style="border-radius: 16px; border: 2px solid white"
                                    size="57"
                                    v-bind="props"
                                >
                                    <custom-icons :icon="category.icon ?? 'tag'" :size="35" color="white"></custom-icons>
                                </v-avatar>
                            </template>
                        </v-menu>
                    </div>


                    <div class="mr-4" style="flex-grow: 1;">
                        <span>{{ t('global_name') }}</span>
                        <completed v-model="category.name" :placeholder="t('add_category_placeholder')" style="width: 100%;"></completed>
                    </div>


                    <div style="flex-grow: 1;">
                        <span>{{ t('global_color') }}</span>

                        <v-menu :close-on-content-click="false">
                            <template v-slot:activator="{ props }">
                                <choose-plain
                                    v-bind="props"
                                    :placeholder="t('add_category_choose_color')"
                                    :class="category.color ? 'text-white' : ''"
                                    :style="category.color ? `background: linear-gradient(180deg, ${category?.color} 0%, ${makeItFade(category?.color!)} 100%)` : ''"
                                    style="width: 100%;"
                                ></choose-plain>
                            </template>
                            <v-color-picker v-model="category.color"></v-color-picker>
                        </v-menu>
                    </div>
                </v-col>

                <v-col md="12" cols="12" class="mt-2">
                    <choose-plain
                        color="black-black200"
                        class="text-white"
                        :placeholder="category.id ? t('add_category_save') : t('add_category_create')"
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
import { useCategoryStore } from "../../stores/Category.store";
import {ColorUtils} from "../../utils/color.utils";
import { useI18n } from "vue-i18n";
import { useDisplay } from "vuetify";
import { Category } from "../../models/Category.model";
import { Folder } from "../../models/Folder.model";
const { t, locale } = useI18n({ useScope: 'global' });

const categoryStore = useCategoryStore();

let dialog = ref(false);
let category = ref(new Category());

const props = defineProps({
    id: {
        type: Number,
        required: false,
    },
})

onMounted(() => {
    if (props.id) {
        category.value = new Category(categoryStore.getCategoryById(props.id));
    }
})

const makeItFade = (originalColor: string) => {
    return ColorUtils.adjustLightness(originalColor, -10)
}
const windowWidth = ref(useDisplay().width);

const dialogWidth = computed(() => (windowWidth.value < 1200 ? "90%" : "50%"));

const save = async () => {
    if (category.value.id) {
        await categoryStore.updateCategory(category.value.id, category.value);
    } else {
        await categoryStore.createCategory(category.value);
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