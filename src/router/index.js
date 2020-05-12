import Vue from "vue";
import VueRouter from "vue-router";
import Home from "../views/Home.vue";
import Login from "../views/Login.vue";
import Users from "../views/user/Users.vue";
import Roles from "../views/power/Roles.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/home",
    name: "Home",
    component: Home,
    children: [
      {
        path: "/users",
        name: "Users",
        component: Users
      },
      {
        path: "/roles",
        name: "Roles",
        component: Roles
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
