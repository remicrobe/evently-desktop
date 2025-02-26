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
                <custom-icons icon="tag" :size="38" color="white" class="mr-1"></custom-icons>
            </v-avatar>

            <span class="content-h4 ma-auto ml-2">{{ category.id ? t('update_cat_title') : t('create_cat_title') }}</span>
        </v-col>

        <v-col md="8" cols="12" class="text-white text-start justify-end d-flex flex-row" align-self="end">

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

        <v-col md="8" cols="12" class="bottom-0 position-absolute">
            <choose-plain
                class="mb-10"
                @click="create"
                :placeholder="t('global_validate')"
                icon="sparkes"
                :class="(category?.name?.length ?? 0 > 0) && category?.color ? 'content-l-bold' : 'content-l-bold text-black-black500'"
                :color="(category?.name?.length ?? 0 > 0) && category?.color ? 'white' : 'black-black200'"
                :icon-color="(category?.name?.length ?? 0 > 0) && category?.color ? 'black' : 'black-black500'"
                justify="start"
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
import { useCategoryStore } from "../../../stores/Category.store";
import { Category } from "../../../models/Category.model";
import Completed from "../../../components/text-field/completed.vue";
import { ColorUtils } from "../../../utils/color.utils";

const toast = useToastStore();
const { t, locale } = useI18n({ useScope: 'global' });

const category = ref(new Category());
const categoryStore = useCategoryStore()
const router = useRouter()

const categoryId = ref(router.currentRoute.value.params.id)

if (categoryId.value) {
    category.value = new Category(categoryStore.getCategoryById(Number(categoryId.value)))
}

const create = async () => {
    if (category.value.id) {
        await categoryStore.updateCategory(category.value.id, category.value);
    } else {
        await categoryStore.createCategory(category.value);
    }
    router.back();
}

const makeItFade = (originalColor: string) => {
    return ColorUtils.adjustLightness(originalColor, -10)
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

.progress {
    border-radius: 10px;
}

.v-progress-linear__content {
    justify-content: start !important;
}
</style>