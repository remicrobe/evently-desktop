<template>
    <v-dialog :max-width="dialogWidth">
        <template v-slot:activator="{ props: activatorProps }">
            <choose-plain
                v-bind="activatorProps"
                class="mr-n5"
                icon="plusCircle"
                position="prepend"
                icon-color="black"
            >
                {{ t('global_add_friends') }}
                {{ selectedFriendUsername.length > 0 ? `(${selectedFriendUsername.length} ${t('global_selected')}` : '' }}
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
                                <custom-icons icon="person" :size="38" color="white" class="mr-1"></custom-icons>
                            </v-avatar>
                            <span class="content-h4 ma-auto ml-2">{{ t('global_add_friends') }}</span>
                        </v-col>
                    </v-row>
                </v-col>

                <v-col md="12" cols="12" class="text-white">
                    <completed v-model="search" :placeholder="t('global_search_friend')"></completed>
                    <v-divider class="mt-5"></v-divider>
                </v-col>

                <v-col md="12" cols="12" class="text-white text-center">
                    <span>{{ t('add_friends_can_create') }}</span>
                    <add-friend>
                        <template v-slot:activator="{ openDialog }">
                            <choose-plain
                                @click="openDialog"
                                class="mt-2"
                                color="white"
                                icon="plusCircle"
                                icon-color="black"
                                position="prepend"
                                :placeholder="t('add_friends_label')"
                            ></choose-plain>
                        </template>
                    </add-friend>
                    <v-divider class="mt-5"></v-divider>
                </v-col>

                <v-col cols="12" md="12">
                    <v-row>
                        <v-col md="6" cols="12" v-for="user in filteredFriends" :key="user.id">
                            <choose-plain
                                icon="person"
                                :color="selectedFriendUsername.includes(user.username!) ? 'white' : 'black-black200'"
                                :icon-color="selectedFriendUsername.includes(user.username!) ? 'black' : 'white'"
                                :class="selectedFriendUsername.includes(user.username!) ? 'text-black' : 'text-white'"
                                position="prepend"
                                @click="selectFriends(user.username!)"
                            >
                                {{ user.fullName }}
                            </choose-plain>
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
import {useUserStore} from "../../stores/User.store";
import { useI18n } from "vue-i18n";
import { useDisplay } from "vuetify";
import AddFriend from "./add-friend.vue";

const userStore = useUserStore();
const search = ref("");
const selectedFriendUsername = ref<string[]>([]);
const emit = defineEmits(["friendRemoved", "friendAdded"]);
const { t, locale } = useI18n({ useScope: 'global' });

const windowWidth = ref(useDisplay().width);

const props = defineProps<{ selectedFriendUsername?: string[] }>();

if (props.selectedFriendUsername && props.selectedFriendUsername.length > 0) {
    selectedFriendUsername.value = props.selectedFriendUsername;
}

const dialogWidth = computed(() => (windowWidth.value < 1200 ? "90%" : "50%"));

const filteredFriends = computed(() => {
    return userStore.friends.filter(fr =>
        fr.fullName.toLowerCase().includes(search.value.toLowerCase())
    );
});

const selectFriends = (username:  string) => {
    if (selectedFriendUsername.value.includes(username)) {
        selectedFriendUsername.value = selectedFriendUsername.value.filter(friend => friend !== username);
        emit("friendRemoved", username);
    } else {
        selectedFriendUsername.value.push(username)
        emit("friendAdded", username);
    }
};
</script>

<style scoped>
.card {
    border: 1px solid rgb(var(--v-theme-black-black200));
    border-radius: 32px;
    background-color: rgb(var(--v-theme-black-black100));
}
</style>