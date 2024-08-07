import './style.scss';
import router from './router/router';
import { createApp } from 'vue';
import App from './App.vue';

createApp(App).use(router).mount('#app')
