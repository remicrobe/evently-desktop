<template>
    <div
        class="list-item"
        :style="[selected ? selectedBackgroundStyle : {}, customStyle]"
        @click="$emit('click')"
    >
        <div class="icon-container">
            <custom-icons :icon="icon" :color="color"></custom-icons>
        </div>
        <span :class="{
          'text-black-black500': !selected,
          [`text-${selectedTextColor}`]: selected,
          'content-l-bold': true
        }">
            {{ text }}
        </span>
    </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import CustomIcons from "../../custom-icons.vue";

const props = defineProps({
    icon: {
        type: String,
        required: true
    },
    text: {
        type: String,
        required: true
    },
    color: {
        type: String,
        default: 'black-black500'
    },
    selectedTextColor: {
        type: String,
        default: 'black'
    },
    selected: {
        type: Boolean,
        default: false
    },
    selectedBackground: {
        type: String,
        default: ''
    },
    customStyle: {
        type: String,
        default: ''
    }
});

defineEmits(['click']);

const selectedBackgroundStyle = computed(() => {
    return props.selectedBackground ? `background: ${props.selectedBackground};` : '';
});
</script>

<style scoped>
.list-item {
    display: flex;
    flex-direction: row;
    align-items: center;
    padding: 12px 16px;
    gap: 10px;
    width: 226px;
    height: 49px;
    border-radius: 16px;
    cursor: pointer;
    transition: all 0.2s;
    background: transparent;
}

.icon-container {
    width: 20px;
    height: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
}

.list-item:hover {
    background: rgba(255, 255, 255, 0.1);
}

@media (max-width: 1200px) {
    .list-item span {
        display: none;
    }

    .list-item {
        width: auto;
        gap: 8px;
    }

    .icon-container {
        width: 18px;
        height: 18px;
    }
}
</style>