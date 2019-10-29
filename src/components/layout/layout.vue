<template>
    <div class="layout">
        <Layout>
            <Header>
                <Row type="flex" justify="start" style="height:63px;">
                  <Col :xs="0" :md="2" :sm="0">
                    <!-- <div class="layout-logo"> -->
                      <img style="width:100px;height:50px;" src="https://file.iviewui.com/dist/e1cf12c07bf6458992569e67927d767e.png" alt="">
                    <!-- </div> -->
                  </Col>
                  <Col span="18">
                    <Row type="flex" justify="start">
                      <Col span="14" :xs="24" :md="6" :sm="6">
                        <Menu @on-select="selected" accordion mode="horizontal" theme="light" :active-name="activeName">
                            <div class="layout-nav" >
                                <MenuItem v-for="(p, index) in oneLevelMenu" :key="index" :name="p.id">
                                    <Icon :type="p.icon"></Icon>
                                    {{p.title}}
                                </MenuItem>
                            </div>
                        </Menu>
                      </Col>
                    </Row>
                  </Col>
                  <Col span="4">
                    <Row type="flex" justify="end">
                      <Col :xs="0" :md="2" :sm="0">
                        <Dropdown>
                          <Avatar style="background-color: #87d068" icon="ios-person" />
                          <DropdownMenu slot="list">
                              <DropdownItem>个人信息</DropdownItem>
                              <DropdownItem>修改密码</DropdownItem>
                              <DropdownItem divided>退出登录</DropdownItem>
                          </DropdownMenu>
                        </Dropdown>
                      </Col>
                    </Row>
                  </Col>
                </Row>


            </Header>
            <Layout>
                <Sider hide-trigger breakpoint="md" collapsible :collapsed-width="78" v-model="isCollapsed">
                    <Menu theme="dark" width="auto" @on-select="LeftSelected" :class="menuitemClasses">
                        <Submenu v-for="(p, index) in twoLevelMenu" :key="index" :name="p.id">
                            <template slot="title">
                                <Icon :type="p.icon"></Icon>
                                {{p.title}}
                            </template>
                              <MenuItem v-for="(p_menu, menu_index) in p.children" :key="menu_index" :name="p_menu.url" :url="p_menu.id">{{p_menu.title}}</MenuItem>
                        </Submenu>

                    </Menu>
                </Sider>
                <Layout :style="{margin:'5px 5px 5px 5px'}">
                    <router-view/>
                    <!-- <Tabs value="name1" type="card">
                      <TabPane label="主页" name="name1"></TabPane>
                      <TabPane v-for="(p, index) in twoLevelMenu" :key="index" label="主页" name="name1">
                        <Content :style="{padding: '24px', minHeight: '280px', background: '#fff'}">
                            <router-view/>
                        </Content>
                      </TabPane>
                  </Tabs> -->
                    <!-- <Breadcrumb :style="{margin: '24px 0'}">
                        <BreadcrumbItem to="/">主页</BreadcrumbItem>
                        <BreadcrumbItem to="/about">{{this.$route.name}}</BreadcrumbItem>
                        <BreadcrumbItem>Layout</BreadcrumbItem>
                    </Breadcrumb> -->

                </Layout>
            </Layout>
        </Layout>
    </div>
</template>
<script>
    import {send,twoLevelMenu} from "@/api/user"

    export default {
      data(){
        return {
          isCollapsed: false,
          activeName : 1,
          openNameTwo:[],
          // currentMenu:{},
          oneLevelMenu:[],
          twoLevelMenu:{}
        }
      },
      created(){
          //获取一级菜单
          send({user_id:1}).then(res =>{
            this.oneLevelMenu = res.data.data;
            this.activeName = res.data.data[0].id;
            //获取二级菜单
            twoLevelMenu({user_id:1,oneLevelMenu:this.activeName}).then(res =>{
              this.twoLevelMenu = res.data.data;
              this.openNameTwo.push(res.data.data[0].id)
            })
          //th
          })
      },
      methods:{
        selected(name){
          this.twoLevelMenu = [];
          //获取二级菜单
          twoLevelMenu({user_id:1,oneLevelMenu:name}).then(res =>{
            this.twoLevelMenu = res.data.data;
          })
          //this.$router.push(name)

        },LeftSelected(name){
          this.$router.push(name)
        }
      },
        computed: {
            menuitemClasses: function () {
                return [
                    'menu-item',
                    this.isCollapsed ? 'collapsed-menu' : ''
                ]
            },
            menuitemClasses () {
                return [
                    'menu-item',
                    this.isCollapsed ? 'collapsed-menu' : ''
                ]
            }
        }
    }
</script>
<style scoped>
    .collapsed-menu span{
        width: 0px;
        transition: width .2s ease;
    }
    .collapsed-menu i{
        transform: translateX(5px);
        transition: font-size .2s ease .2s, transform .2s ease .2s;
        vertical-align: middle;
        font-size: 22px;
    }

    .ivu-layout{
      height:100%;
    }
    .ivu-menu-horizontal{
      height:0px;
    }
.layout{
  height:100%;
    border: 1px solid #d7dde4;
    background: #f5f7f9;
    position: relative;
    border-radius: 4px;
    overflow: hidden;
}
.ivu-layout-header{
  background:#fff
}
.layout-logo{
    width: 30px;
    height: 30px;
    /* background: #5b6270; */
    /* background-image: "public"; */
    border-radius: 3px;
    float: left;
    position: relative;
    top: 9px;
    left: 20px;
}
.layout-nav{
    width: 420px;
    margin-left: 10%;
    /* margin: 0 auto; */
    /* margin-right: 20px; */
}
</style>
