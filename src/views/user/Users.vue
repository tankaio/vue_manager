<template>
  <div class="users">
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片布局 -->
    <el-card class="box-card">
      <el-row :gutter="20">
        <!-- 搜索框 -->
        <el-col :span="8">
          <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable @keyup.enter.native="searchUser">
            <el-button slot="append" icon="el-icon-search" @click="searchUser"></el-button>
          </el-input>
        </el-col>
        <!-- 添加用户按钮 -->
        <el-col :span="4">
          <el-button type="primary" @click="dialogVisibleOfAdd = true">添加用户</el-button>
        </el-col>
      </el-row>
      <!-- table表单 -->
      <el-table :data="userList" border class="table-wrap">
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column prop="username" label="姓名" width="180"> </el-table-column>
        <el-table-column prop="email" label="邮箱" width="180"> </el-table-column>
        <el-table-column prop="mobile" label="电话"> </el-table-column>
        <el-table-column prop="role_name" label="角色"> </el-table-column>
        <el-table-column prop="mg_state" label="状态">
          <template v-slot="scope">
            <el-switch v-model="scope.row.mg_state" active-color="#409EFF" inactive-color="#DCDFE6" @change="switchChange($event, scope.row.id)">
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column prop="mg_state" label="操作" width="180px">
          <template v-slot="scope">
            <!-- <el-button @click="editClick(scope.row, scope.column, scope.$index)" type="text" size="small"
              >查看</el-button
            > -->
            <el-row class="row_last">
              <el-button type="primary" icon="el-icon-edit" size="mini" @click="changeUserClick(scope.row.id)"></el-button>
              <el-button type="danger" icon="el-icon-delete" size="mini" @click="delUserClick(scope.row.id)"></el-button>
              <el-tooltip class="item" effect="dark" content="分配角色" placement="top">
                <el-button type="warning" icon="el-icon-setting" size="mini" @click="dialogAssignRole(scope.row)"></el-button>
              </el-tooltip>
            </el-row>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[2, 3, 4, 5, 50]"
        :page-size="4"
        layout="total, sizes, prev, pager, next, jumper"
        :total="userTotal"
        class="pagination-wrap"
      >
      </el-pagination>
    </el-card>
    <!-- 添加用户弹窗 -->
    <el-dialog title="添加用户" :visible.sync="dialogVisibleOfAdd" width="40%" @closed="dialogCloseOfAdd">
      <el-card class="box-card">
        <el-form :model="addUserForm" :rules="addUserFormRules" ref="addUserForm" label-width="80px">
          <el-form-item label="用户名" prop="username">
            <el-input v-model="addUserForm.username"></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input v-model="addUserForm.password"></el-input>
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="addUserForm.email"></el-input>
          </el-form-item>
          <el-form-item label="手机号" prop="mobile">
            <el-input v-model="addUserForm.mobile"></el-input>
          </el-form-item>
        </el-form>
      </el-card>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisibleOfAdd = false">取 消</el-button>
        <el-button type="primary" @click="confirmAddUser">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 修改用户信息弹窗 -->
    <el-dialog title="修改用户信息" :visible.sync="dialogVisibleOfChange" width="40%" @closed="dialogCloseOfChange">
      <el-card>
        <el-form :model="changeUserForm" :rules="changeUserFormRules" ref="changeUserForm" label-width="80px">
          <el-form-item label="用户名"> <el-input disabled v-model="changeUserForm.username"></el-input> </el-form-item>
          <el-form-item label="邮箱" prop="email"> <el-input v-model="changeUserForm.email"></el-input> </el-form-item>
          <el-form-item label="手机号" prop="mobile">
            <el-input v-model="changeUserForm.mobile"></el-input>
          </el-form-item>
        </el-form>
      </el-card>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisibleOfChange = false">取 消</el-button>
        <el-button type="primary" @click="confirmChangeUser">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 分配角色弹窗 -->
    <el-dialog title="分配角色" :visible.sync="dialogVisibleOfAssignRole" width="40%" @close="dialogCloseOfAssignRole">
      <el-card>
        <p>当前用户：{{ curUser.username }}</p>
        <p>当前角色：{{ curUser.role_name }}</p>
        <el-select v-model="selId" placeholder="请选择">
          <el-option v-for="item in selectOptions" :key="item.id" :label="item.roleName" :value="item.id"> </el-option>
        </el-select>
      </el-card>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisibleOfAssignRole = false">取 消</el-button>
        <el-button type="primary" @click="confirmAssignRole">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import http from "@/api/request";
export default {
  name: "Users",
  data() {
    // 自定义邮箱正则验证
    let emailValid = (rule, value, callback) => {
      const reg = /^\w+((.\w+)|(-\w+))@[A-Za-z0-9]+((.|-)[A-Za-z0-9]+).[A-Za-z0-9]+$/;
      if (!value) return callback(new Error("请输入邮箱"));
      if (!reg.test(value)) return callback(new Error("邮箱格式不正确"));
      callback();
    };
    // 自定义手机号码正则验证
    let phoneNumValid = (rule, value, callback) => {
      const reg = /^1[3456789]\d{9}$/;
      if (!value) return callback(new Error("请输入手机号码"));
      if (!reg.test(value)) return callback(new Error("手机号码格式不合法"));
      callback();
    };
    return {
      queryInfo: {
        query: "",
        pagenum: 1,
        pagesize: 4
      },
      userList: [],
      userTotal: 0,
      dialogVisibleOfAdd: false,
      addUserForm: {
        username: "",
        password: "",
        email: "",
        mobile: ""
      },
      addUserFormRules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          { min: 3, max: 8, message: "长度在 3 到 8 个字符", trigger: "blur" }
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          { min: 3, max: 15, message: "长度在 3 到 15 个字符", trigger: "blur" }
        ],
        email: [{ validator: emailValid, trigger: "blur" }],
        mobile: [{ validator: phoneNumValid, trigger: "blur" }]
      },
      dialogVisibleOfChange: false,
      changeUserForm: {},
      changeUserFormRules: {
        email: [{ validator: emailValid, trigger: "blur" }],
        mobile: [{ validator: phoneNumValid, trigger: "blur" }]
      },
      dialogVisibleOfAssignRole: false,
      assignRoleForm: {},
      selectOptions: [],
      selId: "",
      curUser: {}
    };
  },
  methods: {
    // 获取后台用户列表数据
    async getUserList() {
      let { data: res } = await http.getUserList(this.queryInfo);
      console.log(res);
      if (res.meta.status !== 200) return this.$message.error("获取用户列表失败！");
      this.userList = res.data.users;
      this.userTotal = res.data.total;
      if (this.queryInfo.query) this.queryInfo.query = "";
    },
    // 分页组件分页数（pagesize）改变事件
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
      this.queryInfo.pagesize = val;
      this.getUserList();
    },
    // 分页组件当前页（pagenum）改变事件
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
      this.queryInfo.pagenum = val;
      this.getUserList();
    },
    //查询用户
    searchUser() {
      this.queryInfo.pagenum !== 1 && (this.queryInfo.pagenum = 1);
      this.getUserList();
    },
    // 添加用户弹窗关闭事件
    dialogCloseOfAdd() {
      this.dialogVisibleOfAdd = false;
      this.$refs.addUserForm.resetFields();
    },
    //确认添加用户
    confirmAddUser() {
      console.log("addF:", this.addUserForm);
      this.$refs.addUserForm.validate(async vali => {
        if (!vali) return;
        let { data: res } = await http.addUser(this.addUserForm);
        console.log("add:", res);
        if (res.meta.status !== 201) return this.$message.error(res.meta.msg);
        this.$message.success("添加用户成功!");
        this.dialogVisibleOfAdd = false;
        this.getUserList();
      });
    },
    // 改变用户状态
    async switchChange(newState, id) {
      let { data: res } = await http.changeState(id, newState);
      console.log("switchChange:", res);
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg);
      this.$message.success(res.meta.msg);
    },
    //修改用户弹窗关闭事件
    dialogCloseOfChange() {
      this.dialogVisibleOfChange = false;
      this.$refs.changeUserForm.resetFields();
    },
    //查询用户
    async changeUserClick(id) {
      this.dialogVisibleOfChange = true;
      let { data: res } = await http.queryUserById(id);
      console.log("currentUser:", res);
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg);
      this.changeUserForm = res.data;
    },
    // 确认添加用户
    confirmChangeUser() {
      this.$refs.changeUserForm.validate(async valid => {
        if (!valid) return;
        let { data: res } = await http.changeUserInfo(+this.changeUserForm.id, {
          email: this.changeUserForm.email,
          mobile: this.changeUserForm.mobile
        });
        console.log("changeUserReturn:", res);
        if (res.meta.status !== 200) return this.$message.error(res.meta.msg);
        this.dialogVisibleOfChange = false;
        this.getUserList();
        this.$message.success("修改用户信息成功");
      });
    },
    // 删除用户
    async delUserClick(id) {
      const confirmTxt = await this.$confirm("此操作将永久删除该项, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).catch(() => {
        return;
      });
      if (confirmTxt === "confirm") {
        let { data: res } = await http.delUser(id);
        console.log("delUser", res);
        if (res.meta.status !== 200) return this.$message.error(res.meta.msg);
        this.getUserList();
        this.$message.success("删除用户成功");
      }
    },
    // 打开分配角色弹出
    async dialogAssignRole(row) {
      console.log("cur:", row);
      this.dialogVisibleOfAssignRole = true;
      const { data: res } = await http.getRoles();
      this.selectOptions = res.data;
      this.curUser = row;
    },
    // 确认分配角色权限
    async confirmAssignRole() {
      if (!this.selId) {
        return this.$message({
          type: "warning",
          message: "请选择角色"
        });
      }
      if (this.curUser.username === "admin") {
        return this.$message({
          type: "warning",
          message: "不能修改admin用户"
        });
      }
      const { data: res } = await http.assignRole(this.curUser.id, { rid: this.selId });
      console.log("assignRole:", res);
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg);
      this.$message.success("分配角色成功");
      this.dialogVisibleOfAssignRole = false;
      this.getUserList();
    },
    // 分配角色权限弹窗关闭
    dialogCloseOfAssignRole() {
      this.selId = "";
    }
  },
  created() {
    this.getUserList();
  }
};
</script>

<style lang="scss" scoped>
.row_last {
  display: flex;
}
</style>
