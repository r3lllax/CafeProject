<script setup>


import { onMounted, ref } from 'vue'
import apiFetch from '@/helpers/apiFetch.js'
import ErrorDescription from '@/components/ErrorDescription.vue'

const data = ref({
  WorkShifts:[],
  Errors:{},
  WorkShiftWasLoad:false
})

const LoadWorkShifts = async () =>{
  data.value.WorkShiftWasLoad = false
  const responce = await apiFetch("get","/work-shift")
  data.value.WorkShifts = responce
  for(let ws of data.value.WorkShifts){
    checkboxes.value.push( {id:ws.id,checked:ws.active?true:false,processing:false})
  }
  data.value.WorkShiftWasLoad = true

}
onMounted(()=>{
  LoadWorkShifts()
})

const checkboxes = ref([

])

const check = async (WorkShift)=>{

  const checkbox = checkboxes.value.find(element => element.id == WorkShift.id)
  console.log(checkbox)
  checkbox.processing = true
  if(!checkbox.checked){
    const responce = await apiFetch("GET",`/work-shift/${WorkShift.id}/open`)
    if(responce.error){
      data.value.Errors.error = [responce.error.message,'The data may not be displayed correctly, please reload the page']
      return
    }
  }
  else{
    const responce = await apiFetch("GET",`/work-shift/${WorkShift.id}/close`)
    if(responce.error){
      data.value.Errors.error = [responce.error.message,'The data may not be displayed correctly, please reload the page']
      return
    }
  }
  checkbox.checked = !checkbox.checked
  checkbox.processing = false

}

const NewWsForm = ref({
  data:{
    start:'',
    end:'',
  },
  errors:{},
  processing:false,
})

const modal = ref({
  OpenStatus:false
})

const toggleModal = () =>{
  modal.value.OpenStatus = !modal.value.OpenStatus
}


const MakeWS = async ()=>{
  NewWsForm.value.errors = []
  if(NewWsForm.value.processing){
    return
  }
  NewWsForm.value.processing =true
  const responce = await apiFetch("POST","/work-shift",NewWsForm.value.data)
  console.log(responce)
  if(responce.error){
    if(!responce.error.errors){
      NewWsForm.value.errors.start=[responce.error.message]
    }
    else{
      NewWsForm.value.errors=responce.error.errors
    }
  }
  if(responce.data){
    LoadWorkShifts()
    toggleModal()
  }
  NewWsForm.value.processing =false
}
</script>

<template>
  <main class="w-full flex flex-col items-center">
    <h2 class="text-4xl font-bold dark:text-white p-5">Рабочие смены</h2>
    <div v-if="data.WorkShiftWasLoad" class="w-full md:w-1/2 self-center justify-center gap-3">
      <div class="w-full">
        <ul class="grid grid-cols-12 gap-3 p-2">
          <li class="col-span-full">
            <ErrorDescription :error="data.Errors.error"></ErrorDescription>
          </li>

          <li v-for="WorkShift of data.WorkShifts" :class="{'border-gray-200':(!checkboxes.find(cb =>cb.id==WorkShift.id).checked) && !checkboxes.find(cb =>cb.id==WorkShift.id).processing,'border-green-500':(checkboxes.find(cb =>cb.id==WorkShift.id).checked) && !checkboxes.find(cb =>cb.id==WorkShift.id).processing,'border-yellow-500':checkboxes.find(cb =>cb.id==WorkShift.id).processing}" class="transition border col-span-12 md:col-span-6 lg:col-span-4 p-6 bg-white rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-700 flex flex-col items-center">
            <a href="#">
              <h5 class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Смена {{WorkShift.id}}</h5>
            </a>
            <div class="mb-3 font-normal text-gray-700 dark:text-gray-400">
              <div>
                <span class="font-semibold">Дата начала:</span>
                <div>
                  {{WorkShift.start}}
                </div>
              </div>
              <div>
                <span class="font-semibold">Дата окончания:</span>
                <div>
                  {{WorkShift.end}}
                </div>
              </div>
            </div>
            <label class="inline-flex items-center cursor-pointer">
              <input v-if="(!(checkboxes.find(cb =>cb.id==WorkShift.id)).checked && (checkboxes.find(cb =>cb.checked==true))?true:false)||(checkboxes.find(cb =>cb.id==WorkShift.id)).processing" @change.prevent="check(WorkShift)" type="checkbox" class="sr-only peer" disabled>
              <input v-else-if="!(checkboxes.find(cb =>cb.id==WorkShift.id)).checked && !(checkboxes.find(cb =>cb.checked==true))?true:false" @change.prevent="check(WorkShift)" type="checkbox" class="sr-only peer">
              <input v-else @change.prevent="check(WorkShift)" type="checkbox" class="sr-only peer" checked>
              <div class="relative w-11 h-6 bg-gray-200 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-green-500 dark:peer-checked:bg-green-500"></div>
            </label>

          </li>

          <li @click.prevent="toggleModal" class="hover:bg-blue-400 hover:text-white hover:scale-[1.01] relative transition cursor-pointer border-gray-200 border col-span-12 p-6 bg-white rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-700 flex flex-col justify-center items-center text-neutral-500">
            <div class="w-full h-full peer absolute top-0 bottom-0 right-0 left-0"></div>
            <span class="transition duration-700 peer-hover:scale-[2] peer-hover:rotate-[360deg] peer-hover:font-bold">+</span>
          </li>
        </ul>
      </div >

    </div>
    <div v-else class="w-full flex justify-center">
      <svg aria-hidden="true" class="w-7 h-7 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
        <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
      </svg>
    </div>
  </main>
  <div :class="{'hidden':!modal.OpenStatus}" class="fixed bg-black/50 top-0 bottom-0 left-0 right-0 z-50 flex justify-center items-center">
    <div class="w-full md:w-1/2 max-h-full flex justify-center flex-col items-center bg-white gap-2 overflow-y-auto p-5 rounded-none md:rounded-xl">
      <h2 class="text-4xl mb-10">Добавление смены</h2>
      <div class="w-full flex flex-col gap-2">
        <h3 class="text-2xl">Дата и время начала</h3>
        <input v-model="NewWsForm.data.start" :class="{'bg-red-200':NewWsForm.errors.start,'bg-gray-50':!NewWsForm.errors.start}" type="text" id="start" class="shadow-xs border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-xs-light" placeholder="2000-01-01 08:00"  />
        <ErrorDescription :error="NewWsForm.errors.start"></ErrorDescription>
      </div>
      <div class="w-full flex flex-col gap-2">
        <h3 class="text-2xl">Дата и время окончания</h3>
        <input v-model="NewWsForm.data.end" :class="{'bg-red-200':NewWsForm.errors.end,'bg-gray-50':!NewWsForm.errors.end}" type="text" id="end" class="shadow-xs bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-xs-light" placeholder="2000-01-01 08:00"  />
        <ErrorDescription :error="NewWsForm.errors.end"></ErrorDescription>
      </div>


      <button @click.prevent="MakeWS" :disabled="NewWsForm.processing" :class="{'pointer-events-none':NewWsForm.processing}" class="mt-5 cursor-pointer w-full items-center px-4 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
        <template v-if="!NewWsForm.processing">
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
      <button @click.prevent="toggleModal" class="cursor-pointer w-full items-center px-4 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Назад</button>

    </div>
  </div>
</template>
