import { getMyName } from "../api/app";

const actions = {
  updateAppName({commit}){
    getMyName().then(res =>{
      console.info("==========")
      console.info(res)
    })
  }
}
export default actions;
