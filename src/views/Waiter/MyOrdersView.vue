<script setup>

import { onMounted, ref } from 'vue'
import apiFetch from '@/helpers/apiFetch.js'
import ErrorDescription from '@/components/ErrorDescription.vue'
import router from '@/router/index.js'

const MyOrders = ref({
  data:{},
  errors:{},
  isProcessing:false,
})

const RefreshData = ref(false)

const Timer = ref(5)

const EnableDataRefresh = ref(0)
async function delayedLoop() {
  for (EnableDataRefresh.value; EnableDataRefresh.value>0;) {
    if(!EnableDataRefresh.value){
      break
    }
    await new Promise(resolve => setTimeout(resolve, 1000));
    if(!EnableDataRefresh.value){
      break
    }
    Timer.value-=1
    if(Timer.value<=0){
      LoadOrders()
      Timer.value=5
    }

  }
}

onMounted( async ()=>{
  await LoadOrders()
  delayedLoop();

  if(localStorage.getItem('lastViewOrder')){
    OrderToFullScreenOrBack(localStorage.getItem('lastViewOrder'))
  }
})

const ToggleDataRefresh = ()=>{
  if(!EnableDataRefresh.value){
    EnableDataRefresh.value = !EnableDataRefresh.value
    Timer.value=5
    delayedLoop();

  }
  else{
    EnableDataRefresh.value = !EnableDataRefresh.value
  }

}

const LoadOrders = async ()=>{
  if(MyOrders.value.isProcessing){
    return
  }
  MyOrders.value.errors = []
  MyOrders.value.isProcessing = true
  const responce = await apiFetch("get","/order/myOrders")
  if(responce.data){
    MyOrders.value.data = responce.data
  }
  if(responce.error){
    MyOrders.value.errors.error = responce.error.message
  }
  MyOrders.value.isProcessing = false
}

const orderFullScreen = ref({
  state:false,
  id:null,
})

const OrderToFullScreenOrBack = (id)=>{
  if(EditStatusData.value.isProcessing){
    return
  }
  if(EditMode.value.Enabled){
    toggleEditMode()
  }
  orderFullScreen.value.id = null
  EditStatusData.value.id=''
  let order = document.getElementById(`${id}`)
  if(orderFullScreen.value.state){
    order.classList.remove('fixed','z-50','bg-white','top-0','bottom-0','left-0','right-0','backdrop-blur-xl')
    order.classList.add('hover:scale-110','bg-white','rounded-xl')
    localStorage.removeItem('lastViewOrder')
  }
  else{
    order.classList.add('fixed','z-50','bg-white','top-0','bottom-0','left-0','right-0','backdrop-blur-xl')
    order.classList.remove('hover:scale-110','bg-white','rounded-xl')
    orderFullScreen.value.id = id
  }
  orderFullScreen.value.state = !orderFullScreen.value.state


}

const modal = ref({
  Open:false
})

const addOrderForm = ref({
  data:{
    work_shift_id:null,
    table_id:null,
    number_of_person:null,
  },
  errors:{},
  isProcess:false,
})

const OpenAddOrder = async ()=>{
  toggleModal()
  const responce = await apiFetch("get","/work-shift")
  for(let ws of responce){
    if (ws.active){
      addOrderForm.value.data.work_shift_id = ws.id
    }
  }
}
const toggleModal = ()=>{
  modal.value.Open =!modal.value.Open

}
const ChoiceTable = (id) =>{
  addOrderForm.value.data.table_id = id
}

const CreateOrder = async ()=>{
  if(addOrderForm.value.isProcess){
    return
  }
  addOrderForm.value.isProcess = true
  const responce = await apiFetch("POST","/order",addOrderForm.value.data)
  if (responce.error){
    addOrderForm.value.errors=responce.error.errors
  }
  if (responce.data){
    toggleModal()
    LoadOrders()
  }
  addOrderForm.value.isProcess = false
}

const EditMode = ref({
  Enabled:false,
  save:false
})

const toggleEditMode = ()=>{

  if(EditMode.value.Enabled){
    let order = MyOrders.value.data.find(item=>item.id==EditStatusData.value.id)
    if( EditStatusData.value.oldStatus.length>1){
      order.status = EditStatusData.value.oldStatus
    }
    EditStatusData.value.oldStatus = ''
    EditStatusData.value.newStatus = ''
  }
  EditMode.value.Enabled = !EditMode.value.Enabled

}

const editOrder = async (id)=>{
  await router.replace(`/waiter/order/edit/${id}`)
}

const EditStatusData = ref({
  oldStatus:'',
  newStatus:'',
  id:'',
  isProcessing:false
})

const SwapStatus = (orderID)=>{
  if(!EditMode.value.Enabled){
    return
  }
  EditStatusData.value.id=orderID
  let currentOrder = MyOrders.value.data.find(item=>item.id==orderID)
  if(currentOrder.status=="Готов"){
    EditStatusData.value.oldStatus=''
    EditStatusData.value.oldStatus = 'Готов'
    EditStatusData.value.newStatus = 'Оплачен'
  }
  else if(currentOrder.status=="Принят"){
    EditStatusData.value.oldStatus=''
    EditStatusData.value.oldStatus = 'Принят'
    EditStatusData.value.newStatus = 'Отменен'
  }
  else{return}
  currentOrder.status = EditStatusData.value.newStatus;

  console.log(EditStatusData.value.oldStatus)
  console.log(EditStatusData.value.newStatus)
}

const save = async ()=>{
  if (EditStatusData.value.oldStatus.length>1){
    let newStatus = ''
    if(EditStatusData.value.newStatus=="Оплачен"){
      newStatus = "paid-up"
    }
    else if(EditStatusData.value.newStatus=="Отменен"){
      newStatus = "canceled"
    }
    let body ={status:newStatus }
    EditStatusData.value.isProcessing = true
    const responce = await apiFetch("PATCH",`/order/${EditStatusData.value.id}/change-status`,body)
    console.log(responce)
    EditStatusData.value.isProcessing = false
    if(responce.data){
      OrderToFullScreenOrBack(EditStatusData.value.id)

      LoadOrders()
    }

  }
}
const DeleteProcessing = ref(false)
const DelPos = async (OrderID,PosId)=>{
  if(DeleteProcessing.value){
    return
  }
  DeleteProcessing.value = true
  const responce = await apiFetch("DELETE",`/order/${OrderID}/position/${PosId}`)
  console.log(responce)
  if (responce.data){
    await LoadOrders()
    DeleteProcessing.value = false
  }



}

</script>

<template>

  <main class="w-full flex justify-center">
    <div class=" w-full md:w-1/2 self-center justify-center p-5 flex gap-3 flex-col">
      <h2 class="text-4xl font-bold">Ваши заказы:</h2>
      <p v-if="EnableDataRefresh">До обновления данных:{{Timer}}</p>
      <button v-if="(!MyOrders.isProcessing || EnableDataRefresh) " @click.prevent="ToggleDataRefresh">
        <template v-if="EnableDataRefresh">Выключить авто-обновление данных</template>
        <template v-else>Включить авто-обновление данных</template>
      </button>
      <li v-if="!MyOrders.errors.error && (!MyOrders.isProcessing || EnableDataRefresh) " @click.prevent="OpenAddOrder" class="hover:bg-blue-400 hover:text-white hover:scale-[1.01] relative transition cursor-pointer border-gray-200 border col-span-12 p-6 bg-white rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-700 flex flex-col justify-center items-center text-neutral-500">
        <div class="w-full h-full peer absolute top-0 bottom-0 right-0 left-0"></div>
        <span class="transition duration-700 peer-hover:scale-[2] peer-hover:rotate-[360deg] peer-hover:font-bold">+</span>
      </li>
      <div class="relative w-full h-full" v-if="MyOrders.data.length">
        <ul class="grid grid-cols-12 gap-3">
          <li :id="order.id" class="overflow-y-auto transition items-center hover:scale-110 shadow-lg border col-span-12 sm:col-span-6 xl:col-span-4 rounded-xl flex flex-col gap-3 justify-between p-5" v-for="order of MyOrders.data">
            <div :class="{'justify-center':!orderFullScreen.state,'h-full':orderFullScreen.state}" class="w-fit md:w-full flex flex-col items-center">
              <div class="w-full md:justify-between flex flex-col md:flex-row items-center">
                <div :class="{'bg-red-500 ':order.status=='Отменен','bg-sky-500':order.status=='Принят','bg-yellow-500':order.status=='Готовится','bg-green-600 ':order.status=='Готов','bg-green-400 ':order.status=='Оплачен',}" class="px-3 py-[0.5rem] m-0 border border-neutral-400 rounded-full font-bold text-xl text-white">
                  {{ order.id }}
                </div>
                <div class="p-1 flex gap-1 items-center items-center flex-col">
                  <span class="text-lg font-semibold">Статус:</span>
                  <div class="flex justify-between gap-2">
                    <span @click.prevent="SwapStatus(order.id)"
                          :class="{'hover:scale-110':EditMode.Enabled && (order.status=='Принят' || order.status=='Готов'),'animate-pulse':EditMode.Enabled && (order.status=='Принят' || order.status=='Готов'),'cursor-pointer':EditMode.Enabled && (order.status=='Принят' || order.status=='Готов') ,'bg-red-500 ':order.status=='Отменен','bg-sky-500':order.status=='Принят','bg-yellow-500':order.status=='Готовится','bg-green-600 ':order.status=='Готов','bg-green-400 ':order.status=='Оплачен',}"
                          class="transition  px-3 py-1 text-white font-semibold rounded-full">{{ order.status }}</span>
                  </div>
                </div>
              </div>
              <div class="w-full flex flex-col gap-3 py-2" v-if="orderFullScreen.state && orderFullScreen.id==order.id">

                <div class="text-center text-lg lg:text-xl xl:text-2xl p-2 text-white rounded-xl bg-sky-500">
                  <p class="text-wrap m-0  flex flex-wrap justify-center">
                    <span>Позиции(</span>
                    <span>ID,</span>
                    <span>Название,</span>
                    <span>Количество,</span>
                    <span>Цена</span>
                    <span>):</span>

                  </p>
                </div>
                <ul class="flex flex-col gap-3 w-full">
                  <li class="p-5 rounded-xl shadow-xl w-full flex flex-col md:flex-row text-center justify-between items-center bg-white" v-for="position of order.positions">
                    <div class="font-semibold border-b text-neutral-400  md:border-b-0 md:border-r w-full md:w-fit p-2 text-xl">{{position.id}}</div>
                    <div class="font-semibold border-b  md:border-b-0 w-full p-2 text-xl overflow-hidden text-ellipsis">{{position.position}}</div>
                    <div class="font-semibold border-b  md:border-b-0 w-full md:w-fit p-2 text-xl">{{position.count}}</div>
                    <div class="font-semibold border-b  md:border-b-0 w-full p-2 flex justify-center  text-xl">
                      <span class="bg-green-300 px-3 py-1 w-fit rounded-full flex items-center justify-center">
                        {{position.price}}
                      </span>
                    </div>
                    <div v-if="EditMode.Enabled && order.status=='Принят'" @click.prevent="DelPos(order.id,position.id)" class="transition bg-red-600 my-2 rounded-full hover:bg-red-800 cursor-pointer hover:scale-110">
                      <svg v-if="!DeleteProcessing" class="w-fit h-10 scale-50" fill="#FFFFFF" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="64px" height="64px" viewBox="0 0 482.428 482.429" xml:space="preserve" data-darkreader-inline-fill="" style="--darkreader-inline-fill: var(--darkreader-background-000000, #000000);"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <g> <g>
                        <path d="M381.163,57.799h-75.094C302.323,25.316,274.686,0,241.214,0c-33.471,0-61.104,25.315-64.85,57.799h-75.098 c-30.39,0-55.111,24.728-55.111,55.117v2.828c0,23.223,14.46,43.1,34.83,51.199v260.369c0,30.39,24.724,55.117,55.112,55.117 h210.236c30.389,0,55.111-24.729,55.111-55.117V166.944c20.369-8.1,34.83-27.977,34.83-51.199v-2.828 C436.274,82.527,411.551,57.799,381.163,57.799z M241.214,26.139c19.037,0,34.927,13.645,38.443,31.66h-76.879 C206.293,39.783,222.184,26.139,241.214,26.139z M375.305,427.312c0,15.978-13,28.979-28.973,28.979H136.096 c-15.973,0-28.973-13.002-28.973-28.979V170.861h268.182V427.312z M410.135,115.744c0,15.978-13,28.979-28.973,28.979H101.266 c-15.973,0-28.973-13.001-28.973-28.979v-2.828c0-15.978,13-28.979,28.973-28.979h279.897c15.973,0,28.973,13.001,28.973,28.979 V115.744z"></path> <path d="M171.144,422.863c7.218,0,13.069-5.853,13.069-13.068V262.641c0-7.216-5.852-13.07-13.069-13.07 c-7.217,0-13.069,5.854-13.069,13.07v147.154C158.074,417.012,163.926,422.863,171.144,422.863z"></path> <path d="M241.214,422.863c7.218,0,13.07-5.853,13.07-13.068V262.641c0-7.216-5.854-13.07-13.07-13.07 c-7.217,0-13.069,5.854-13.069,13.07v147.154C228.145,417.012,233.996,422.863,241.214,422.863z"></path> <path d="M311.284,422.863c7.217,0,13.068-5.853,13.068-13.068V262.641c0-7.216-5.852-13.07-13.068-13.07 c-7.219,0-13.07,5.854-13.07,13.07v147.154C298.213,417.012,304.067,422.863,311.284,422.863z"></path></g></g></g>
                      </svg>
                      <svg v-else aria-hidden="true" class="w-5 h-5 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
                        <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
                      </svg>

                    </div>
                  </li>
                </ul>
                <div class="font-semibold border-b  md:border-b-0 w-full p-2 flex justify-center  text-xl">
                      <span class="bg-green-300 px-3 py-1 w-fit rounded-full flex items-center justify-center">
                        {{order.price_all}}
                      </span>
                </div>
                <li v-if="orderFullScreen.state && (order.status=='Принят') &&EditMode.Enabled" @click.prevent="editOrder(order.id)" class="hover:bg-blue-400 hover:text-white hover:scale-[1.01] relative transition cursor-pointer border-gray-200 border col-span-12 p-6 bg-white rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-700 flex flex-col justify-center items-center text-neutral-500">
                  <div class="w-full h-full peer absolute top-0 bottom-0 right-0 left-0"></div>
                  <span class="transition duration-700 peer-hover:scale-[2] peer-hover:rotate-[360deg] peer-hover:font-bold">+</span>
                </li>
              </div>
              <div class="w-full flex justify-center flex-col lg:flex-row items-center gap-1">
                <button @click.prevent="OrderToFullScreenOrBack(order.id)" class="z-1 w-1/2 text-center transition ease-out overflow-hidden relative
                hover:scale-110 border w-fit px-3 py-2 rounded-2xl flex items-center text-white before:transition before:ease-out before:duration-700
                before:absolute before:bg-sky-800 before:rounded-full before:min-w-10 before:min-h-10 before:text-white before:translate-x-[6rem]
                before:translate-y-[2.6rem] hover:before:scale-[10] hover:text-white hover:shadow-lg before:-z-10 font-semibold bg-sky-500">
                  <template v-if="orderFullScreen.state"><p class="truncate">Закрыть</p></template>
                  <template v-else><p class="truncate">Подробнее</p></template>
                </button>
                <button v-if="orderFullScreen.state && (order.status=='Принят' || order.status=='Готов' || EditMode.Enabled)" :class="{'scale-110':EditMode.Enabled}" @click.prevent="toggleEditMode" class="z-1 justify-center w-fit transition ease-out
                overflow-hidden relative hover:scale-110 border px-3 py-2 rounded-2xl flex items-center text-white before:transition before:ease-out before:duration-700 before:absolute
                before:bg-sky-800 before:rounded-full before:min-w-10 before:min-h-10 before:text-white before:translate-x-[6rem] before:translate-y-[2.6rem] hover:before:scale-[10] hover:text-white
                hover:shadow-lg before:-z-10 font-semibold bg-sky-500">
                  <template v-if="!EditMode.Enabled">
                    <p class="truncate">Редактировать</p>
                  </template>
                  <template v-else-if="EditMode.Enabled && orderFullScreen.id==order.id">
                    <p class="truncate">Назад</p>
                  </template>
                  <template v-else>
                    <img src="/src/assets/edit.svg" class="max-h-6 p-1" alt="">
                  </template>
                </button>
                <button v-if="orderFullScreen.state && orderFullScreen.id==order.id && EditMode.Enabled"
                        @click.prevent="save" class="z-1 justify-center w-fit transition ease-out
                overflow-hidden relative hover:scale-110 border px-3 py-2 rounded-2xl flex items-center text-white before:transition before:ease-out before:duration-700 before:absolute
                before:bg-sky-800 before:rounded-full before:min-w-10 before:min-h-10 before:text-white before:translate-x-[6rem] before:translate-y-[2.6rem] hover:before:scale-[10] hover:text-white
                hover:shadow-lg before:-z-10 font-semibold bg-sky-500">
                    <p class="truncate">
                      <template v-if="!EditStatusData.isProcessing">
                        Сохранить
                      </template>
                      <template v-else>
                        <div class="w-full flex justify-center">
                        <svg aria-hidden="true" class="w-7 h-7 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
                          <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
                        </svg>
                      </div></template>
                    </p>
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
  <div :class="{'absolute':modal.Open,'hidden':!modal.Open}" class=" top-0 bottom-0 right-0 left-0 bg-black/50 flex justify-center items-center" style="z-index: 22;">
    <div class="w-2/3 md:w-1/4 h-fit rounded-xl bg-white flex flex-col gap-3 p-5">
      <div>
        <button @click.prevent="toggleModal" class="cursor-pointer w-full  min-h-1/2 items-center px-4 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Закрыть</button>
      </div>
      <div>
        <h3 class="text-xl">Столик:</h3>
        <div class="flex gap-0.5 justify-center">
          <ul class="flex gap-1 py-3">
            <li class="flex flex-wrap gap-2">
              <button v-for="i in 10" @click.prevent="ChoiceTable(i)" :class="{'scale-150':addOrderForm.data.table_id==i}"
                      class="transition overflow-hidden hover:scale-150 px-2 shadow-xl border flex justify-center items-center rounded-full text-center bg-white relative before:absolute
                      before:top-0 before:border-0 before:left-0 before:right-0 before:bg-neutral-500 before:w-full before:h-[250%] before:translate-y-[80%] before:-translate-x-[80%] hover:before:-translate-y-[80%]
                      before:transition hover:before:translate-x-[80%] before:duration-[400ms] before:-rotate-45 before:ease-linear ">
                <span :class="{'text-yellow-600':addOrderForm.data.table_id==i}" class="text-md font-normal transition flex items-center justify-center mix-blend-difference text-white">{{ i }}</span>
              </button>
            </li>
          </ul>
        </div>
        <ErrorDescription :error="addOrderForm.errors.table_id"></ErrorDescription>

      </div>
      <div class="flex flex-col">
        <label for="userCount" class="self-center">Людей за столиком:</label>
        <input v-model="addOrderForm.data.number_of_person" class="border text-center" type="number" name="userCount" id="userCount">
        <ErrorDescription :error="addOrderForm.errors.number_of_person"></ErrorDescription>
      </div>
      <div>
        <button @click.prevent="CreateOrder" class="cursor-pointer w-full  min-h-1/2 items-center px-4 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
          <template v-if="!addOrderForm.isProcess">
            Создать
          </template>
          <template v-else>
            <div class="w-full flex justify-center">
              <svg aria-hidden="true" class="w-5 h-5 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
                <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
              </svg>
            </div>
          </template>
        </button>

      </div>


    </div>
  </div>

</template>
