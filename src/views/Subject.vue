<template>
<div>
  <Modal
    v-model="modal1"
    title="编辑"
    width="40%"
    @on-ok="ok"
    @on-cancel="cancel">
    <el-form ref="formItem" :model="formItem" label-width="40px">
      <el-form-item label="题目">
        <el-input type="textarea" :rows="4" v-model="formItem.name" style="width: 95%;"></el-input>
      </el-form-item>
      <el-form-item label="图片">
        <el-input v-model="formItem.url" style="width: 95%;"></el-input>
      </el-form-item>
      <el-form-item label="答案" v-if="formItem.type !=2">
        <el-input type="textarea" :rows="4" v-model="formItem.answer_str" style="width: 95%;" @input="change($event)"></el-input>
      </el-form-item>
      <el-form-item label="解析">
        <el-input type="textarea" :rows="4" v-model="formItem.remark" style="width: 95%;"></el-input>
      </el-form-item>
    </el-form>
    <el-tag style="margin-left: 30px;" :key="tag" v-for="tag in formItem.dynamicTags" closable :disable-transitions="false" @close="handleClose(tag)">
      {{tag}}
    </el-tag>
    <el-input style="margin-left: 30px;" class="input-new-tag" v-if="inputVisible" v-model="inputValue"
              ref="saveTagInput" size="small" @keyup.enter.native="handleInputConfirm" @blur="handleInputConfirm" >
    </el-input>
    <el-button style="margin-left: 35px;" v-else class="button-new-tag" size="small" @click="showInput">+ New Tag</el-button><br><br>
  </Modal>
  <div class="head">
    <Row>
        <i-col :xs="6" :sm="6" :md="2" :lg="3"><Cascader :data="data" :value.sync="value1" @on-change="handleChange" change-on-select></Cascader></i-col>
        <i-col :offset="1" :xs="6" :sm="6" :md="3" :lg="3">
           <i-input placeholder="搜索题目" v-model="searchName"  @on-enter="search()"></i-input>
        </i-col>
        <i-col :offset="1" :xs="6" :sm="6" :md="3" :lg="3">
             <el-select v-model="select_type" placeholder="题目类型" @change="search()" size="small">
               <el-option
                 v-for="item in options"
                 :key="item.value"
                 :label="item.label"
                 :value="item.value">
               </el-option>
             </el-select>
<!--          <i-button shape="circle" icon="md-add" @click="toPage"></i-button>-->
        </i-col>
    </Row>
    <Row class="my_tabs" type="flex" :gutter="16" justify="space-between">
        <i-col v-for="(p, index) in card_data" :key="index" :xs="24" :md="12" :lg="12">
            <Card style="margin-top: 10px;">
                <p slot="title">{{index+1}}、{{p.type ===2?'填空题':''}} {{p.type ===1?'单选题':''}}{{p.type===3?'简答题':''}}</p>
                <a href="#" slot="extra" @click.prevent="changeLimit(index,1)">
                    <Icon type="ios-loop-strong"></Icon>
                    查看答案
                </a>
                <!-- 单选题 -->
                <div v-if="p.type === 1">
                  <div >&nbsp;&nbsp;&nbsp;&nbsp;{{p.name}}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</div>
                  <p class="demobox" v-for="(op, op_key) in JSON.parse(p.options)" :key="'a'+op_key" @click="select_answer(p,op,index)">{{op.value}}、{{op.item}}</p>
                </div>
                <!-- 填空题 -->
                <div v-if="p.type === 2">
                  <div >&nbsp;&nbsp;&nbsp;&nbsp;{{p.name}}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</div><!-- <i-button type="primary" icon="md-checkmark-circle-outline"></i-button>-->
                  <div style="margin-top:10px;height:30px;margin-bottom:10px" v-for="(op, op_key) in JSON.parse(p.answer)" :key="'a'+op_key">
                    {{op_key+1}}、&nbsp;&nbsp;
                    <i-input :icon="`${getLocalStorage('INPUT_ID_'+p.id+'_OP_KEY'+op_key)}`" :value.sync="$data[index_op_key]"  style="width: 300px" @on-enter="blur($event,p.id,op_key)" @on-blur="blur($event,p.id,op_key)"></i-input>
                    <!-- :icon="`${getLocalStorage('INPUT_ID_'+p.id+'_OP_KEY'+op_key)}`" -->
                    <!-- <Icon :type="`${getLocalStorage('INPUT_ID_'+p.id+'_OP_KEY'+op_key)}`"></Icon> -->
                  </div>

                </div>
                <!-- 简答题  -->
                <div v-if="p.type === 3">
                  <div >&nbsp;&nbsp;&nbsp;&nbsp;{{p.name}}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</div>
                  <!-- <p class="demobox" v-for="(op, op_key) in JSON.parse(p.options)" :key="'a'+op_key" @click="select_answer(p,op,index)">{{op.value}}、{{op.item}}</p> -->
                  <i-input type="textarea" :rows="4"   @on-blur="blur($event,p.id,0)"></i-input>
                </div>
                <div v-show="show_answer[index]">
                  <Divider>答案解析</Divider>
                  正确答案：
                  <p v-for="(aaa, aaa_index) in JSON.parse(p.answer)" :key="'b'+aaa_index" v-html="aaa.item">
                    <!-- {{aaa.item}} -->
                  </p>
                  <div v-if="p.remark !='' && p.remark !=undefined && p.remark !=null && p.remark !='null'">解析:<br>{{p.remark}}<br></div>
                  <i-button shape="circle" icon="ios-bookmarks-outline" @click="open(p)"></i-button>&nbsp;&nbsp;
                  <i-button shape="circle" icon="md-close" @click="del(p)"></i-button>
                  <img v-if="p.url !=null && p.url !='null'" :src="p.url" />
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
import {list, check, update,del} from "@/api/question"
export default {
  name:"Subject",
    data(){
        return {
          formItem:{
            dynamicTags:[],//添加的标签数组
          },
          inputVisible: false,//编辑时，标签使用
          inputValue: '',//编辑时，标签使用
          editVal:{},//编辑时对象的值
          modal1: false,//编辑框
          select_type:'',//题型过滤
          searchName:'',
          curr_sec:'',
          value1:[],
          data :[],
          selected_category:'',
          card_data:[],
          show_answer:[],
          index_op_key:[],
          options: [{
            value: '1',
            label: '单选题'
          }, {
            value: '2',
            label: '填空题'
          }, {
            value: '3',
            label: '简答题'
          }]
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

    },
  methods:{
    toPage(){
      this.$router.push({ path:'/add_subject'})
    },
    del(p){
      var id = p.id;
      console.info(id)
      this.$confirm('将删除该题目, 是否确定?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        del({"id":id}).then(res =>{
          if(res.data.code === 0){
            this.search()
          }else{
          }
        });
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    },
    change(e) {
      this.$forceUpdate()
    },
    /*表单更新*/
    onUpdate() {
      console.log('submit!');
      console.info(this.formItem)
      //var tags = this.formItem.dynamicTags;
      update({"id":this.formItem.id,"category":this.formItem.category,"name":this.formItem.name,"dynamicTags":this.formItem.dynamicTags,
        "type":this.formItem.type,"answer":this.formItem.answer_str,"remark":this.formItem.remark,"url":this.formItem.url}).then(res =>{
        if(res.data.code === 0){
          this.clearForm();
          this.search()
          this.$Message.success('操作成功');
        }else{
          this.$Message.error(res.data.msg);
        }

      });
    },
    clearForm(){
      this.formItem.name='';
      this.formItem.answer='';
      this.formItem.url = '';
      this.formItem.remark = '';
      this.formItem.dynamicTags.splice(0,this.formItem.dynamicTags.length)
    },
    showInput() {
      this.inputVisible = true;
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus();
      });
    },
    handleClose(tag) {
      console.info(this.formItem.dynamicTags)
      this.formItem.dynamicTags.splice(this.formItem.dynamicTags.indexOf(tag), 1);
      console.info(this.formItem.dynamicTags)
      this.inputVisible = true;
    },
    handleInputConfirm() {
      let inputValue = this.inputValue;
      if (inputValue) {
        this.formItem.dynamicTags.push(inputValue);
      }
      this.inputVisible = false;
      this.inputValue = '';
    },
    //打开窗口
    open(p){
      this.formItem = p;
      var type = this.formItem.type;
      this.formItem.dynamicTags=[]
      this.formItem.answer_str=''
      if(type ==1 || type ==3){//1或3时，需要把answer转换出来
        console.info("3333")
        if(this.formItem.answer !='' && this.formItem.answer !=undefined){
          var obj = JSON.parse(this.formItem.answer);
          if(obj.length>0){
            this.formItem.answer_str = obj[0].item;
          }
        }

      }
      if(type ==1){//单选题
        if(this.formItem.options !='' && this.formItem.options !=undefined){
          var obj = JSON.parse(this.formItem.options);
          for(var i=0;i<obj.length;i++){
            this.formItem.dynamicTags.push(obj[i].item)
          }
        }
      }else if(type==2){
        if(this.formItem.answer !='' && this.formItem.answer !=undefined){
          var obj = JSON.parse(this.formItem.answer);
          for(var i=0;i<obj.length;i++){
            this.formItem.dynamicTags.push(obj[i].item)
          }
        }
      }
      this.modal1=true
    },
    ok() {
      // this.$Message.info('Clicked ok');
      this.onUpdate();
    },
    cancel() {
      // this.$Message.info('Clicked cancel');
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
        list({category:selected_category,searchName:this.searchName,select_type:this.select_type}).then(res =>{
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
.el-tag + .el-tag {
  margin-left: 10px;
}
.button-new-tag {
  margin-left: 5px;
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}
.input-new-tag {
  width: 90px;
  margin-left: 10px;
  vertical-align: bottom;
}
 >>> .ivu-card-head {
  border-bottom: 1px solid #e8eaec;
  padding: 14px 16px;
  padding-right: 75px;
  line-height: 1;
}
  .red_color{
    color:red
  }
  .my_tabs{
    margin:15px;
  }
  .demobox{height:30px;line-height:30px;overflow:hidden;display:block;}
</style>
