import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
// 导入全局样式
import './assets/css/global.css'
// 导入字体图标
import './assets/fonts/iconfont.css'
import axios from 'axios'

// 配置全局路由
axios.defaults.baseURL = 'http://127.0.0.1:9000/alarm/'
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
