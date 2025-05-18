<script setup>


import { onMounted, ref } from 'vue'
import apiFetch from '@/helpers/apiFetch.js'
import ErrorDescription from '@/components/ErrorDescription.vue'

const data = ref({
  WorkShifts:[],
  Errors:{}
})

const LoadWorkShifts = async () =>{
  const responce = await apiFetch("get","/work-shift")
  data.value.WorkShifts = responce
  for(let ws of data.value.WorkShifts){
    checkboxes.value.push( {id:ws.id,checked:ws.active?true:false,processing:false})
  }


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
</script>

<template>
  <main class="w-full flex justify-center">
    <div class="w-full md:w-1/2 self-center border justify-center gap-3">
      <h2 class="text-4xl">Рабочие смены</h2>
      <div class="w-full">
        <ul class="grid grid-cols-12 gap-3 p-2">
          <li class="col-span-full">
            <ErrorDescription :error="data.Errors.error"></ErrorDescription>
          </li>

          <li v-for="WorkShift of data.WorkShifts" :class="{'border-gray-200':(!checkboxes.find(cb =>cb.id==WorkShift.id).checked) && !checkboxes.find(cb =>cb.id==WorkShift.id).processing,'border-green-500':(checkboxes.find(cb =>cb.id==WorkShift.id).checked) && !checkboxes.find(cb =>cb.id==WorkShift.id).processing}" class="border col-span-12 md:col-span-6 lg:col-span-4 p-6 bg-white rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-700 flex flex-col items-center">
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
         </ul>
      </div>
    </div>
  </main>
</template>
