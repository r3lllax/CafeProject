<script setup>

import { inject, onMounted, ref } from 'vue'
import apiFetch from '@/helpers/apiFetch.js'
import ErrorDescription from '@/components/ErrorDescription.vue'

const WorkShiftInfo = ref({
  Work_shifts:{},
  No_Work_shifts:{},
})

const LoadWS = async ()=>{
  const responce = await apiFetch("GET",`/user/${id.value}`)
  WorkShiftInfo.value.Work_shifts = responce['work_shifts']
  WorkShiftInfo.value.No_Work_shifts = responce['not-work-shifts']
}



const id = inject('ViewUserId')
onMounted(()=>{
  LoadWS()
})

const Errors = ref({
  errors:null
})

const AddToWs = async (WSid)=>{
  let User_toAdd_ID = id.value
  const responce = await apiFetch("POST",`/work-shift/${WSid}/user`,{user_id:User_toAdd_ID})
  console.log(responce)
  if(responce.error){
    Errors.value.errors = [responce.error.message]
  }

  if (responce.data){
    LoadWS()
  }

}

</script>

<template>
  <form action="" class="border w-full h-full p-5 flex flex-col items-center gap-2.5">
    <div class="w-full">
      <h2 class="text-nowrap text-xl font-bold dark:text-white w-fit">Смены пользователя</h2>
      <ul class="border rounded-xl grid grid-cols-12 overflow-auto gap-2 p-5 justify-center" style="max-height: 15rem;" v-if="WorkShiftInfo.Work_shifts.length>0">
        <li class="border p-2 w-full max-h-48 col-span-12 md:col-span-6 lg:col-span-4 xl:col-span-3 bg-blue-400 rounded-xl"  v-for="work_shift of WorkShiftInfo.Work_shifts" >
          <div class="flex flex-col w-full break-words gap-2">
            <span class="font-bold font-sans text-white">Смена {{work_shift.id}}</span>
            <span class="text-sm flex flex-col text-center text-white">Дата начала: <span class="text-black font-bold p-1 bg-sky-200 rounded-full md:rounded">{{work_shift.start}}</span></span>
            <span class="text-sm flex flex-col text-center text-white">Дата окончания: <span class="text-black font-bold p-1 bg-sky-200 rounded-full md:rounded">{{work_shift.end}}</span></span>
          </div>
        </li>
      </ul>
      <div class="col-span-12 w-full"  v-else >Пользователь не находится ни на одной из смен</div>


    </div>
    <div class="w-full">
      <h2 class="text-nowrap text-xl font-bold dark:text-white w-fit">Остальные смены</h2>
      <ul class="border rounded-xl grid grid-cols-12 overflow-auto max-h-52 gap-2 p-5 " style="max-height: 20rem;" v-if="WorkShiftInfo.No_Work_shifts.length>0">

        <li class="cursor-default transition-all border rounded-xl hover:bg-accent-500 hover:scale-110 bg-sky-50 p-2 w-full h-full col-span-12 md:col-span-6 lg:col-span-4 xl:col-span-3"  v-for="no_work_shift of WorkShiftInfo.No_Work_shifts" >
          <div class="flex flex-col w-full break-words gap-2 items-center">
            <span class="font-bold font-sans">Смена {{no_work_shift.id}}</span>
            <span class="text-sm flex flex-col text-center text-black">Дата начала: <span class=" text-black font-bold p-1 bg-sky-200 rounded-full md:rounded-none">{{no_work_shift.start}}</span></span>
            <span class="text-sm flex flex-col text-center text-black">Дата окончания: <span class=" text-black font-bold p-1 bg-sky-200 rounded-full md:rounded-none">{{no_work_shift.end}}</span></span>
            <button @click.prevent="AddToWs(no_work_shift.id)" class="mt-5 cursor-pointer inline-flex items-center px-4 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 w-fit">Добавить</button>

          </div>
        </li>
      </ul>
      <div class="col-span-12 w-full"  v-else >Нет смен на которых нет пользователя</div>

    </div>
    <ErrorDescription :error="Errors.errors"></ErrorDescription>
  </form>
</template>

<style scoped>

</style>