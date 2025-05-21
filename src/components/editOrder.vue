<script setup>
import { useRouter } from 'vue-router'

const route = useRouter()
const id = route.currentRoute.value.params.id

import router from '@/router/index.js'

const back = ()=>{
  localStorage.setItem('lastViewOrder',id)
  router.replace('/waiter/my-orders')
}

</script>

<template>
  <main class="w-full flex justify-center">
    <div class=" w-full md:w-1/2 self-center justify-center p-5 flex gap-3 flex-col">
      Edit order {{id}}
      <button @click.prevent="back">back</button>
    </div>
  </main>
</template>

<style scoped>

</style>