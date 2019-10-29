import Vue from 'vue'
import Router from 'vue-router'
import routes from './router'


Vue.use(Router)
/**
 * 重写路由的push方法
 */
const routerPush = Router.prototype.push
Router.prototype.push = function push(location) {
  return routerPush.call(this, location).catch(error=> error)
}
export default new Router({
  mode: 'history',
  routes
})
