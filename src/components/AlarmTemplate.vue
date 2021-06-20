<template>
  <div>
    <!-- 面包屑导航区 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>告警模板管理</el-breadcrumb-item>
      <el-breadcrumb-item>模板列表</el-breadcrumb-item>
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
                     @click="templateVisible=true">添加</el-button>
        </el-col>
      </el-row>
      <!-- 告警渠道列表区域 -->
      <el-table :data="result"
                border
                stripe>
        <el-table-column type="index"
                         label="#"></el-table-column>
        <el-table-column label="告警模板名称"
                         prop="template_name"></el-table-column>
        <el-table-column label="告警模板类型"
                         prop="template_type"></el-table-column>
        <!-- 告警模板 -->
        <el-table-column show-overflow-tooltip
                         label="模板内容"
                         prop="template_content">
        </el-table-column>
        <el-table-column label="创建时间"
                         prop="create_time"></el-table-column>
        <el-table-column label="修改时间"
                         prop="update_time"></el-table-column>
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
                         @click="editTemplate(scope.row.template_id,scope.row.template_type,scope.row.template_name,scope.row.template_content)"></el-button>
            </el-tooltip>
            <el-tooltip effect="dark"
                        content="删除"
                        placement="top"
                        :enterable="false">
              <el-button type="danger"
                         icon="el-icon-delete"
                         size="mini"
                         @click="deleteTemplateById(scope.row.template_id)"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页区域 -->
      <el-pagination @size-change="handleSizeChange"
                     @current-change="handleCurrentChange"
                     :current-page="queryParm.pagenum"
                     :page-sizes="[10, 20, 50, 100]"
                     :page-size="10"
                     layout="total, sizes, prev, pager, next, jumper"
                     :total="total">
      </el-pagination>
    </el-card>
    <!-- 添加告警模板对话框 -->
    <el-dialog title="添加告警模板"
               :visible.sync="templateVisible"
               width="30%"
               @close="templateDialogClosed">
      <!-- 内容主题区 -->
      <el-form :model="templateForm"
               :rules="templateFormRules"
               ref="createTemplateFormRef"
               label-width="80px">
        <el-form-item label="模板类型"
                      prop="template_type">
          <el-select v-model="templateForm.template_type"
                     placeholder="请选择模板类型">
            <el-option label="企业微信"
                       value="weixin"></el-option>
            <el-option label="钉钉"
                       value="dingding"></el-option>
            <el-option label="飞书"
                       value="feishu"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="模板名称"
                      prop="template_name">
          <el-input v-model="templateForm.template_name"></el-input>
        </el-form-item>
        <el-form-item label="模板内容"
                      prop="template_content">
          <el-input type="textarea"
                    :rows="20"
                    :placeholder="create_template_content['weixin']"
                    v-model="templateForm.template_content"></el-input>
        </el-form-item>
      </el-form>>
      <!-- 内容底部区 -->
      <span slot="footer"
            class="dialog-footer">
        <el-button @click="templateVisible = false">取 消</el-button>
        <el-button type="primary"
                   @click="addTemplate">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 编辑告警模板对话框 -->
    <el-dialog title="提示"
               :visible.sync="editTemplateDialogVisible"
               width="50%"
               @close="editTemplateDialogClosed">
      <!-- 修改对话框内容区 -->
      <el-form :model="editTemplateForm"
               :rules="editTemplateFormRules"
               ref="editTemplateFormRef"
               label-width="80px">
        <el-form-item label="模板类型"
                      prop="template_type">
          <el-input :disabled="true"
                    v-model="editTemplateForm.template_type"></el-input>
        </el-form-item>
        <el-form-item label="模板名称"
                      prop="template_name">
          <el-input v-model="editTemplateForm.template_name"></el-input>
        </el-form-item>
        <el-form-item label="模板内容"
                      prop="template_content">
          <el-input type="textarea"
                    :rows="20"
                    v-model="editTemplateForm.template_content"></el-input>
        </el-form-item>
      </el-form>
      <!-- 编辑对话框底部区 -->
      <span slot="footer"
            class="dialog-footer">
        <el-button @click="editTemplateDialogVisible = false">取 消</el-button>
        <el-button type="primary"
                   @click="updateTemplate">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      templateVisible: false,
      editTemplateDialogVisible: false,
      result: [],
      total: 0,
      create_template_content: {
        dingding: 'sdasdasdada\nsdasdsadad\nsdsadasd',
        weixin: 'weixinweixinweixin\nweixi\n',
        feishu: 'sdsdasdsad\nsdasdsada\n'
      },
      templateForm: {
        template_type: '',
        template_name: '',
        template_content: ''
      },
      editTemplateForm: {
        template_id: '',
        template_type: '',
        template_name: '',
        template_content: ''
      },
      queryParm: {
        search: '',
        pagenum: 1,
        pagesize: 10
      },
      // 表单的验证规则数据
      templateFormRules: {
        template_type: [
          { required: true, message: '请选择模板类型', trigger: 'change' }
        ],
        template_name: [
          { required: true, message: '请输入模板名称', trigger: 'blur' },
          {
            min: 3,
            max: 30,
            message: '用户名在3~30个字符之间',
            trigger: 'blur'
          }
        ],
        template_content: [
          { required: true, message: '请输入模板内容', trigger: 'blur' },
          {
            min: 2,
            max: 5000,
            message: '用户名在3~50000个字符之间',
            trigger: 'blur'
          }
        ]
      },
      // 表单的验证规则数据
      editTemplateFormRules: {
        template_type: [
          { required: true, message: '请选择模板类型', trigger: 'change' }
        ],
        template_name: [
          { required: true, message: '请输入模板名称', trigger: 'blur' },
          {
            min: 2,
            max: 30,
            message: '用户名在3~30个字符之间',
            trigger: 'blur'
          }
        ],
        template_content: [
          { required: true, message: '请输入模板内容', trigger: 'blur' },
          {
            min: 3,
            max: 5000,
            message: '用户名在3~50000个字符之间',
            trigger: 'blur'
          }
        ]
      }
    }
  },
  created() {
    this.getData()
  },
  methods: {
    async getData() {
      console.log('33333333')
      const { data: res } = await this.$http.get('alarmTemplate/get.json', {
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
    handleSizeChange(newsize) {
      console.log(newsize)
      this.queryParm.pagesize = newsize
      this.queryParm.pagenum = 1
      this.getData()
    },
    // 监听 页码值 改变
    handleCurrentChange(newpage) {
      console.log(newpage)
      this.queryParm.pagenum = newpage
      this.getData()
    },
    templateDialogClosed() {
      this.$refs.createTemplateFormRef.resetFields()
    },
    addTemplate() {
      this.$refs.createTemplateFormRef.validate(async (valid) => {
        if (!valid) return
        const formdata = new FormData()
        formdata.append('template_type', this.templateForm.template_type)
        formdata.append('template_name', this.templateForm.template_name)
        formdata.append('template_content', this.templateForm.template_content)
        const { data: res } = await this.$http.post(
          'alarmTemplate/create.json',
          formdata,
          {
            headers: {
              'Content-Type':
                'multipart/form-data; boundary=----WebKitFormBoundaryn8D9asOnAnEU4Js0'
            }
          }
        )
        console.log(res)
        if (res.status !== 200) {
          return this.$message.error(res.message)
        }
        this.$message.success('添加模板成功')
        this.templateVisible = false
        this.getData()
      })
    },
    editTemplate(templateId, templateType, templateName, templateContent) {
      this.editTemplateForm.template_type = templateType
      this.editTemplateForm.template_id = templateId
      this.editTemplateForm.template_name = templateName
      this.editTemplateForm.template_content = templateContent
      this.editTemplateDialogVisible = true
    },
    editTemplateDialogClosed() {
      this.$refs.editTemplateFormRef.resetFields()
    },
    updateTemplate() {
      this.$refs.editTemplateFormRef.validate(async (valid) => {
        if (!valid) return
        const { data: res } = await this.$http.post(
          'alarmTemplate/update.json',
          {
            template_id: this.editTemplateForm.template_id,
            template_name: this.editTemplateForm.template_name,
            template_content: this.editTemplateForm.template_content
          }
        )
        if (res.status !== 200) {
          return this.$message.error(res.message)
        }
        this.$message.success('更新成功')
        this.editTemplateDialogVisible = false
        this.getData()
      })
    },
    async deleteTemplateById(templateId) {
      console.log(templateId)
      // 弹窗询问
      const resultConfirm = await this.$confirm(
        '此操作将永久删除该渠道, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).catch((err) => err) // 捕获错误返回给 resultConfirm
      console.log(resultConfirm)
      if (resultConfirm !== 'confirm') {
        return this.$message.info('已取消删除')
      }
      const { data: res } = await this.$http.post('alarmTemplate/delete.json', {
        template_id: templateId
      })
      if (res.status !== 200) {
        return this.$message.error(res.message)
      }
      this.$message.success('删除模板成功')
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
