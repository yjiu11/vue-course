import axios from './app'
export const send = ({user_id}) =>{
  var params = new URLSearchParams();
  params.append('user_id',user_id)
  return axios.request({
    url:'oneLevelMenu',
    method:'post',
    data:params
  })
}
export const twoLevelMenu = ({user_id,oneLevelMenu}) =>{
  var params = new URLSearchParams();
  params.append('user_id',user_id)
  params.append('oneLevelMenu',oneLevelMenu)
  return axios.request({
    url:'twoLevelMenu',
    method:'post',
    data:params
  })
}
