<template>
    <div class="svg-icon" :style="{ width: size + 'px', height: size + 'px' }">
        <svg
            v-if="iconPath"
            :width="size"
            :height="size"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <mask :id="`icon-mask${randomId}`" mask-type="alpha" maskUnits="userSpaceOnUse" x="0" y="0" width="24" height="24">
                <image :href="iconPath" width="24" height="24" />
            </mask>
            <rect width="24" height="24" :fill="vuetifyColor" :mask="`url(#icon-mask${randomId})`" />
        </svg>
    </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useTheme } from "vuetify";

const randomId = Math.random().toString();

const availableIcons: Record<string, string> = {
    arrowDiagonal: "./assets/icons/arrow-diagonal.svg",
    bike: "./assets/icons/bike.svg",
    birthday: "./assets/icons/birthday.svg",
    brush: "./assets/icons/brush.svg",
    calendar: "./assets/icons/calendar.svg",
    checkmark: "./assets/icons/checkmark.svg",
    chevronBack: "./assets/icons/chevron-back.svg",
    chevronMenu: "./assets/icons/chevron-menu.svg",
    copy: "./assets/icons/copy.svg",
    document: "./assets/icons/document.svg",
    edit: "./assets/icons/edit.svg",
    update: "./assets/icons/update.svg",
    finance: "./assets/icons/finance.svg",
    gamepad: "./assets/icons/gamepad.svg",
    gear: "./assets/icons/gear.svg",
    gift: "./assets/icons/gift.svg",
    heart: "./assets/icons/heart.svg",
    list: "./assets/icons/list.svg",
    magnifyingGlass: "./assets/icons/magnifying-glass.svg",
    party: "./assets/icons/party.svg",
    person: "./assets/icons/person.svg",
    plane: "./assets/icons/plane.svg",
    plant: "./assets/icons/plant.svg",
    plusCircle: "./assets/icons/plus-circle.svg",
    qrcode: "./assets/icons/qrcode.svg",
    sparkes: "./assets/icons/sparkes.svg",
    sport: "./assets/icons/sport.svg",
    study: "./assets/icons/study.svg",
    tag: "./assets/icons/tag.svg",
    technology: "./assets/icons/technology.svg",
    trash: "./assets/icons/trash.svg",
    folderPlus: "./assets/icons/folderPlus.svg",
    work: "./assets/icons/work.svg",
    inboxStack: "./assets/icons/inbox-stack.svg",
    xmark: "./assets/icons/xmark.svg",
    apple: "./assets/icons/apple.svg",
    google: "./assets/icons/google.svg",
    guest: "./assets/icons/guest.svg",
    folder: "./assets/icons/folder.svg",
    logout: "./assets/icons/logout.svg",
    description: "./assets/icons/description.svg",
    crown: "./assets/icons/crown.svg",
    link: "./assets/icons/link.svg",
    ticket: "./assets/icons/ticket.svg",
    questionmark: "./assets/icons/questionmark.svg",
    checkmarkCircle: "./assets/icons/checkmarkCircle.svg",
} as const;

const props = defineProps({
    icon: {
        type: String,
        required: true,
    },
    size: {
        type: Number,
        default: 24,
    },
    color: {
        type: String,
        default: "black",
    },
});

// Calcule le chemin de l'icône en fonction du préfixe du prop icon
const iconPath = computed(() => {
    if (props.icon.startsWith("hero-")) {
        // On récupère la partie après "hero-"
        return `./assets/icons/Heroicons/${props.icon}.svg`;
    } else if (props.icon.startsWith("lcd-")) {
        // On récupère la partie après "lcd-"
        return `./assets/icons/Lucide/${props.icon}.svg`;
    } else {
        // On utilise l'icône présente dans availableIcons
        return availableIcons[props.icon];
    }
});

const vuetifyColor = computed(() => {
    return useTheme().global.current.value.colors[props.color] || props.color;
});
</script>

<style scoped>
.svg-icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
}
</style>
