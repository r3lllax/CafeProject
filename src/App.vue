<script setup>
import { provide, inject, ref } from 'vue'
import { RouterLink, RouterView } from 'vue-router'
import Header from '@/components/Header.vue'

const role_id = ref(localStorage.getItem('role_id'))
const token = ref(localStorage.getItem('user_token'))


const updateToken = (newToken) =>{
  if(newToken){
    localStorage.setItem('user_token',newToken)
  }
  else{
    localStorage.removeItem('user_token')
  }
  token.value = newToken
  updateRoleID(null)
}

const updateRoleID = (newRole)=>{
  if(newRole){
    localStorage.setItem('role_id',newRole)
  }
  else{
    localStorage.removeItem('role_id')
  }
  role_id.value = newRole
}

provide('role_id',role_id)
provide('token',token)
provide('updateRole',updateRoleID)
provide('updateToken',updateToken)

</script>

<template>
  <Header />
  <RouterView />
</template>

<style scoped>

</style>
