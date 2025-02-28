<template>
    <default></default>
    <drawer></drawer>

    <v-row justify="start" align="start" class="ma-3" v-if="eventStore.getEvent.length > 0">
        <v-col md="12">
            <template v-if="invitations.length > 0 && !eventStore.onlyMine && !eventStore.showPast">
                <span class="content-h5 ml-4">
                    {{ t ('home_waiting_invitation') }}
                </span>

                <v-row class="mt-1 mb-1">
                    <v-col md="4" cols="12" v-for="inv in invitations" :key="inv.id">
                        <event-component
                            :event="inv.event"
                            :invite-id="inv.id"
                            :is-invite="true"
                        ></event-component>
                    </v-col>
                </v-row>

                <v-divider class="mb-5"></v-divider>
            </template>

            <template v-for="(events, period) in groupedEvents" :key="period">
                <span v-if="events.length > 0" class="content-h5 ml-4">
                    {{ t (period) }}
                </span>

                <v-row v-if="events.length > 0" class="mt-1 mb-1">
                    <v-col md="4" cols="12" v-for="event in events" :key="event.id">
                        <event-component :event="event"></event-component>
                    </v-col>
                </v-row>

                <v-divider class="mb-5" v-if="events.length > 0"></v-divider>
            </template>
        </v-col>
    </v-row>

    <v-row justify="center" align="center" style="height: 90vh;" v-else>
        <v-col md="12" cols="12" class="text-center">
            <v-img
                width="20%"
                src="./assets/no_event.svg"
                class="mx-auto mb-5"
            ></v-img>
            <span class="content-h4">
                {{ t ('home_empty_title') }}
            </span> <br/><br/>
            <span class="content-l-medium">
                {{ t ('home_empty_desc') }}
            </span>
        </v-col>
    </v-row>

    <choose-plain
        icon="calendar"
        icon-color="black"
        position="prepend"
        class="add-button pa-7"
        :placeholder="t('add_event_title')"
        @click="goToCreationPage"
    ></choose-plain>
</template>

<script setup lang="ts">
import Default from "../../components/layout/default.vue";
import Drawer from "../../components/layout/drawer.vue";
import EventComponent from "../../components/card/event.vue";
import { Event } from "../../models/Event.model";
import { useEventStore } from "../../stores/Event.store";
import { computed } from 'vue';
import ChoosePlain from "../../components/button/choose-plain.vue";
import { useRouter } from "vue-router";
import { useI18n } from "vue-i18n";
import { DateTime } from "luxon";

const eventStore = useEventStore ();
const router = useRouter ()
const { t, locale } = useI18n ({ useScope: 'global' });

const invitations = eventStore.invitations;

const groupedEvents = computed (() => {
    const today = DateTime.now ();
    const thisMonthEnd = today.endOf ("month").toJSDate ();
    const thisYearEnd = today.endOf ("year").toJSDate ();
    const nextYearEnd = today.plus ({ years: 1 }).endOf ("year").toJSDate ();
    const yesterday = today.minus ({ day: 1 }).endOf ('day').toJSDate ();

    return eventStore.getEvent.reduce ((acc, event) => {
        const eventDate = event.targetDate ?? new Date ();

        if (eventDate <= yesterday) {
            acc.home_past.push (event);
        } else if (eventDate <= thisMonthEnd) {
            acc.home_this_month.push (event);
        } else if (eventDate <= thisYearEnd) {
            acc.home_later_this_year.push (event);
        } else if (eventDate <= nextYearEnd) {
            acc.home_next_year.push (event);
        } else {
            acc.home_later_future.push (event);
        }

        return acc;
    }, {
        home_this_month: [] as Event[],
        home_later_this_year: [] as Event[],
        home_next_year: [] as Event[],
        home_later_future: [] as Event[],
        home_past: [] as Event[],
    });
});

const goToCreationPage = () => {
    router.push ('/app/event/create')
}
</script>

<style>
.add-button {
    position: fixed;
    bottom: 20px;
    right: 20px;
    border: none;
    max-width: 325px;
    font-size: 24px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
}

@media (max-width: 1200px) {
    .add-button .v-btn__content {
        display: none;
    }

    .add-button {
        max-width: 45px;
    }
}
</style>