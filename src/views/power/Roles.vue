<template>
  <div class="roles">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-button type="primary" @click="dialogVisibleOfAdd = true">添加角色</el-button>
      <el-table :data="rolesList" style="width: 100%" border stripe>
        <el-table-column type="expand">
          <template v-slot="scope">
            <el-row v-for="(item1, i1) in scope.row.children" :key="item1.id" :class="['bor-bottom', i1 === 0 ? 'bor-top' : '']">
              <el-col :span="5">
                <el-tag type="info" closable @close="closeTag(scope.row, item1.id)">{{ item1.authName }}</el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <el-col :span="19">
                <el-row v-for="(item2, i2) in item1.children" :key="item2.id" :class="[i2 === 0 ? '' : 'bor-top']">
                  <el-col :span="5">
                    <el-tag closable @close="closeTag(scope.row, item2.id)">{{ item2.authName }}</el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <el-col :span="19">
                    <el-tag type="warning" v-for="item3 in item2.children" :key="item3.id" closable @close="closeTag(scope.row, item3.id)">
                      {{ item3.authName }}
                    </el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <el-table-column type="index" label="#"> </el-table-column>
        <el-table-column prop="roleName" label="角色名称"> </el-table-column>
        <el-table-column prop="roleDesc" label="角色职位"> </el-table-column>
        <el-table-column label="操作" width="300px">
          <template v-slot="scope">
            <el-button size="mini" type="primary" @click="editRoles(scope.row.id)" icon="el-icon-edit">编辑</el-button>
            <el-button size="mini" type="danger" @click="delRoles(scope.row.id)" icon="el-icon-delete">删除</el-button>
            <el-button size="mini" type="warning" @click="assignPermission(scope.row)" icon="el-icon-setting">
              分配权限
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <el-dialog title="修改角色" :visible.sync="dialogVisibleOfEdit" width="40%" @close="resetFieldsOfEdit">
      <el-card>
        <el-form :model="rolesForm" :rules="rolesFormRules" ref="rolesFormRef" label-width="80px">
          <el-form-item label="角色名称" prop="roleName"><el-input v-model="rolesForm.roleName"></el-input></el-form-item>
          <el-form-item label="角色描述"><el-input v-model="rolesForm.roleDesc"></el-input></el-form-item>
        </el-form>
      </el-card>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisibleOfEdit = false">取 消</el-button>
        <el-button type="primary" @click="editRoleConfirm">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog title="分配权限" :visible.sync="dialogVisibleOfAssign" width="50%" @close="closeDialogOfAssign">
      <el-tree
        :data="treeData"
        show-checkbox
        node-key="id"
        default-expand-all
        :default-checked-keys="defaultExpandKeyArr"
        :props="treeProps"
        ref="rolesTreeRef"
      >
      </el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisibleOfAssign = false">取 消</el-button>
        <el-button type="primary" @click="assignRoleConfirm">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog title="提示" :visible.sync="dialogVisibleOfAdd" width="40%" @close="resetFieldsOfAdd">
      <el-card>
        <el-form :model="addRoleForm" :rules="addRoleFormRules" ref="addRoleFormRef" label-width="80px">
          <el-form-item label="角色名称" prop="roleName">
            <el-input v-model="addRoleForm.roleName"></el-input>
          </el-form-item>
          <el-form-item label="角色描述">
            <el-input v-model="addRoleForm.roleDesc"></el-input>
          </el-form-item>
        </el-form>
      </el-card>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisibleOfAdd = false">取 消</el-button>
        <el-button type="primary" @click="addRoleConfirm">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import http from "../../api/request";
export default {
  name: "Roles",
  data() {
    return {
      rolesList: [],
      dialogVisibleOfEdit: false,
      rolesForm: {},
      rolesFormRules: {
        roleName: [
          { required: true, message: "请输入活动名称", trigger: "blur" },
          { min: 2, max: 8, message: "长度在 3 到 5 个字符", trigger: "blur" }
        ]
      },
      dialogVisibleOfAssign: false,
      treeData: [],
      treeProps: {
        children: "children",
        label: "authName"
      },
      defaultExpandKeyArr: [],
      curRoleId: 0,
      dialogVisibleOfAdd: false,
      addRoleForm: {
        roleName: "",
        roleDesc: ""
      },
      addRoleFormRules: {
        roleName: [
          { required: true, message: "请输入活动名称", trigger: "blur" },
          { min: 3, max: 8, message: "长度在 3 到 5 个字符", trigger: "blur" }
        ]
      }
    };
  },
  methods: {
    async getRoles() {
      let { data: res } = await http.getRoles();
      console.log("roles:", res);
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg);
      this.rolesList = res.data;
    },
    async delRolesRightsById(role, rightId) {
      const confirmTxt = await this.$confirm("此操作将永久删除该项, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).catch(() => {
        return;
      });
      if (confirmTxt === "confirm") {
        let { data: res } = await http.delRolesRightsById(role.id, rightId);
        console.log("delRoles:", res);
        if (res.meta.status !== 200) return this.$message.error(res.meta.msg);
        // this.getRoles();
        role.children = res.data;
        this.$message.success("删除成功!");
      }
    },
    closeTag(role, rightId) {
      this.delRolesRightsById(role, rightId);
    },
    async queryRoleById(id) {
      let { data: res } = await http.queryRoleById(id);
      console.log("queryRole:", res);
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg);
      return res.data;
    },
    async editRoles(id) {
      this.dialogVisibleOfEdit = true;
      this.rolesForm = await this.queryRoleById(id);
    },
    async editRoleConfirm() {
      const { data: res } = await http.editRole(this.rolesForm.roleId, this.rolesForm);
      console.log("editRole:", res);
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg);
      this.$message.success("修改成功");
      this.dialogVisibleOfEdit = false;
      this.getRoles();
    },
    async delRoles(id) {
      const confirmTxt = await this.$confirm("此操作将永久删除该项, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).catch(() => {
        return;
      });
      if (confirmTxt === "confirm") {
        const { data: res } = await http.delRoleById(id);
        console.log("delRole:", res);
        if (res.meta.status !== 200) return this.$message.error(res.meta.msg);
        this.$message.success("删除成功!");
        this.getRoles();
      }
    },
    async assignPermission(row) {
      this.curRoleId = row.id;
      this.dialogVisibleOfAssign = true;
      const { data: res } = await http.getAllPermission("tree");
      console.log("treePermi:", res);
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg);
      this.treeData = res.data;
      this.defaultExpandKey(row, this.defaultExpandKeyArr);
    },
    defaultExpandKey(node, arr) {
      if (!node.children) {
        arr.push(node.id);
      } else {
        node.children.forEach(item => {
          this.defaultExpandKey(item, arr);
        });
      }
      return arr;
    },
    async assignRoleConfirm() {
      let rolesKeyStr = [...this.$refs.rolesTreeRef.getHalfCheckedKeys(), ...this.$refs.rolesTreeRef.getCheckedKeys()].join(",");
      const { data: res } = await http.roleAuthorization(this.curRoleId, { rids: rolesKeyStr });
      console.log("assignRole:", res);
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg);
      this.$message.success("权限分配成功");
      this.dialogVisibleOfAssign = false;
      this.getRoles();
    },
    closeDialogOfAssign() {
      this.defaultExpandKeyArr = [];
    },
    async addRoleConfirm() {
      const { data: res } = await http.addRole(this.addRoleForm);
      console.log("addRole:", res);
      if (res.meta.status !== 201) return this.$message.error(res.meta.msg);
      this.$message.success("添加角色成功");
      this.dialogVisibleOfAdd = false;
      this.getRoles();
    },
    resetFieldsOfAdd() {
      this.$refs.addRoleFormRef.resetFields();
    },
    resetFieldsOfEdit() {
      this.$refs.rolesFormRef.resetFields();
    }
  },
  created() {
    this.getRoles();
  }
};
</script>

<style lang="scss" scoped>
.el-tag {
  margin: 10px;
}
.el-row {
  display: flex;
  align-items: center;
}
.bor-top {
  border-top: 1px solid #eee;
}
.bor-bottom {
  border-bottom: 1px solid #eee;
}
</style>
