<script setup>



import { ref } from 'vue'

const BurgerOpen = ref(false)

const ToggleBurger = ()=>{
  if(BurgerOpen.value){
    document.querySelector('#burger').classList.remove('flex')
    document.querySelector('#burger').classList.add('hidden')
    BurgerOpen.value = !BurgerOpen.value
  }
  else {
    document.querySelector('#burger').classList.remove('hidden')
    document.querySelector('#burger').classList.add('flex','flex-col')
    BurgerOpen.value = !BurgerOpen.value
  }
}

</script>


<template>
<header class="flex  border-b p-2 sticky top-0 z-20 bg-amber-200 min-h-24 items-center">
  <div class="w-full flex justify-between gap-4 lg:justify-between items-center">
    <div class="w-full lg:w-fit ml-2">
      <img src="/public/assets/logo.svg" class="h-9" alt="">
    </div>
    <div @click.prevent="ToggleBurger" class="w-fit cursor-pointer flex lg:hidden">
      <img src="/public/assets/burger.svg" class="w-10 h-10 object-cover">
    </div>
    <div class="">
      <ul id="burger" class="gap-6 mt-12 lg:m-0 hidden fixed right-0 bg-white lg:relative lg:bg-transparent lg:flex lg:flex-row justify-around border-amber-600 p-3 border-2 lg:rounded-2xl">
        <RouterLink to="/users" class="p-3  lg:p-2 text-zinc-700 lg:border-amber-200 bg-amber-50 lg:rounded-2xl text-xl text-center hover:bg-amber-50 transition-all hover:scale-110 hover:cursor-pointer">Пользователи</RouterLink>
        <RouterLink to="/work-shifts" class="p-3 lg:p-2 text-zinc-700 lg:border-amber-200 bg-amber-50 lg:rounded-2xl text-xl text-center hover:bg-amber-50 transition-all hover:scale-110 hover:cursor-pointer">Смены</RouterLink>
        <RouterLink to="/orders" class="p-3 lg:p-2 text-zinc-700 lg:border-amber-200 bg-amber-50 lg:rounded-2xl text-xl text-center hover:bg-amber-50 transition-all hover:scale-110 hover:cursor-pointer">Заказы</RouterLink>
      </ul>
    </div>

  </div>

</header>
</template>

<style scoped>

</style>