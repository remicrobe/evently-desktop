import { defineStore } from "pinia";
import { Folder } from "../models/Folder.model";
import { useApiService } from "../services/api.services";
import { useToastStore } from "./Toast.store";

export const useFolderStore = defineStore({
    id: 'folder',
    state: () => ({
        folders: [] as Folder[],
        selectedFolderId: -1,
    }),
    getters: {
        selectedFolder(): Folder | undefined {
            return this.folders.find(f => f.id === this.selectedFolderId);
        }
    },
    actions: {
        selectFolder(folderId: number) {
            this.selectedFolderId = folderId;
        },
        getFolderById(id: number): Folder | undefined {
            return this.folders.find(f => f.id === id);
        },
        async fetchFolders() {
            const res = await useApiService.get('/folders');

            if (!res.success) {
                useToastStore().success({ key: 'toast_error_get_folder' });
                return false;
            }

            this.folders = res.data.map((folder: any) => new Folder(folder));
            return true;
        },
        async createFolder(folderData: Partial<Folder>) {
            const response = await useApiService.post('/folders', folderData);
            if (!response.success) {
                useToastStore().success({ key: 'toast_error_creating_folder' });
                return false;
            }
            this.folders.push(new Folder(response.data));
            return true;
        },
        async updateFolder(id: number, folderData: Partial<Folder> ) {
            const response = await useApiService.put(`/folders/${id}`, folderData);
            if (!response.success) {
                useToastStore().success({ key: 'toast_error_updating_folder' });
                return false;
            }
            const index = this.folders.findIndex(f => f.id === id);
            if (index !== -1) {
                this.folders[index] = new Folder(response.data);
            }
            return true;
        }
    },
});
