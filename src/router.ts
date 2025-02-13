import {createRouter, createWebHashHistory, createWebHistory} from 'vue-router';
import SplashScreen from "./view/start/splash-screen.vue";
import AuthScreen from "./view/auth/index.vue";
import OnboardingScreen from "./view/start/onboarding.vue";
import StepTwoAuthScreen from "./view/auth/step-two.vue";
import AppIndexView from "./view/app/index.vue";
import ClassicAuthScreen from "./view/auth/classic.vue";
import AppEventCreateView from "./view/app/event/create.vue";
import { useUserStore } from "./stores/User.store";
import ProfileView from "./view/app/profile.vue";

const routes = [
    { path: '/', isLogin: false, component: SplashScreen },
    { path: '/auth', isLogin: false, component: AuthScreen },
    { path: '/auth/step-two', isLogin: false, component: StepTwoAuthScreen },
    { path: '/auth/classic', isLogin: false, component: ClassicAuthScreen },
    { path: '/onboarding', isLogin: false, component: OnboardingScreen },
    { path: '/app', isLogin: true, component: AppIndexView },
    { path: '/app/event/create', isLogin: true, component: AppEventCreateView },
    { path: '/app/profile', isLogin: true, component: ProfileView },
];

const router = createRouter({
    history: window.ipcRenderer ? createWebHashHistory() : createWebHistory(),
    routes,
});

router.beforeEach((to, from, next) => {
    console.log("Changement de route vers :", to.fullPath);
    const userStore = useUserStore();

    const path = to.path.endsWith('/') ? to.path.slice(0, -1) : to.path;
    // Recherche la route correspondante
    const route = routes.find(r => r.path === path);

    if (route?.isLogin && !userStore.token) {
        next('/');
    } else {
        next();
    }
});



export default router;
