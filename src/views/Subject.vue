<template>
<div>
  <div class="head">
    <Row>
        <i-col :xs="6" :sm="6" :md="2" :lg="3"><Cascader :data="data" :value.sync="value1" @on-change="handleChange" change-on-select></Cascader></i-col>
        <i-col :offset="1" :xs="6" :sm="6" :md="3" :lg="3">
           <i-input placeholder="搜索题目" v-model="searchName"  @on-enter="search()"></i-input>
        </i-col>
    </Row>
    <Row class="my_tabs" type="flex" :gutter="16" justify="space-between">
        <i-col v-for="(p, index) in card_data" :key="index" :xs="24" :md="12" :lg="12">
            <Card style="margin-top: 10px;">
                <p slot="title">{{index+1}}、{{p.type ===2?'填空题':''}} {{p.type ===1 || p.type===3?p.name:''}}</p>
                <a href="#" slot="extra" @click.prevent="changeLimit(index,1)">
                    <Icon type="ios-loop-strong"></Icon>
                    查看答案
                </a>
                <!-- 单选题 -->
                <div v-if="p.type === 1">
                  <p class="demobox" v-for="(op, op_key) in JSON.parse(p.options)" :key="'a'+op_key" @click="select_answer(p,op,index)">{{op.value}}、{{op.item}}</p>
                </div>
                <!-- 填空题 -->
                <div v-if="p.type === 2">
                  <div >&nbsp;&nbsp;&nbsp;&nbsp;{{p.name}}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</div><!-- <i-button type="primary" icon="md-checkmark-circle-outline"></i-button>-->
                  <div style="margin-top:10px;height:30px;margin-bottom:10px" v-for="(op, op_key) in JSON.parse(p.answer)" :key="'a'+op_key">
                    {{op_key+1}}、&nbsp;&nbsp;
                    <i-input :icon="`${getLocalStorage('INPUT_ID_'+p.id+'_OP_KEY'+op_key)}`" :value.sync="$data[index_op_key]" placeholder="请输入..." style="width: 300px" @on-enter="blur($event,p.id,op_key)" @on-blur="blur($event,p.id,op_key)"></i-input>
                    <!-- :icon="`${getLocalStorage('INPUT_ID_'+p.id+'_OP_KEY'+op_key)}`" -->
                    <!-- <Icon :type="`${getLocalStorage('INPUT_ID_'+p.id+'_OP_KEY'+op_key)}`"></Icon> -->
                  </div>

                </div>
                <!-- 简答题  -->
                <div v-if="p.type === 3">
                  <!-- <p class="demobox" v-for="(op, op_key) in JSON.parse(p.options)" :key="'a'+op_key" @click="select_answer(p,op,index)">{{op.value}}、{{op.item}}</p> -->
                  <i-input type="textarea" :rows="4" placeholder="请输入..."  @on-blur="blur($event,p.id,0)"></i-input>
                </div>
                <div v-show="show_answer[index]">
                  <Divider>答案解析</Divider>
                  正确答案：
                  <p v-for="(aaa, aaa_index) in JSON.parse(p.answer)" :key="'b'+aaa_index" v-html="aaa.item">
                    <!-- {{aaa.item}} -->
                  </p>
                  解析:<br>{{p.remark}}
                </div>
            </Card>
        </i-col>
        <!-- <i-col span="24">
              <Tabs type="card">
                  <Tab-pane label="填空题">标签一的内容</Tab-pane>
                  <Tab-pane label="简答题">标签三的内容</Tab-pane>
                  <Tab-pane label="单选题">标签二的内容</Tab-pane>
                  <Tab-pane label="多选题">标签三的内容</Tab-pane>
              </Tabs>

        </i-col> -->

    </Row>
  </div>
</div>
</template>
<script>
import {category} from "@/api/params"
import {list,check} from "@/api/question"
export default {
    data(){
        return {
          searchName:'',
          curr_sec:'',
          value1:[],
          data :[],
          selected_category:'',
          card_data:[],
          show_answer:[],
          index_op_key:[]
        }
    },
    mounted(){

    },
    created(){
          category({code:"category"}).then(res =>{
            this.data = res.data.data
          });
          var selected_category = localStorage.getItem("selected_category");
          if(selected_category !==null){
            this.value1 = JSON.parse(selected_category);
            //加载完，直接列出题目
            let selected = this.value1[this.value1.length-1];
            this.btn_search(selected);
          }

    },methods:{
      search(e){
        let input_value = e.srcElement.value;

      },
      getLocalStorage(key){
        let result = localStorage.getItem(key);
        if(result === '' || result ===null){
          return 'ios-clock-outline'
        }else{
          return result;
        }

      },
      //填空题，失去焦点时判断
      blur(e,id,op_key){
        console.info(e.srcElement)
        let input_value = e.srcElement.value;
        if(input_value!==''){
            console.info(input_value,id,op_key)
            check({input_value,question_id:id,curr_question_index:op_key}).then(res =>{
                if(res.data.code === 0){
                  this.$Message.success('回答正确,匹配度:'+(res.data.data*100)+"%");
                  localStorage.setItem("INPUT_ID_"+id+"_OP_KEY"+op_key,"ios-checkmark-empty");//<Icon type="ios-checkmark-empty"></Icon>
                  //<Icon type="checkmark"></Icon>
                }else{
                  if(res.data.msg === null){
                      this.$Message.error('回答错误');
                  }else {
                    this.$Message.error('回答错误,匹配度:'+(res.data.data*100)+"%");
                  }
                  localStorage.setItem("INPUT_ID_"+id+"_OP_KEY"+op_key,"ios-close-outline");//<Icon type="ios-close-outline"></Icon>
                }
              })
        }

        // console.info(this.index_op_key[index])
        // console.info(this.input_value)
        //this.input_value = "";
      },
      handleChange(e1){
        for(var i=0;i<e1.length;i++){
          this.value1.splice(i,1,e1[i])
        }
        localStorage.setItem("selected_category",JSON.stringify(this.value1));
        let selected = e1[e1.length-1];
        // this.selected_category = selected;
        this.btn_search(selected);
      },
      search(){
        let selected = this.getSelected();
        if(selected != undefined){
          this.btn_search(selected,this.searchName)
        }else{
          this.$Message.error("请先选择分类")
        }

      },
      getSelected(){
        var selected_category = localStorage.getItem("selected_category");
        if(selected_category !==null){
          this.value1 = JSON.parse(selected_category);
          //加载完，直接列出题目
          let selected = this.value1[this.value1.length-1];
          return selected;
        }
      },
      /**
       * 搜索按钮
       */
      btn_search(selected_category,searchName){
        list({category:selected_category,searchName:this.searchName}).then(res =>{
            this.card_data = res.data.data
            for(var i = 0; i < this.card_data.length; i++) {
                this.show_answer.push(false)
            };
          });
      },
      /**
       *
       */
      changeLimit(changeLimit,isOpen){
        var old = this.show_answer[changeLimit];
        this.show_answer.splice(changeLimit,1,isOpen===1?!old:true)
      },
      /**
       * 当前题目对象p
       * 选择的答案op
       */
      select_answer(p,op,index){
        let answer = JSON.parse(p.answer);
        //单选题
        if(answer.length ===1){
          if(answer[0].item === op.value){
            this.$Message.success('回答正确');
          }else{
            this.$Message.error('回答错误');
            this.changeLimit(index,true)
          }
        }
      }
    }
}
</script>
<style scoped>
  .red_color{
    color:red
  }
  .my_tabs{
    margin:15px;
  }
  .demobox{height:30px;line-height:30px;overflow:hidden;display:block;}
</style>
