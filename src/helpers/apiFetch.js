export default async function(method,route,body=null,isBlob=false){
  const host = "https://apicafe/api-cafe"
  let options = {
    method:method,
    headers:{
      Accept:'application/json'
    }
  }
  if(localStorage.getItem('user_token')){
    options.headers['Authorization'] = `Bearer ${localStorage.getItem('user_token')}`
  }
  if(body){
    if(body instanceof FormData){
      options.body = body
    }
    else{
      options.headers['Content-Type']='application/json'
      options.body = JSON.stringify(body)
    }
  }
  const responce = await fetch(`${host}${route}`,options)
  let result = null

  if(responce.status===401){
    window.location.replace('/login')
    localStorage.removeItem('user_token')
    localStorage.removeItem('role_id')
  }
  if (responce.status===404){
    return {
      error:{
        code:404,
        message:'Не найдено'
      }
    }
  }
  try{
    if(isBlob){
      result = await responce.blob()
    }else{
      result = await responce.json()

    }
  }
  catch (e){

  }
  return result
}