import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import UsersView from '@/views/UsersView.vue'
import WorkShiftsView from '@/views/WorkShiftsView.vue'
import OrdersView from '@/views/OrdersView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/users',
      name: 'users',
      component: UsersView,
    },
    {
      path: '/work-shifts',
      name: 'work-shifts',
      component: WorkShiftsView,
    },
    {
      path: '/orders',
      name: 'orders',
      component: OrdersView,
    },
  ],
})

export default router
