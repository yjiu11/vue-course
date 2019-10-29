import axios from './app'
export const category = ({code}) =>{
  var params = new URLSearchParams();
  params.append('code',code)
  return axios.request({
    url:'select',
    method:'post',
    data:params
  })
}
