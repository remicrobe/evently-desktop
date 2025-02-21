import { defineStore } from 'pinia';
import { useApiService } from "../services/api.services";
import { Event } from "../models/Event.model";
import { useFolderStore } from "./Folder.store";
import { useCategoryStore } from "./Category.store";
import { useUserStore } from "./User.store";
import { useToastStore } from "./Toast.store";
import { Category } from "../models/Category.model";
import { DateTime } from "luxon";
import { Invitation } from "../models/Invitation.model";

export const useEventStore = defineStore({
    id: 'event',
    state: () => ({
        events: [] as Event[],
        invitations: [] as Invitation[],
        onlyMine: false,
        showPast: false,
    }),
    getters: {
        getEvent(): Event[] {
            const categoryStore = useCategoryStore();
            const folderStore = useFolderStore();
            const userStore = useUserStore();
            const selectedFolderId = folderStore.selectedFolderId;
            const selectedCategoryId = categoryStore.selectedCategoryId;
            const userId = userStore.user.id;

            const today = DateTime.local().startOf('day');

            return this.events.filter(event => {
                const eventDate = DateTime.fromJSDate(event.targetDate!);
                return (
                    (selectedCategoryId === -1 || event.categoryID === selectedCategoryId) &&
                    (selectedFolderId === -1 || event.folderID === selectedFolderId) &&
                    (!this.onlyMine || event.userID === userId) &&
                    ((this.showPast && eventDate < today) || (!this.showPast && eventDate >= today))
                );
            });
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
        getInvitationById(id: number): Invitation | undefined {
            return this.invitations.find(i => i.id === id);
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
        },
        async fetchInvitations() {
            const response = await useApiService.get('/events/invitation');
            if (!response.success) {
                useToastStore().success({ key: 'toast_error_getting_invitations' });
                return false;
            }
            this.invitations = response.data.map((inv: any) => new Invitation(inv));

            return true;
        },
        async updateInvitationStatus(eventId: number, status: string) {
            const response = await useApiService.put(`/events/invitation/${eventId}`, { status });
            if (!response.success) {
                useToastStore().success({ key: 'toast_error_updating_invitation' });
                return false;
            }

            const index = this.invitations.findIndex((inv: any) => inv.event.id === eventId);
            if (index !== -1) {
                if (status === 'pending') {
                    this.invitations[index].invitationStatus = status;
                } else {
                    this.invitations.splice(index, 1);
                    this.events.push(new Event(response.data.event));
                }
            }
            return true;
        },
        async joinEvent(inviteToken: string) {
            const response = await useApiService.post('/events/join', { inviteToken });

            if (!response.success) {
                useToastStore().success({ key: 'toast_error_joining_event' });
                return false;
            }

            const updatedEvent = new Event(response.data);

            const index = this.events.findIndex(ev => ev.id === updatedEvent.id);
            if (index !== -1) {
                this.events[index] = updatedEvent;
            } else {
                this.events.push(updatedEvent);
            }

            useToastStore().success({ key: 'toast_success_joining_event' });
            return true;
        }
    },
});
