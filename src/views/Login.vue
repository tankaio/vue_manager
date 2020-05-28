<template>
  <div class="login">
    <div class="login-info-wrap">
      <!-- logo -->
      <div class="login-logo">
        <img src="../assets/logo.png" alt="logo" />
      </div>
      <!-- 表单输入区 -->
      <el-form class="ruleForm" :model="ruleForm" :rules="rules" ref="ruleForm">
        <el-form-item prop="username">
          <el-input prefix-icon="el-icon-user-solid" v-model="ruleForm.username"></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input prefix-icon="el-icon-lock" v-model="ruleForm.password" type="password" show-password></el-input>
        </el-form-item>
        <el-form-item class="btns">
          <el-button type="primary" @click="login">登录</el-button>
          <el-button type="info" @click="reset">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import http from "../api/request.js";
export default {
  name: "login",
  data() {
    return {
      ruleForm: {
        username: "",
        password: ""
      },
      rules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          { min: 3, max: 8, message: "长度在 3 到 8 个字符", trigger: "blur" }
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          { min: 3, max: 15, message: "长度在 3 到 15 个字符", trigger: "blur" }
        ]
      }
    };
  },
  methods: {
    //重置表单
    reset() {
      this.$refs.ruleForm.resetFields();
    },
    //登录
    login() {
      this.$refs.ruleForm.validate(async (isValidate, obj) => {
        if (!isValidate) return this.$message("用户名或密码填写错误");
        let { data } = await http.login({ username: this.ruleForm.username, password: this.ruleForm.password });
        console.log(data);
        let msg = data.meta.msg;
        if (data.meta.status === 200) {
          this.$message.success(msg);
          window.sessionStorage.setItem("token", data.data.token);
          this.$router.push("/home");
        } else {
          this.$message.error(msg);
        }
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.login {
  height: 100%;
  background-color: #2b4b6b;
  position: relative;
}
.login-info-wrap {
  width: 450px;
  height: 300px;
  background-color: #fff;
  border-radius: 5px;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
.login-logo {
  width: 150px;
  height: 150px;
  border-radius: 50%;
  box-shadow: 0 0 10px #ddd;
  padding: 10px;
  box-sizing: border-box;
  position: absolute;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: #fff;
  img {
    width: 100%;
    height: 100%;
    border-radius: 50%;
    background-color: #eee;
  }
}
.ruleForm {
  position: absolute;
  bottom: 0;
  width: 100%;
  padding: 0 20px;
  box-sizing: border-box;
}
.btns {
  display: flex;
  justify-content: flex-end;
}
</style>
