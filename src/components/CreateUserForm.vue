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
  errors:{}
})


const sendForm = async ()=>{
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

    <button type="submit" class="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Зарегистрировать</button>
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