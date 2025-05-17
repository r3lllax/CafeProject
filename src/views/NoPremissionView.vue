<script setup>
import { useRoute } from 'vue-router'
import { onMounted } from 'vue'
import router from '@/router/index.js'


const route = useRoute()


</script>

<template>
  <main class="w-full flex justify-center">
    <div class="w-1/2 self-center border justify-center">
      У вас нет доступа на просмотр этой страницы
      <button @click.prevent="router.back()">вернуться назад</button>
    </div>
  </main>
</template>
