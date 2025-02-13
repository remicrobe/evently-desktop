<template>
    <div class="card">
        <h2 class="content-h5">{{ t('detail_invite_link') }}</h2>
        <p class="content-m-semibold text-start">{{
                t('detail_share_link')
            }}</p>
        <div class="link content-h5 mt-10 mb-10">evently.app/jhzo78fe</div>
<!--        <button class="button" @click="copyLink">-->
<!--            <img src="@/assets/copy-icon.png" alt="Copier" />-->
<!--            Copier le lien d’invitation-->
<!--        </button>-->

        <choose-plain
            class="mb-n2"
            icon="copy"
            :placeholder="t('detail_copy_link')"
        ></choose-plain>
    </div>
</template>

<script setup lang="ts">
import ChoosePlain from "../button/choose-plain.vue";
import { useI18n } from "vue-i18n";

const { t, locale } = useI18n({ useScope: 'global' });
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
