<template>
    <div class="card">
        <h2 class="content-h5">{{ t('detail_invite_link') }}</h2>
        <p class="content-m-semibold text-start">{{
                t('detail_share_link')
            }}</p>
        <div class="link content-h5 mt-10 mb-10">{{ inviteLink }}</div>

        <choose-plain
            class="mb-n2"
            icon="copy"
            position="prepend"
            @click="copyInviteLink"
            :placeholder="t('detail_copy_link')"
        ></choose-plain>
    </div>
</template>

<script setup lang="ts">
import ChoosePlain from "../button/choose-plain.vue";
import { useI18n } from "vue-i18n";
import { useGlobalStore } from "../../stores/Global.store";
import { useToastStore } from "../../stores/Toast.store";
import { defineProps } from "vue";

const { t, locale } = useI18n({ useScope: 'global' });

const props = defineProps({
    inviteToken: {
        type: String,
        default: 'XXXXX'
    },
})

const inviteLink = `${useGlobalStore.appUrl}/join/${props.inviteToken}`

const copyInviteLink = () => {
    navigator.clipboard.writeText(inviteLink)

    useToastStore().success({ key: 'banner_copy_invite_link' });
}
</script>

<style scoped>
.card {
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    align-items: start;
    padding: 24px;
    gap: 16px;
    width: 100%;
    background: rgb(var(--v-theme-black100));
    border: 1px solid rgb(var(--v-theme-black200));
    border-radius: 32px;
    color: #FFFFFF;
    font-family: 'Nunito', sans-serif;
}

.card h2 {
    font-weight: 700;
    font-size: 24px;
    line-height: 32px;
    margin: 0;
}


.link {
    font-weight: 700;
    font-size: 24px;
    line-height: 32px;
    text-align: center;
    width: 100%;
    margin: 16px 0;
}
</style>
