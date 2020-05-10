import axios from "axios";

const service = axios.create({
  baseURL: "http://127.0.0.1:8888/api/private/v1/",
  timeout: 6000
});

// 添加请求拦截器
// service.interceptors.request.use(
//   function(config) {
//     // 在发送请求之前做些什么
//     return config;
//   },
//   function(error) {
//     // 对请求错误做些什么
//     return Promise.reject(error);
//   }
// );

let http = {
  login: function(data) {
    return service({
      url: "login",
      method: "POST",
      data
    });
  }
};

export default http;
