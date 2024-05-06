
<template>
  <RouterView />
</template>

<script setup>
import { RouterView } from "vue-router";
import { useUserData } from "@/stores/useUserDataCopy";
const store = useUserData();

// *** Checking is this running in Flutter APP or not
window.addEventListener("flutterInAppWebViewPlatformReady", function (event) {
  store.setFieldValue('isMobileViewReady', true);
});
</script>