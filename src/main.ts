// Importation des bibliothèques et styles nécessaires
import { createApp } from 'vue';
import 'vuetify/styles';
import { createVuetify } from 'vuetify';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';
import locales from './translations/locales.json';

// Importation des composants et configurations de l'application
import App from './App.vue';
import './style.css';
import router from "./router"; // Configuration du routeur Vue
import { createI18n } from "vue-i18n"; // Internationalisation
import { createPinia } from 'pinia'; // Gestion d'état avec Pinia
import { PersistentStore } from "./stores/Persistent.store";
import { Settings } from "luxon"; // Importation des traductions

// Définition du thème par défaut pour Vuetify
const defaultTheme = {
    dark: false,
    colors: {
        "background": "#111111",
        "black-black0": "#111111",
        "black-black100": "#191919",
        "black-black200": "#2D2D2D",
        "black-black300": "#303030",
        "black-black400": "#595959",
        "black-black500": "#828282",
        "white-white600": "#8E8E93",
        "white-white500": "#AEAEB2",
        "white-white400": "#C7C7CC",
        "white-white300": "#D1D1D6",
        "white-white200": "#E5E5EA",
        "white-white100": "#F2F2F7",
        "white-white0": "#FFFFFF"
    },
};

async function initApp() {
    // Wait for the locale to be fetched
    const locale = await PersistentStore.getLocale();

    if (locale) {
        Settings.defaultLocale = locale;
    }

    // Configuration de l'internationalisation (i18n)
    const i18n = createI18n({
        legacy: false,
        locale: locale, // Définition de la langue par défaut
        fallbackLocale: 'en-EN', // Langue de secours
        messages: Object.assign(locales), // Chargement des traductions
    });

    // Configuration de Vuetify avec le thème personnalisé
    const vuetify = createVuetify({
        components,
        directives,
        locale: {
            locale: locale ? locale.split('-')[0] : 'en',
            fallback: 'en',
        },
        theme: {
            defaultTheme: 'defaultTheme',
            themes: {
                defaultTheme,
            },
        },
    });

    // Création et montage de l'application Vue
    const app = createApp(App)
        .use(router) // Activation du routeur
        .use(vuetify) // Activation de Vuetify
        .use(createPinia()) // Activation de Pinia
        .use(i18n) // Activation d'i18n
        .mount('#app'); // Montage de l'application
}

// Initialisation de l'application
initApp();
