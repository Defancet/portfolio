import App from "@/app/App.vue";
import reveal from "@/app/directive/reveal";
import router from "@/app/router";
import warmRoutes from "@/app/util/prefetch";
import { createApp } from "vue";

createApp(App).use(router).directive("reveal", reveal).mount("#app");

warmRoutes(router);
