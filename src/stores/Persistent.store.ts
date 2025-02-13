export class PersistentStore {
    static get isElectron() {
        return !!window.ipcRenderer;
    }

    static async clear() {
        if (this.isElectron) {
            try {
                await window.ipcRenderer.invoke('storage-clear');
            } catch (error) {
                console.error('Erreur lors de la suppression via IPC:', error);
            }
        } else {
            localStorage.clear();
        }
    }

    static async get(key: string): Promise<any> {
        if (this.isElectron) {
            try {
                return await window.ipcRenderer.invoke('storage-get', key);
            } catch (error) {
                console.error('Erreur lors de la lecture via IPC:', error);
                return null;
            }
        } else {
            return localStorage.getItem(key);
        }
    }

    static async set(key: string, value: string): Promise<void> {
        if (this.isElectron) {
            try {
                await window.ipcRenderer.invoke('storage-set', key, value);
            } catch (error) {
                console.error('Erreur lors de l\'écriture via IPC:', error);
            }
        } else {
            localStorage.setItem(key, value);
        }
    }

    static async getLocale () {
        if (this.isElectron) {
            return await window.ipcRenderer.invoke('get-locale');
        } else {
            return Intl.DateTimeFormat().resolvedOptions().locale || null;
        }
    }
}
