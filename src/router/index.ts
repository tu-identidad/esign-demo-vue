import { createRouter, createWebHistory } from '@ionic/vue-router';
import { RouteRecordRaw } from 'vue-router';
import HomePage from '@/views/HomePage.vue';
import SignDocumentPage from '@/views/SignDocumentPage.vue';
import SignedDocumentPage from '@/views/SignedDocumentPage.vue';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    redirect: '/home'
  },
  {
    path: '/home',
    name: 'Home',
    component: HomePage
  },
  {
    path: '/sign',
    name: 'Sign',
    component: SignDocumentPage
  },
  {
    path: '/signed/:id',
    name: 'Signed',
    component: SignedDocumentPage
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

export default router
