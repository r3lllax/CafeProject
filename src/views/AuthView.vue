<script setup>

import { inject, onMounted, ref } from 'vue'
import apiFetch from '@/helpers/apiFetch.js'
import ErrorDescription from '@/components/ErrorDescription.vue'
import router from '@/router/index.js'

const updateToken = inject('updateToken')
const updateRole = inject('updateRole')

const form = ref({
  data:{
    login:'',
    password:'',
  },
  errors:{},
  isProcess:false
})

onMounted(()=>{
  updateToken(null)
})

const TryLogin = async ()=>{
  const response = await apiFetch("POST","/login",form.value.data)
  if (response.error){
    form.value.errors.error = response.error.message
  }
  if(response.data){
    updateToken(response.data.user_token)
    updateRole(response.data.role_id)
    await router.replace('/')

  }

}
</script>

<template>
  <main class="w-full flex justify-center">
    <div class="w-full md:w-1/2 self-center border justify-center items-center">

      <form @submit.prevent="TryLogin" class="mt-10 w-3/4 md:max-w-sm mx-auto pb-5">
        <div class="mb-5">
          <label for="login" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Login</label>
          <input type="text" v-model="form.data.login" id="login" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="login" />
        </div>
        <div class="mb-5">
          <label for="password" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Password</label>
          <input type="password" v-model="form.data.password" id="password" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="password"  />
        </div>

        <button type="submit" class="justify-self-center text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Вход</button>
        <ErrorDescription :error="form.errors.error"/>
      </form>

    </div>
  </main>
</template>
