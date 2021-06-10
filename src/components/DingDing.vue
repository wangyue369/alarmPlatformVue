<template>
  <div>
    <!-- 面包屑导航区 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>告警渠道管理</el-breadcrumb-item>
      <el-breadcrumb-item>钉钉告警</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片试图 -->
    <el-card>
      <!-- 搜索与添加区域 -->
      <el-row :gutter="10">
        <el-col :span="6">
          <el-input placeholder="请输入内容">
            <el-button slot="append"
                       icon="el-icon-search"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary">添加</el-button>
        </el-col>
      </el-row>
      <!-- 用户列表区域 -->
      <el-table :data="result"
                border
                stripe>
        <el-table-column type="index"
                         label="#"></el-table-column>
        <el-table-column label="告警渠道名称"
                         prop="channel_name"></el-table-column>
        <el-table-column label="告警渠道地址"
                         prop="channel_access"></el-table-column>
        <el-table-column label="创建时间"
                         prop="create_time"></el-table-column>
        <el-table-column label="修改时间"
                         prop="update_time"></el-table-column>
        <el-table-column label="是否启用">
          <template slot-scope="scope">
            <!-- {{ scope.row }} -->
            <el-switch v-model="scope.row.is_active"
                       @change="changeState(scope.row)">
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作"
                         width="180px">
          <template>
            <el-tooltip effect="dark"
                        content="修改"
                        placement="top"
                        :enterable="false">
              <el-button type="primary"
                         icon="el-icon-edit"
                         size="mini"></el-button>
            </el-tooltip>
            <el-tooltip effect="dark"
                        content="删除"
                        placement="top"
                        :enterable="false">
              <el-button type="danger"
                         icon="el-icon-delete"
                         size="mini"></el-button>
            </el-tooltip>
            <el-tooltip effect="dark"
                        content="设置"
                        placement="top"
                        :enterable="false">
              <el-button type="warning"
                         icon="el-icon-setting"
                         size="mini"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页区域 -->
      <el-pagination @size-change="handleSizeChange"
                     @current-change="handleCurrentChange"
                     :current-page="queryParm.pagenum"
                     :page-sizes="[10, 20, 50, 100]"
                     :page-size="queryParm.pagesize"
                     layout="total, sizes, prev, pager, next, jumper"
                     :total="total">
      </el-pagination>
    </el-card>
  </div>
</template>

<script>
export default {
  data () {
    return {
      queryParm: {
        channel_type: 'dingding',
        pagenum: 1,
        pagesize: 10
      },
      result: [],
      total: 0
    }
  },
  created () {
    this.getData()
  },
  methods: {
    async getData () {
      const { data: res } = await this.$http.get('alarmChannel/get.json', {
        params: this.queryParm
      })
      if (res.status !== 200) {
        return this.$message.error(res.message)
      }
      this.result = res.data.data
      this.total = res.data.total
      console.log(res)
    },
    // 监听 页码 改变事件
    handleSizeChange (newsize) {
      console.log(newsize)
      this.queryParm.pagesize = newsize
      this.getData()
    },
    // 监听 页码值 改变
    handleCurrentChange (newpage) {
      console.log(newpage)
      this.queryParm.pagenum = newpage
      this.getData()
    },
    // 改变状态
    async changeState (result) {
      const { data: res } = await this.$http.post('alarmChannel/update.json', {
        channel_id: result.channel_id,
        channel_name: result.channel_name,
        channel_access: result.channel_access,
        is_active: result.is_active
      })
      if (res.status !== 200) {
        return this.$message.error(res.message)
      }
    }
  }
}
</script>

<style lang="less" scoped>
.el-breadcrumb {
  margin-bottom: 15px;
  font-size: 12px;
}
.el-card {
  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.15) !important;
}
.el-table {
  margin-top: 15px;
  font-size: 12px;
}
</style>
