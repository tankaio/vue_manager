<template>
  <div class="permission">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="box-card">
      <el-table :data="allPermissionData" style="width: 100%" border stripe>
        <el-table-column type="index" label="#"> </el-table-column>
        <el-table-column prop="authName" label="权限名称"> </el-table-column>
        <el-table-column prop="path" label="路径"> </el-table-column>
        <el-table-column label="权限等级">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.level === '0'">一级权限</el-tag>
            <el-tag v-if="scope.row.level === '1'" type="success">二级权限</el-tag>
            <el-tag v-if="scope.row.level === '2'" type="warning">三级权限</el-tag>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
import http from "../../api/request";
export default {
  name: "Permission",
  data() {
    return {
      allPermissionData: []
    };
  },
  methods: {
    async getAllPermission(type) {
      let { data: res } = await http.getAllPermission(type);
      console.log("allPremission:", res);
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg);
      this.allPermissionData = res.data;
    }
  },
  created() {
    this.getAllPermission("list");
  }
};
</script>

<style lang="scss" scoped></style>
