<template>
  <div class="params">
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>参数列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片布局 -->
    <el-card>
      <!-- 提示 -->
      <el-alert title="注意：只允许为第三级分类设置相关参数！" type="warning" show-icon> </el-alert>
      <p>
        <span class="choose_type">选择商品分类:</span>
        <el-cascader class="type_cascader" v-model="selKeys" :options="goodsTypeList" :props="cascaderProps" @change="handleChange"></el-cascader>
      </p>
      <el-tabs v-model="activeName" @tab-click="tabChangeClick">
        <!-- 动态参数面板 -->
        <el-tab-pane label="动态参数" name="many">
          <el-button type="primary" size="mini" :disabled="!isDisabled" @click="addDialogVisible = true">添加参数</el-button>
          <el-table :data="paramsList" border stripe>
            <el-table-column type="expand">
              <template v-slot="scope">
                <el-tag v-for="(item, index) in scope.row.attr_vals" :key="index" closable>{{ item }}</el-tag>
                <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                >
                </el-input>
                <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag</el-button>
              </template>
            </el-table-column>
            <el-table-column type="index" label="#"></el-table-column>
            <el-table-column prop="attr_name" label="参数名称"> </el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button size="mini" type="primary" icon="el-icon-edit" @click="showEditDialog(scope.row.attr_id)">编辑</el-button>
                <el-button size="mini" type="danger" icon="el-icon-delete" @click="removeParams(scope.row.attr_id)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <!-- 静态参数面板 -->
        <el-tab-pane label="静态参数" name="only">
          <el-button type="primary" size="mini" :disabled="!isDisabled" @click="addDialogVisible = true">添加属性</el-button>
          <el-table :data="paramsList" border stripe>
            <el-table-column type="expand">
              <template v-slot="scope">
                <el-tag v-for="(item, index) in scope.row.attr_vals" :key="index" closable>{{ item }}</el-tag>
                <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                >
                </el-input>
                <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag</el-button>
              </template>
            </el-table-column>
            <el-table-column type="index" label="#"></el-table-column>
            <el-table-column prop="attr_name" label="属性名称"> </el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button size="mini" type="primary" icon="el-icon-edit" @click="showEditDialog(scope.row.attr_id)">编辑</el-button>
                <el-button size="mini" type="danger" icon="el-icon-delete" @click="removeParams(scope.row.attr_id)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>
    <!-- 弹窗 -->
    <el-dialog :title="'添加' + addParamTxt" :visible.sync="addDialogVisible" width="40%" @close="closeAddParamsDialog">
      <el-form ref="addParamsFormRef" :model="addParamsForm" :rules="addParamsFormRules" label-width="80px">
        <el-form-item :label="addParamTxt" prop="params">
          <el-input v-model="addParamsForm.params"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="confirmAddParams">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog :title="'修改' + addParamTxt" :visible.sync="editDialogVisible" width="40%" @close="closeEditParamsDialog">
      <el-form ref="editParamsFormRef" :model="editParamsForm" :rules="editParamsFormRules" label-width="80px">
        <el-form-item :label="addParamTxt" prop="attr_name">
          <el-input v-model="editParamsForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="confirmEditParams">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import http from "../../api/request";
export default {
  name: "Params",
  data() {
    return {
      selKeys: [],
      goodsTypeList: [],
      cascaderProps: {
        value: "cat_id",
        label: "cat_name",
        children: "children",
        checkStrictly: false,
        expandTrigger: "hover"
      },
      activeName: "many",
      paramsList: [],
      paramsChildrenList: [],
      addDialogVisible: false,
      addParamsForm: {
        params: ""
      },
      addParamsFormRules: {
        params: [{ required: true, message: "请输入活动名称", trigger: "blur" }]
      },
      editDialogVisible: false,
      editParamsForm: {},
      editParamsFormRules: {
        attr_name: [{ required: true, message: "请输入活动名称", trigger: "blur" }]
      }
    };
  },
  computed: {
    // 控制添加参数/添加属性按钮的禁用与启用
    isDisabled() {
      return this.selKeys.length === 3;
    },

    // 选中的分类id
    typeId() {
      return this.selKeys.length === 3 ? this.selKeys[2] : null;
    },
    // 添加参数/属性按钮文本
    addParamTxt() {
      if (this.activeName === "many") {
        return "动态参数";
      } else {
        return "静态属性";
      }
    }
  },
  methods: {
    // 获取类型
    async getGoodsTypeList() {
      const { data: res } = await http.getGoodsTypeList({ type: 3 });
      console.log("goodsTypeList:", res);
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg);
      this.goodsTypeList = res.data;
    },
    // 获取参数/属性列表
    async getParamsList(sel) {
      const { data: res } = await http.getParamsList(this.selKeys[this.selKeys.length - 1], sel);
      console.log("getParamsList:", res);
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg);
      res.data.forEach(item => {
        if (!item.attr_vals) {
          item.attr_vals = [];
        } else {
          item.attr_vals = item.attr_vals.split(",");
        }
        item.inputVisible = false;
        item.inputValue = "";
      });
      this.paramsList = res.data;
    },
    getParams() {
      if (this.activeName === "many") {
        this.getParamsList("many");
      } else {
        this.getParamsList("only");
      }
    },
    tabChangeClick(tab) {
      console.log(tab.name);
      this.getParams();
    },
    handleChange(value) {
      console.log(value);
      this.getParams();
    },
    // 添加new tag按钮与input输入框切换
    showInput(row) {
      row.inputVisible = true;
      this.$nextTick(() => {
        this.$refs.saveTagInput.$refs.input.focus();
      });
    },
    // 添加new tag input输入框失去焦点时的事件处理
    async handleInputConfirm(row) {
      console.log("row:", row);
      let inputValue = row.inputValue;
      if (inputValue) {
        row.attr_vals.push(inputValue);
      }
      row.inputVisible = false;
      row.inputValue = "";

      const { data: res } = await http.editParam(this.typeId, row.attr_id, {
        attr_name: inputValue,
        attr_sel: this.activeName,
        attr_vals: row.attr_vals.join(",")
      });
      console.log("addParams:", res);
    },
    // 确认添加参数
    async confirmAddParams() {
      this.addDialogVisible = false;
      const { data: res } = await http.addParam(this.typeId, { attr_name: this.addParamsForm.params, attr_sel: this.activeName });
      console.log("addParams:", res);
      if (res.meta.status !== 201) return this.$message.error(res.meta.msg);
      this.$message.success("添加成功");
      this.getParams();
    },
    // 关闭添加参数弹出框时事件处理
    closeAddParamsDialog() {
      this.$refs.addParamsFormRef.resetFields();
    },
    // 显示编辑弹出框
    async showEditDialog(id) {
      this.editDialogVisible = true;
      const { data: res } = await http.queryParam(this.typeId, id, { attr_sel: this.activeName });
      console.log("queryParams:", res);
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg);
      this.editParamsForm = res.data;
    },
    // 确认编辑参数
    async confirmEditParams() {
      const { data: res } = await http.editParam(this.typeId, this.editParamsForm.attr_id, {
        attr_name: this.editParamsForm.attr_name,
        attr_sel: this.activeName
      });
      console.log("editParams:", res);
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg);
      this.editDialogVisible = false;
      this.$message.success("修改成功");
      this.getParams();
    },
    // 移除参数/属性
    async removeParams(id) {
      const confirmTxt = await this.$confirm("此操作将永久删除该项, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).catch(() => {
        return;
      });
      if (confirmTxt === "confirm") {
        let { data: res } = await http.delParam(this.typeId, id);
        console.log("delParam:", res);
        if (res.meta.status !== 200) return this.$message.error(res.meta.msg);
        this.$message.success("删除成功");
        this.getParams();
      }
    },
    // 关闭编辑参数弹出框时事件处理
    closeEditParamsDialog() {
      this.$refs.editParamsFormRef.resetFields();
    }
  },
  created() {
    this.getGoodsTypeList();
  }
};
</script>

<style lang="scss" scoped>
.choose_type {
  color: #606266;
  font-size: 14px;
  margin-right: 10px;
}
.type_cascader {
  width: 30%;
}
.el-tag {
  margin: 8px;
}
.button-new-tag {
  margin-left: 10px;
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}
.input-new-tag {
  width: 90px;
  // margin-left: 10px;
  // vertical-align: bottom;
}
</style>
