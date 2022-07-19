import { createApp } from "vue";
import App from "./App.vue";

import "vite-plugin-vue-tree/styles.css";
import TreePlugin from "vite-plugin-vue-tree";

const app = createApp(App);

app.use(TreePlugin);

app.mount("#app");
