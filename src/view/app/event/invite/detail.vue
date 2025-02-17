<template>
    <default></default>

    <v-row justify="center" style="margin-top: 95px" class="mr-2 ml-2 mb-5">
        <v-col md="9" cols="12">
            <v-row>
                <v-col md="12" cols="12">
                    <v-row class="ma-1" style="height: 100%">
                        <v-col md="12" cols="12" class="onboarding-card pa-24">
                            <div class="d-flex">
                                <custom-icons class="mr-2 ml-1 ma-auto" icon="ticket" color="white"
                                              :size="24"></custom-icons>
                                <h2 class="content-h5">{{ t ('global_invitation') }}</h2>
                            </div>

                            <div class="mt-2 content-m-semibold">
                                {{ t ('global_invitation_text') }}
                            </div>

                            <v-row class="mt-5">
                                <v-col md="12" cols="12">
                                    <choose-plain
                                        icon="checkmarkCircle"
                                        position="prepend"
                                        :placeholder="t('global_accept')"
                                        @click="respond('accepted')"
                                    ></choose-plain>
                                </v-col>

                                <v-col md="6" cols="6" class="mt-n2">
                                    <choose-clear
                                        icon="xmark"
                                        position="prepend"
                                        @click="respond('refused')"
                                        :placeholder="t('global_refuse')"
                                    ></choose-clear>
                                </v-col>

                                <v-col md="6" cols="6" class="mt-n2">
                                    <choose-clear
                                        icon="questionmark"
                                        position="prepend"
                                        @click="respond('pending')"
                                        :color="selectedInvitation?.invitationStatus === 'pending' ? 'grey-darken-2' : ''"
                                        :placeholder="t('global_maybe')"
                                    ></choose-clear>
                                </v-col>
                            </v-row>
                        </v-col>
                    </v-row>
                </v-col>

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
                                :readonly="!isOwner"
                                class="mt-2 mb-n5 content-l-semibold"
                                variant="plain"
                                :placeholder="t('add_event_some_text_description')"
                                v-model="description"
                            ></v-textarea>
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
</template>
<script setup lang="ts">
import { Event } from "../../../../models/Event.model";
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";
import { useEventStore } from "../../../../stores/Event.store";
import { useUserStore } from "../../../../stores/User.store";
import { computed, ref } from "vue";
import { Folder } from "../../../../models/Folder.model";
import { Category } from "../../../../models/Category.model";
import { ColorUtils } from "../../../../utils/color.utils";
import { DateTime } from "luxon";
import ChooseClear from "../../../../components/button/choose-clear.vue";
import CustomIcons from "../../../../components/custom-icons.vue";
import Default from "../../../../components/layout/default.vue"
import ChoosePlain from "../../../../components/button/choose-plain.vue";

const { t, locale } = useI18n ({ useScope: 'global' });
const router = useRouter ();

const eventStore = useEventStore ()
const userStore = useUserStore ()
const description = ref('')

const invitationId = Number (router.currentRoute.value.params.id)

const selectedInvitation = computed (() => {
    return eventStore.getInvitationById (invitationId)
})

const selectedEvent = computed (() => {
    return new Event (selectedInvitation.value?.event)
})

const isOwner = computed (() => {
    return selectedEvent.value?.userID === userStore.user.id;
})

const folder = computed (() => {
    return new Folder (selectedEvent.value?.folder)
})

const category = computed (() => {
    return new Category (selectedEvent.value?.category)
})

description.value = selectedEvent.value?.description ?? '';

const makeItFade = (originalColor: string) => {
    return ColorUtils.adjustLightness (originalColor, -10)
}

const remainingTime = computed (() => {
    if (!selectedEvent.value?.targetDate) return { years: 0, months: 0, days: 0 };

    const now = DateTime.now ().startOf ('day');
    const targetDate = DateTime.fromJSDate (selectedEvent.value.targetDate!).startOf ('day');

    const diff = targetDate.diff (now, ["years", "months", "days"]).toObject ();

    return {
        years: diff.years ? Math.floor (diff.years) : 0,
        months: diff.months ? Math.floor (diff.months) : 0,
        days: diff.days ? Math.floor (diff.days) : 0,
    };
});

const respond = async (status: string) => {
    await eventStore.updateInvitationStatus(selectedEvent?.value.id!, status);

    if (status !== 'pending') {
        await router.push('/app')
    }
}
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
