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
  },
  /**
   * 用户管理 用户数据列表
   */
  getUserList: function(params) {
    return service({
      url: "users",
      method: "GET",
      params
    });
  },
  /**
   * 添加用户
   */
  addUser(data) {
    return service({
      url: "users",
      method: "POST",
      data
    });
  },
  /**
   * 修改用户状态
   */
  changeState(id, newStatus) {
    return service({
      url: `users/${id}/state/${newStatus}`,
      method: "PUT"
    });
  },
  /**
   * 根据id查询用户信息
   */
  queryUserById(id) {
    return service({
      url: `users/${id}`,
      method: "GET"
    });
  },
  /**
   * 编辑用户提交
   */
  changeUserInfo(id, data) {
    return service({
      url: `users/${id}`,
      method: "PUT",
      data
    });
  },
  /**
   * 删除单个用户
   */
  delUser(id) {
    return service({
      url: `users/${id}}`,
      method: "DELETE"
    });
  },
  /**
   * 所有权限列表
   */
  getAllPermission(type) {
    return service({
      url: `rights/${type}`
    });
  },
  /**
   * 角色列表
   */
  getRoles() {
    return service({
      url: "roles",
      method: "GET"
    });
  },
  /**
   * 删除角色指定权限
   */
  delRolesRightsById(roleId, rightId) {
    return service({
      url: `roles/${roleId}/rights/${rightId}`,
      method: "DELETE"
    });
  },
  /**
   * 根据 ID 查询角色
   */
  queryRoleById(id) {
    return service({
      url: `roles/${id}`,
      method: "GET"
    });
  },
  /**
   * 编辑提交角色
   */
  editRole(id, data) {
    return service({
      url: `roles/${id}`,
      method: "PUT",
      data
    });
  },
  /**
   * 删除角色
   */
  delRoleById(id) {
    return service({
      url: `roles/${id}`,
      method: "DELETE"
    });
  },
  /**
   * 角色授权
   */
  addRole(data) {
    return service({
      url: "roles",
      method: "POST",
      data
    });
  },
  /**
   *
   * 角色授权
   */
  roleAuthorization(roleId, data) {
    return service({
      url: `roles/${roleId}/rights`,
      method: "POST",
      data
    });
  },
  /**
   * 分配用户角色
   */
  assignRole(id, data) {
    return service({
      url: `users/${id}/role`,
      method: "PUT",
      data
    });
  },
  /**
   * 商品分类数据列表
   */
  getGoodsTypeList(params) {
    return service({
      url: "categories",
      method: "GET",
      params
    });
  },
  /**
   * 根据 id 查询分类
   */
  queryCategoriesById(id) {
    return service({
      url: `categories/${id}`,
      method: "GET"
    });
  },
  /**
   * 编辑提交分类
   */
  editCategories(id, data) {
    return service({
      url: `categories/${id}`,
      method: "PUT",
      data
    });
  },
  /**
   * 删除分类
   */
  delCategoriesById(id) {
    return service({
      url: `categories/${id}`,
      method: "DELETE"
    });
  },
  /**
   * 添加分类
   */
  addCategories(data) {
    return service({
      url: "categories",
      method: "POST",
      data
    });
  },
  /**
   * 参数列表
   */
  getParamsList(id, sel) {
    return service({
      url: `categories/${id}/attributes?sel=${sel}`,
      method: "GET"
    });
  },
  /**
   * 编辑提交参数
   */
  editParam(id, id2, data) {
    return service({
      url: `categories/${id}/attributes/${id2}`,
      method: "PUT",
      data
    });
  },
  /**
   * 添加动态参数或者静态属性
   */
  addParam(id, data) {
    return service({
      url: `categories/${id}/attributes`,
      method: "POST",
      data
    });
  },
  /**
   * 删除参数
   */
  delParam(id, id2) {
    return service({
      url: `categories/${id}/attributes/${id2}`,
      method: "DELETE"
    });
  },
  /**
   * 根据 ID 查询参数
   */
  queryParam(id, id2, params) {
    return service({
      url: `categories/${id}/attributes/${id2}`,
      method: "GET",
      params
    });
  },
  /**
   * 商品列表数据
   */
  getGoodList(params) {
    return service({
      url: "goods",
      method: "GET",
      params
    });
  },
  /**
   * 删除商品
   */
  delGood(id) {
    return service({
      url: `goods/${id}`,
      method: "DELETE"
    });
  },
  /**
   * 根据 ID 查询商品
   */
  queryGoodById(id) {
    return service({
      url: `goods/${id}`,
      method: "GET"
    });
  },
  /**
   * 编辑提交商品
   */
  editGood(id, data) {
    return service({
      url: `goods/${id}`,
      method: "PUT",
      data
    });
  },
  /**
   * 添加商品
   */
  addGoods(data) {
    return service({
      url: "goods",
      method: "POST",
      data
    });
  },
  /**
   * 订单数据列表
   */
  getOrdersList(params) {
    return service({
      url: "orders",
      method: "GET",
      params
    });
  },
  /**
   * 修改订单状态
   */
  editOrders(id, data) {
    return service({
      url: `orders/${id}`,
      method: "PUT",
      data
    });
  },
  /**
   * 基于时间统计的折线图
   */
  getTimeline() {
    return service({
      url: "reports/type/1",
      method: "GET"
    });
  }
};

export default http;
