import {io, Socket} from "socket.io-client";
import {useUserStore} from "../stores/User.store";
import {useEventStore} from "../stores/Event.store";
import {useFolderStore} from "../stores/Folder.store";


const SocketContext = {
    FRIEND: 'friend',
    FRIEND_REQUEST: 'friendRequest',
    EVENT: 'event',
    FOLDER: 'folder',
};

const baseUrl = "https://api.evently-app.fr";


export class SocketService {
    static socket: Socket;
    static init(token: string) {
        this.socket = io(baseUrl, {
            reconnection: true,
            reconnectionAttempts: 4,
            reconnectionDelay: 10000,
            query: {
                token: token,
            },
        });

        this.setupSocketEvents();
    }

    static connect() {
        if (this.socket) {
            this.socket.connect();
        }
    }

    static disconnect() {
        if (this.socket) {
            this.socket.disconnect();
        }
    }

    static isConnected() {
        return this.socket && this.socket.connected;
    }

    static setupSocketEvents() {
        if (!this.socket) return;

        this.socket.on('connect', () => {
            console.log('🛰️ Socket connected');
        });

        this.socket.on('disconnect', () => {
            console.log('🛰️ Socket disconnected');
        });

        this.socket.on('reconnect', () => {
            console.log('🛰️ Socket reconnecting');
        });

        this.socket.on('reconnect_attempt', () => {
            console.log('🛰️ Socket reconnect attempt');
        });

        this.socket.on('error', (error) => {
            console.log('🛰️ Socket error:', error);
        });

        this.observeSocket();
    }

    static observeSocket() {
        if (!this.socket) return;

        this.socket.on('update', async (data) => {
            console.log('🛰️ AN UPDATE IS NEEDED');
            if (data) {
                console.log('🛰️ Data :', data);
                await this.handleUpdateEvent(data);
            }
        });
    }

    static async handleUpdateEvent(eventData: any) {
        const context = eventData.context;
        const id = eventData.id;
        const mId = eventData.mainId;
        const socketContext = Object.values(SocketContext).includes(context) ? context : null;

        if (socketContext) {
            try {
                switch (socketContext) {
                    case SocketContext.FRIEND:
                        await useUserStore().fetchUserFriends();
                        break;
                    case SocketContext.FRIEND_REQUEST:
                        await useUserStore().fetchFriendRequests();
                        break;
                    case SocketContext.EVENT:
                        await useEventStore().fetchEvents()
                        // if (id) {
                        //     await useEventStore().fetchEvents(id)
                        // }
                        break;
                    case SocketContext.FOLDER:
                        await useFolderStore().fetchFolders()
                        await useEventStore().fetchEvents()
                        break;
                }
            } catch (e) {
                console.log(e)
            }
        }
    }
}