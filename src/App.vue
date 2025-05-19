<script setup>
import { provide, inject, ref } from 'vue'
import { RouterLink, RouterView } from 'vue-router'
import Header from '@/components/Header.vue'

const role_id = ref(localStorage.getItem('role_id'))
const token = ref(localStorage.getItem('user_token'))
const user_id = ref(localStorage.getItem('user_id'))
const username = ref(localStorage.getItem('username'))

const updateUsername = (newUsername) =>{
  if(newUsername){
    localStorage.setItem('username',newUsername)
  }
  else{
    localStorage.removeItem('username')
  }
  username.value = newUsername
}

const updateUser_id = (newUser_id) =>{
  if(newUser_id){
    localStorage.setItem('user_id',newUser_id)
  }
  else{
    localStorage.removeItem('user_id')
  }
  user_id.value = newUser_id
}

const updateToken = (newToken) =>{
  if(newToken){
    localStorage.setItem('user_token',newToken)
  }
  else{
    localStorage.removeItem('user_token')
  }
  token.value = newToken
  updateRoleID(null)
  updateUsername(null)
  updateUser_id(null)
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
provide('user_id',user_id)
provide('username',username)
provide('updateRole',updateRoleID)
provide('updateUser',updateUser_id)
provide('updateToken',updateToken)
provide('updateUsername',updateUsername)

</script>

<template>
  <Header />
  <RouterView />
</template>

<style scoped>

</style>
