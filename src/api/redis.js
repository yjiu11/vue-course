import axios from './app'
export const redis_get = ({key}) =>{
  var params = new URLSearchParams();
  params.append('key',key)
  return axios.request({
    url:'redis/get',
    method:'post',
    data:params
  })
}
export const redis_set = ({key,value}) =>{
  var params = new URLSearchParams();
  params.append('key',key)
  params.append('value',value)
  return axios.request({
    url:'redis/set',
    method:'post',
    data:params
  })
}
export default{
  redis_get,redis_set
}
