<script setup>

import { onMounted, ref } from 'vue'
import apiFetch from '@/helpers/apiFetch.js'

const MyOrders = ref({
  data:{},
  errors:{},
  isProcessing:false,
})

onMounted( async ()=>{
  if(MyOrders.value.isProcessing){
    return
  }
  MyOrders.value.errors = []
  MyOrders.value.isProcessing = true
  const responce = await apiFetch("get","/order/myOrders")
  console.log(responce)
  if(responce.data){
    MyOrders.value.data = responce.data
  }
  if(responce.error){
    MyOrders.value.errors.error = responce.error.message
  }
  MyOrders.value.isProcessing = false
  console.log(MyOrders.value.data.length)
})

const orderFullScreen = ref({
  state:false,
  id:null,
})

const OrderToFullScreenOrBack = (id)=>{
  orderFullScreen.value.id = null
  console.log(orderFullScreen.value)
  let order = document.getElementById(`${id}`)
  if(orderFullScreen.value.state){
    order.classList.remove('fixed','z-50','bg-white','top-0','bottom-0','left-0','right-0','backdrop-blur-xl')
    order.classList.add('hover:scale-110','bg-white','rounded-xl')

  }
  else{
    order.classList.add('fixed','z-50','bg-white','top-0','bottom-0','left-0','right-0','backdrop-blur-xl')
    order.classList.remove('hover:scale-110','bg-white','rounded-xl')
    orderFullScreen.value.id = id
  }
  orderFullScreen.value.state = !orderFullScreen.value.state


}

</script>

<template>
  <main class="w-full flex justify-center">
    <div class=" w-full md:w-1/2 self-center justify-center p-5 flex gap-3 flex-col">
      <h2 class="text-4xl font-bold">Ваши заказы:</h2>
      <li @click.prevent="toggleModal" class="hover:bg-blue-400 hover:text-white hover:scale-[1.01] relative transition cursor-pointer border-gray-200 border col-span-12 p-6 bg-white rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-700 flex flex-col justify-center items-center text-neutral-500">
        <div class="w-full h-full peer absolute top-0 bottom-0 right-0 left-0"></div>
        <span class="transition duration-700 peer-hover:scale-[2] peer-hover:rotate-[360deg] peer-hover:font-bold">+</span>
      </li>
      <div class="w-full h-full" v-if="MyOrders.data.length">
        <ul class="grid grid-cols-12 gap-3">
          <li :id="order.id" class="overflow-y-auto transition items-center hover:scale-110 shadow-lg border col-span-12 sm:col-span-6 xl:col-span-4 rounded-xl flex flex-col gap-3 justify-between p-5" v-for="order of MyOrders.data">
            <div :class="{'justify-center':!orderFullScreen.state,'h-full':orderFullScreen.state}" class="w-fit md:w-full flex flex-col items-center">
              <div class="w-full md:justify-between flex flex-col md:flex-row items-center">
                <div :class="{'bg-red-500 ':order.status=='Отменен','bg-sky-500':order.status=='Принят','bg-yellow-500':order.status=='Готовится','bg-green-600 ':order.status=='Готов','bg-green-400 ':order.status=='Оплачен',}" class="px-3 py-[0.5rem] m-0 border border-neutral-400 rounded-full font-bold text-xl text-white">
                  {{ order.id }}
                </div>
                <div class="p-1 flex gap-1 items-center items-center flex-col">
                  <span class="text-lg font-semibold">Статус:</span>
                  <span :class="{'bg-red-500 ':order.status=='Отменен','bg-sky-500':order.status=='Принят','bg-yellow-500':order.status=='Готовится','bg-green-600 ':order.status=='Готов','bg-green-400 ':order.status=='Оплачен',}" class="px-1 text-white font-semibold rounded-full">{{ order.status }}</span>
                </div>
              </div>
              <div class="w-full flex flex-col gap-3 py-2" v-if="orderFullScreen.state && orderFullScreen.id==order.id">
                <div class="text-center text-4xl p-2 text-white rounded-xl bg-sky-500">Позиции(ID,Название,Количество,Цена):</div>
                <ul class="flex flex-col gap-3 w-full">
                  <li class="p-5 rounded-xl shadow-xl w-full flex flex-col md:flex-row text-center justify-between items-center bg-white" v-for="position of order.positions">
                    <div class="font-semibold border-b  md:border-b-0 w-full p-2 text-xl">{{position.id}}</div>
                    <div class="font-semibold border-b  md:border-b-0 w-full p-2 text-xl overflow-hidden text-ellipsis">{{position.position}}</div>
                    <div class="font-semibold border-b  md:border-b-0 w-full p-2 text-xl">{{position.count}}</div>
                    <div class="font-semibold border-b  md:border-b-0 w-full p-2 text-xl">{{position.price}}</div>
                  </li>
                </ul>
              </div>
              <div class="w-full flex justify-center items-center">
                <button :id="'Button'+order.id" @click.prevent="OrderToFullScreenOrBack(order.id)" class="z-1 transition ease-out overflow-hidden relative hover:scale-110 border w-fit px-3 py-2 rounded-2xl flex items-center text-white before:transition before:ease-out before:duration-700 before:absolute before:border before:bg-sky-800 before:rounded-full before:min-w-10 before:min-h-10 before:text-white before:translate-x-[6rem] before:translate-y-[2.6rem] hover:before:scale-[10] hover:text-white hover:shadow-lg before:-z-10 font-semibold bg-sky-500">
                  <template v-if="orderFullScreen.state">Закрыть</template>
                  <template v-else>Подробнее</template>
                </button>
              </div>
            </div>
          </li>

        </ul>
      </div>

      <div class="shadow-lg p-10 rounded-xl text-center flex flex-col justify-center items-center" v-else-if="MyOrders.errors.error">
        <span class="text-4xl font-semibold">
                 {{MyOrders.errors.error}}
        </span>
        <span class="text-2xl font-xl">
          Если это не так, обратитесь к администратору
        </span>
      </div>
      <div class="shadow-lg p-10 rounded-xl text-center flex flex-col justify-center items-center" v-else-if="!MyOrders.data.length && !MyOrders.isProcessing">
        <span class="text-4xl font-semibold">
          У вас нет заказов за смену
        </span>
        <span class="text-2xl font-xl">
          Работайте усерднее!
        </span>
      </div>
      <div v-else class="w-full flex justify-center">
        <svg aria-hidden="true" class="w-7 h-7 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
          <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
        </svg>
      </div>
    </div>
  </main>
</template>
