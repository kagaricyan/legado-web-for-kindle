import { createRouter, createWebHashHistory } from 'vue-router'

import BookShelf from '../pages/book-shelf/BookShelf.vue';
import BookContent from '../pages/book-content/BookContent.vue';

const routes = [
  { path: '/', component: BookShelf },
  { path: '/book-content', component: BookContent },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
})

export default router;