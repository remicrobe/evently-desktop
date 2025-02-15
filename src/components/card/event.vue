<template>
    <div
        class="card text-white position-relative"
        :style="`background: linear-gradient(180deg, ${category?.color} 0%, ${makeItFade(category?.color!)} 100%)`"
        @click="() => route.push(`/app/event/${event?.id}`)"
    >
        <!-- Titre -->
        <div>
            <h2 class="text-left content-h5">{{ event?.name }}</h2>
            <p class="text-left content-l-medium" style="color: #E5E5EA;">{{ event?.getFormattedDate() }}</p>
        </div>

        <!-- Étiquette avec icône dossier -->
        <v-row v-if="event?.folderID">
            <v-col md="12" cols="12" class="text-start">
                <div
                    class="pa-2"
                    style="background-color: rgba(232,213,213,0.5); display: inline-flex; border-radius: 8px; vertical-align: bottom"
                >
                    <custom-icons class="mr-2 ml-1 ma-auto" icon="folder" color="white" :size="18"></custom-icons>
                    <span class="content-m-bold text-center ma-auto" style="margin: auto">
            {{ folder?.name }}
          </span>
                </div>
            </v-col>
        </v-row>

        <!-- Section du bas -->
        <v-row class="mt-n2">
            <v-col md="3" cols="3" class="text-start d-flex">
                <div
                    class="text-start justify-end align-end"
                    style="display: inline-flex; border-radius: 8px; vertical-align: bottom"
                >
                    <div style="background-color: rgba(232,213,213,0.5); border-radius: 8px;">
                        <custom-icons
                            :icon="category?.icon!"
                            color="white"
                            class="ma-2"
                            :size="20"
                        ></custom-icons>
                    </div>
                </div>
            </v-col>

            <v-col md="9" cols="9" class="d-flex flex-column fill-height">
                <div class="mt-auto text-end">
                    <p class="content-h3">{{ event?.getDiffToday() }}</p>
                    <p class="content-xl-semibold">{{ t('detail_rest_time') }}</p>
                </div>
            </v-col>
        </v-row>
    </div>
</template>

<script setup lang="ts">
import CustomIcons from "../custom-icons.vue"
import { Event } from "../../models/Event.model"
import { computed, defineProps } from "vue"
import { useCategoryStore } from "../../stores/Category.store"
import { useFolderStore } from "../../stores/Folder.store"
import { ColorUtils } from "../../utils/color.utils"
import { useI18n } from "vue-i18n"
import { useRouter } from "vue-router"

const categoryStore = useCategoryStore()
const folderStore = useFolderStore()
const { t, locale } = useI18n({ useScope: 'global' })

const props = defineProps({
    event: {
        type: Event
    }
})

const route = useRouter()

const folder = computed(() => {
    return folderStore.getFolderById(props.event?.folderID ?? -1)
})

const category = computed(() => {
    return categoryStore.getCategoryById(props.event?.categoryID ?? -1)
})

const makeItFade = (originalColor: string) => {
    return ColorUtils.adjustLightness(originalColor, -10)
}
</script>

<style scoped>
.card {
    display: flex;
    flex-direction: column;
    gap: 8px;
    height: 100%;
    border-radius: 32px;
    padding: 24px !important;
    opacity: 0;
    animation: fadeIn 1s forwards;
    transition: height 0.5s ease-out, transform 0.3s ease, box-shadow 0.3s ease, filter 0.3s ease;
    cursor: pointer;
}

.card:hover {
    transform: translateY(-5px);
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
    filter: brightness(0.8);
}

@keyframes fadeIn {
    0% {
        opacity: 0;
    }
    100% {
        opacity: 1;
    }
}
</style>
