<script setup>
</script>

<template>
  <main class="w-full flex justify-center">
    <div class="px-2 md:px-0 w-full md:w-1/2 self-center justify-center flex flex-col items-center">
      <div class="w-full flex flex-col md:flex-row my-5 gap-2">
        <input type="text" id="end" class="shadow-xs bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-xs-light" placeholder="ID смены"  />
        <button @click.prevent="toggleModal" class="cursor-pointer w-full md:w-fit items-center px-4 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Назад</button>
      </div>
      <div class="bg-gray-100 w-full h-screen rounded-xl">
        <tempalate v-if="0">
          <div class="w-full h-full flex justify-center items-center">
            <span class="text-4xl font-semibold text-neutral-700">Тут пусто</span>
          </div>
        </tempalate>
      </div>

    </div>
  </main>
</template>
