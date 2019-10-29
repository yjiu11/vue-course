import axios from 'axios'
import { baseURL } from '@/config'
class HTTPRequest{
  constructor(baseUrl = baseURL){
    this.baseUrl = baseUrl
    this.queue = {}
  }
  getInsideConfig(){
    const config = {
      baseURL:this.baseUrl,
      headers:{

      }
    }
    return config;
  }
  request(options){
    const instance = axios.create();
    options = Object.assign(this.getInsideConfig(),options)
    return instance(options)
  }
}
export default HTTPRequest
