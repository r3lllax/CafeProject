import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import UsersView from '@/views/Admin/UsersView.vue'
import WorkShiftsView from '@/views/Admin/WorkShiftsView.vue'
import OrdersView from '@/views/Admin/OrdersView.vue'
import AuthView from '@/views/AuthView.vue'
import NoPremissionView from '@/views/NoPremissionView.vue'
import AdminHomeView from '@/views/Admin/AdminHomeView.vue'
import WaiterHomeView from '@/views/Waiter/WaiterHomeView.vue'
import CookHomeView from '@/views/Cook/CookHomeView.vue'
import MyOrdersView from '@/views/Waiter/MyOrdersView.vue'
import CookOrdersView from '@/views/Cook/CookOrdersView.vue'
import RegistrationView from '@/views/RegistrationView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
      meta:{
        forAuth:false
      }
    },
    {
      path: '/admin',
      name: 'admin',
      component: AdminHomeView,
      meta:{
        forAuth:true,
        role:1
      }
    },
    {
      path: '/admin/users',
      name: 'users',
      component: UsersView,
      meta:{
        forAuth:true,
        role:1
      }
    },
    {
      path: '/admin/work-shifts',
      name: 'work-shifts',
      component: WorkShiftsView,
      meta:{
        forAuth:true,
        role:1
      }
    },
    {
      path: '/admin/orders',
      name: 'orders',
      component: OrdersView,
      meta:{
        forAuth:true,
        role:1
      }
    },
    {
      path: '/login',
      name: 'login',
      component: AuthView,
      meta:{
        forAuth:false,
      }
    },
    {
      path: '/no-premissions',
      name: 'nopremissions',
      component: NoPremissionView,
      meta:{
        forAuth:false
      }
    },
    {
      path: '/waiter',
      name: 'waiter',
      component:WaiterHomeView,
      meta:{
        forAuth:true,
        role:2
      }
    },
    {
      path: '/waiter/my-orders',
      name: 'myorders',
      component:MyOrdersView,
      meta:{
        forAuth:true,
        role:2
      }
    },
    {
      path: '/cook',
      name: 'cook',
      component:CookHomeView,
      meta:{
        forAuth:true,
        role:3
      }
    },
    {
      path: '/cook/orders',
      name: 'orderscook',
      component:CookOrdersView,
      meta:{
        forAuth:true,
        role:3
      }
    },
  ],
})

router.beforeResolve(async (to)=>{
  if(to.meta.forAuth && !localStorage.getItem('user_token')){
    await router.replace('/login')
  }

  if(to.meta.role && to.meta.forAuth && (to.meta.role!=localStorage.getItem('role_id'))){
    await router.replace('/no-premissions')
  }

})

export default router
