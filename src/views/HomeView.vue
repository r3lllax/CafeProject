<script setup>

import { inject, onMounted } from 'vue'
import { useRouter } from 'vue-router'
const router = useRouter()
const user_id = inject('role_id')
onMounted(()=>{
  if(user_id.value == 1){
    router.replace('/admin')
  }
  else if(user_id.value == 2){
    router.replace('/waiter')
  }
  else if(user_id.value == 3){
    router.replace('/cook')
  }
  else{
    router.replace('/login')
  }
  // switch (user_id.value){
  //   case 1:
  //     router.replace('/admin')
  //     break;
  //   case 2:
  //     router.replace('/waiter')
  //     break;
  //   case 3:
  //     router.replace('/cook')
  //     break;
  //   default:
  //     console.log("DEFAULT")
  //     router.replace('/login')
  //     break;
  // }
})
</script>

<template>
  <main class="w-full flex justify-center">
    <div class="w-full md:w-1/2 self-center border justify-center">
      home
    </div>
  </main>
</template>
