import { defineStore } from 'pinia';
import { useApiService } from "../services/api.services";
import { Event } from "../models/Event.model";
import { useFolderStore } from "./Folder.store";
import { useCategoryStore } from "./Category.store";
import { useUserStore } from "./User.store";
import { useToastStore } from "./Toast.store";
import {Category} from "../models/Category.model";


export const useEventStore = defineStore({
    id: 'event',
    state: () => ({
        events: [] as Event[],
        onlyMine: false,
    }),
    getters: {
        getEvent(): Event[] {
            const categoryStore = useCategoryStore();
            const folderStore = useFolderStore();
            const userStore = useUserStore();
            const selectedFolderId = folderStore.selectedFolderId;
            const selectedCategoryId = categoryStore.selectedCategoryId;
            const userId = userStore.user.id;

            return this.events.filter(event =>
                (selectedCategoryId === -1 || event.categoryID === selectedCategoryId) &&
                (selectedFolderId === -1 || event.folderID === selectedFolderId) &&
                (!this.onlyMine || event.userID === userId)
            );
        }
    },
    actions: {
        async createEvent(eventData: Partial<Event>) {
            const response = await useApiService.post('/events', eventData);
            if (!response.success) {
                useToastStore().success({ key: 'toast_error_creating_event' });
                return false;
            }
            this.events.push(new Event(response.data));
            return true;
        },
        getEventById(id: number): Event | undefined {
            return this.events.find(e => e.id === id);
        },
        async fetchEvents() {
            const response = await useApiService.get('/events');
            if (!response.success) {
                useToastStore().success({ key: 'toast_error_getting_event' });
                return false;
            }
            this.events = response.data.map((ev: any) => new Event(ev));
            return true;
        },

        async updateEvent(id: number, eventData: Partial<Event>) {
            const response = await useApiService.put(`/events/${id}`, eventData);
            if (!response.success) {
                    useToastStore().success({ key: 'toast_error_update_event' });
                return false;
            }
            const index = this.events.findIndex(ev => ev.id === id);
            if (index !== -1) {
                this.events[index] = new Event(response.data);
            }
            return true;
        },

        async deleteEvent(id: number) {
            const response = await useApiService.delete(`/events/${id}`);
            if (response.status !== 204 && !response.success) {
                useToastStore().success({ key: 'toast_error_deleting_event' });
                return false;
            }
            this.events = this.events.filter(ev => ev.id !== id);
            return true;
        }
    },
});