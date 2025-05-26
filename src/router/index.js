// router/index.js
import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '../stores/auth';
import axios from '../axios';
import NotFound from '@/views/NotFound.vue';

const routes = [
  { path: '/', component: () => import('../views/Home.vue') },
  { path: '/login', component: () => import('../views/Login.vue') },
  { path: '/signup', component: () => import('../views/Signup.vue') },
  {
    path: '/users/favorites',
    component: () => import('../views/MyFavorite.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/users/coupons',
    component: () => import('../views/MyCoupon.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/restaurants/:id',
    component: () => import('../views/RestaurantDetail.vue'),
  },
  {
    path: '/restaurants',
    component: () => import('../views/RestaurantsList.vue'),
  },
  {
    path: '/privacy-policy',
    name: 'PrivacyPolicy',
    component: () => import('../views/PrivacyPolicy.vue'),
  },
  {
    path: '/terms-of-service',
    name: 'TermsOfService',
    component: () => import('../views/TermsOfService.vue'),
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: NotFound,
  },
  {
    path: '/coupons-create',
    name: 'CouponCreate',
    component: () => import('../views/CouponCreate.vue'),
    meta: { requiresAuth: true },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore();

  if (to.meta.requiresAuth) {
    try {
      const res = await axios.get('/auth/me');
      authStore.setUser(res.data);
      next();
    } catch {
      authStore.clearUser();
      next('/login');
    }
  } else {
    next();
  }
});

export default router;
