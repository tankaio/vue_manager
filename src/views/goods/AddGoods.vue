<template>
  <div class="addgoods">
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/goods' }">商品列表</el-breadcrumb-item>
      <el-breadcrumb-item>添加商品</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片布局 -->
    <el-card>
      <el-alert title="添加商品信息" type="info" center show-icon> </el-alert>
      <el-steps :space="200" :active="+activeIndex" finish-status="success">
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>
      <el-form :model="addGoodsForm" :rules="addGoodsFormRules" ref="addGoodsFormRef" label-width="100px">
        <el-tabs v-model="activeIndex" tab-position="left" stretch @tab-click="tabClick" :before-leave="beforeTabLeave">
          <!-- 添加基本信息面板 -->
          <el-tab-pane label="基本信息" name="0">
            <el-form-item label="商品名称" prop="goods_name">
              <el-input v-model="addGoodsForm.goods_name"></el-input>
            </el-form-item>
            <el-form-item label="商品价格" prop="goods_price">
              <el-input v-model="addGoodsForm.goods_price" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品重量" prop="goods_weight">
              <el-input v-model="addGoodsForm.goods_weight" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品数量" prop="goods_number">
              <el-input v-model="addGoodsForm.goods_number" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品分类">
              <el-cascader v-model="addGoodsForm.goods_cat" :options="cascaderData" :props="props" @change="cascaderChange" clearable></el-cascader>
            </el-form-item>
          </el-tab-pane>
          <!-- 添加商品参数面板 -->
          <el-tab-pane label="商品参数" name="1" class="ml-25">
            <div v-for="item in manyList" :key="item.attr_id">
              <h5>{{ item.attr_vals.length === 0 ? "" : item.attr_name }}</h5>
              <el-checkbox-group v-model="item.attr_vals" @change="cbChange">
                <el-checkbox v-for="(cb, i) in item.attr_vals" :key="i" :label="cb"></el-checkbox>
              </el-checkbox-group>
            </div>
          </el-tab-pane>
          <!-- 添加商品属性面板 -->
          <el-tab-pane label="商品属性" name="2" class="ml-25">
            <div v-for="item in onlyList" :key="item.attr_id">
              <h5>{{ item.attr_name }}</h5>
              <el-checkbox-group v-model="item.attr_vals" @change="cbChange">
                <el-input v-model="item.attr_vals"></el-input>
              </el-checkbox-group>
            </div>
          </el-tab-pane>
          <!-- 上传商品图片面板 -->
          <el-tab-pane label="商品图片" name="3" class="ml-25">
            <el-upload
              action="http://127.0.0.1:8888/api/private/v1/upload"
              :on-remove="imgRemove"
              list-type="picture"
              :on-preview="imgPreview"
              :on-success="imgUploadSuccess"
              :headers="headers"
            >
              <el-button size="small" type="primary">点击上传</el-button>
            </el-upload>
          </el-tab-pane>
          <!-- 添加商品内容面板 -->
          <el-tab-pane label="商品内容" name="4" class="ml-25">
            <quill-editor v-model="addGoodsForm.goods_introduce" />
            <el-button type="primary" class="confirm-btn" @click="confirmAddGoods">确认添加</el-button>
          </el-tab-pane>
        </el-tabs>
      </el-form>
    </el-card>
    <!-- 图片预览弹窗 -->
    <el-dialog title="图片预览" :visible.sync="imgDialogVisible" width="40%">
      <img :src="imgPreviewUrl" />
      <span slot="footer" class="dialog-footer">
        <el-button @click="imgDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="imgDialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import http from "../../api/request.js";
import _ from "lodash";
export default {
  name: "AddGoods",
  data() {
    return {
      activeIndex: 0,
      addGoodsForm: {
        goods_cat: [],
        goods_name: "",
        goods_price: "",
        goods_weight: "",
        goods_number: "",
        pics: [],
        goods_introduce: "",
        attrs: []
      },
      addGoodsFormRules: {
        goods_name: [{ required: true, message: "请输入活动名称", trigger: "blur" }],
        goods_price: [{ required: true, message: "请输入活动名称", trigger: "blur" }],
        goods_weight: [{ required: true, message: "请输入活动名称", trigger: "blur" }],
        goods_number: [{ required: true, message: "请输入活动名称", trigger: "blur" }]
      },
      props: { expandTrigger: "hover", value: "cat_id", label: "cat_name", children: "children" },
      cascaderData: [],
      manyList: [],
      onlyList: [],
      imgDialogVisible: false,
      imgPreviewUrl: "",
      headers: {
        Authorization: sessionStorage.getItem("token")
      }
    };
  },
  computed: {
    // 判断是否选中了三级分类
    cascaderIsThree() {
      return this.addGoodsForm.goods_cat.length === 3;
    },
    // 第三级分类id
    cascaderLastKey() {
      return this.addGoodsForm.goods_cat[2];
    }
  },
  methods: {
    // 获取参数数据列表
    async getParamsList(sel) {
      const { data: res } = await http.getParamsList(this.cascaderLastKey, sel);
      console.log("getParamsList:", res);
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg);
      if (sel === "many") {
        res.data.forEach(item => {
          item.attr_vals = item.attr_vals.length !== 0 ? item.attr_vals.split(",") : [];
        });
        this.manyList = res.data;
      } else {
        this.onlyList = res.data;
      }
    },
    // 获取商品类型数据
    async getGoodsTypeList() {
      const { data: res } = await http.getGoodsTypeList();
      console.log("getGoodsTypeList:", res);
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg);
      this.cascaderData = res.data;
    },
    // 离开tab前的钩子
    beforeTabLeave(activeName, oldActiveName) {
      console.log("activeName:", activeName);
      console.log("oldActiveName:", oldActiveName);
      if (activeName === "1" && oldActiveName === "0") {
        if (!this.cascaderIsThree) {
          this.$message({
            message: "必要表单数据未填写完",
            type: "warning"
          });
          return false;
        }
      }
    },
    // tab点击事件
    tabClick(tab) {
      console.log(tab.label);
      if (tab.label === "商品参数") {
        this.getParamsList("many");
      }
      if (tab.label === "商品属性") {
        this.getParamsList("only");
      }
    },
    // cascaderChange(val) {
    //   console.log("选中节点的值:", val);
    //   console.log("cascaderValue:", this.addGoodsForm.goods_cat);
    // },
    // cbChange(val) {
    //   console.log(val);
    // },
    imgUploadSuccess(res) {
      console.log("imgUploadRes:", res);
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg);
      this.$message.success("图片上传成功");
      const picInfo = { pic: res.data.tmp_path };
      this.addGoodsForm.pics.push(picInfo);
    },
    imgPreview(file) {
      this.imgDialogVisible = true;
      this.imgPreviewUrl = file.response.data.url;
    },
    imgRemove(file) {
      const filePath = file.response.data.tmp_path;
      const index = this.addGoodsForm.pics.findIndex(item => item.pic === filePath);
      this.addGoodsForm.pics.splice(index, 1);
    },
    // 确认添加商品
    async confirmAddGoods() {
      let formData = _.cloneDeep(this.addGoodsForm);
      formData.goods_cat = formData.goods_cat.join(",");
      this.manyList.forEach(item => {
        const manyInfo = {
          attr_id: item.attr_id,
          attr_value: item.attr_vals.join(",")
        };
        formData.attrs.push(manyInfo);
      });
      this.onlyList.forEach(item => {
        const onlyInfo = {
          attr_id: item.attr_id,
          attr_value: item.attr_vals
        };
        formData.attrs.push(onlyInfo);
      });
      console.log("formData:", formData);
      const { data: res } = await http.addGoods(formData);
      console.log("addGoods:", res);
      if (res.meta.status !== 201) return this.$message.error(res.meta.msg);
      this.$message.success(res.meta.msg);
      this.$router.push("/goods");
    }
  },
  created() {
    this.getGoodsTypeList();
  }
};
</script>

<style lang="scss" scoped>
.el-step__title {
  font-size: 14px !important;
}
.el-tabs {
  margin-top: 20px;
  margin-left: -20px;
}
.el-input {
  width: 50% !important;
}
.el-cascader .el-input {
  width: 100% !important;
}
.el-tabs__item {
  height: 60px !important;
}
.ml-25 {
  margin-left: 25px;
}
.el-checkbox {
  margin-bottom: 10px;
}
.el-dialog img {
  width: 100%;
  height: 100%;
}
/deep/.ql-editor {
  height: 150px;
}
.confirm-btn {
  margin-top: 20px;
}
</style>
