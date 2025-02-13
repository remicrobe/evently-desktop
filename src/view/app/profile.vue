<template>
    <default></default>
    <drawer></drawer>

    <v-row justify="start" align="start" class="ma-3">
        <v-col md="6" cols="12">
            <v-row>
                <v-col md="12" cols="12">
                    <v-row class="card">
                        <v-col md="7" cols="7" class="ma-auto">
                            <v-avatar
                                class="rounded ma-auto mt-n2"
                                :rounded="false"
                                size="28"
                                image="./assets/logo.png"
                            >
                                <custom-icons icon="person" :size="28" color="white" class="mr-1"></custom-icons>
                            </v-avatar>
                            <span class="content-h5 ma-auto ml-2">
                                {{ t('global_my_friend') }}
                    </span>
                        </v-col>

                        <v-col md="5" cols="5">
                            <add-friend>
                                <template v-slot:activator="{ openDialog }">
                                    <choose-plain
                                        class="pa-5 content-s-semibold"
                                        @click="openDialog"
                                        icon-color="black"
                                        icon="plusCircle"
                                        :placeholder="t('global_add_friend')"
                                        position="prepend"
                                    ></choose-plain>
                                </template>
                            </add-friend>
                        </v-col>

                        <v-col md="12" cols="12" v-for="friend in userStore.friends">
                            <v-row>
                                <v-col md="10" cols="10" class="ma-auto">
                                    <v-avatar
                                        class="rounded ma-auto mt-n2"
                                        :rounded="false"
                                        size="28"
                                        image="./assets/logo.png"
                                    >
                                        <custom-icons icon="person" :size="28" color="white" class="mr-1"></custom-icons>
                                    </v-avatar>

                                    <div class="user-info ml-10 mt-n9 d-flex flex-column">
                                <span class="content-l-medium">
                                    {{ friend.fullName }}
                                </span>

                                        <span class="content-s-semibold">
                                    {{ friend.username }}
                                </span>
                                    </div>
                                </v-col>

                                <v-col md="2" cols="2" class="text-right">
                                    <custom-icons @click="userStore.removeFriend(friend.username!)" icon="trash" class="cursor-pointer" color="red"></custom-icons>
                                </v-col>
                            </v-row>
                        </v-col>

                        <v-col md="12" cols="12" class="text-center content-l-bold" v-if="userStore.friends.length === 0">
                            <span>{{ t('add_friend_advice') }}</span>
                        </v-col>
                    </v-row>
                </v-col>

                <v-col md="12" cols="12">
                    <v-row class="card">
                        <v-col md="12" cols="12" class="ma-auto">
                            <v-avatar
                                class="rounded ma-auto mt-n2"
                                :rounded="false"
                                size="28"
                                image="./assets/logo.png"
                            >
                                <custom-icons icon="gear" :size="28" color="white" class="mr-1"></custom-icons>
                            </v-avatar>
                            <span class="content-h5 ma-auto ml-2">
                        {{ t('profile_manage_my_account') }}
                    </span>
                        </v-col>

                        <v-col md="12" cols="12">
                            <choose-plain
                                color="white-white0"
                                icon-color="black-black100"
                                :placeholder="t('account_logout')"
                                @click="logout"
                                icon="logout"
                                position="prepend"
                            ></choose-plain>

                            <choose-plain
                                class="mt-3 text-white-white0"
                                color="red"
                                icon-color="white-white0"
                                :placeholder="t('account_delete')"
                                @click="deleteAccount"
                                icon="trash"
                                position="prepend"
                            ></choose-plain>
                        </v-col>
                    </v-row>
                </v-col>
            </v-row>
        </v-col>

        <v-col md="6" cols="12">
            <v-row>
                <v-col md="12" cols="12">
                    <v-row class="card">
                        <v-col md="12" cols="12" class="ma-auto">
                            <v-avatar
                                class="rounded ma-auto mt-n2"
                                :rounded="false"
                                size="28"
                                image="./assets/logo.png"
                            >
                                <custom-icons icon="person" :size="28" color="white" class="mr-1"></custom-icons>
                            </v-avatar>
                            <span class="content-h5 ma-auto ml-2">
                            {{ t('my_friends_requests') }}
                        </span>
                        </v-col>

                        <v-col md="12" cols="12" v-for="request in userStore.friendsRequests">
                            <v-row>
                                <v-col md="6" cols="6" class="ma-auto">
                                    <v-avatar
                                        class="rounded ma-auto"
                                        :rounded="false"
                                        size="28"
                                        image="./assets/logo.png"
                                    >
                                        <custom-icons icon="person" :size="28" color="white" class="mr-1"></custom-icons>
                                    </v-avatar>

                                    <div class="user-info ml-10 mt-n9 d-flex flex-column">
                                    <span class="content-l-medium">
                                        {{ request.asker!.fullName }}
                                    </span>

                                        <span class="content-s-semibold">
                                        {{ request.asker!.username }}
                                    </span>
                                    </div>
                                </v-col>

                                <v-col md="6" cols="6" class="text-right ma-auto">
                                    <v-row no-gutters>
                                        <v-col md="6" cols="6">
                                            <choose-plain
                                                class="pa-4 content-s-semibold"
                                                icon-color="black"
                                                position="prepend"
                                                icon="checkmarkCircle"
                                                :placeholder="t('accept')"
                                                @click="userStore.respondToFriendRequest(request.id!, true)"
                                                :icon-size="16"
                                            ></choose-plain>
                                        </v-col>
                                        <v-col md="6" cols="6">
                                            <choose-clear
                                                class="pa-4 content-s-semibold ml-2"
                                                icon-color="white"
                                                position="prepend"
                                                icon="xmark"
                                                :icon-size="16"
                                                :placeholder="t('refuse')"
                                                @click="userStore.respondToFriendRequest(request.id!, false)"
                                            ></choose-clear>
                                        </v-col>
                                    </v-row>
                                </v-col>
                            </v-row>
                        </v-col>

                        <v-col md="12" cols="12" class="text-center content-l-bold" v-if="userStore.friendsRequests.length === 0">
                            <span>{{ t('add_friend_advice') }}</span>
                        </v-col>
                    </v-row>
                </v-col>
                </v-row>
        </v-col>

    </v-row>
</template>
<script setup lang="ts">
import Default from "../../components/layout/default.vue";
import Drawer from "../../components/layout/drawer.vue";
import CustomIcons from "../../components/custom-icons.vue";
import { useI18n } from "vue-i18n";
import ChoosePlain from "../../components/button/choose-plain.vue";
import { useUserStore } from "../../stores/User.store";
import AddFriend from "../../components/dialog/add-friend.vue";
import { PersistentStore } from "../../stores/Persistent.store";
import router from "../../router";
import ChooseClear from "../../components/button/choose-clear.vue";

const { t, locale } = useI18n({ useScope: 'global' });
const userStore = useUserStore();

const logout = async () => {
    await PersistentStore.clear()
    await router.push('/')
}

const deleteAccount = async () => {
    await PersistentStore.clear()
    await router.push('/')
}
</script>

<style scoped>
.card {
    padding: 15px;
    margin: 1px;
    border: 1px solid rgb(var(--v-theme-black-black200));
    border-radius: 32px;
    background-color: rgb(var(--v-theme-black-black100));
}
</style>