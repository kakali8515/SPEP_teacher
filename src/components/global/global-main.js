import ButtonVue from "./ButtonVue.vue";
import LoaderVue from "./LoaderVue.vue";
import TableVue from "./TableVue.vue";
import PaginationVue from "./PaginationVue.vue";
import NoDataFoundVue from "./NoDataFoundVue.vue";
import ModalVue from "./ModalVue.vue";
import DrawerVue from "./DrawerVue.vue";
import SimplePaginationVue from "./SimplePaginationVue.vue";
import ConfirmModalVue from "./ConfirmModalVue.vue";
import SpinnerVue from "./SpinnerVue.vue";
const GuiComponents = {
  install(Vue) {
    Vue.component("ButtonVue", ButtonVue);
    Vue.component("LoaderVue", LoaderVue);
    Vue.component("TableVue", TableVue);
    Vue.component("PaginationVue", PaginationVue);
    Vue.component("SimplePaginationVue", SimplePaginationVue);
    Vue.component("NoDataFoundVue", NoDataFoundVue);
    Vue.component("ModalVue", ModalVue);
    Vue.component("DrawerVue", DrawerVue);
    Vue.component("ConfirmModalVue", ConfirmModalVue);
    Vue.component("SpinnerVue", SpinnerVue);
  },
};
export default GuiComponents;
