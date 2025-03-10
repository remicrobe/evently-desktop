import { createRouter, createWebHashHistory, createWebHistory } from 'vue-router';
import SplashScreen from "./view/start/splash-screen.vue";
import AuthScreen from "./view/auth/index.vue";
import OnboardingScreen from "./view/start/onboarding.vue";
import StepTwoAuthScreen from "./view/auth/step-two.vue";
import AppIndexView from "./view/app/index.vue";
import ClassicAuthScreen from "./view/auth/classic.vue";
import AppEventCreateView from "./view/app/event/create.vue";
import AppEventDetailView from "./view/app/event/detail.vue";
import AppEventInviteDetailView from "./view/app/event/invite/detail.vue";
import { useUserStore } from "./stores/User.store";
import ProfileView from "./view/app/profile.vue";
import AppCategoryCreateView from "./view/app/category/create.vue";
import AppFolderCreateView from "./view/app/folder/create.vue";

const routes = [
    { path: '/', isLogin: false, component: SplashScreen },
    { path: '/auth', isLogin: false, component: AuthScreen },
    { path: '/auth/step-two', isLogin: false, component: StepTwoAuthScreen },
    { path: '/auth/classic', isLogin: false, component: ClassicAuthScreen },
    { path: '/onboarding', isLogin: false, component: OnboardingScreen },
    { path: '/app', isLogin: true, component: AppIndexView },
    // Event part
    { path: '/app/event/create', isLogin: true, component: AppEventCreateView },
    { path: '/app/event/edit/:id', isLogin: true, component: AppEventCreateView },
    { path: '/app/event/:id', isLogin: true, component: AppEventDetailView },
    { path: '/app/event/invite/:id', isLogin: true, component: AppEventInviteDetailView },
    // Category part
    { path: '/app/category/create', isLogin: true, component: AppCategoryCreateView },
    { path: '/app/category/edit/:id', isLogin: true, component: AppCategoryCreateView },
    // Folder part
    { path: '/app/folder/create', isLogin: true, component: AppFolderCreateView },
    { path: '/app/folder/edit/:id', isLogin: true, component: AppFolderCreateView },
    // User part
    { path: '/app/profile', isLogin: true, component: ProfileView },
    // Auth part
    { path: '/join/:token', isLogin: false, component: SplashScreen },
];

const router = createRouter ({
    history: window.ipcRenderer ? createWebHashHistory () : createWebHistory (),
    routes,
});

router.beforeEach ((to, from, next) => {
    const userStore = useUserStore ();

    const path = to.path.endsWith ('/') ? to.path.slice (0, -1) : to.path;

    const route = routes.find (r => r.path === path);

    if (route?.isLogin && !userStore.token) {
        next ('/');
    } else {
        next ();
    }
});

export default router;
