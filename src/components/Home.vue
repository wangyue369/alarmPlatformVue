<template>
  <el-container direction="vertical">
    <!-- 头部区域 -->
    <el-header>
      <div>
        <img src="../assets/alarm.png"
             alt="" />
        <span>运维告警平台</span>
      </div>
    </el-header>
    <!-- 侧面主题区域 -->
    <el-container>
      <!-- 侧边栏 -->
      <el-aside :width="isCollapse ? '64px' : '200px'">
        <div class="toggle-button"
             @click="toggleCollapse">|||</div>
        <el-menu background-color="#333744"
                 text-color="#fff"
                 active-text-color="#409EFF"
                 unique-opened
                 :collapse="isCollapse"
                 :collapse-transition="false"
                 :router="true"
                 :default-active="activePath">
          <!-- 一级菜单 -->
          <el-submenu :index="item.pk + ' '"
                      v-for="item in menulist"
                      :key="item.pk">
            <!-- 一级菜单的模板区 -->
            <template slot="title">
              <!-- 图标 -->
              <i class="el-icon-menu"></i>
              <!-- 文本 -->
              <span>{{ item.name }}</span>
            </template>
            <!-- 二级菜单 -->
            <el-menu-item :index="'/' + subItem.fields.level_two_type"
                          v-for="subItem in item.childs"
                          :key="subItem.pk"
                          @click="savenavState('/' + subItem.fields.level_two_type)">
              <template slot="title">
                <!-- 图标 -->
                <i class="el-icon-bell"></i>
                <!-- 文本 -->
                <span>{{ subItem.fields.level_two_name }}</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <!-- 右侧内容主体 -->
      <el-main>
        <!-- 路由占位符 -->
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>
<script>
export default {
  data () {
    return {
      menulist: [],
      isCollapse: false,
      // 被激活的链接地址
      activePath: ''
    }
  },
  created () {
    this.getMenuList()
    this.activePath = window.sessionStorage.getItem('activePath')
  },
  methods: {
    async getMenuList () {
      const { data: res } = await this.$http.get('navigation/get.json')
      if (res.status !== 200) return this.$message.error(res.message)
      this.menulist = res.data
      console.log(res)
    },
    toggleCollapse () {
      // 点击展开关闭导航菜单
      this.isCollapse = !this.isCollapse
    },
    // 保存链接的机会状态
    savenavState (activePath) {
      console.log(activePath)
      window.sessionStorage.setItem('activePath', activePath)
      this.activePath = activePath
    }
  }
}
</script>
<style lang="less" scoped>
.el-container {
  height: 100%;
}
.el-header {
  background-color: #373d41;
  display: flex;
  justify-content: space-between;
  padding-left: 0;
  align-items: center;
  color: #fff;
  font-size: 20px;
  > div {
    display: flex;
    align-items: center;
    img {
      width: 50px;
      height: 50px;
      margin-right: 15px;
    }
  }
}
.el-aside {
  background-color: #333744;
  .el-menu {
    border-right: 0;
  }
}
.el-main {
  background-color: #eaedf1;
}
.iconfont {
  margin-right: 6px;
}
.toggle-button {
  background-color: #4a5064;
  font-size: 10px;
  line-height: 24px;
  color: #fff;
  text-align: center;
  letter-spacing: 0.2em;
  cursor: pointer;
}
</style>
