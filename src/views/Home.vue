<template>
  <div class="home">
    <el-container>
      <el-header>
        <div class="left-box">
          <img src="../assets/img/logo_sheyingji.png" alt="商城后台管理系统" />
          <span>商城后台管理系统</span>
        </div>
        <el-button type="info" size="midium" @click="logout">退出</el-button>
      </el-header>
      <el-container>
        <el-aside :width="collapse ? '65px' : '200px'" style="transition: .3s">
          <el-col>
            <div class="collapse" @click="collapse = !collapse">|||</div>
            <el-menu
              :default-active="$route.path"
              background-color="#333744"
              text-color="#fff"
              active-text-color="#66CCFF"
              unique-opened
              router
              :collapse="collapse"
              :collapse-transition="false"
            >
              <el-submenu :index="item.id + ''" v-for="item in menuList" :key="item.id">
                <template slot="title">
                  <i :class="['iconfont', iconList[item.authName]]"></i>
                  <span>{{ item.authName }}</span>
                </template>
                <el-menu-item :index="'/' + itemC.path" v-for="itemC in item.children" :key="itemC.id">
                  <i class="el-icon-menu"></i>
                  <span slot="title">{{ itemC.authName }}</span>
                </el-menu-item>
              </el-submenu>
            </el-menu>
          </el-col>
        </el-aside>
        <el-main>
          <router-view />
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import http from "../api/request";
export default {
  name: "Home",
  data() {
    return {
      menuList: [],
      collapse: false,
      iconList: {
        用户管理: "icon-yonghuguanli",
        权限管理: "icon-quanxianguanli",
        商品管理: "icon-shangpinguanli",
        订单管理: "icon-dingdanguanli",
        数据统计: "icon-shujutongji"
      }
    };
  },
  methods: {
    async getMenu() {
      let { data: res } = await http.getMenu();
      console.log(res);
      this.menuList = res.data;
    },
    logout() {
      window.sessionStorage.clear();
      this.$router.replace("/login");
    }
  },
  created() {
    this.getMenu();
  }
};
</script>

<style lang="scss" scoped>
.home {
  height: 100%;
}
.el-container {
  height: 100%;
}
.el-header {
  background-color: #666666;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-left: 0;
  .left-box {
    display: flex;
    align-items: center;
    color: #fff;
    img {
      width: 60px;
      height: 60px;
      margin-right: 15px;
    }
  }
}
.el-aside {
  background-color: #333744;
}
.el-main {
  background-color: #eaedf1;
}
.el-menu {
  border-right: 0;
}
.collapse {
  height: 30px;
  line-height: 30px;
  text-align: center;
  background-color: #999999;
  color: #fff;
  letter-spacing: 0.1em;
  cursor: pointer;
}
.iconfont {
  margin-right: 6px;
  font-size: 18px;
}
</style>
