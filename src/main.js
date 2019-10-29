import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import Layout from '@/components/layout/layout.vue'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import iView from 'iview';
import 'iview/dist/styles/iview.css';
import redis from './api/redis'

Vue.use(iView)
Vue.use(ElementUI);
Vue.config.productionTip = false
Vue.component('layout',Layout)
Vue.prototype.redis = redis;

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
