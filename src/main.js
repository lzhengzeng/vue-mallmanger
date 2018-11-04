// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import '@/assets/index.css'
import HttpTool from '@/pulign/http.js'
import ElementUI from 'element-ui'
import moment from 'moment'
import MyBread from '@/components/MyBread'
import 'element-ui/lib/theme-chalk/index.css'
Vue.config.productionTip = false
Vue.use(ElementUI)

Vue.use(HttpTool)
/* eslint-disable no-new */
Vue.component(MyBread.name,MyBread)
// 写一个全局过滤器
Vue.filter('fmtData', function (v) {
  return moment(v).format('YYYY-MM-DD')
})
new Vue({
  el: '#app',
  router,
  components: {
    App
  },
  template: '<App/>'
})
