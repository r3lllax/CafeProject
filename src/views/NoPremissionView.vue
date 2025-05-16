<script setup>
import { useRoute } from 'vue-router'
import { onMounted } from 'vue'


const route = useRoute()


</script>

<template>
  <main class="w-full flex justify-center">
    <div class="w-1/2 self-center border justify-center">
      You have no premissions to view this page
      <RouterLink to="/login">back to login</RouterLink>
    </div>
  </main>
</template>
