<script setup>

import { ref } from 'vue'
import apiFetch from '@/helpers/apiFetch.js'
import ErrorDescription from '@/components/ErrorDescription.vue'

const form = ref({
  data:{
    name:'',
    login:'',
    password:'',
    role_id:'',
    photo_file:null,
  },
  errors:{},
  processing:false
})


const sendForm = async ()=>{
  console.log(form.value.processing)
  if(form.value.processing){
    return
  }
  form.value.processing = true
  form.value.errors=[]

  const formData = new FormData()
  for(const key in form.value.data){
    formData.append(key,form.value.data[key])
  }
  if(!form.value.data.photo_file){
    formData.delete('photo_file')
  }
  const responce = await apiFetch("post","/user",formData, false)

  if(responce.error){
    form.value.errors = responce.error.errors
  }
  if (responce.data){
    window.location.reload()
  }
  form.value.processing = false
}

const formStatus = ref({
  status:null,
})

const ChangeFile = event =>{
  form.value.data.photo_file = event.target.files[0]
}
const drop = event =>{
  formStatus.value.status = null
  form.value.data.photo_file = event.dataTransfer.files[0]
  console.log(form.value.data)
}
const dragover = (e) =>{
  e.preventDefault()
  formStatus.value.status = 'over'
}
const dragleave = (e) =>{
  e.preventDefault()
  formStatus.value.status = null

}

</script>

<template>
  <div class="p-2 w-fit self-center">
    <h2 class="text-nowrap text-xl font-bold dark:text-white w-fit">Регистрация пользователя</h2>
  </div>
  <form @submit.prevent="sendForm" class="w-full">
    <div class="mb-5">
      <label for="name" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Имя</label>
      <input type="text" v-model="form.data.name" id="name" class="shadow-xs bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-xs-light" placeholder="Пример: Александр" />
      <error-description :error="form.errors.name"></error-description>
    </div>
    <div class="mb-5">
      <label for="login" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Логин</label>
      <input type="text" v-model="form.data.login" id="login" class="shadow-xs bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-xs-light" placeholder="Пример: alex059" />
          <error-description :error="form.errors.login"></error-description>

    </div>
    <div class="mb-5">
      <label for="password" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Пароль</label>
      <input type="password" v-model="form.data.password" id="password" class="shadow-xs bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-xs-light" placeholder="Пример: ZNnpjL2"  />
          <error-description :error="form.errors.password"></error-description>

    </div>
    <div class="mb-5 flex flex-col">
      <label class="block mb-5 text-sm font-medium text-gray-900 dark:text-white">Фото профиля</label>
      <label @drop.prevent="drop" :class="{'over':formStatus.status==='over','success':form.data.photo_file}" @dragleave="dragleave" @dragover="dragover" class="drop-zone">
        <input type="file" @change="ChangeFile($event)">
          <tempalte v-if="!form.data.photo_file">
            Переместите фото сюда
          </tempalte>
        <tempalte v-else>
          {{ form.data.photo_file.name }}
        </tempalte>

      </label>
          <error-description :error="form.errors.photo_file"></error-description>

    </div>
    <div class="mb-5">
      <label for="role" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Должность</label>
      <select id="role" v-model="form.data.role_id" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
        <option value=1 selected>Администратор</option>
        <option value=2>Официант</option>
        <option value=3>Повар</option>
      </select>
          <error-description :error="form.errors.role_id"></error-description>

    </div>
    <button type="submit" :disabled="form.processing" :class="{'pointer-events-none':form.processing}" class="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
      <template v-if="!form.processing">Зарегистрировать</template>
      <template v-else>
        <div class="w-full flex justify-center">
          <svg aria-hidden="true" class="w-5 h-5 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
            <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
          </svg>
        </div>
      </template>
    </button>
  </form>

</template>

<style scoped>
.wrapper{
  flex-direction: column;
}
.drop-zone{
  padding: 10px;
  border: 5px dashed #eeeeee;
}
.drop-zone input{
  display: none;
}
.success{
  border: 5px dashed #06ff00;
}
.over{
  border: 5px dashed black;
}
</style>