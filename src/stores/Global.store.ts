import { useCategoryStore } from "./Category.store";
import { useFolderStore } from "./Folder.store";
import { useEventStore } from "./Event.store";
import {useUserStore} from "./User.store";

export class useGlobalStore {
    static async init () {
        await Promise.all([
            useCategoryStore().fetchCategories(),
            useFolderStore().fetchFolders(),
            useEventStore().fetchEvents(),
            useUserStore().fetchUserFriends(),
            useUserStore().fetchFriendRequests(),
        ])
    }
}