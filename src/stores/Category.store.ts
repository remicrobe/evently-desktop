import {defineStore} from 'pinia';
import { useApiService } from "../services/api.services";
import { Category } from "../models/Category.model";
import { Folder } from "../models/Folder.model";
import { useToastStore } from "./Toast.store";

export const useCategoryStore = defineStore({
    id: 'category',
    state: () => ({
        categories: [] as Category[],
        selectedCategoryId: -1,
    }),
    getters: {
        selectedCategory(): Category | undefined {
            return this.categories.find(c => c.id === this.selectedCategoryId);
        }
    },
    actions: {
        selectCategory(catId: number) {
            this.selectedCategoryId = catId;
        },
        getCategoryById(id: number): Category | undefined {
            return this.categories.find(c => c.id === id);
        },
        async fetchCategories() {
            let res = await useApiService.get('/categories');
            let resDefault = await useApiService.get('/categories/default');

            this.categories = [];

            for (let category of [...resDefault.data, ...res.data]) {
                this.categories.push(new Category(category));
            }

            return;
        },
        async createCategory(categoryData: Partial<Category>) {
            const response = await useApiService.post('/categories', categoryData);
            if (!response.success) {
                useToastStore().success({ key: 'toast_error_creating_category' });
                return false;
            }
            this.categories.push(new Category(response.data));
            return true;
        },
        async updateCategory(id: number, categoryData: Partial<Category>) {
            const response = await useApiService.put(`/categories/${id}`, categoryData);
            if (!response.success) {
                useToastStore().success({ key: 'toast_error_updating_category' });
                return false;
            }
            const index = this.categories.findIndex(cat => cat.id === id);
            if (index !== -1) {
                this.categories[index] = new Category(response.data);
            }
            return true;
        }
    },
});