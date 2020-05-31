import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";

import "normalize.css";
import "./assets/css/global.css";
import "./assets/iconfont/iconfont.css";
import "./plugins/element.js";
// 引入并挂载VueQuillEditor
import VueQuillEditor from "vue-quill-editor";
// import "quill/dist/quill.core.css"; // import styles
// import "quill/dist/quill.snow.css"; // for snow theme
// import "quill/dist/quill.bubble.css"; // for bubble theme
Vue.use(VueQuillEditor /* { default global options } */);

Vue.config.productionTip = false;

Vue.filter("dateFormat", function ymdAndHms(timeStamp) {
  const dt = new Date(timeStamp);
  let y = dt.getFullYear();
  let m = (dt.getMonth() + 1 + "").padStart(2, "0");
  let d = (dt.getDate() + "").padStart(2, "0");
  let hh = (dt.getHours() + "").padStart(2, "0");
  let mm = (dt.getMinutes() + "").padStart(2, "0");
  let ss = (dt.getSeconds() + "").padStart(2, "0");
  return `${y}-${m}-${d} ${hh}:${mm}:${ss}`;
});

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
