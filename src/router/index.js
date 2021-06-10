import Vue from 'vue'
import VueRouter from 'vue-router'
import DingDing from '../components/DingDing.vue'
import feishu from '../components/FeiShu.vue'
import Home from '../components/Home.vue'
import weixin from '../components/WeiXin.vue'
import Welcome from '../components/Welcome.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/home',
    component: Home,
    redirect: '/welcome',
    children: [
      { path: '/welcome', component: Welcome },
      { path: '/dingding', component: DingDing },
      { path: '/weixin', component: weixin },
      { path: '/feishu', component: feishu }
    ]
  },
  {
    path: '/',
    redirect: '/home'
  }
]

const router = new VueRouter({
  routes
})

export default router
