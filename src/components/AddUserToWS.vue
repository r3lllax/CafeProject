<script setup>

import { inject, onMounted, ref } from 'vue'
import apiFetch from '@/helpers/apiFetch.js'
import ErrorDescription from '@/components/ErrorDescription.vue'

const WorkShiftInfo = ref({
  Work_shifts:{},
  No_Work_shifts:{},
  Processing:true
})

const LoadWS = async ()=>{
  WorkShiftInfo.value.Processing = true
  const responce = await apiFetch("GET",`/user/${id.value}`)
  WorkShiftInfo.value.Work_shifts = responce['work_shifts']
  WorkShiftInfo.value.No_Work_shifts = responce['not-work-shifts']
  WorkShiftInfo.value.Processing = false
  Errors.value.processing = false
}



const id = inject('ViewUserId')
onMounted(()=>{
  LoadWS()
})

const Errors = ref({
  errors:null,
  processing:false
})

const AddToWs = async (WSid)=>{
  if(Errors.value.processing){
    return
  }
  Errors.value.processing = true
  let User_toAdd_ID = id.value
  const responce = await apiFetch("POST",`/work-shift/${WSid}/user`,{user_id:User_toAdd_ID})
  console.log(responce)
  if(responce.error){
    Errors.value.errors = [responce.error.message]
    Errors.value.processing = false
    return
  }

  if (responce.data){
    LoadWS()
  }
}

</script>

<template>
  <form action="" class="border w-full h-fit p-5 flex flex-col items-center gap-2.5">
    <div class="w-full">
      <h2 class="text-nowrap text-xl font-bold dark:text-white w-fit">Смены пользователя</h2>
      <ul class="border rounded-xl grid grid-cols-12 overflow-auto gap-2 p-5 justify-center" style="max-height: 15rem;" v-if="WorkShiftInfo.Work_shifts.length>0">
        <li class="border cursor-default p-2 w-full h-fit col-span-12 md:col-span-6 lg:col-span-4 xl:col-span-3 bg-blue-400 rounded-xl"  v-for="work_shift of WorkShiftInfo.Work_shifts" >
          <div class="flex flex-col w-full break-words gap-2">
            <span class="font-bold font-sans text-white">Смена {{work_shift.id}}</span>
            <span class="text-sm flex flex-col text-center text-white">Дата начала: <span class="text-black font-bold p-1 bg-sky-200 rounded-full md:rounded">{{work_shift.start}}</span></span>
            <span class="text-sm flex flex-col text-center text-white">Дата окончания: <span class="text-black font-bold p-1 bg-sky-200 rounded-full md:rounded">{{work_shift.end}}</span></span>
          </div>
        </li>
      </ul>
      <div class="flex flex-nowrap bg-sky-300 py-1 px-4 rounded-xl items-center text-white justify-center gap-1" v-else-if="WorkShiftInfo.Processing">
        <span>Загрузка...</span>
        <svg aria-hidden="true" class="w-5 h-5 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
          <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
        </svg>
      </div>
      <div class="col-span-12 w-full"  v-else >Пользователь не находится ни на одной из смен</div>


    </div>
    <div class="w-full">
      <h2 class="text-nowrap text-xl font-bold dark:text-white w-fit">Остальные смены</h2>
      <ul class="border rounded-xl grid grid-cols-12 overflow-auto max-h-52 gap-2 p-5 " style="max-height: 20rem;" v-if="WorkShiftInfo.No_Work_shifts.length>0">

        <li class="cursor-default transition-all border rounded-xl hover:bg-accent-500 hover:scale-110 bg-sky-50 p-2 w-full h-full col-span-12 md:col-span-6 lg:col-span-4 xl:col-span-3"  v-for="no_work_shift of WorkShiftInfo.No_Work_shifts" >
          <div class="flex flex-col w-full break-words gap-2 items-center">
            <span class="font-bold font-sans">Смена {{no_work_shift.id}}</span>
            <span class="text-sm flex flex-col text-center text-black">Дата начала: <span class=" text-black font-bold p-1 bg-sky-200 rounded-full md:rounded">{{no_work_shift.start}}</span></span>
            <span class="text-sm flex flex-col text-center text-black">Дата окончания: <span class=" text-black font-bold p-1 bg-sky-200 rounded-full md:rounded">{{no_work_shift.end}}</span></span>
            <button @click.prevent="AddToWs(no_work_shift.id)" :disabled="Errors.processing" :class="{'pointer-events-none':Errors.processing}" class="mt-5 cursor-pointer w-full items-center px-4 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
              <template v-if="!Errors.processing">Добавить</template>
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
        </li>
      </ul>
      <div class="flex flex-nowrap bg-sky-300 py-1 px-4 rounded-xl items-center text-white justify-center gap-1" v-else-if="WorkShiftInfo.Processing">
        <span>Загрузка...</span>
        <svg aria-hidden="true" class="w-5 h-5 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
          <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
        </svg>
      </div>
      <div class="col-span-12 w-full"  v-else >Нет смен на которых нет пользователя</div>

    </div>
    <ErrorDescription :error="Errors.errors"></ErrorDescription>
  </form>
</template>

<style scoped>

</style>