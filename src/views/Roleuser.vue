<template>
<el-card class='el-card'>
  <my-bread class='my-bread' level1='权限管理' level2='角色列表'></my-bread>
  <el-row>
    <el-col :span="24">
      <el-button type="primary" @click='showaddRole()'>添加角色</el-button>
    </el-col>
  </el-row>
  <!-- 添加角色 -->
  <el-dialog title="添加角色" :visible.sync="dialogFormVisibleAdd">
    <el-form :model="formData">
      <el-form-item label="角色名称" :label-width="formLabelWidth">
        <el-input v-model="formData.roleName" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="角色描述" :label-width="formLabelWidth">
        <el-input v-model="formData.roleDesc" autocomplete="off"></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="dialogFormVisibleAdd = false">取 消</el-button>
      <el-button type="primary" @click='addRole()'>确 定</el-button>
    </div>
  </el-dialog>
  <!-- 编辑角色信息 -->
  <el-dialog title="编辑角色" :visible.sync="dialogFormVisibleEdit">
    <el-form :model="formData">
      <el-form-item label="角色名称" :label-width="formLabelWidth">
        <el-input v-model="formData.roleName" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="角色描述" :label-width="formLabelWidth">
        <el-input v-model="formData.roleDesc" autocomplete="off"></el-input>
      </el-form-item>

    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="dialogFormVisibleEdit = false">取 消</el-button>
      <el-button type="primary" @click='changeRole()'>确 定</el-button>
    </div>
  </el-dialog>
  <!-- 这是角色编辑页面 -->
  <el-dialog title="分配权限" :visible.sync="dialogVisible" width="80%">
    <el-tree :data="RoleList" show-checkbox node-key="id" ref='tree' default-expand-all :default-checked-keys="checkedkeys" :props="defaultProps">
    </el-tree>
    <el-button @click="dialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="changeRoleById()">确 定</el-button>

  </el-dialog>
  <el-table :data="tableData" style="width: 100%">
    <el-table-column type="expand">
      <template slot-scope="scope">
        <el-row class='level1' v-for="(item1,index) in scope.row.children" :key='index'>
          <el-col :span="4">
            <el-tag closable type='success' @close='deleteTag(scope.row,item1.id)'>
              {{item1.authName}}

            </el-tag>
            <i class='el-icon-caret-right'></i>
          </el-col>

          <el-col :span="20">
            <el-row class='level2' v-for="(item2,index) in item1.children" :key='index'>
              <el-col :span="4">
                <el-tag closable type='warning' @close='deleteTag(scope.row,item2.id)'>
                  {{item2.authName}}

                </el-tag>
                <i class='el-icon-caret-right'></i>
              </el-col>
              <el-col :span="20">
                <el-tag @close='deleteTag(scope.row,item3.id)' closable type='danger' v-for="(item3,index) in item2.children" :key='index'>
                  {{item3.authName}}

                </el-tag>
              </el-col>
            </el-row>
          </el-col>
        </el-row>
        <el-row v-if="scope.row.children.length===0">
          没有任何权限
        </el-row>
      </template>
    </el-table-column>
    <el-table-column label="#" type='index'>
    </el-table-column>
    <el-table-column label="角色名称" prop="roleName" width="100">
    </el-table-column>
    <el-table-column label="角色描述" prop="roleDesc" width="350">
    </el-table-column>
    <el-table-column label="操作" min-width="180">
      <template slot-scope="scope">
        <el-row>
          <el-button size='mini' plain type="primary" icon="el-icon-edit" circle @click='showeditRole(scope.row.id)'></el-button>
          <el-button size='mini' plain type="success" icon="el-icon-check" circle @click='showRoleTree(scope.row)'></el-button>
          <el-button size='mini' plain type="danger" icon="el-icon-delete" circle @click='deleteRole(scope.row.id)'></el-button>
        </el-row>
      </template>
    </el-table-column>
  </el-table>
</el-card>
</template>

<script>
export default {
  data() {
    return {
      tableData: [],
      formData: {
        roleName: '',
        roleDesc: ''
      },
      dialogFormVisibleAdd: false,
      dialogFormVisibleEdit: false,
      dialogVisible: false,
      formLabelWidth: '100px',
      roleId: -1,
      RoleList: [],
      checkedkeys: [],
      defaultProps: {
        children: 'children',
        label: 'authName'
      }
    }
  },
  created() {
    this.getallUser()
  },
  methods: {
    async getallUser() {
      const res = await this.$http.get(`roles`)
      // console.log(res)
      this.tableData = res.data.data
    },
    // 展示添加页
    showaddRole() {
      this.formData = {}
      this.dialogFormVisibleAdd = true
    },
    async addRole() {
      const res = await this.$http.post(`roles`, this.formData)
      const {
        meta: {
          msg,
          status
        }
      } = res.data
      if (status === 201) {
        this.$message.success(msg)
        this.dialogFormVisibleAdd = false
        this.getallUser()
      }
    },
    deleteRole(id) {
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const res = await this.$http.delete(`roles/${id}`)
        const {
          meta: {
            msg,
            status
          }
        } = res.data
        if (status === 200) {
          this.getallUser()
          this.$message({
            type: 'success',
            message: '删除成功!'
          });
        }

      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    },
    async showeditRole(id) {
      this.roleId = id
      this.dialogFormVisibleEdit = true
      const res = await this.$http.get(`roles/${id}`)
      this.formData = res.data.data
      // console.log(this.formData)
    },
    // 编辑角色功能实现
    async changeRole() {
      const res = await this.$http.put(`roles/${this.roleId}`, this.formData)
      const {
        msg,
        status
      } = res.data.meta
      if (status === 200) {
        this.$message.success(msg)
        this.dialogFormVisibleEdit = false
        this.getallUser()
      }
    },
    //删除单个标签
    async deleteTag(uid, rid) {
      const res = await this.$http.delete(`roles/${uid.id}/rights/${rid}`)
      const {
        meta: {
          msg,
          status
        }
      } = res.data
      if (status === 200) {
        this.$message.success(msg)
        uid.children = res.data.data
      }
    },
    //显示树状结构
    async showRoleTree(role) {
      this.roleId = role.id
      this.dialogVisible = true
      //获取所有的权限
      const res = await this.$http.get(`rights/tree`)
      this.RoleList = res.data.data
      //遍历得到默认选中的选项
      const arr = []
      role.children.forEach(element => {
        element.children.forEach(element2 => {
          element2.children.forEach(element3 => {
            arr.push(element3.id)
          })      
        })
      })
      this.checkedkeys = arr
    },
    // 修改用户权限
    async changeRoleById(){
      // 获取用户选中的选项
      const arr = this.$refs.tree.getCheckedKeys()
      const arr2 = this.$refs.tree.getHalfCheckedKeys()
      const arr3 = [...arr,...arr2]
      const res = await this.$http.post(`roles/${this.roleId}/rights`,{
        rids: arr3.join(',')
      })
      const {meta:{
        msg,status
      }} = res.data
      if(status === 200){
        this.$message.success(msg)
        this.getallUser()
      }
    }
  }
}
</script>

<style>
.el-card {
  height: 100%;
}

.my-bread {
  margin-bottom: 20px;

}

.level1 {
  margin-bottom: 10px;
}

.level2 {
  margin-bottom: 10px;
}
</style>
