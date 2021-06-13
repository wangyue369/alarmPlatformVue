import axios from 'axios'
import Vue from 'vue'
import App from './App.vue'
// 导入全局样式
import './assets/css/global.css'
// 导入字体图标
import './assets/fonts/iconfont.css'
import './plugins/element.js'
import router from './router'

// 配置全局路由
axios.defaults.baseURL = 'https://alarm.wy1212.cn/alarm/'
Vue.prototype.$http = axios
// 设置拦截器
// axios.interceptors.request.use(config => {
//   // console.log(config)
//   config.headers.Authorization = window.sessionStorage.getItem('token')
//   return config
// })
Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
