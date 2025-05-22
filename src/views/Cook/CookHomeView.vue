<script setup>
import { inject } from 'vue'

const username = inject('username')

</script>

<template>
  <main class="w-full flex justify-center">
    <div class="w-full md:w-1/2 self-center justify-center">
      <div class="w-full h-full flex flex-col gap-2 p-5 text-center">
        <h2 class="text-4xl font-semibold"><span class="px-3 py-1 text-white bg-sky-500 rounded-full">{{username?username:"Аноним"}}</span>, добро пожаловать в панель повара!</h2>
        <div class="flex flex-col gap-2">
          <h3 class="text-xl">В ваших полномочиях:</h3>
          <ul class="pl-5 text-left flex flex-col items-center">
            <li class="relative w-fit pl-5 before:absolute before:bg-[url(/src/assets/mark.svg)] before:bg-no-repeat before:bg-cover before:left-0 before:top-0.5 before:w-5 before:h-5">Просмотр активных заказов за смену</li>
            <li class="relative w-fit pl-5 before:absolute before:bg-[url(/src/assets/mark.svg)] before:bg-no-repeat before:bg-cover before:left-0 before:top-0.5 before:w-5 before:h-5">Изменение статуса активных заказов</li>
            </ul>
          <div class="w-full flex justify-center">
            <p class="relative text-4xl">Приятной работы!</p>
          </div>
        </div>


      </div>
    </div>
  </main>

</template>
