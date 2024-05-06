<template>
    <div class="loader-background" v-if="isLoading">
        <div>
        <div class="loader">
        </div>
        <small>loading....</small>
    </div>
    </div>
  </template>
  <script setup>
  import { computed } from "vue";
  const props = defineProps({
      loading: {
          default: false,
          type: Boolean,
      } 
  })
  const isLoading = computed(()=>props.loading);
  </script>
  <style lang="scss" scoped>
.loader {
    border: 6px solid #f3f3f3;
  border-radius: 50%;
  border-top: 6px solid #3498db;
  width: 60px;
  height: 60px;
  -webkit-animation: spin 2s linear infinite; /* Safari */
  animation: spin 2s linear infinite;
}

/* Safari */
@-webkit-keyframes spin {
  0% { -webkit-transform: rotate(0deg); }
  100% { -webkit-transform: rotate(360deg); }
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style>
  