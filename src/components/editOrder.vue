<script setup>
import { useRouter } from 'vue-router'

const route = useRouter()
const id = route.currentRoute.value.params.id

import router from '@/router/index.js'
import { onMounted, ref } from 'vue'
import apiFetch from '@/helpers/apiFetch.js'

onMounted(async ()=>{
  loadOrder()
  await LoadMenu()
  openCategory('Основные блюда')
})

const loadOrder = async ()=>{
  OrderData.value.isProcessing = true
  const response = await apiFetch("GET",`/order/${id}`)
  if (response.data) {
    console.log(response.data[0].status)
    if(response.data[0].status!="Принят"){
      await router.replace('/not-found')
    }
    OrderData.value.startBucket = response.data[0].positions
    OrderData.value.data = response.data[0];
    for (let item of OrderData.value.startBucket){
      Bucket.value.push(item)
    }
  }
  OrderData.value.isProcessing = false

}

const LoadMenu = async () =>{
  const responce = await apiFetch("GET","/menu")
  for (let dish of responce.data){
    switch (dish.category){
      case "Основные блюда":
        menu.value.data.mainDishes.dishes.push(dish)
        break
      case "Напитки":
        menu.value.data.drinks.dishes.push(dish)
        break
      case "Десерты":
        menu.value.data.desserts.dishes.push(dish)
        break
    }
  }
  menu.value.processed = true
  console.log(menu.value)
}

const OrderData=ref({
  data:{},
  errors:{},
  startBucket:[],
  deletedFromStartBucked:[],
  isProcessing:false,
})

const Bucket=ref([])

const menu = ref({
  data:{
    mainDishes: {
      name:'Основные блюда',
      dishes:[]
    },
    drinks: {
      name:'Напитки',
      dishes:[]
    },
    desserts: {
      name:'Десерты',
      dishes:[]
    },
  },
  open:true,
  processed:false
})

const ActiveMenuPage = ref({
  category:'',
  dishes:[]
})

const openCategory = (category) =>{
  console.log(category)
  ActiveMenuPage.value.category=category
  let findCategory=''
  switch (category){
    case "Основные блюда":
      findCategory = 'mainDishes'
      break
    case "Напитки":
      findCategory = 'drinks'
      break
    case "Десерты":
      findCategory = 'desserts'
      break
  }
  ActiveMenuPage.value.dishes = menu.value.data[findCategory].dishes
}

const addPositionInBucket = (PosID)=>{
  let position = ActiveMenuPage.value.dishes.find(item=>item.id==PosID)
  console.table(position)
  let posInOrder =Bucket.value.find(item=>item.menu_id==position.id)
  console.table(Bucket.value)
  if(posInOrder){
    posInOrder.count++
    posInOrder.price+=position.price
  }
  else{
    Bucket.value.push({ "menu_id": position.id, "count": 1, "position": position.name, "price": position.price })
  }

}

const DelPos = (PosId) =>{
  let position = Bucket.value.find(item => item.id == PosId)
  let indexOfPos = Bucket.value.indexOf(Bucket.value.find(item => item.id == PosId))
  Bucket.value.splice(indexOfPos, 1);
  if(OrderData.value.startBucket.find(item => item.id == PosId)){
    OrderData.value.deletedFromStartBucked.push(position)
  }
}

const back = ()=>{
  if (SaveProcessing.value){
    return
  }
  localStorage.setItem('lastViewOrder',id)
  router.replace('/waiter/my-orders')
}

const increase = (PosID) =>{
  let posInOrder =Bucket.value.find(item=>item.id==PosID)
  if(posInOrder){
    let onePrice = posInOrder.price/posInOrder.count
    posInOrder.count++
    posInOrder.price+=onePrice
  }
}
const decrease = (PosID) =>{
  let position = Bucket.value.find(item => item.id == PosID)
  let indexOfPos = Bucket.value.indexOf(position)
  let onePrice = position.price/position.count

  if(position.count>1){
    position.price-=onePrice
    position.count--
  }
  else{
    DelPos(PosID)

  }
}

const SaveProcessing = ref(false)
const SuccesSave = ref(false)

const save = async ()=>{
  if(SaveProcessing.value){
    return
  }
  SaveProcessing.value = true
  for (let DeleteFetchItem of OrderData.value.startBucket){
    const responce = await apiFetch('DELETE',`/order/${OrderData.value.data.id}/position/${DeleteFetchItem.id}`)
  }

  for (let AddFetchItem of Bucket.value){
    const body = {"menu_id":AddFetchItem.menu_id, "count":AddFetchItem.count}
    const responce = await apiFetch('POST',`/order/${OrderData.value.data.id}/position`,body)

  }
  document.body.scrollTop = document.documentElement.scrollTop = 0;
  SaveProcessing.value = false
  SuccesSave.value = true
}

</script>

<template>
  <div v-if="SuccesSave" class="bg-teal-100 border-t-4 border-teal-500 rounded-b text-teal-900 px-4 py-3 shadow-md" role="alert">
    <div class="flex">
      <div class="py-1"><svg class="fill-current h-6 w-6 text-teal-500 mr-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M2.93 17.07A10 10 0 1 1 17.07 2.93 10 10 0 0 1 2.93 17.07zm12.73-1.41A8 8 0 1 0 4.34 4.34a8 8 0 0 0 11.32 11.32zM9 11V9h2v6H9v-4zm0-6h2v2H9V5z"/></svg></div>
      <div>
        <p class="font-bold">Позиции заказа успешно изменены</p>
        <p class="font-bold">Вы можете <span @click.prevent="back" class="underline cursor-pointer">выйти</span>  из меню редактирования</p>
      </div>
    </div>
  </div>
  <main class="w-full flex justify-center">
    <div class=" w-full md:w-2/3 self-center justify-center p-5 flex gap-3 flex-col">
      <div class="flex justify-between" @click.prevent="menu.open=!menu.open">
        <h3  class="text-4xl relative font-semibold">Меню</h3>
        <div v-if="!menu.open">+</div>
        <div v-else>-</div>
      </div>

      <div :class="{'max-h-0':!menu.open}" class="transition-all min-w-full overflow-hidden shadow-lg flex flex-col gap-2">
        <div class="flex gap-2 justify-between flex-wrap p-5">
          <div class=" px-3 py-1 shadow-lg rounded-full hover:scale-110 transition-all" v-for="category of menu.data" v-if="menu.processed">
            <button @click.prevent="openCategory(category.name)">{{category.name}}</button>
          </div>
          <div v-else class="w-full flex justify-center">
            <svg aria-hidden="true" class="w-7 h-7 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
              <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
            </svg>
          </div>
        </div>
        <div class="grid grid-cols-12 w-full h-full gap-3">
          <div class="col-span-12 md:col-span-6 lg:col-span-4 justify-start xl:col-span-3 shadow-lg p-5 rounded flex flex-col" v-for="dish of ActiveMenuPage.dishes">
            <div class="flex flex-col justify-between h-full gap-3">
              <div>
                <div class="text-neutral-400 " >{{dish.id}}</div>
                <div class="font-semibold ">{{dish.name}}</div>
                <div class="">{{dish.description}}</div>
              </div>
              <div class="flex items-center justify-between">
                <div class="px-2 py-1 bg-green-300 text-white rounded-full flex justify-center items-center w-fit">{{dish.price}}</div>
                <button @click.prevent="addPositionInBucket(dish.id)" class="bg-blue-400 text-white px-2 py-1 rounded-full">Add</button>
              </div>

            </div>
          </div>
        </div>
      </div>
      <h3 class="text-4xl font-semibold">Корзина заказа</h3>
      <div class="h-fit w-full shadow-lg rounded-xl" v-if="Bucket.length">
        <ul class="w-full flex flex-col p-5 gap-1">
          <li class="transition bg-white px-4 py-1 shadow-sm rounded-2xl hover:scale-[1.05] flex flex-col md:flex-row justify-center items-center" v-for="position of Bucket">
<!--            <div class="font-semibold border-b text-center text-neutral-400  md:border-b-0 md:border-r w-full md:w-fit p-2 text-xl">{{position.id}}</div>-->
            <div class="font-semibold border-b text-center md:border-b-0 w-full p-2 text-xl overflow-hidden text-ellipsis">{{position.position}}</div>
            <div class="flex justify-center items-center font-semibold border-b text-center md:border-b-0 w-full md:w-fit p-2 text-xl">
              <div @click.prevent="decrease(position.id)" class="transition cursor-pointer flex justify-center items-center h-5 w-5  px-2 hover:bg-neutral-300 bg-white rounded-full">
                <span  class="h-5 w-5 flex items-center justify-center">-</span>
              </div>
              <div>{{position.count}}</div>
              <div @click.prevent="increase(position.id)" class="transition cursor-pointer flex justify-center items-center h-5 w-5  px-2 hover:bg-neutral-300 bg-white rounded-full">
                <span  class="h-5 w-5 flex items-center justify-center">+</span>
              </div>
            </div>
            <div class="font-semibold border-b text-center md:border-b-0 w-full p-2 flex justify-center  text-xl">
              <span class="bg-green-300 px-3 py-1 w-fit rounded-full flex items-center justify-center">
                {{position.price}}
              </span>
            </div>
            <div v-if="OrderData.data.status=='Принят'" @click.prevent="DelPos(position.id)" class="flex justify-center transition bg-red-600 my-2 rounded-full hover:bg-red-800 cursor-pointer hover:scale-110">
              <svg v-if="!OrderData.isProcessing" class="flex justify-center text-center w-fit h-10 scale-50" fill="#FFFFFF" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="64px" height="64px" viewBox="0 0 482.428 482.429" xml:space="preserve" data-darkreader-inline-fill="" style="--darkreader-inline-fill: var(--darkreader-background-000000, #000000);"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <g> <g>
                        <path d="M381.163,57.799h-75.094C302.323,25.316,274.686,0,241.214,0c-33.471,0-61.104,25.315-64.85,57.799h-75.098 c-30.39,0-55.111,24.728-55.111,55.117v2.828c0,23.223,14.46,43.1,34.83,51.199v260.369c0,30.39,24.724,55.117,55.112,55.117 h210.236c30.389,0,55.111-24.729,55.111-55.117V166.944c20.369-8.1,34.83-27.977,34.83-51.199v-2.828 C436.274,82.527,411.551,57.799,381.163,57.799z M241.214,26.139c19.037,0,34.927,13.645,38.443,31.66h-76.879 C206.293,39.783,222.184,26.139,241.214,26.139z M375.305,427.312c0,15.978-13,28.979-28.973,28.979H136.096 c-15.973,0-28.973-13.002-28.973-28.979V170.861h268.182V427.312z M410.135,115.744c0,15.978-13,28.979-28.973,28.979H101.266 c-15.973,0-28.973-13.001-28.973-28.979v-2.828c0-15.978,13-28.979,28.973-28.979h279.897c15.973,0,28.973,13.001,28.973,28.979 V115.744z"></path> <path d="M171.144,422.863c7.218,0,13.069-5.853,13.069-13.068V262.641c0-7.216-5.852-13.07-13.069-13.07 c-7.217,0-13.069,5.854-13.069,13.07v147.154C158.074,417.012,163.926,422.863,171.144,422.863z"></path> <path d="M241.214,422.863c7.218,0,13.07-5.853,13.07-13.068V262.641c0-7.216-5.854-13.07-13.07-13.07 c-7.217,0-13.069,5.854-13.069,13.07v147.154C228.145,417.012,233.996,422.863,241.214,422.863z"></path> <path d="M311.284,422.863c7.217,0,13.068-5.853,13.068-13.068V262.641c0-7.216-5.852-13.07-13.068-13.07 c-7.219,0-13.07,5.854-13.07,13.07v147.154C298.213,417.012,304.067,422.863,311.284,422.863z"></path></g></g></g>
                      </svg>
              <svg v-else aria-hidden="true" class="w-5 h-5 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
                <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
              </svg>

            </div>
          </li>
        </ul>
      </div>
      <div v-else-if="OrderData.isProcessing" class="h-fit w-full shadow-lg rounded-xl flex justify-center items-center p-10">
        <svg aria-hidden="true" class="w-5 h-5 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
          <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
        </svg>
      </div>
      <div v-else class="h-fit w-full shadow-lg rounded-xl flex justify-center items-center p-10 text-neutral-600 text-4xl" >
        Корзина пуста
      </div>
      <div class="flex">
        <button @click.prevent="back" class="cursor-pointer w-full  min-h-1/2 items-center px-4 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
          <template v-if="!SaveProcessing">Назад</template>
          <template v-else>
            <div class="w-full flex justify-center">
              <svg aria-hidden="true" class="w-5 h-5 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
                <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
              </svg>
            </div>
          </template>
        </button>
        <button @click.prevent="save" class="cursor-pointer w-full  min-h-1/2 items-center px-4 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
          <template v-if="!SaveProcessing">Сохранить</template>
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
  </main>
</template>

<style scoped>

</style>