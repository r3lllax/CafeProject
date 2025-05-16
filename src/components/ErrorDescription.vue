<script setup>

defineProps({
  error:Array
})

</script>

<template>
  <div class="flex justify-center border border-red-600 text-red-600 p-2 mt-2 rounded-xl" v-if="error">
    {{error}}
  </div>
</template>

<style scoped>

</style>