<template>
  <div class="reports">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>数据统计</el-breadcrumb-item>
      <el-breadcrumb-item>数据报表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <!-- 为ECharts准备一个具备大小（宽高）的Dom -->
      <div id="main" style="width: 750px;height:400px;"></div>
    </el-card>
  </div>
</template>

<script>
import http from "../../api/request";
import echarts from "echarts";
import _ from "lodash";
export default {
  name: "Reports",
  data() {
    return {
      options: {
        title: {
          text: "用户来源"
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "cross",
            label: {
              backgroundColor: "#E9EEF3"
            }
          }
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
          containLabel: true
        },
        xAxis: [
          {
            boundaryGap: false
          }
        ],
        yAxis: [
          {
            type: "value"
          }
        ]
      }
    };
  },
  methods: {
    async getTimeline() {
      const { data: res } = await http.getTimeline();
      console.log("timeline:", res);
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg);
      const reportEcharts = echarts.init(document.getElementById("main"));
      const newsOptions = _.merge(res.data, this.options);
      reportEcharts.setOption(newsOptions);
    }
  },
  created() {
    this.getTimeline();
  }
};
</script>

<style></style>
