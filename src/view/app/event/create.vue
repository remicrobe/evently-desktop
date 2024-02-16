<template>
    <default></default>

    <v-row justify="center" align="center" class="mr-5 ml-5 mb-15">
        <v-col md="7" cols="12" class="text-lg-center text-left mt-10">
            <v-avatar
                class="rounded mt-n4"
                :rounded="false"
                size="35"
                image="./assets/logo.png"
            >
                <custom-icons icon="calendar" :size="38" color="white" class="mr-1"></custom-icons>
            </v-avatar>

            <span class="content-h4 ma-auto ml-2">{{ event.id ? t('home_update_event') : t('home_add_event') }}</span>
        </v-col>

        <v-col md="7" cols="12">
            <v-progress-linear
                :model-value="step/totalStep*100"
                color="white"
                height="38"
                class="mb-6 mb-n1 progress"
            >
                <strong class="text-black content-m-bold ml-5">{{ t('add_event_step') }} {{ step }} / {{ totalStep }}</strong>
            </v-progress-linear>
        </v-col>

        <template v-if="step === 1">
            <v-col md="7" cols="12">
                <span>{{ t('add_event_name') }}</span>
                <completed
                    v-model="event.name"
                    class="mb-6 mt-1"
                    :placeholder="t('add_event_name_placeholder')"
                ></completed>
            </v-col>

            <v-col md="7" cols="12" class="mt-n5">
                <v-row>
                    <v-col md="6" cols="12">
                        <span>{{ t('add_event_category') }}</span>
                        <choose-category
                            :selected-category-id="event.categoryID"
                            @category-selected="(id) => event.categoryID = id"
                        ></choose-category>
                    </v-col>

                    <v-col md="6" cols="12" class="mt-5 mt-md-0 ml-sm-0 mt-n1 mr-sm-0">
                        <span>{{ t('add_event_folder_shared') }}</span>
                        <choose-folder
                            :selected-folder-id="event.folderID"
                            @folder-selected="(id) => selectFolder(id)"
                        ></choose-folder>
                    </v-col>
                </v-row>
            </v-col>
        </template>

        <template v-if="step === 2">
            <v-col md="7" cols="12" class="mt-5">
                <v-row>
                    <v-col md="6" cols="12">
                        <span >{{ t('add_event_choose_date') }}</span>

                        <v-menu :close-on-content-click="false">
                            <template v-slot:activator="{ props }">
                                <choose-clear
                                    icon="calendar"
                                    position="prepend"
                                    v-bind="props"
                                >
                                    {{ DateTime.fromJSDate(event.targetDate!).isValid ? DateTime.fromJSDate(event.targetDate!).toLocaleString() : t('add_event_choose_date') }}
                                </choose-clear>
                            </template>

                            <v-date-picker v-model="event.targetDate"></v-date-picker>
                        </v-menu>
                    </v-col>

                    <v-col md="6" cols="12" class="mt-5 mt-md-0 mt-n1 ml-sm-0 mr-sm-0">
                        <span>{{ t('add_event_reccurence') }}</span>
                        <v-menu>
                            <template v-slot:activator="{ props }">
                                <choose-clear
                                    icon="chevronMenu"
                                    position="prepend"
                                    v-bind="props"
                                >
                                    {{ event.recurrencePattern }}
                                </choose-clear>
                            </template>

                            <v-list>
                                <v-list-item
                                    v-for="(item, index) in availableRepetition"
                                    :key="index"
                                    @click="event.recurrencePattern = item.value"
                                    :value="index"
                                >
                                    <v-list-item-title>{{ item.text }}</v-list-item-title>
                                </v-list-item>
                            </v-list>
                        </v-menu>
                    </v-col>
                </v-row>
            </v-col>
        </template>

        <template v-if="step === 3">
            <v-col md="7" cols="12" class="mt-5">
                <v-row>
                    <v-col md="6" cols="12">
                        <span >{{ t('global_friends') }}</span>
                        <choose-friends
                            :selected-friend-username="event.friends"
                            @friend-added="(username) => event.friends.push(username)"
                            @friend-removed="(username) => event.friends = event.friends.filter(f => f !== username)"
                        ></choose-friends>
                    </v-col>

                    <v-col md="6" cols="12" class="mt-5 mt-md-0 mt-n1 ml-sm-0 mr-sm-0">
                        <span>{{ t('detail_invite_link') }}</span>
                        <choose-clear
                            icon="copy"
                            position="prepend"
                            @click="copyInviteLink"
                        >
                            {{ t('detail_copy_link') }}
                        </choose-clear>
                    </v-col>
                </v-row>
            </v-col>
        </template>

        <v-col md="7" cols="12" >
            <choose-plain
                class="mb-6 mt-6 text-white"
                color="black-black200"
                :placeholder="t('add_event_nextstep')"
                @click="nextStep"
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
import Completed from "../../../components/text-field/completed.vue";
import ChoosePlain from "../../../components/button/choose-plain.vue";
import {useRouter} from "vue-router";
import {onMounted, ref} from "vue";
import ChooseCategory from "../../../components/dialog/choose-category.vue";
import ChooseFolder from "../../../components/dialog/choose-folder.vue";
import { Event } from "../../../models/Event.model";
import {DateTime} from "luxon";
import {useEventStore} from "../../../stores/Event.store";
import ChooseFriends from "../../../components/dialog/choose-friends.vue";
import {useToastStore} from "../../../stores/Toast.store";
import { useI18n } from "vue-i18n";
import { useGlobalStore } from "../../../stores/Global.store";

let totalStep = ref(3);
let step = ref(1);
const toast = useToastStore();
const { t, locale } = useI18n({ useScope: 'global' });

const event = ref(new Event());
const eventStore = useEventStore()
const router = useRouter()

const eventId = ref(router.currentRoute.value.params.id)

if (eventId.value) {
    event.value = new Event(eventStore.getEventById(Number(eventId.value)))
}

const nextStep = async () => {
    // Validation pour passer de l'étape 1 à l'étape 2
    if (step.value === 1) {
        if (!event.value.name || !event.value.categoryID) {
            toast.success({ key: 'toast_need_category_create_event'});
            return; // Empêche le passage à l'étape suivante
        }
    }

    // Validation pour passer de l'étape 2 à l'étape 3
    if (step.value === 2) {
        if (!DateTime.fromJSDate(event.value.targetDate!).isValid) {
            toast.success({ key: 'toast_need_date_create_event' });
            return; // Empêche le passage à l'étape suivante
        }
    }

    if (step.value === totalStep.value) {
        const res = event.value.id ? await eventStore.updateEvent(event.value.id!, event.value) : await eventStore.createEvent(event.value);
        if (res) {
            await router.back()
        }
    } else {
        step.value++ // Passage à l'étape suivante
    }
}

const availableRepetition = [
    { value: 'unique', text: t('global_unique') },
    { value: 'monthly', text: t('global_monthly') },
    { value: 'yearly', text: t('global_yearly') },
]

const copyInviteLink = () => {
    const inviteLink = `${useGlobalStore.appUrl}/join/${event.value.inviteToken}`

    navigator.clipboard.writeText(inviteLink)

    useToastStore().success({ key: 'banner_copy_invite_link' });
}

const selectFolder = (id: number) => {
    if (id) {
        totalStep.value = 2;
    } else {
        totalStep.value = 3;
    }
    event.value.folderID = id;
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