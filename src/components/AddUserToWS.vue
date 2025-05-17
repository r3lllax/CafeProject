<script setup>

import { inject, onMounted, ref } from 'vue'
import apiFetch from '@/helpers/apiFetch.js'
import ErrorDescription from '@/components/ErrorDescription.vue'

const WorkShiftInfo = ref({
  Work_shifts:{},
  No_Work_shifts:{},
})

const id = inject('ViewUserId')
onMounted(async function() {
  const responce = await apiFetch("GET",`/user/${id.value}`)
  console.log(responce)
  WorkShiftInfo.value.Work_shifts = responce['work_shifts']
  WorkShiftInfo.value.No_Work_shifts = responce['not-work-shifts']
  console.log(WorkShiftInfo.value)

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
    location.reload()
  }

}

</script>

<template>
  <form action="" class="border w-full h-full p-5 flex flex-col items-center gap-2.5">
    <div class="w-full">
      <h2 class="text-nowrap text-xl font-bold dark:text-white w-fit">Смены пользователя</h2>
      <ul class="border rounded-xl grid grid-cols-12 overflow-auto max-h-52 gap-2 p-5">
        <li class="border p-2 w-full h-full col-span-12 md:col-span-6 lg:col-span-4 xl:col-span-3" v-for="work_shift of WorkShiftInfo.Work_shifts" >
          <div class="flex flex-col w-full break-words gap-2">
            <span class="font-bold font-sans">Смена {{work_shift.id}}</span>
            <span class="text-sm flex flex-col text-center">Дата начала: <span class="p-1 bg-sky-200 rounded-full md:rounded-none">{{work_shift.start}}</span></span>
            <span class="text-sm flex flex-col text-center">Дата окончания: <span class="p-1 bg-sky-200 rounded-full md:rounded-none">{{work_shift.end}}</span></span>
          </div>
        </li>

      </ul>
    </div>
    <div class="w-full">
      <h2 class="text-nowrap text-xl font-bold dark:text-white w-fit">Остальные смены</h2>
      <ul class="border rounded-xl grid grid-cols-12 overflow-auto max-h-52 gap-2 p-5">

        <li class="border p-2 w-full h-full col-span-12 md:col-span-6 lg:col-span-4 xl:col-span-3" v-for="no_work_shift of WorkShiftInfo.No_Work_shifts" >
          <div class="flex flex-col w-full break-words gap-2 items-center">
            <span class="font-bold font-sans">Смена {{no_work_shift.id}}</span>
            <span class="text-sm flex flex-col text-center">Дата начала: <span class="p-1 bg-sky-200 rounded-full md:rounded-none">{{no_work_shift.start}}</span></span>
            <span class="text-sm flex flex-col text-center">Дата окончания: <span class="p-1 bg-sky-200 rounded-full md:rounded-none">{{no_work_shift.end}}</span></span>
            <button @click.prevent="AddToWs(no_work_shift.id)" class="mt-5 cursor-pointer inline-flex items-center px-4 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 w-fit">Добавить</button>

          </div>
        </li>

      </ul>
    </div>
    <ErrorDescription :error="Errors.errors"></ErrorDescription>
  </form>
</template>

<style scoped>

</style>