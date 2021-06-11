import Vue from 'vue'
import VueRouter from 'vue-router'
import AlarmHistory from '../components/AlarmHistory.vue'
import AlarmTemplate from '../components/AlarmTemplate.vue'
import AlarmType from '../components/AlarmType.vue'
import ChartManager from '../components/ChartManager.vue'
import DingDing from '../components/DingDing.vue'
import feishu from '../components/FeiShu.vue'
import Home from '../components/Home.vue'
import PermissionManager from '../components/PermissionManager.vue'
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
      { path: '/feishu', component: feishu },
      { path: '/alarm_template', component: AlarmTemplate },
      { path: '/alarm_history', component: AlarmHistory },
      { path: '/alarm_type', component: AlarmType },
      { path: '/chart_manager', component: ChartManager },
      { path: '/permission_manager', component: PermissionManager }
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
