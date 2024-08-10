import './style.scss';
import router from './router/router';
import { createApp } from 'vue';
import App from './App.vue';
import { recoverFromLocalForage } from './store';

(async () => {
  await recoverFromLocalForage();
  createApp(App).use(router).mount('#app');
})();
