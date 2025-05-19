<script setup>
</script>

<template>
  <main class="w-full flex justify-center">
    <div class="w-full md:w-1/2 self-center justify-center">
      <div class="w-full h-full flex flex-col gap-2">
        <h2 class="text-4xl font-semibold">Добро пожаловать в панель админа!</h2>
        <div class="flex flex-col gap-2">
          <h3 class="text-xl">В ваших полномочиях:</h3>
          <ul class="pl-5 ">
            <li class="relative pl-5 before:absolute before:bg-[url(/src/assets/mark.svg)] before:bg-no-repeat before:bg-cover before:left-0 before:top-0.5 before:w-5 before:h-5">Просмотр информации о пользователях</li>
            <li class="relative pl-5 before:absolute before:bg-[url(/src/assets/mark.svg)] before:bg-no-repeat before:bg-cover before:left-0 before:top-0.5 before:w-5 before:h-5">Просмотр и изменение информации о сменах</li>
            <li class="relative pl-5 before:absolute before:bg-[url(/src/assets/mark.svg)] before:bg-no-repeat before:bg-cover before:left-0 before:top-0.5 before:w-5 before:h-5">Просмотр заказов за любую смену</li>
          </ul>
          <div class="w-full flex justify-center">
            <p class="relative text-4xl before:text-4xl before:content-['!']
            before:text-black before:top-0
            before:-right-4 before:animate-bounce
            before:w-fit before:h-15 before:absolute">Приятной работы</p>
          </div>
        </div>


      </div>
    </div>
  </main>
</template>
