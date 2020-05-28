<template>
  <div class="orders">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <!-- <el-row>
        <el-col :span="10" class="card-top">
          <el-input placeholder="请输入内容" v-model="orderForm.query">
            <el-button slot="append" icon="el-icon-search" @click="searchClick"></el-button>
          </el-input>
        </el-col>
      </el-row> -->
      <el-table :data="ordersList" style="width: 100%" border stripe>
        <el-table-column label="#" type="index"> </el-table-column>
        <el-table-column prop="order_number" label="订单编号" width="250px"> </el-table-column>
        <el-table-column prop="order_price" label="订单价格(元)"> </el-table-column>
        <el-table-column label="是否付款">
          <template v-slot="scope">
            <el-tag type="danger">{{ scope.row.order_pay === "0" ? "未付款" : "已付款" }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="is_send" label="是否发货"> </el-table-column>
        <el-table-column label="下单时间" width="165px">
          <template v-slot="scope">
            {{ scope.row.create_time | dateFormat }}
          </template>
        </el-table-column>
        <el-table-column prop="address" label="操作" width="120px">
          <template v-slot="scope">
            <el-button size="mini" type="primary" icon="el-icon-edit" @click="editDialogClick(scope.row)"></el-button>
            <!-- <el-button size="mini" type="danger" icon="el-icon-location-outline"></el-button> -->
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="orderForm.pagenum"
        :page-sizes="[2, 3, 5, 15]"
        :page-size="orderForm.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        class="pagination-wrap"
      >
      </el-pagination>
    </el-card>
    <el-dialog title="修改订单信息" :visible.sync="editDialogVisible" width="40%">
      <el-form :model="editForm" ref="editFormRef" label-width="80px">
        <el-form-item label="订单编号">
          <el-input v-model="editForm.order_number" disabled></el-input>
        </el-form-item>
        <el-form-item label="订单价格" prop="order_price">
          <el-input v-model="editForm.order_price"></el-input>
        </el-form-item>
        <el-form-item label="是否付款" prop="order_pay">
          <el-input v-model="editForm.order_pay"></el-input>
        </el-form-item>
        <el-form-item label="是否发货">
          <el-input v-model="editForm.is_send"></el-input>
        </el-form-item>
        <el-form-item label="下单时间">
          <el-input v-model="editForm.create_time" disabled></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="confirmEdit">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import http from "../../api/request";
import { ymdAndHms } from "../../utils/dateFormat";
import _ from "lodash";
export default {
  name: "Orders",
  data() {
    return {
      orderForm: {
        query: "",
        pagenum: 1,
        pagesize: 5
      },
      total: 0,
      ordersList: [],
      editDialogVisible: false,
      editForm: {}
    };
  },
  methods: {
    async getOrdersList() {
      const { data: res } = await http.getOrdersList(this.orderForm);
      console.log("getOrdersList:", res);
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg);
      this.ordersList = res.data.goods;
      this.total = res.data.total;
    },
    handleSizeChange(val) {
      this.orderForm.pagesize = val;
      this.getOrdersList();
    },
    handleCurrentChange(val) {
      this.orderForm.pagenum = val;
      this.getOrdersList();
    },
    editDialogClick(row) {
      this.editDialogVisible = true;
      let newRow = _.cloneDeep(row);
      this.editForm = newRow;
      this.editForm.order_pay = this.editForm.order_pay === "0" ? "未付款" : "已付款";
      this.editForm.create_time = ymdAndHms(this.editForm.create_time);
    },
    async confirmEdit() {
      this.editDialogVisible = false;
      this.editForm.order_pay = this.editForm.order_pay === "未付款" ? "0" : "1";
      const { data: res } = await http.editOrders(this.editForm.order_id, this.editForm);
      console.log("editOrders:", res);
      if (res.meta.status !== 201) return this.$message.error(res.meta.msg);
      this.$message.success("修改成功");
      this.getOrdersList();
    }
    // searchClick() {
    //   this.getOrdersList();
    // }
  },
  created() {
    this.getOrdersList();
  }
};
</script>

<style></style>
