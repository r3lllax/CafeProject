<script setup>

import { inject, onMounted, provide, ref } from 'vue'
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
  Processing:false
})
const modalAdd =ref(false)
const modalWs =ref(false)
onMounted(async ()=>{
  users.value.Processing=true
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
  users.value.Processing = false
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
const user_id = inject('user_id')
</script>

<template>
  <main class="w-full flex justify-center">
    <div class="w-full md:w-1/2 self-center flex flex-col items-center">
      <div class="p-5">
        <h2 class="text-4xl font-bold dark:text-white">Пользователи</h2>
      </div>
      <div v-if="users.Processing" class="w-fit self-center">
        <svg aria-hidden="true" class="w-7 h-7 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
          <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
        </svg>
      </div>
      <div class="w-full mb-5" v-for="item of users">
        <h2 class="text-xl mb-2 font-bold dark:text-white">{{item.prefix}}</h2>
          <ul class="grid grid-cols-12 gap-4">
            <li class="w-full col-span-full md:col-span-6 lg:col-span-4" v-for="user of item.users">
              <div :class="{'border-blue-200':user.id==user_id,'border-gray-200':!(user.id==user_id),'bg-blue-50':user.id==user_id,'bg-white':!(user.id==user_id)}" class="w-full  border rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-700">
                <div class="flex justify-end px-4 pt-4">
                  <span v-if="user.id == user_id" :style="{ '--before-content': `'${user.id}'` }" class="MyCard transition before:flex before:justify-center before:items-center before:text-white before:transition relative cursor-pointer hover:before:opacity-100 before:absolute before:bg-black before:w-full before:h-full before:rounded-xl before:opacity-0 text-sm text-gray-500 dark:text-gray-400">Вы</span>
                  <span v-else class="text-sm text-gray-500 dark:text-gray-400">{{ user.id }}</span>

                </div>
                <div class="flex flex-col items-center pb-10">
                  <img class=" object-cover w-24 h-24 mb-3 rounded-full shadow-lg" :src="`https://apicafe/public/${user.photo_file?user.photo_file:'photos/NoUserPhoto.jpg'}`" alt="Bonnie image"/>
                  <h5 class="mb-1 text-xl font-medium text-gray-900 dark:text-white">{{user.name}}</h5>
                  <span class="text-sm text-gray-500 dark:text-gray-400">{{ user.group }}</span>
                  <span style="z-index: 1;" class="overflow-hidden before:transition-all relative
                  before:bg-neutral-700
                  before:text-neutral-300
                  before:flex before:justify-center
                  before:items-center
                  before:content-['Логин']
                  before:absolute before:inset-0
                  hover:before:-translate-x-[101%]
                  transition-all cursor-default mt-3 text-sm text-gray-100 dark:text-gray-400 bg-gray-400 py-1 px-4 rounded-full">
                    {{ user.login }}
                  </span>
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
      <button @click.prevent="CloseModal" class="mt-5 cursor-pointer w-full items-center px-4 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 w-fit">Назад</button>

    </div>
  </div>


</template>

<style scoped>
.Im{
  background-color: rgb(237 245 255);
}
.MyCard::before {
  content: var(--before-content);
}
</style>