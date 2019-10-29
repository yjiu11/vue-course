import HttpRequest from '@/lib/axios'
const axios = new HttpRequest();
export default axios;

export const getMyName = () =>{
  return new Promise( (resolve,reject) =>{
    console.info("Promise")
    resolve({code:200,info:{appName : 'mmmmmmmmmm'}})
  })
}
