<script setup>

import { onMounted, provide, ref } from 'vue'
import apiFetch from '@/helpers/apiFetch.js'
import CreateUserForm from '@/components/CreateUserForm.vue'
import AddUserToWS from '@/components/AddUserToWS.vue'

const users = ref({
  Admins:{
    prefix:'',
    users:[],
  },
  Waiters:{
    prefix:'',
    users:[],
  },
  Cooks:{
    prefix:'',
    users:[],
  },
})
const modalAdd =ref(false)
const modalWs =ref(false)
onMounted(async ()=>{
  const responce = await apiFetch('GET','/user')
  for(let user of responce.users){
    switch (user.group){
      case "Администратор":
        users.value.Admins.users.push(user)
        users.value.Admins.prefix = user.group + "ы"
        break
      case "Официант":
        users.value.Waiters.users.push(user)
        users.value.Waiters.prefix = user.group + "ы"
        break
      case "Повар":
        users.value.Cooks.users.push(user)
        users.value.Cooks.prefix = user.group + "а"
        break
    }
  }
  console.log(users)
})

const ViewUserID = ref(null)
provide('ViewUserId',ViewUserID)

const ShowModalWs = () =>{
  modalAdd.value = false
  modalWs.value = true
  document.querySelector("#modal").classList.remove('hidden')
}
const ShowModalAndID = (id) =>{
  ShowModalWs()
  ViewUserID.value = id
}

const ShowModalReg = () =>{
  modalWs.value = false
  modalAdd.value = true
  document.querySelector("#modal").classList.remove('hidden')

}

const CloseModal = () =>{
  document.querySelector("#modal").classList.add('hidden')
  modalAdd.value = false
  modalWs.value = false
}

</script>

<template>
  <main class="w-full flex justify-center">
    <div class="w-full md:w-1/2 self-center justify-center">
      <div class="p-5">
        <h2 class="text-4xl font-bold dark:text-white">Пользователи</h2>
      </div>
      <div class="w-full mb-5" v-for="item of users">
        <h2 class="text-xl mb-2 font-bold dark:text-white">{{item.prefix}}</h2>
          <ul class="grid grid-cols-12 gap-4">
            <li class="w-full col-span-full md:col-span-6 lg:col-span-4" v-for="user of item.users">
              <div class="w-full bg-white border border-gray-200 rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-700">
                <div class="flex justify-end px-4 pt-4">
                  <span class="text-sm text-gray-500 dark:text-gray-400">{{ user.id }}</span>

                </div>
                <div class="flex flex-col items-center pb-10">
                  <img class=" object-cover w-24 h-24 mb-3 rounded-full shadow-lg" :src="`https://apicafe/public/${user.photo_file?user.photo_file:'photos/NoUserPhoto.jpg'}`" alt="Bonnie image"/>
                  <h5 class="mb-1 text-xl font-medium text-gray-900 dark:text-white">{{user.name}}</h5>
                  <span class="text-sm text-gray-500 dark:text-gray-400">{{ user.group }}</span>
                  <span style="z-index: 1;" class="transition-all cursor-default mt-3 text-sm text-gray-100 dark:text-gray-400 bg-gray-400 py-1 px-4 rounded-full blur-sm hover:blur-none">{{ user.login }}</span>
                  <div class="flex mt-4 md:mt-6">
                    <a @click.prevent="ShowModalAndID(user.id)" :class="{'bg-blue-300':user.group=='Администратор','bg-blue-700':user.group!=='Администратор','pointer-events-none': user.group=='Администратор'}" class="z-19 cursor-pointer inline-flex items-center px-4 py-2 text-sm font-medium text-center text-white rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Назначить на смену</a>
                  </div>
                </div>
              </div>

            </li>

          </ul>
      </div>
    </div>
    <div @click.prevent="ShowModalReg" class="transition-all hover:animate-pulse hover:cursor-pointer hover:scale-110 hover:bg-sky-600 border p-10 w-6 h-6 flex justify-center items-center rounded-full bg-sky-500 fixed right-5 bottom-5 font-sans font-bold text-xl text-white">+</div>
  </main>
  <div style="z-index: 25;" id="modal" class="transition-all hidden transition-discrete fixed top-0 left-0 right-0 bottom-0 bg-black/50 flex flex-col justify-center items-center">
    <div style="z-index: 25;" class="bg-white w-full md:w-1/2 h-fit md:rounded-xl p-5 flex flex-col items-center overflow-auto">
        <CreateUserForm v-if="modalAdd"></CreateUserForm>
        <AddUserToWS v-if="modalWs"></AddUserToWS>
      <button @click.prevent="CloseModal" class="mt-5 cursor-pointer inline-flex items-center px-4 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 w-fit">Назад</button>

    </div>
  </div>


</template>
