<template>
    <div
        class="text-start mt-auto bg-white pa-5 mb-5"
        style="display: flex; justify-content: center; border-radius: 8px;"
    >
        <qrcode-canvas
            v-if="qrValue"
            :value="qrValue"
            level="H"
            :size="115"
        >
        </qrcode-canvas>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, defineEmits } from "vue"
import { io } from "socket.io-client"
import { QrcodeCanvas } from "qrcode.vue"

const emit = defineEmits([
    "logged"
])

const socket = ref<any>(null)
const qrValue = ref<string | null>(null)

const connectSocket = () => {
    socket.value = io("https://api.evently-app.fr", {
        query: {
            context: "auth"
        }
    })

    socket.value.on("auth_uuid", (res: any) => {
        qrValue.value = `evently://login?uuid=${res.uuid}`
    })

    socket.value.on("login", (res: any) => {
        emit("logged", res.jwt)
        socket.value.disconnect()
    })

    socket.value.on("disconnect", () => {
        setTimeout(connectSocket, 2000)
    })
}

onMounted(() => {
    connectSocket()
})

onUnmounted(() => {
    if (socket.value) {
        socket.value.disconnect()
    }
})
</script>
