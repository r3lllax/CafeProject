export default async function(method,route,body=null){
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
    options.headers['Content-Type']='application/json'
    options.body = JSON.stringify(body)
  }
  const responce = await fetch(`${host}${route}`,options)
  let result = responce.json()
  if(responce.status == 401){
    window.location.replace('/login')
    localStorage.removeItem('user_token')
    localStorage.removeItem('role_id')
  }
  return result
}