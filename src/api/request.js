import axios from "axios";

const service = axios.create({
  baseURL: "http://127.0.0.1:8888/api/private/v1/",
  timeout: 6000
});

// 添加请求拦截器;
service.interceptors.request.use(
  function(config) {
    // 在发送请求之前做些什么
    const token = window.sessionStorage.getItem("token");
    if (token) config.headers.Authorization = token;
    return config;
  },
  function(error) {
    // 对请求错误做些什么
    return Promise.reject(error);
  }
);

let http = {
  /**
   * 登录
   */
  login: function(data) {
    return service({
      url: "login",
      method: "POST",
      data
    });
  },
  /**
   * 获取home页面左侧菜单
   */
  getMenu: function() {
    return service({
      url: "menus",
      method: "GET"
    });
  }
};

export default http;
