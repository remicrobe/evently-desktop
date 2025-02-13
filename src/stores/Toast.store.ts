import { defineStore } from "pinia";
import { useI18n } from "vue-i18n";

export type TToastStatus = "success" | "warning" | "error";

interface IToast {
    text: string;
    status: TToastStatus;
    id: number;
}
type ToastPayload = { timeout?: number; key: string };

const defaultTimeout = 2000;

const createToast = (text: string, status: TToastStatus): IToast => ({
    text,
    status,
    id: Math.random() * 1000,
});

export const useToastStore = defineStore("toast-store", {
    state: () => ({
        toasts: [] as IToast[],
        i18n: useI18n({ useScope: 'global' })
    }),
    actions: {
        updateState(payload: ToastPayload, status: TToastStatus) {

            const { key, timeout } = payload;

            const toast = createToast(this.i18n.t(key), status);

            this.toasts.push(toast);

            setTimeout(() => {
                this.toasts = this.toasts.filter((t) => t.id !== toast.id);
            }, timeout ?? defaultTimeout);
        },
        success(payload: ToastPayload) {
            this.updateState(payload, "success");
        },

        warning(payload: ToastPayload) {
            this.updateState(payload, "warning");
        },

        error(payload: ToastPayload) {
            this.updateState(payload, "error");
        },
    },
});