import Vue from "vue";
import VueRouter from "vue-router";
// import Login from "../views/Login.vue";
// import Home from "../views/Home.vue";
// import Welcome from "../views/Welcome.vue";
// import Users from "../views/user/Users.vue";
// import Roles from "../views/power/Roles.vue";
// import Permission from "../views/power/Permission.vue";
// import Categories from "../views/goods/Categories.vue";
// import Params from "../views/goods/Params.vue";
// import Goods from "../views/goods/Goods.vue";
// import AddGoods from "../views/goods/AddGoods.vue";
// import Orders from "../views/order/Orders.vue";
// import Reports from "../views/reports/Reports.vue";

// 路由懒加载
// /* webpackChunkName: "login" */：分组，相同组的路由的打包到同一个js文件中
const Login = () => import(/* webpackChunkName: "main" */ "../views/Login.vue");
const Home = () => import(/* webpackChunkName: "main" */ "../views/Home.vue");
const Welcome = () => import(/* webpackChunkName: "main" */ "../views/Welcome.vue");
const Users = () => import(/* webpackChunkName: "home-clild" */ "../views/user/Users.vue");
const Roles = () => import(/* webpackChunkName: "home-clild" */ "../views/power/Roles.vue");
const Permission = () => import(/* webpackChunkName: "home-clild" */ "../views/power/Permission.vue");
const Categories = () => import(/* webpackChunkName: "home-clild" */ "../views/goods/Categories.vue");
const Params = () => import(/* webpackChunkName: "home-clild" */ "../views/goods/Params.vue");
const Goods = () => import(/* webpackChunkName: "home-clild" */ "../views/goods/Goods.vue");
const AddGoods = () => import(/* webpackChunkName: "home-clild" */ "../views/goods/AddGoods.vue");
const Orders = () => import(/* webpackChunkName: "home-clild" */ "../views/order/Orders.vue");
const Reports = () => import(/* webpackChunkName: "home-clild" */ "../views/reports/Reports.vue");

Vue.use(VueRouter);

const routes = [
  {
    path: "/home",
    name: "Home",
    component: Home,
    redirect: "/welcome",
    children: [
      {
        path: "/welcome",
        name: "Welcome",
        component: Welcome
      },
      {
        path: "/users",
        name: "Users",
        component: Users
      },
      {
        path: "/roles",
        name: "Roles",
        component: Roles
      },
      {
        path: "/rights",
        name: "Permission",
        component: Permission
      },
      {
        path: "/categories",
        name: "Categories",
        component: Categories
      },
      {
        path: "/params",
        name: "Params",
        component: Params
      },
      {
        path: "/goods",
        name: "Goods",
        component: Goods
      },
      {
        path: "/addgoods",
        name: "AddGoods",
        component: AddGoods
      },
      {
        path: "/orders",
        name: "Orders",
        component: Orders
      },
      {
        path: "/reports",
        name: "Reports",
        component: Reports
      }
    ]
  },
  {
    path: "/login",
    name: "login",
    component: Login
  },
  {
    path: "/",
    redirect: "/login"
  }
  // {
  //   path: "/about",
  //   name: "About",
  //   // route level code-splitting
  //   // this generates a separate chunk (about.[hash].js) for this route
  //   // which is lazy-loaded when the route is visited.
  //   component: () =>
  //     import(/* webpackChunkName: "about" */ "../views/About.vue")
  // }
];

const router = new VueRouter({
  routes
});

router.beforeEach((to, form, next) => {
  if (to.path === "/login") return next();
  const token = window.sessionStorage.getItem("token");
  if (!token) return next("/login");
  next();
});

export default router;
