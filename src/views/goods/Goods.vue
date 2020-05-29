<template>
  <div class="goods">
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片布局 -->
    <el-card>
      <el-row>
        <el-col :span="10" class="card-top">
          <el-input placeholder="请输入内容" v-model="goodParams.query">
            <el-button slot="append" icon="el-icon-search" @click="searchClick"></el-button>
          </el-input>
          <el-button type="primary" class="btn-add_goods" @click="$router.push('/addgoods')">添加商品</el-button>
        </el-col>
      </el-row>
      <el-table :data="goodData" style="width: 100%" border stripe>
        <el-table-column label="#" type="index"> </el-table-column>
        <el-table-column prop="goods_name" label="商品名称" width="490px"> </el-table-column>
        <el-table-column prop="goods_price" label="商品价格(元)"> </el-table-column>
        <el-table-column prop="goods_number" label="数量"> </el-table-column>
        <el-table-column prop="goods_weight" label="商品重量"> </el-table-column>
        <el-table-column prop="add_time" label="创建时间" width="165px">
          <template v-slot="scope">
            {{ scope.row.add_time | dateFormat }}
          </template>
        </el-table-column>
        <el-table-column prop="address" label="操作" width="120px">
          <template v-slot="scope">
            <el-button size="mini" type="primary" icon="el-icon-edit" @click="showEditDialog(scope.row.goods_id)"></el-button>
            <el-button size="mini" type="danger" icon="el-icon-delete" @click="removeGood(scope.row.goods_id)"></el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="goodParams.pagenum"
        :page-sizes="[2, 3, 5, 15]"
        :page-size="goodParams.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        class="pagination-wrap"
      >
      </el-pagination>
    </el-card>
    <!-- 弹窗 -->
    <el-dialog title="修改信息" :visible.sync="editDialogVisible" width="40%" @close="editDialogClose">
      <el-card>
        <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="80px">
          <el-form-item label="商品名称" prop="goods_name">
            <el-input v-model="editForm.goods_name"></el-input>
          </el-form-item>
          <el-form-item label="商品价格" prop="goods_price">
            <el-input v-model="editForm.goods_price"></el-input>
          </el-form-item>
          <el-form-item label="商品数量" prop="goods_number">
            <el-input v-model="editForm.goods_number"></el-input>
          </el-form-item>
          <el-form-item label="商品重量" prop="goods_weight">
            <el-input v-model="editForm.goods_weight"></el-input>
          </el-form-item>
        </el-form>
      </el-card>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="confirmEditDialog">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import http from "../../api/request";
export default {
  name: "Goods",
  data() {
    return {
      goodData: [],
      goodParams: {
        query: "",
        pagenum: 1,
        pagesize: 5
      },
      total: 0,
      editDialogVisible: false,
      editForm: {},
      editFormRules: {
        goods_name: [{ required: true, message: "请输入活动名称", trigger: "blur" }],
        goods_price: [{ required: true, message: "请输入活动名称", trigger: "blur" }],
        goods_number: [{ required: true, message: "请输入活动名称", trigger: "blur" }],
        goods_weight: [{ required: true, message: "请输入活动名称", trigger: "blur" }]
      }
    };
  },
  methods: {
    // 获取后台商品数据
    async getGoodList() {
      const { data: res } = await http.getGoodList(this.goodParams);
      console.log("getGoodList:", res);
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg);
      this.goodData = res.data.goods;
      this.total = res.data.total;
    },
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
      this.goodParams.pagesize = val;
      this.getGoodList();
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
      this.goodParams.pagenum = val;
      this.getGoodList();
    },
    // 删除商品
    async removeGood(id) {
      const confirmTxt = await this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).catch(() => {
        return;
      });
      if (confirmTxt === "confirm") {
        const { data: res } = await http.delGood(id);
        console.log("getGoodList:", res);
        if (res.meta.status !== 200) return this.$message.error(res.meta.msg);
        this.$message.success("删除成功");
        this.getGoodList();
      }
    },
    // 显示编辑商品弹窗
    async showEditDialog(id) {
      this.editDialogVisible = true;
      const { data: res } = await http.queryGoodById(id);
      console.log("queryGoodById:", res);
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg);
      this.editForm = res.data;
    },
    // 编辑商品确认
    async confirmEditDialog() {
      const { data: res } = await http.editGood(this.editForm.goods_id, this.editForm);
      console.log("editGood:", res);
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg);
      this.$message.success("修改成功");
      this.editDialogVisible = false;
      this.getGoodList();
    },
    editDialogClose() {
      this.$refs.editFormRef.resetFields();
    },
    // 搜索商品
    async searchClick() {
      await this.getGoodList();
      this.goodParams.query = "";
    }
  },
  created() {
    this.getGoodList();
  }
};
</script>

<style lang="scss" scope>
.card-top {
  display: flex;
}
.btn-add_goods {
  margin-left: 15px !important;
}
</style>
