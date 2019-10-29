<template>
  <div>
    <div class="head">
      <Row>
          <i-col :xs="6" :sm="6" :md="2" :lg="3"><Cascader :data="data" :value.sync="value1" @on-change="handleChange" change-on-select></Cascader></i-col>
          <!-- <i-col :offset="1" :xs="6" :sm="6" :md="3" :lg="3"><i-button type="primary" icon="ios-search" @click="btn_search">查询</i-button></i-col> -->
      </Row><br>
      <Row>
        <i-col span="24">
              <Tabs type="card">
                  <!-- 填空题 -->
                  <Tab-pane label="填空题">
                      <el-form ref="formItem" :model="formItem" label-width="80px">
                        <el-form-item label="题目">
                          <el-input v-model="name" style="width: 400px;"></el-input>
                        </el-form-item>
                      </el-form>
                      <el-tag style="margin-left: 30px;" :key="tag" v-for="tag in formItem.dynamicTags" closable :disable-transitions="false"
                        @close="handleClose(tag)">
                        {{tag}}
                      </el-tag>
                      <el-input style="margin-left: 30px;" class="input-new-tag" v-if="inputVisible" v-model="inputValue"
                        ref="saveTagInput" size="small" @keyup.enter.native="handleInputConfirm" @blur="handleInputConfirm" >
                      </el-input>
                      <el-button style="margin-left: 35px;" v-else class="button-new-tag" size="small" @click="showInput">+ New Tag</el-button><br><br>
                      <el-button style="margin-left: 35px;" type="primary" @click="onSubmit(2)">立即创建</el-button>
                      <el-button @click="resetForm('formItem')">重置</el-button>
                  </Tab-pane>
                  <!-- 简答题 -->
                  <Tab-pane label="简答题">
                    <el-form ref="formItem" :model="formItem" label-width="80px">
                      <el-form-item label="题目">
                        <el-input v-model="name" style="width: 400px;"></el-input>
                      </el-form-item>
                      <el-form-item label="答案">
                        <el-input v-model="answer" style="width: 400px;"></el-input>
                      </el-form-item>
                    </el-form>
                    <el-button style="margin-left: 35px;" type="primary" @click="onSubmit(3)">立即创建</el-button>
                    <el-button @click="resetForm('formItem')">重置</el-button>
                  </Tab-pane>
                  <!-- 单选题 -->
                  <Tab-pane label="单选题">
                    <el-form ref="formItem" :model="formItem" label-width="80px">
                      <el-form-item label="题目">
                        <el-input v-model="name" style="width: 400px;"></el-input>
                      </el-form-item>
                      <el-form-item label="答案">
                        <el-input v-model="answer" style="width: 400px;"></el-input>
                      </el-form-item>
                    </el-form>
                    <el-tag style="margin-left: 30px;" :key="tag" v-for="tag in formItem.dynamicTags" closable :disable-transitions="false"
                      @close="handleClose(tag)">
                      {{tag}}
                    </el-tag>
                    <el-input style="margin-left: 30px;" class="input-new-tag" v-if="inputVisible" v-model="inputValue"
                      ref="saveTagInput" size="small" @keyup.enter.native="handleInputConfirm" @blur="handleInputConfirm" >
                    </el-input>
                    <el-button style="margin-left: 35px;" v-else class="button-new-tag" size="small" @click="showInput">+ New Tag</el-button><br><br>
                    <el-button style="margin-left: 35px;" type="primary" @click="onSubmit(1)">立即创建</el-button>
                    <el-button @click="resetForm('formItem')">重置</el-button>
                  </Tab-pane>
                  <!-- <Tab-pane label="多选题">标签三的内容</Tab-pane> -->
              </Tabs>
        </i-col>
      </Row>
    </div>
  </div>
</template>
<script>
import {category} from "@/api/params"
import {list,check,save} from "@/api/question"
export default {
  data(){
    return {
      formItem:{
        dynamicTags:[],//添加的标签数组
      },
      name:'',
      answer:'',
      inputVisible: false,
      inputValue: '',
      data :[],
      value1:[]
    }
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
      }

    },
  methods: {
    handleClose(tag) {
      this.formItem.dynamicTags.splice(this.formItem.dynamicTags.indexOf(tag), 1);
    },
    showInput() {
      this.inputVisible = true;
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus();
      });
    },
    handleInputConfirm() {
      let inputValue = this.inputValue;
      if (inputValue) {
        this.formItem.dynamicTags.push(inputValue);
      }
      this.inputVisible = false;
      this.inputValue = '';
    },
    /*表单提交,填空题*/
    onSubmit(type) {
      console.log('submit!');
      console.info(this.formItem)
      var selected_category = localStorage.getItem("selected_category");
      if(selected_category ===null){
        this.$Message.error('未选择分类');
        return;
      }
      //var tags = this.formItem.dynamicTags;
      save({"name":this.name,"dynamicTags":this.formItem.dynamicTags,"type":type,"answer":this.answer}).then(res =>{
        if(res.data.code === 0){
          this.clearForm();
          this.$Message.success('操作成功');
        }else{
          this.$Message.error(res.data.msg);
        }

      });
    },
    clearForm(){
      this.name='';
      this.answer='';
      this.formItem.dynamicTags.splice(0,this.formItem.dynamicTags.length)
    },
    /*重置*/
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    handleChange(e1){
        for(var i=0;i<e1.length;i++){
          this.value1.splice(i,1,e1[i])
        }
        localStorage.setItem("selected_category",JSON.stringify(this.value1));
        let selected = e1[e1.length-1];
        this.selected_category = selected;
        // this.btn_search(selected);
      }
  },
}
</script>
<style>
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
</style>
