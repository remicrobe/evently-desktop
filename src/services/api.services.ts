import axios, { AxiosResponse } from 'axios';
import { useUserStore } from "../stores/User.store";

export class useApiService {
    private static apiClient = axios.create({
        baseURL: 'https://api.evently-app.fr/',
        headers: {
            'Content-Type': 'application/json',
        },
    });

    private static getHeaders(): Record<string, string> {
        const userStore = useUserStore();
        const token = userStore.token;
        return {
            Authorization: token ? `Bearer ${token}` : '',
        };
    }

    private static async request(method: string, endpoint: string, data?: any) {
        try {
            const response: AxiosResponse = await this.apiClient({
                method,
                url: endpoint,
                data,
                headers: this.getHeaders(),
            });

            console.log(`✅ Api call: ${endpoint}`, response);

            const success = response.status >= 200 && response.status < 300;

            return { status: response.status, data: response.data, success };
        } catch (error) {
            console.error(`❌ Api call: ${endpoint}`, error);

            return { status: 666, data: null, success: false };
        }
    }

    static async get(endpoint: string) {
        return await this.request('get', endpoint);
    }

    static async post(endpoint: string, data?: any) {
        return await this.request('post', endpoint, data);
    }

    static async put(endpoint: string, data?: any) {
        return await this.request('put', endpoint, data);
    }

    static async delete(endpoint: string, data?: any) {
        return await this.request('delete', endpoint, data);
    }
}
