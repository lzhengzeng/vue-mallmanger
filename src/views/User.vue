<template>
<!-- 面包屑 -->
<el-card class="box-card">
  <el-breadcrumb separator="/">
    <el-breadcrumb-item>首页</el-breadcrumb-item>
    <el-breadcrumb-item>用户管理</el-breadcrumb-item>
    <el-breadcrumb-item>用户列表</el-breadcrumb-item>
  </el-breadcrumb>
  <!-- 搜索框 -->
  <el-row class="searchArea">
    <el-col :span="24">
      <el-input placeholder="请输入内容" class='searchInput' v-model='searchVal'>
        <el-button slot="append" icon="el-icon-search" @click="checkUser()"></el-button>
      </el-input>
      <el-button
      type="success"
      @click='showaddUser()'
      >添加用户</el-button>
    </el-col>
  </el-row>
  <!-- 添加用户对话框 -->
  <el-dialog title="添加用户" :visible.sync="dialogFormVisibleAdd">
  <el-form :model="formData">
    <el-form-item label="用户名" :label-width="formLabelWidth">
      <el-input v-model="formData.username" autocomplete="off"></el-input>
    </el-form-item>
    <el-form-item label="密码" :label-width="formLabelWidth">
      <el-input v-model="formData.password" autocomplete="off"></el-input>
    </el-form-item>
    <el-form-item label="邮箱" :label-width="formLabelWidth">
      <el-input v-model="formData.email" autocomplete="off"></el-input>
    </el-form-item>
    <el-form-item label="电话" :label-width="formLabelWidth">
      <el-input v-model="formData.mobile" autocomplete="off"></el-input>
    </el-form-item>
  </el-form>
  <div slot="footer" class="dialog-footer">
    <el-button @click="dialogFormVisibleAdd = false">取 消</el-button>
    <el-button type="primary" @click="addUser()">确 定</el-button>
  </div>
</el-dialog>
<!-- 编辑用户对话框 -->
<el-dialog title="编辑用户" :visible.sync="dialogFormVisibleEdit">
  <el-form :model="formData">
    <el-form-item label="用户名" :label-width="formLabelWidth">
      <el-input v-model="formData.username" disabled autocomplete="off"></el-input>
    </el-form-item>
    <el-form-item label="邮箱" :label-width="formLabelWidth">
      <el-input v-model="formData.email" autocomplete="off"></el-input>
    </el-form-item>
    <el-form-item label="电话" :label-width="formLabelWidth">
      <el-input v-model="formData.mobile" autocomplete="off"></el-input>
    </el-form-item>
  </el-form>
  <div slot="footer" class="dialog-footer">
    <el-button @click="dialogFormVisibleEdit = false">取 消</el-button>
    <el-button type="primary" @click='showEditUser()'>确 定</el-button>
  </div>
</el-dialog>
<!-- 设置权限 -->
<el-dialog title="分配权限" :visible.sync="dialogFormVisibleSetRol">
  <el-form :model="formData">
      <el-form-item label="用户名" :label-width="formLabelWidth">
          {{currUserName}}
      </el-form-item>
      <el-form-item
      label="角色"
      :label-width="formLabelWidth"
      >
        <!-- el-select的v-model绑定的值如果和el-option的value值 一样
          就显示当前el-option的label
          注意: currRoleId是数值
          -->
          <el-select v-model='currentRolId'>
            <!-- 请选择 -->
            <el-option disabled label="请选择" :value='-1'>

            </el-option>
            <!-- 遍历数组 -->
              <el-option v-for="(item,index) in roles"
              :label="item.roleName"
              :key="index"
              :value="item.id">
              </el-option>
          </el-select>

      </el-form-item>

  </el-form>
  <div slot="footer" class="dialog-footer">
      <el-button @click="dialogFormVisibleSetRol = false">取 消</el-button>
      <el-button type="primary" @click="setRole()">确 定</el-button>
  </div>
</el-dialog>
  <!-- 表格 -->
  <el-table v-loading="loading" style="width: 100%" :data='tableData'>
    <el-table-column type='index' label="#" width="80">
    </el-table-column>
    <el-table-column prop="username" label="姓名" width="100">
    </el-table-column>
    <el-table-column prop="email" label="邮箱" width="180">
    </el-table-column>
    <el-table-column label="电话" prop="mobile" width="100">
    </el-table-column>
    <el-table-column label="创建日期" width="180">
      <template slot-scope="scope">
        {{scope.create_time | fmtData}}
      </template>

    </el-table-column>
    <el-table-column label="用户状态" width="120">
      <template slot-scope='scope'>
        <el-switch v-model="scope.row.mg_state" active-color="#13ce66" inactive-color="#ff4949" @change='changeBtn(scope.row)'>
        </el-switch>
      </template>

    </el-table-column>
    <el-table-column label="操作" min-width="140">
      <template slot-scope='scope'>
        <el-row>
          <el-button
          size='mini'
          plain type="primary"
          icon="el-icon-edit"
          circle
          @click='editUserdia(scope.row.id)'
          ></el-button>
          <el-button
          size='mini'
          plain
          type="success"
          icon="el-icon-check"
          circle
          @click='showRoleUser(scope.row)'
          ></el-button>
          <el-button size='mini' plain type="danger" icon="el-icon-delete" circle @click='deleteBox(scope.row.id)'></el-button>
        </el-row>
      </template>
    </el-table-column>
  </el-table>
  <!-- 分页 -->
  <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currenPage" :page-sizes="[2, 4, 6, 8]" :page-size="pagesize" layout="total, sizes, prev, pager, next, jumper" :total="total">
  </el-pagination>
</el-card>
</template>

<script>
export default {
  data () {
    return {
      tableData: [],
      loading: false,
      value: false,
      // 分页
      currenPage: 1,
      total: 0,
      pagesize: 4,
      pagenum: 1,
      // 搜索查询
      searchVal: '',
      dialogFormVisibleAdd: false,
      dialogFormVisibleEdit: false,
      dialogFormVisibleSetRol: false,
      formData: {
      },
      formLabelWidth: '120px',
      roles: [],
      currUserName: '',
      currentRolId: -1,
      currentUserId: -1
    }
  },
  mounted () {
    this.loadTableData()
  },
  methods: {
    // 分配用户角色
    async setRole () {
      const res = await this.$http.put(`users/${this.currentUserId}/role`, {
        rid: this.currentRolId
      })
      const {meta: {
        status, msg
      }} = res.data
      if (status === 200) {
        this.$message.success(msg)
        this.dialogFormVisibleSetRol = false
        this.currentRolId = -1
      }
    },
    // 显示分配权限对话框
    async showRoleUser (user) {
      this.dialogFormVisibleSetRol = true
      this.currUserName = user.username
      this.currentUserId = user.id
      const res = await this.$http.get('roles')
      const res2 = await this.$http.get(`users/${user.id}`)
      this.currentRolId = res2.data.data.rid
      this.roles = res.data.data
    },
    // 显示编辑页面内容
    async showEditUser () {
      // this.formData.id
      const res = await this.$http.put(`users/${this.formData.id}`, this.formData)
      const {
        meta: {status, msg}
      } = res.data
      if (status === 200) {
        this.dialogFormVisibleEdit = false
        this.$message.success(msg)
        this.loadTableData()
      }
    },
    // 显示编辑用户对话框
    async editUserdia (userId) {
      this.dialogFormVisibleEdit = true
      const res = await this.$http.get(`users/${userId}`)
      // console.log(res)
      this.formData = res.data.data
    },
    // 添加用户
    async addUser () {
      this.dialogFormVisibleAdd = false
      const res = await this.$http.post('users', this.formData)
      const {
        meta: { status, msg }
      } = res.data
      // console.log(res)
      if (status === 201) {
        this.$message(msg)
        this.loadTableData()
        for (const key in this.formData) {
          if (this.formData.hasOwnProperty(key)) {
            this.formData[key] = ''
          }
        }
      }
    },
    // 显示添加用户
    showaddUser () {
      this.dialogFormVisibleAdd = true
      this.formData = {}
    },
    // 显示删除狂
    deleteBox (userId) {
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const res = await this.$http.delete(`users/${userId}`)

        const {
          meta: {
            status
          }
        } = res.data
        if (status === 200) {
          this.loadTableData()
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
        }
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    // 改变用户状态
    async changeBtn (user) {
      const res = await this.$http.put(`users/${user.id}/state/${user.mg_state}`)
      // console.log(res)
      const {
        meta: {
          status,
          msg
        }
      } = res.data
      if (status === 200) {
        this.$message.success(msg)
      }
    },
    // 查询用户
    checkUser () {
      this.pagenum = 1
      this.loadTableData()
    },
    // 分页
    handleSizeChange (val) {
      console.log(`每页 ${val} 条`)
      this.pagesize = val
      this.loadTableData()
    },
    handleCurrentChange (val) {
      console.log(`当前页: ${val}`)
      this.pagenum = val
      this.loadTableData()
    },
    async loadTableData () {
      this.loading = true
      const AUTH_TOKEN = sessionStorage.getItem('token')
      this.$http.defaults.headers.common['Authorization'] = AUTH_TOKEN
      const res = await this.$http.get(`users?pagenum=${this.pagenum}&pagesize=${this.pagesize}&query=${this.searchVal}`)
      // console.log(res)
      this.total = res.data.data.total
      const {
        meta: {
          status
        },
        data: {
          users
        }
      } = res.data
      if (status === 200) {
        this.loading = false
        this.tableData = users
        // this.pagesize=2

        // this.currenPage=1
      }
    }
  }
}
</script>

<style>
.box-card {
  height: 100%;
}

.searchArea {
  margin-top: 10px;
  margin-bottom: 10px;
}

.searchArea .searchInput {
  width: 350px;
}
</style>
