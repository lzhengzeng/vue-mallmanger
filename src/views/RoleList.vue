<template>
<el-card class='el-card'>
  <my-bread  class='my-bread' level1='权限管理' level2='权限列表'></my-bread>
  <el-table :data="tableData" border  height="500" style="width: 100%">
    <el-table-column type='index'  label="#" width="80">
    </el-table-column>
    <el-table-column prop="authName"  label="权限名称" width="100">
    </el-table-column>
    <el-table-column prop="path"  label="路径" width="100">
    </el-table-column>
    <el-table-column prop="level"  label="层级" >
      <template slot-scope="scope">
        <span  v-if="scope.row.level === '0'">一级</span>
        <span  v-if="scope.row.level === '1'">二级</span>
        <span  v-if="scope.row.level === '2'">三级</span>
      </template>

    </el-table-column>
  </el-table>
</el-card>
</template>

<script>
export default {
  data() {
    return {
      tableData: []
    }
  },
  mounted() {
    this.loadtableData()
  },
  methods: {
    async loadtableData() {
      const res = await this.$http.get(`rights/list`)
      // console.log(res)
      this.tableData = res.data.data
    }
  }

}
</script>

<style>
.el-card{
  height: 100%;
}
.my-bread{
  margin-bottom: 20px;
}
</style>
