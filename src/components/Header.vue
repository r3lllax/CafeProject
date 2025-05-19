<script setup>


import { inject, onMounted, ref } from 'vue'
import apiFetch from '@/helpers/apiFetch.js'
import router from '@/router/index.js'

const BurgerOpen = ref(false)

const isAuth = inject('token')
const role = inject('role_id')

const CloseBurger = ()=>{
  document.querySelector('#burger').classList.add('opacity-0')
  document.querySelector('#burgerBtn').classList.remove('rotate-90')
  document.querySelector('#burger').classList.remove('translate-x-0')
  document.querySelector('#burger').classList.add('translate-x-full')

  BurgerOpen.value = !BurgerOpen.value
}

const OpenBurger =()=>{
  document.querySelector('#burgerBtn').classList.add('rotate-90')
  document.querySelector('#burger').classList.remove('hidden')
  document.querySelector('#burger').classList.remove('opacity-0')
  document.querySelector('#burger').classList.remove('translate-x-full')
  document.querySelector('#burger').classList.add('flex','flex-col')
  BurgerOpen.value = !BurgerOpen.value
}

const ToggleBurger = ()=>{
  if(BurgerOpen.value){
    CloseBurger()
  }
  else {
    OpenBurger()
  }
}

const logout = async ()=>{
  CloseBurger()
  const responce = await apiFetch('GET',"/logout")
  await router.replace('/login')
}

</script>


<template>
<header style="z-index: 22;" class="flex border-b p-2 sticky top-0 z-19 bg-blue-300 min-h-24 items-center">
  <div class="w-full flex justify-between gap-4 lg:justify-between items-center">
    <div @click.prevent="router.replace('/')" class="cursor-pointer w-full lg:w-fit ml-2">
      <img src="/src/assets/logo.svg" class="h-9" alt="">
    </div>
    <div id="burgerBtn" @click.prevent="ToggleBurger" class="transition-all ease-in-out w-fit cursor-pointer flex lg:hidden">
      <img src="/src/assets/burger.svg" class="w-10 h-10 object-cover">
    </div>
    <div class="">
      <ul id="burger" class="transition-all right-0 gap-6 mt-12 lg:m-0 opacity-0 fixed translate-x-full lg:translate-x-0 bg-white lg:opacity-100 lg:relative lg:bg-transparent lg:flex lg:flex-row justify-around border-blue-300 p-3 border-2 lg:rounded-2xl">
        <template v-if="!isAuth">
          <RouterLink @click.prevent="CloseBurger" to="/login" class="p-3  lg:p-2 text-zinc-700 lg:border-amber-200 bg-amber-50 lg:rounded-2xl text-xl text-center hover:bg-amber-50 transition-all hover:scale-110 hover:cursor-pointer">Авторизация</RouterLink>
        </template>
        <template v-if="isAuth && role==1">
          <RouterLink @click.prevent="CloseBurger" to="/admin/users" class="p-3  lg:p-2 text-zinc-700 lg:border-amber-200 bg-amber-50 lg:rounded-2xl text-xl text-center hover:bg-amber-50 transition-all hover:scale-110 hover:cursor-pointer">Пользователи</RouterLink>
          <RouterLink @click.prevent="CloseBurger" to="/admin/work-shifts" class="p-3 lg:p-2 text-zinc-700 lg:border-amber-200 bg-amber-50 lg:rounded-2xl text-xl text-center hover:bg-amber-50 transition-all hover:scale-110 hover:cursor-pointer">Смены</RouterLink>
          <RouterLink @click.prevent="CloseBurger" to="/admin/orders" class="p-3 lg:p-2 text-zinc-700 lg:border-amber-200 bg-amber-50 lg:rounded-2xl text-xl text-center hover:bg-amber-50 transition-all hover:scale-110 hover:cursor-pointer">Заказы</RouterLink>
        </template>
        <template v-else-if="isAuth && role==2">
          <RouterLink @click.prevent="CloseBurger" to="/waiter/my-orders" class="p-3  lg:p-2 text-zinc-700 lg:border-amber-200 bg-amber-50 lg:rounded-2xl text-xl text-center hover:bg-amber-50 transition-all hover:scale-110 hover:cursor-pointer">Мои заказы</RouterLink>
        </template>
        <template v-else-if="isAuth && role==3">
          <RouterLink @click.prevent="CloseBurger" to="/cook/orders" class="p-3  lg:p-2 text-zinc-700 lg:border-amber-200 bg-amber-50 lg:rounded-2xl text-xl text-center hover:bg-amber-50 transition-all hover:scale-110 hover:cursor-pointer">Заказы</RouterLink>
        </template>
        <template v-if="isAuth">
          <button @click.prevent="logout" class="p-3 lg:p-2 text-zinc-700 lg:border-amber-200 bg-amber-50 lg:rounded-2xl text-xl text-center hover:bg-amber-50 transition-all hover:scale-110 hover:cursor-pointer">Выйти</button>
        </template>
      </ul>
    </div>

  </div>

</header>
</template>

<style scoped>

</style>