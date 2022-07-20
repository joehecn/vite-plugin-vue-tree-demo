import "element-plus/dist/index.css";

import { createApp } from "vue";
import App from "./App.vue";
import ElementPlus from "element-plus";

import "vite-plugin-vue-tree/styles.css";
import TreePlugin from "vite-plugin-vue-tree";

const app = createApp(App);

app.use(ElementPlus);
app.use(TreePlugin);

app.mount("#app");
