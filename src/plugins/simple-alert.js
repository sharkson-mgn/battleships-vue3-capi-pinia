import VueSimpleAlert from 'vue3-simple-alert'

export default {
    install: (app) => {
        const myAlert = VueSimpleAlert;
        app.config.globalProperties.$simpleAlert = myAlert;

        app.provide('simpleAlert',myAlert);
    }
}