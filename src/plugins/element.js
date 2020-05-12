import Vue from "vue";
import {
  Button,
  Form,
  FormItem,
  Input,
  Message,
  Container,
  Header,
  Aside,
  Main,
  Col,
  Menu,
  Submenu,
  MenuItem,
  MenuItemGroup
} from "element-ui";

Vue.use(Button)
  .use(Form)
  .use(FormItem)
  .use(Input)
  .use(Container)
  .use(Header)
  .use(Aside)
  .use(Main)
  .use(Col)
  .use(Menu)
  .use(Submenu)
  .use(MenuItemGroup)
  .use(MenuItem);

Vue.prototype.$message = Message;
