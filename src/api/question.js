import axios from './app'
export const list = ({category,searchName}) =>{
  var params = new URLSearchParams();
  params.append('category',category)
  params.append('searchName',searchName)
  return axios.request({
    url:'question/list',
    method:'post',
    data:params
  })
}
/**
 * 检测填空题是否正确
 */
export const check = ({input_value,question_id,curr_question_index}) =>{
  var params = new URLSearchParams();
  params.append('input_value',input_value)
  params.append('question_id',question_id)
  params.append('curr_question_index',curr_question_index)
  return axios.request({
    url:'question/check',
    method:'post',
    data:params
  })
}
export const save = ({name,dynamicTags,type,answer,remark}) =>{
  var selected_category = localStorage.getItem("selected_category");
  if(selected_category !==null){
    var value1 = JSON.parse(selected_category);
    //加载完，直接列出题目
    let selected = value1[value1.length-1];
    var params = new URLSearchParams();
    params.append('dynamicTags',dynamicTags)
    params.append('name',name)
    params.append('category',selected)
    params.append('type',type)
    params.append('answer',answer)
    params.append('remark',remark)
    return axios.request({
      url:'question/save',
      method:'post',
      data:params
    })
  }

}
