<template>
    <default></default>

    <v-row justify="center" style="margin-top: 95px" class="mr-2 ml-2 mb-15">
        <v-col md="9" cols="12">
            <v-row>
                <v-col md="6" cols="12">
                    <v-row class="ma-1" style="height: 100%">
                        <v-col
                            md="12"
                            cols="12"
                            class="event-card position-relative"
                            :style="`background: linear-gradient(180deg, ${category?.color} 0%, ${makeItFade(category?.color!)} 100%)`"
                        >
                            <!-- Titre -->
                            <div>
                                <h2 class="text-left content-h5">{{ selectedEvent?.name }}</h2>
                                <p class="text-left content-l-medium" style="color: #E5E5EA;">
                                    {{ selectedEvent?.getFormattedDate () }}
                                </p>
                            </div>

                            <!-- Étiquette avec icône dossier -->
                            <v-row v-if="selectedEvent?.folderID">
                                <v-col md="12" cols="12" class="text-start">
                                    <div
                                        class="pa-2"
                                        style="background-color: rgba(232,213,213,0.5); display: inline-flex; border-radius: 8px; vertical-align: bottom"
                                    >
                                        <custom-icons class="mr-2 ml-1 ma-auto" icon="folder" color="white"
                                                      :size="18"></custom-icons>
                                        <span class="content-m-bold text-center ma-auto" style="margin: auto">
                                        {{ folder?.name }}
                                      </span>
                                    </div>
                                </v-col>
                            </v-row>

                            <v-row>
                                <v-col md="12" cols="12" class="text-start">
                            <span class="content-xl-semibold">
                                {{ t ('add_event_reccurence') }} : {{
                                    t ('global_' + selectedEvent?.recurrencePattern)
                                }}
                            </span>
                                </v-col>

                                <v-col md="12" cols="12" class="text-start mt-n5">
                            <span v-if="remainingTime.years" class="content-h4">
                                {{ remainingTime.years }}
                            </span>

                                    <span v-if="remainingTime.years" class="content-xl-semibold mr-3">
                                an{{ remainingTime.years > 1 ? 's' : '' }}
                            </span>

                                    <span v-if="remainingTime.months" class="content-h4">
                                        {{ remainingTime.months }}
                                    </span>

                                    <span v-if="remainingTime.months" class="content-xl-semibold mr-2">
                                        mois
                                    </span>

                                    <span v-if="remainingTime.days" class="content-h4">
                                        {{ remainingTime.days }}
                                    </span>

                                    <span v-if="remainingTime.days" class="content-xl-semibold">
                                        jour{{ remainingTime.days > 1 ? 's' : '' }}
                                    </span>

                                    <span v-if="remainingTime.hours" class="content-h4">
                                        {{ remainingTime.hours }}
                                    </span>

                                    <span v-if="remainingTime.hours" class="content-xl-semibold">
                                        heure{{ remainingTime.hours > 1 ? 's' : '' }}
                                    </span>
                                </v-col>
                            </v-row>

                            <!-- Section du bas -->
                            <v-row class="mt-n2">
                                <v-col md="3" cols="3" class="text-start d-flex">
                                    <div
                                        class="text-start justify-end align-end"
                                        style="display: inline-flex; border-radius: 8px; vertical-align: bottom"
                                    >
                                        <div
                                            style="background-color: rgba(232,213,213,0.5); border-radius: 8px; display: flex; align-items: center; justify-content: center;">
                                            <custom-icons
                                                :icon="category?.icon!"
                                                color="white"
                                                class="ma-2"
                                                :size="20"
                                            ></custom-icons>

                                            <span class="content-m-bold mr-3">{{
                                                    category.default ? t (category.name!) : category.name!
                                                }}</span>
                                        </div>
                                    </div>
                                </v-col>

                                <v-col md="9" cols="9" class="d-flex flex-column fill-height">
                                    <div class="mt-auto text-end">
                                        <p class="content-h3">{{ selectedEvent?.getDiffToday () }}</p>
                                        <p class="content-xl-semibold">{{ t ('detail_rest_time') }}</p>
                                    </div>
                                </v-col>
                            </v-row>
                        </v-col>
                    </v-row>
                </v-col>

                <v-col md="6" cols="12">
                    <v-row class="ma-1" style="height: 100%">
                        <v-col md="12" cols="12" class="onboarding-card pa-24">
                            <div class="d-flex">
                                <custom-icons class="mr-2 ml-1 ma-auto" icon="description" color="white"
                                              :size="24"></custom-icons>
                                <h2 class="content-h5">{{ t ('global_description') }}</h2>
                            </div>

                            <div class="mt-2 content-m-semibold">
                                {{ t ('add_event_describe_event') }}
                            </div>

                            <v-textarea
                                @change="updateDescription"
                                :readonly="!isOwner"
                                class="mt-2 mb-n5 content-l-semibold"
                                variant="plain"
                                :placeholder="t('add_event_some_text_description')"
                                v-model="description"
                            ></v-textarea>
                        </v-col>
                    </v-row>
                </v-col>

                <v-col md="6" cols="12">
                    <v-row class="ma-1" style="height: 100%">
                        <v-col md="12" cols="12" class="onboarding-card pa-24">
                            <div class="d-flex">
                                <custom-icons class="mr-2 ml-1 ma-auto" icon="person" color="white"
                                              :size="24"></custom-icons>
                                <h2 class="content-h5">{{ t ('member_list_title') }}</h2>
                            </div>

                            <div class="mt-4 ml-2 content-l-semibold">
                                <div class="d-flex">
                                    <span>
                                        • {{ selectedEvent?.user?.fullName }}
                                    </span>
                                    <custom-icons class="ml-3 ma-auto" icon="crown" :size="22" color="white"></custom-icons>
                                </div>

                                <div class="d-flex mt-2" v-for="invitation in selectedEvent?.joinedUser">
                                    <span> <!-- @TODO: Invitation status -->
                                        • {{ invitation?.user?.fullName }}
                                    </span>
                                </div>
                            </div>
                        </v-col>
                    </v-row>
                </v-col>

                <v-col md="6" cols="12">
                    <v-row class="ma-1">
                        <v-col md="12" cols="12" class="onboarding-card">
                            <share-invite-link :invite-token="selectedEvent?.inviteToken"></share-invite-link>
                        </v-col>
                    </v-row>
                </v-col>
            </v-row>
        </v-col>
    </v-row>

    <choose-clear
        class="cancel-button border-0 hide-mobile-icon"
        color="black-black100 pa-6"
        icon="chevronBack"
        position="prepend"
        @click="router.back()"
    >
        {{ t ('global_back') }}
    </choose-clear>

    <div class="d-inline-flex edit-button mr-md-4 mr-0" v-if="isOwner">
        <choose-clear
            style="order: -1"
            icon="edit"
            position="prepend"
            class="mr-2 w-auto border-0 pa-5 hide-mobile-icon content-l-bold"
            color="black-black100"
            @click="router.push(`/app/event/edit/${eventId}`)"
        >
            {{ t ('detail_edit') }}
        </choose-clear>

        <delete-event :event-id="eventId">
            <template v-slot:activator="{ openDialog }">
                <choose-plain
                    icon="trash"
                    @click="openDialog"
                    position="prepend"
                    color="#B72A12"
                    icon-color="white"
                    class="mr-2 w-auto pa-5 hide-mobile-icon content-l-bold text-white border-0"
                    style="background: linear-gradient(180deg, #E53517 0%, #B72A12 100%);"
                >
                    {{ t ('detail_delete') }}
                </choose-plain>
            </template>
        </delete-event>
    </div>
</template>
<script setup lang="ts">
import Default from "../../../components/layout/default.vue";
import ChooseClear from "../../../components/button/choose-clear.vue";
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";
import ChoosePlain from "../../../components/button/choose-plain.vue";
import CreateCategory from "../../../components/dialog/create-category.vue";
import { computed, ref } from "vue";
import { useEventStore } from "../../../stores/Event.store";
import { useUserStore } from "../../../stores/User.store";
import DeleteFolder from "../../../components/dialog/delete-folder.vue";
import DeleteEvent from "../../../components/dialog/delete-event.vue";
import ShareInviteLink from "../../../components/card/share-invite-link.vue";
import CustomIcons from "../../../components/custom-icons.vue";
import { Category } from "../../../models/Category.model";
import { ColorUtils } from "../../../utils/color.utils";
import { useFolderStore } from "../../../stores/Folder.store";
import { DateTime } from "luxon";

const { t, locale } = useI18n ({ useScope: 'global' });
const router = useRouter ();

const eventStore = useEventStore ()
const userStore = useUserStore ()
const folderStore = useFolderStore ();
const description = ref('')

const eventId = Number (router.currentRoute.value.params.id)

const selectedEvent = computed (() => {
    return eventStore.getEventById (eventId)
})

const folder = computed (() => {
    return folderStore.getFolderById (selectedEvent.value?.folderID ?? -1)
})

const category = computed (() => {
    return new Category (selectedEvent.value?.category)
})

description.value = selectedEvent.value?.description ?? '';

const updateDescription = async () => {
    await eventStore.updateEvent (eventId, {
        description: description.value,
    })
}


const isOwner = computed (() => {
    return selectedEvent.value?.userID === userStore.user.id;
})

const makeItFade = (originalColor: string) => {
    return ColorUtils.adjustLightness (originalColor, -10)
}

const remainingTime = computed (() => {
    if (!selectedEvent.value?.targetDate) return { years: 0, months: 0, days: 0, hours: 0 };

    let now = DateTime.now();
    let targetDate = DateTime.fromJSDate(selectedEvent.value.targetDate!);

    if (targetDate.hour === 0) {
        targetDate = targetDate.startOf("day");
        now = now.startOf('day')
    }

    const diff = targetDate.diff (now, ["years", "months", "days", "hours"]).toObject ();

    return {
        years: diff.years ? Math.floor (diff.years) : 0,
        months: diff.months ? Math.floor (diff.months) : 0,
        days: diff.days ? Math.floor (diff.days) : 0,
        hours: diff.hours ? Math.floor (diff.hours) : 0,
    };
});
</script>


<style scoped>
.onboarding-card {
    border: 1px solid rgb(var(--v-theme-black-black200));
    border-radius: 32px;
    background-color: rgb(var(--v-theme-black-black100));
}

.cancel-button {
    position: fixed;
    top: 95px;
    left: 20px;
    border: none;
    max-width: 275px;
    font-size: 24px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
}

.edit-button {
    position: fixed;
    top: 95px;
    right: 20px;
    border: none;
    max-width: 275px;
    font-size: 24px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
}

.event-card {
    display: flex;
    flex-direction: column;
    gap: 8px;
    height: 100%;
    border-radius: 32px;
    padding: 24px !important;
    animation: fadeIn 1s forwards;
    transition: height 0.5s ease-out, transform 0.3s ease, box-shadow 0.3s ease, filter 0.3s ease;
}

.pa-24 {
    padding: 24px !important;
    gap: 8px;
}
</style>
