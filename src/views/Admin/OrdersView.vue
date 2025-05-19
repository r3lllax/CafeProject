<script setup>

import { onMounted, ref } from 'vue'
import apiFetch from '@/helpers/apiFetch.js'
import ErrorDescription from '@/components/ErrorDescription.vue'

const searchForm = ref({
  data:{
    id:''
  },
  errors:{},
  processing:false,
})

const Order = ref({
  data:{
    order:null
  },
  processing:false
})

const Users = ref([])

const GetUsers = async ()=>{
  const responce = await apiFetch("GET","/user")
  Users.value=responce.users
  console.log(Users.value)

}

const SearhOrder = async (id)=>{
  if(Order.value.processing){
    return
  }
  lastActiveWS.value = id?id:searchForm.value.data.id
  Order.value.data.order = null
  Order.value.processing = true
  searchForm.value.errors = []
  const responce = await apiFetch("GET",`/work-shift/${id?id:searchForm.value.data.id}/order`)

  if (responce.error){
    searchForm.value.errors.message = [responce.error.message]
    Order.value.processing = false
    return
  }

  if (responce.data){
    await GetUsers()

    Order.value.data.order = responce.data[0]

  }
  for (let OrderItem of Order.value.data.order.orders){
    OrderItem.UserInfo = Users.value.find(item =>item.id==OrderItem.user_id)
    console.log(OrderItem)
  }
  Order.value.processing = false
}

const WorkShifts = ref(null)

onMounted(async ()=>{
  const responce = await apiFetch("get","/work-shift")
  WorkShifts.value = responce
})

const lastActiveWS = ref(null)
</script>

<template>
  <main class="w-full flex justify-center">
    <div class="px-2 md:px-0 w-full md:w-2/3 self-center justify-center flex flex-col items-center gap-6">
<!--      <div class="w-full flex flex-col md:flex-row my-5 gap-2">-->
<!--        <div class="flex flex-col w-full">-->
<!--          <input type="text" v-model="searchForm.data.id" id="search" class="shadow-xs bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500  p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-xs-light" placeholder="ID смены"  />-->
<!--          <ErrorDescription :error="searchForm.errors.message"></ErrorDescription>-->
<!--        </div>-->
<!--        <div>-->
<!--          <button @click.prevent="SearhOrder" class="cursor-pointer w-full md:w-fit min-h-1/2 items-center px-4 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Найти</button>-->
<!--          <div class="min-h-1/2 w-full"></div>-->
<!--        </div>-->

<!--      </div>-->
      <div class="w-full flex flex-col gap-2">
        <h2 class="text-4xl font-semibold">Смены</h2>
        <ul class="w-full grid grid-cols-12 gap-2 justify-center" v-if="WorkShifts">
          <li @click.prevent="SearhOrder(shift.id)" :class="{'pointer-events-none':Order.processing,'bg-red-300':!shift.active,'bg-green-300':shift.active,'active':lastActiveWS == shift.id}"
              class="transition hover:scale-110 hover:text-white hover:bg-sky-500 hover:cursor-pointer col-span-12 sm:col-span-6 md:col-span-4 lg:col-span-3 xl:col-span-2 border flex justify-center p-5 text-4xl rounded-xl"
              v-for="shift of WorkShifts">
            {{shift.id}}
          </li>
        </ul>
        <div v-else class="w-full flex justify-center">
          <svg aria-hidden="true" class="w-7 h-7 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
            <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
          </svg>
        </div>
      </div>
      <div class="bg-gray-100 w-full h-fit rounded-xl p-2" v-if="Order.data.order">
        <div v-for="WorkShift in Order.data">
          <div class="w-full min-h-20 border-b border-b-neutral-300 grid grid-cols-12 gap-3 py-2">
            <div :class="{'bg-red-400':!WorkShift.active,'bg-green-400':WorkShift.active,}" class="min-h-10 w-full col-span-12 md:col-span-10 rounded-lg flex flex-col md:flex-row text-white">
              <div class="flex items-center gap-3 px-5 w-full md:w-fit border-r-0 border-b md:border-b-0 md:border-r">
                <span class="text-2xl font-semibold w-full flex justify-center">СМЕНА&nbsp;{{ WorkShift.id }}</span>
              </div>
              <div class="flex flex-col items-center flex-nowrap gap-3 py-0 md:py-5 w-full text-center">
                <span class="flex flex-col w-full md:w-1/2">Дата&nbsp;начала: <span>{{ WorkShift.start }}</span></span>
                <span class="flex flex-col w-full md:w-1/2">Дата&nbsp;окончания: <span>{{ WorkShift.end }}</span></span>
              </div>
            </div>
            <div :class="{'bg-red-400':!WorkShift.active,'bg-green-400':WorkShift.active,}" class="min-h-14 min-w-14 col-span-12 md:col-span-2 rounded-lg text-white flex flex-col justify-center items-center">
              <span class="text-sm w-full text-center">За смену:</span>
              <span class="text-sm w-full text-center ">{{ WorkShift.amount_for_all }}</span>
            </div>
          </div>
          <div>
            <ul class="py-2 flex flex-col gap-2">
              <template v-if="WorkShift.orders.length">
                <li class="min-h-28 bg-white rounded-lg flex flex-col" v-for="order of WorkShift.orders">
                  <div class="w-full gap-2 h-fit py-1 border-b flex flex-col md:flex-row justify-between px-2">
                    <div class="bg-sky-500 px-3 py-1 text-white rounded-full w-full md:w-fit flex self-start md:self-center items-center">ID&nbsp;{{order.id}}</div>
                    <div class=" px-3 py-1 md:justify-center flex border-t md:border-t-0 w-full gap-2 items-center self-center">
                      <span>Статус:</span>
                      <span :class="{'bg-red-500 ':order.status=='Отменен','bg-sky-500':order.status=='Принят','bg-yellow-500':order.status=='Готовится','bg-green-600 ':order.status=='Готов','bg-green-400 ':order.status=='Оплачен',}" class="text-white rounded-full p-1">{{ order.status }}</span>
                    </div>
                    <div class="px-3 md:pl-3 md:pr-2 py-1 flex items-center md:justify-center text-center gap-2">
                      <span>ДАТА:</span>
                      <span class="text-nowrap rounded-full bg-sky-500 text-white px-3">{{ order.create_at }}</span>
                    </div>
                  </div>
                  <div class="flex flex-wrap sm:flex-nowrap justify-between">
                    <div class="w-full flex flex-col md:w-fit md:border-r p-5 justify-center items-center border-b md:border-b-0">
                      <span class="text-white bg-sky-500 px-2 py-1 rounded-full text-xl text-center">{{order.table}}</span>
                    </div>
                    <div class="w-full  py-2 flex md:w-2/3 justify-center items-center border-b md:border-b-0">
                      <div class="w-full col-span-full md:col-span-6 lg:col-span-4">
                        <div class="w-full bg-white ">
                          <div class="flex justify-end px-4 pt-4">
                            <span class="text-sm text-gray-500 dark:text-gray-400">{{order.UserInfo.id}}</span>

                          </div>
                          <div class="flex flex-col items-center pb-10">
                            <img class=" object-cover w-24 h-24 mb-3 rounded-full shadow-lg" :src="`https://apicafe/public/${order.UserInfo.photo_file?order.UserInfo.photo_file:'photos/NoUserPhoto.jpg'}`" alt="Bonnie image"/>
                            <h5 class="mb-1 text-xl font-medium text-gray-900 dark:text-white">{{ order.UserInfo.name }}</h5>
                            <span class="text-sm text-gray-500 dark:text-gray-400">{{order.UserInfo.group}}</span>
                          </div>
                        </div>

                      </div>

                    </div>
                    <div class="w-full flex md:w-fit md:border-l flex-col px-5 py-2 items-center justify-center">
                      <span class="w-fit h-fit p-1 text-xl">Цена:</span>
                      <div class="h-full justify-center flex w-full">
                        <span class="w-2/3 md:w-full text-white rounded-full self-center bg-green-600 text-center px-1">{{ order.price }}</span>

                      </div>
                    </div>
                  </div>
                </li>
              </template>
              <template v-else>
                В данной смене нет заказов
              </template>
            </ul>
          </div>
        </div>
      </div>
      <div v-else-if="Order.processing" class="w-full flex justify-center">
        <svg aria-hidden="true" class="w-7 h-7 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
          <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
        </svg>
      </div>

      <div v-else>

          <div class="w-full h-full flex justify-center items-center">
            <span class="text-4xl font-semibold text-neutral-700">Тут пусто</span>
          </div>

      </div>

    </div>
  </main>
</template>
<style scoped>
 .active{
   color: white;
   background-color: rgb(14, 148, 205);
 }
</style>