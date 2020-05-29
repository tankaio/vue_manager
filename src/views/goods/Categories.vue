<template>
  <div class="categories">
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片布局 -->
    <el-card>
      <el-button type="primary" @click="addCategories">添加分类</el-button>
      <el-table :data="goodsTypeList" stripe border row-key="cat_id" :tree-props="{ children: 'children' }"
        >>
        <el-table-column type="index" label="#"> </el-table-column>
        <el-table-column prop="cat_name" label="分类名称" width="180"> </el-table-column>
        <el-table-column prop="cat_deleted" label="是否有效" width="180">
          <template v-slot="scope">
            <i class="el-icon-success" v-if="scope.row.cat_deleted === false" style="color: lightgreen;"></i>
            <i class="el-icon-error" v-else style="color: red;"></i>
          </template>
        </el-table-column>
        <el-table-column prop="cat_level" label="等级" width="180">
          <template v-slot="scope">
            <el-tag v-if="scope.row.cat_level === 0" size="mini">一级</el-tag>
            <el-tag v-if="scope.row.cat_level === 1" size="mini">二级</el-tag>
            <el-tag v-if="scope.row.cat_level === 2" size="mini">三级</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template v-slot="scope">
            <el-button size="mini" type="primary" icon="el-icon-edit" @click="dialogOfEditClick(scope.row.cat_id)">编辑</el-button>
            <el-button size="mini" type="danger" icon="el-icon-delete" @click="delCategories(scope.row.cat_id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="1"
        :page-sizes="[2, 3, 5, 20]"
        :page-size="5"
        layout="total, sizes, prev, pager, next, jumper"
        :total="totalSize"
      >
      </el-pagination>
    </el-card>
    <!-- 编辑分类弹窗 -->
    <el-dialog title="编辑分类" :visible.sync="dialogOfEditVisible" width="40%">
      <!-- <el-card> -->
      <el-form label-width="80px">
        <el-form-item label="分类名称">
          <el-input v-model="curCategories.cat_name"></el-input>
        </el-form-item>
      </el-form>
      <!-- </el-card> -->
      <span slot="footer">
        <el-button @click="dialogOfEditVisible = false">取 消</el-button>
        <el-button type="primary" @click="confirmOfEditCategories">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 添加分类弹窗 -->
    <el-dialog title="添加分类" :visible.sync="dialogOfAddVisible" width="40%" @close="closeDialogOfAdd">
      <el-card>
        <el-form label-width="80px">
          <el-form-item label="分类名称">
            <el-input v-model="curCategories.cat_name"></el-input>
          </el-form-item>
          <el-form-item label="父级分类">
            <el-cascader v-model="selKeys" :options="goodsType2List" :props="cascaderProps" @change="handleChange" clearable></el-cascader>
          </el-form-item>
        </el-form>
      </el-card>
      <span slot="footer">
        <el-button @click="dialogOfAddVisible = false">取 消</el-button>
        <el-button type="primary" @click="confirmOfAddCategories">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import http from "../../api/request";
export default {
  name: "Categories",
  data() {
    return {
      goodsTypeList: [],
      goodsType2List: [],
      paramsInfo: {
        type: "3",
        pagenum: "1",
        pagesize: "5"
      },
      totalSize: 0,
      dialogOfEditVisible: false,
      curCategories: {},
      dialogOfAddVisible: false,
      selKeys: [],
      cascaderProps: {
        value: "cat_id",
        label: "cat_name",
        children: "children",
        checkStrictly: true,
        expandTrigger: "hover"
      }
    };
  },
  methods: {
    // 获取商品分类数据
    async getGoodsTypeList() {
      const { data: res } = await http.getGoodsTypeList(this.paramsInfo);
      console.log("goodsTypeList:", res);
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg);
      this.goodsTypeList = res.data.result;
      this.totalSize = res.data.total;
    },
    // 获取2级商品分类数据
    async getGoodsType2() {
      const { data: res } = await http.getGoodsTypeList({ type: 2 });
      console.log("goodsType2:", res);
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg);
      this.goodsType2List = res.data;
    },
    // pagesize改变事件
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
      this.paramsInfo.pagesize = val;
      this.getGoodsTypeList();
    },
    // pagenum改变事件
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
      this.paramsInfo.pagenum = val;
      this.getGoodsTypeList();
    },
    // 打开编辑分类弹窗
    async dialogOfEditClick(id) {
      this.dialogOfEditVisible = true;
      const { data: res } = await http.queryCategoriesById(id);
      console.log("curCategories:", res);
      if (res.meta.status !== 200) this.$message.error(res.meta.msg);
      this.curCategories = res.data;
    },
    // 确认修改分类
    async confirmOfEditCategories() {
      const { data: res } = await http.editCategories(this.curCategories.cat_id, {
        cat_name: this.curCategories.cat_name
      });
      console.log("editCategories:", res);
      if (res.meta.status !== 200) this.$message.error(res.meta.msg);
      this.$message.success("编辑成功");
      this.dialogOfEditVisible = false;
      this.getGoodsTypeList();
    },
    // 删除分类
    async delCategories(id) {
      const confirmTxt = await this.$confirm("此操作将永久删除该项, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).catch(() => {
        return;
      });
      if (confirmTxt === "confirm") {
        const { data: res } = await http.delCategoriesById(id);
        console.log("delCategories:", res);
        if (res.meta.status !== 200) this.$message.error(res.meta.msg);
        this.$message.success("删除成功");
        this.dialogOfEditVisible = false;
        this.getGoodsTypeList();
      }
    },
    handleChange(value) {
      console.log(value);
    },
    // 打开添加分类弹窗
    addCategories() {
      this.dialogOfAddVisible = true;
      this.getGoodsType2();
    },
    // 确认添加分类
    async confirmOfAddCategories() {
      if (!this.curCategories.cat_name) return this.$message.error("分类名称不能为空");
      let params = {};
      if (this.selKeys.length === 0) {
        params.cat_pid = 0;
        params.cat_name = this.curCategories.cat_name;
        params.cat_level = 0;
      } else {
        params.cat_pid = this.selKeys[this.selKeys.length - 1];
        params.cat_name = this.curCategories.cat_name;
        params.cat_level = this.selKeys.length;
      }
      console.log("params:", params);
      let { data: res } = await http.addCategories(params);
      console.log("addCategories:", res);
      if (res.meta.status !== 201) this.$message.error(res.meta.msg);
      this.$message.success("添加成功");
      this.dialogOfAddVisible = false;
      this.getGoodsTypeList();
    },
    // 关闭添加分类弹窗事件
    closeDialogOfAdd() {
      this.selKeys = [];
      this.curCategories.cat_name = "";
    }
  },
  created() {
    this.getGoodsTypeList();
  }
};
</script>

<style></style>
