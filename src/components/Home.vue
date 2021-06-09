<template>
  <el-container direction="vertical">
    <!-- 头部区域 -->
    <el-header>
      <div>
        <img src="../assets/alarm.png"
             alt="">
        <span>运维告警平台</span>
      </div>
    </el-header>
    <!-- 侧面主题区域 -->
    <el-container>
      <!-- 侧边栏 -->
      <el-aside width="200px">
        <el-menu background-color="#545c64"
                 text-color="#fff"
                 active-text-color="#ffd04b">
          <!-- 一级菜单 -->
          <el-submenu index="1">
            <!-- 一级菜单的模板区 -->
            <template slot="title">
              <!-- 图标 -->
              <i class="el-icon-bell"></i>
              <!-- 文本 -->
              <span>告警渠道</span>
            </template>
            <!-- 二级菜单 -->
            <el-menu-item index="1-4-1">
              <template slot="title">
                <!-- 图标 -->
                <i class="iconfont icon-qiyeweixin"></i>
                <!-- 文本 -->
                <span>企业微信</span>
              </template>
            </el-menu-item>

            <el-menu-item index="1-4-1">
              <template slot="title">
                <!-- 图标 -->
                <i class="iconfont icon-dingtalk"></i>
                <!-- 文本 -->
                <span>钉钉</span>
              </template>
            </el-menu-item>

            <el-menu-item index="1-4-1">
              <template slot="title">
                <!-- 图标 -->
                <i class="iconfont icon-zhifeiji"></i>
                <!-- 文本 -->
                <span>飞书</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <!-- 右侧内容主体 -->
      <el-main>Main</el-main>
    </el-container>
  </el-container>
</template>
<script>
export default {
  name: 'Home'
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
}
.el-main {
  background-color: #eaedf1;
}
.iconfont {
  margin-right: 6px;
}
</style>
