<template>
  <div>
    <!-- 面包屑导航区 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>告警渠道管理</el-breadcrumb-item>
      <el-breadcrumb-item>{{ typeJson[this.channelType] }}</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片试图 -->
    <el-card>
      <!-- 搜索与添加区域 -->
      <el-row :gutter="10">
        <el-col :span="6">
          <el-input placeholder="请输入内容"
                    v-model="queryParm.search"
                    clearable
                    @clear="getData">
            <el-button slot="append"
                       icon="el-icon-search"
                       @click="getData"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary"
                     @click="dialogVisible=true">添加</el-button>
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
        <el-table-column label="是否启用"
                         width="120px">
          <template slot-scope="scope">
            <!-- {{ scope.row }} -->
            <el-switch v-model="scope.row.is_active"
                       @change="changeState(scope.row)">
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作"
                         width="180px">
          <template slot-scope="scope">
            <el-tooltip effect="dark"
                        content="修改"
                        placement="top"
                        :enterable="false">
              <el-button type="primary"
                         icon="el-icon-edit"
                         size="mini"
                         @click="editChannel(scope.row.channel_id,scope.row.channel_name,scope.row.channel_access,scope.row.is_active)"></el-button>
            </el-tooltip>
            <el-tooltip effect="dark"
                        content="删除"
                        placement="top"
                        :enterable="false">
              <el-button type="danger"
                         icon="el-icon-delete"
                         size="mini"
                         @click="deleteChannelById(scope.row.channel_id)"></el-button>
            </el-tooltip>
            <!-- <el-tooltip effect="dark"
                        content="设置"
                        placement="top"
                        :enterable="false">
              <el-button type="warning"
                         icon="el-icon-setting"
                         size="mini"></el-button>
            </el-tooltip> -->
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
    <!-- 添加对话框 -->
    <el-dialog title="添加告警渠道"
               :visible.sync="dialogVisible"
               width="30%"
               @close="dialogClosed">
      <!-- 内容主题区 -->
      <el-form :model="channelForm"
               :rules="channelFormRules"
               ref="channelFormRef"
               label-width="80px">
        <el-form-item label="渠道名称"
                      prop="channel_name">
          <el-input v-model="channelForm.channel_name"></el-input>
        </el-form-item>
        <el-form-item label="渠道地址"
                      prop="channel_access">
          <el-input v-model="channelForm.channel_access"></el-input>
        </el-form-item>
        <el-form-item label="是否启用"
                      prop="is_active">
          <el-switch v-model="channelForm.is_active"></el-switch>
        </el-form-item>
      </el-form>
      <!-- 内容底部区 -->
      <span slot="footer"
            class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary"
                   @click="addChannel">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 修改对话框 -->
    <el-dialog title="提示"
               :visible.sync="editCHannelDialogVisible"
               width="50%"
               @close="editDialogClosed">
      <!-- 修改对话框内容区 -->
      <el-form :model="editChannelForm"
               :rules="editChannelFormRules"
               ref="editChannelFormRef"
               label-width="80px">
        <el-form-item label="渠道名称"
                      prop="channel_name">
          <el-input v-model="editChannelForm.channel_name"></el-input>
        </el-form-item>
        <el-form-item label="渠道地址"
                      prop="channel_access">
          <el-input v-model="editChannelForm.channel_access"></el-input>
        </el-form-item>
        <el-form-item label="是否启用"
                      prop="is_active">
          <el-switch v-model="editChannelForm.is_active"></el-switch>
        </el-form-item>
      </el-form>
      <!-- 编辑对话框底部区 -->
      <span slot="footer"
            class="dialog-footer">
        <el-button @click="editCHannelDialogVisible = false">取 消</el-button>
        <el-button type="primary"
                   @click="updateChannel">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  props: {
    channelType: String
  },
  data () {
    return {
      typeJson: {
        dingding: '钉钉渠道',
        weixin: '企业微信渠道',
        feishu: '飞书渠道'
      },
      queryParm: {
        search: '',
        channel_type: this.channelType,
        pagenum: 1,
        pagesize: 10
      },
      result: [],
      total: 0,
      // 控制添加对话框的显示与否
      dialogVisible: false,
      // 创建渠道表单数据
      channelForm: {
        channel_type: this.channelType,
        channel_name: '',
        channel_access: '',
        is_active: true
      },
      // 表单的验证规则数据
      channelFormRules: {
        channel_name: [
          { required: true, message: '请输入渠道名称', trigger: 'blur' },
          { min: 3, max: 30, message: '用户名在3~30个字符之间', trigger: 'blur' }
        ],
        channel_access: [
          { required: true, message: '请输入渠道地址', trigger: 'blur' },
          { min: 3, max: 30, message: '用户名在3~1000个字符之间', trigger: 'blur' }
        ]
      },
      // 控制修改对话框的展示与否
      editCHannelDialogVisible: false,
      editChannelForm: {
        channel_id: '',
        channel_name: '',
        channel_access: '',
        is_active: true
      },
      editChannelFormRules: {
        channel_name: [
          { required: true, message: '请输入渠道名称', trigger: 'blur' },
          { min: 3, max: 30, message: '用户名在3~30个字符之间', trigger: 'blur' }
        ],
        channel_access: [
          { required: true, message: '请输入渠道地址', trigger: 'blur' },
          { min: 3, max: 30, message: '用户名在3~1000个字符之间', trigger: 'blur' }
        ]
      }
    }
  },
  created () {
    console.log(this.channelType)
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
      this.queryParm.pagenum = 1
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
        result.is_active = !result.is_active
        return this.$message.error(res.message)
      }
      this.$message.success('更新状态成功')
    },
    // 监听添加对话框关闭状态
    dialogClosed () {
      this.$refs.channelFormRef.resetFields()
    },
    // 点击添加按钮，创建渠道
    addChannel () {
      this.$refs.channelFormRef.validate(async vaild => {
        if (!vaild) return
        // 请求接口创建渠道
        const formdata = new FormData()
        formdata.append('channel_type', this.channelForm.channel_type)
        formdata.append('channel_name', this.channelForm.channel_name)
        formdata.append('channel_access', this.channelForm.channel_access)
        formdata.append('is_active', this.channelForm.is_active)
        const { data: res } = await this.$http.post('alarmChannel/create.json', formdata, { headers: { 'Content-Type': 'multipart/form-data; boundary=----WebKitFormBoundaryn8D9asOnAnEU4Js0' } })
        console.log(res)
        if (res.status !== 200) {
        return this.$message.error(res.message)
      }
        this.$message.success('添加渠道成功')
        this.dialogVisible = false
        this.getData()
      })
    },
    // 编辑修改
    editChannel (channelId, channelName, channelAccess, isActive) {
      this.editChannelForm.channel_id = channelId
      this.editChannelForm.channel_name = channelName
      this.editChannelForm.channel_access = channelAccess
      this.editChannelForm.is_active = isActive
      this.editCHannelDialogVisible = true
    },
    editDialogClosed () {
      this.$refs.editChannelFormRef.resetFields()
    },
    updateChannel () {
      this.$refs.editChannelFormRef.validate(async vaild => {
        if (!vaild) return
        // 请求接口创建渠道
        const { data: res } = await this.$http.post('alarmChannel/update.json', {
          channel_id: this.editChannelForm.channel_id,
          channel_name: this.editChannelForm.channel_name,
          channel_access: this.editChannelForm.channel_access,
          is_active: this.editChannelForm.is_active
        })
        if (res.status !== 200) {
          return this.$message.error(res.message)
        }
        this.$message.success('更新状态成功')
        this.editCHannelDialogVisible = false
        this.getData()
      })
    },
    async deleteChannelById (channelId) {
      console.log(channelId)
      // 弹窗询问
      const resultConfirm = await this.$confirm('此操作将永久删除该渠道, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err) // 捕获错误返回给 resultConfirm
      console.log(resultConfirm)
      if (resultConfirm !== 'confirm') {
        return this.$message.info('已取消删除')
      }
      const { data: res } = await this.$http.post('alarmChannel/delete.json', {
        channel_id: channelId
      })
      if (res.status !== 200) {
        return this.$message.error(res.message)
      }
      this.$message.success('删除渠道成功')
      this.getData()
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
  // table-layout: auto !important;
}
</style>
