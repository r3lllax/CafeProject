<script setup>

import { onMounted } from 'vue'
import apiFetch from '@/helpers/apiFetch.js'

onMounted(async ()=>{
  const responce = await apiFetch('GET','/user')
  console.log(responce)
})

</script>

<template>
  <main class="w-full flex justify-center">
    <div class="w-full md:w-1/2 self-center border justify-center">
      users
    </div>
  </main>
</template>
