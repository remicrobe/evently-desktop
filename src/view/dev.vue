<template>
    <v-container class="mt-15">
        <v-row>
            <v-col md="12" cols="12">
                <default-layout></default-layout>

                <choose-plain></choose-plain>

                <choose-clear></choose-clear>

                <completed></completed>

                <default></default>

                <share-invite-link></share-invite-link>

                <login method="apple"></login>
                <login method="google"></login>
                <login method="guest"></login>

                <v-row>
                    <v-col md="6" v-for="n in 4">
                        <event></event>
                    </v-col>
                </v-row>
            </v-col>
        </v-row>
    </v-container>
</template>
<script setup lang="ts">
import ChoosePlain from "../components/button/choose-plain.vue";
import ChooseClear from "../components/button/choose-clear.vue";
import Completed from "../components/text-field/completed.vue";
import Default from "../components/text-field/default.vue";
import ShareInviteLink from "../components/card/share-invite-link.vue";
import Login from "../components/button/login.vue";
import Event from "../components/card/event.vue";
import DefaultLayout from "../components/layout/default.vue"
</script>