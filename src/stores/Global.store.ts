import { useCategoryStore } from "./Category.store";
import { useFolderStore } from "./Folder.store";
import { useEventStore } from "./Event.store";
import {useUserStore} from "./User.store";
import {SocketService} from "../services/socket.services";

export class useGlobalStore {
    static appUrl = 'https://app.evently-app.fr'

    static async init () {
        await Promise.all([
            useCategoryStore().fetchCategories(),
            useFolderStore().fetchFolders(),
            useEventStore().fetchEvents(),
            useUserStore().fetchUserFriends(),
            useUserStore().fetchFriendRequests(),
        ])

        const token = useUserStore().token;
        if (token) {
            SocketService.init(token);
        }
    }
}