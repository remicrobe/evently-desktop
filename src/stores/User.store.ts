import { defineStore } from 'pinia';
import { useApiService } from "../services/api.services";
import { User } from "../models/User.model";
import { FriendsRequest } from "../models/FriendsRequest.model";
import { PersistentStore } from "./Persistent.store";
import { useToastStore } from "./Toast.store";



export const useUserStore = defineStore({
    id: 'user',
    state: () => ({
        user: new User(undefined),
        token: '' as string,
        refreshToken: '' as string,
        friendsRequests: [] as FriendsRequest[],
        sentFriendsRequests: [] as FriendsRequest[],
        friends: [] as User[],
    }),
    actions: {
        async disconnect() {
            await PersistentStore.clear();
            this.refreshToken = '';
        },
        async setUser(user: any, persistent: boolean = true) {
            this.token = user.token;
            this.user = new User(user);

            if (persistent) {
                await PersistentStore.set('refreshToken', user.refreshToken)
            }
        },
        async completeUserRegistration(userData: { firstname: string, lastname: string }) {
            const response = await useApiService.post('/auth/from-provider/step-two', userData);

            if (!response.success) {
                useToastStore().success({ key: 'toast_error_save_user' });
                return false;
            }

            this.user = new User(response.data.user);
            this.token = response.data.user.token;
            if (!response.data.needStepTwo) {
                await PersistentStore.set('refreshToken', response.data.user.refreshToken)
            }

            return true;
        },
        async fetchCurrentUser() {
            const response = await useApiService.get('/user/me');
            if (!response.success) {
                useToastStore().success({ key: 'toast_error_getting_user' });
                return false;
            }
            this.user = response.data;
        },
        async deleteUser() {
            const response = await useApiService.delete('/user/');
            if (!response.success) {
                useToastStore().success({ key: 'toast_error_deleting_user' });
                return false;
            }
            return response.success;
        },
        async registerUser(userData: Partial<User>) {
            const response = await useApiService.post('/user/register', userData);

            if (response.success) {
                this.user = new User(response.data);
                this.token = response.data.token;
                await PersistentStore.set('refreshToken', response.data.refreshToken);
            } else {
                useToastStore().success({ key: 'toast_error_save_user' });
            }

            return response;
        },
        async updateUser(userData: Partial<User>) {
            const response = await useApiService.put('/user/update', userData);
            if (response.success) {
                this.user = response.data;
            } else {
                useToastStore().success({ key: 'toast_error_update_user' });
            }
            return response.success;
        },
        async loginUser(loginData: { email: string, password: string }) {
            const response = await useApiService.post('/user/login', loginData);

            if (response.success) {
                this.user = new User(response.data);
                this.token = response.data.token;
                await PersistentStore.set('refreshToken', response.data.refreshToken);
            } else {
                useToastStore().success({ key: 'toast_error_login' });
            }

            return response;
        },
        async fetchUserFriends() {
            const response = await useApiService.get('/user/friends');
            if (!response.success) {
                useToastStore().success({ key: 'toast_error_getting_friends' });
                return false;
            }
            this.friends = response.data.map((request: any) => new User(request));
        },
        async refreshUserWithRefreshToken(token?: string) {
            const refreshToken = token ? token : await PersistentStore.get('refreshToken');

            if (!refreshToken) {
                return false;
            }

            const response = await useApiService.get(`/user/refresh-token/${refreshToken}`);
            if (response.success) {
                this.user = new User(response.data);
                this.token = response.data.token;
                await PersistentStore.set('refreshToken', response.data.refreshToken);
                return true;
            }

            useToastStore().success({ key: 'toast_error_refresh_token' });
            return false;
        },
        async sendFriendRequest(usernameOrEmail: string) {
            const response = await useApiService.post(`/friends-request/`, {
                searchField: usernameOrEmail
            });
            if (!response.success) {
                useToastStore().success({ key: 'toast_error_sending_friend_request' });
                return false;
            }
            return response.success;
        },
        async removeFriend(username: string) {
            const response = await useApiService.delete(`/friends-request/`, {
                field: username
            });
            if (!response.success) {
                useToastStore().success({ key: 'toast_error_removing_friend_request' });
                return false;
            }
            this.friends = this.friends.filter(user => user.username !== username);
            return response.success;
        },
        async fetchFriendRequests() {
            const response = await useApiService.get('/friends-request');
            if (!response.success) {
                useToastStore().success({ key: 'toast_error_getting_friend_request' });
                return false;
            }
            this.friendsRequests = response.data.map((request: any) => new FriendsRequest(request));
        },
        async respondToFriendRequest(requestId: number, accept: boolean) {
            const response = await useApiService.put(`/friends-request/${requestId}`, { accept });

            if (response.success) {
                if (accept) {
                    this.friendsRequests = this.friendsRequests.filter(fr => fr.id !== Number(requestId));
                }
                this.fetchUserFriends();
                return true;
            }

            useToastStore().success({ key: 'toast_error_answer_friend_request' });
            return false;
        },
        async fetchSentFriendRequests() {
            const response = await useApiService.get('/friends-request/sent');
            if (!response.success) {
                useToastStore().success({ key: 'toast_error_getting_friend_request' });
                return false;
            }
            this.sentFriendsRequests = response.data.map((request: any) => new FriendsRequest(request));
        },
        async deleteSentFriendRequest(requestId: string) {
            const response = await useApiService.delete(`/friends-request/sent/${requestId}`);
            if (!response.success) {
                useToastStore().success({ key: 'toast_error_deleting_friend_request' });
                return false;
            }
            return response.data;
        },
    },
});
