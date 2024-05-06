<template>
  <div class="mobile-header-area">
    <a href=""><img src="@/assets/teacher/images/logo.svg" /></a>

    <a href="#" @click="openSidebar"
      ><img src="@/assets/teacher/icons/bars.svg"
    /></a>
  </div>
  <SidebarWrapper v-if="sidebarVisiblity" @on-close="closeSidebar"/>
</template>

<script setup>
import { ref } from "vue";
import SidebarWrapper from "./SidebarWrapper.vue";
const sidebarVisiblity = ref(false);

const openSidebar = () => {
  sidebarVisiblity.value = true;
};
const closeSidebar = () => {
  sidebarVisiblity.value = false;
};
</script>
