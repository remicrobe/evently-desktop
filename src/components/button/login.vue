<template>
    <template v-if="method === 'apple'">
        <choose-plain
            :icon="method"
            position="append"
            :color="authColor"
            :placeholder="authText"
            @click="loginWithApple"
        ></choose-plain>
    </template>

    <template v-else>
        <choose-clear
            :border="method === 'google' ? 'none' : false"
            :icon="method"
            position="append"
            :color="authColor"
            :placeholder="authText"
        ></choose-clear>
    </template>
</template>

<script setup lang="ts">
import { computed, defineProps } from "vue";
import ChoosePlain from "./choose-plain.vue";
import ChooseClear from "./choose-clear.vue";
import { useI18n } from "vue-i18n";
const { t, locale } = useI18n({ useScope: 'global' });


const props = defineProps({
    method: {
        type: String,
        default: 'google'
    },
})

const authColor = computed(() => {
    switch (props.method) {
        case 'google':
            return 'red';
        case 'apple':
            return 'white/white0';
    }
})

const authText = computed(() => {
    switch (props.method) {
        case 'google':
            return t('auth_with_google');
        case 'apple':
            return t('auth_with_apple');
        case 'guest':
            return t('auth_classic');
    }
})

const loginWithApple = () => {
    // redirectUri: 'https://theodev.myftp.org:89/auth/apple-desktop',


    // console.log(authorizationUrl)
}
</script>