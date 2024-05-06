import { createApp } from "vue";
import App from "./App.vue";
import { createPinia } from "pinia";
import router from "./router";
import "bootstrap/dist/css/bootstrap.css";
import "@/assets/styles/style.scss";
import globalComponents from "@/components/global/global-main";
import pageStore from "./stores/pageStore";
import VueSweetalert2 from 'vue-sweetalert2';
import VueDatePicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css'
import VueSignaturePad from 'vue-signature-pad';
import VueApexCharts from "vue3-apexcharts";


const pinia = createPinia();

const app = createApp(App)
  .use(router)
  .use(pinia)
  .provide("pageStore", pageStore)
  .use(globalComponents)
  .use(VueSweetalert2)
  .use(VueSignaturePad)
  .use(VueApexCharts)
  .component('VueDatePicker', VueDatePicker)
app.mount("#app");
