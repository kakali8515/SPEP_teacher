<template>
  <div class="null-result" :style="{'min-height': `${customHeight}px`}">
    <!-- <img src="@/assets/images/no-content-icon.png" /> -->
    <!-- <h4>{{ title }}</h4> -->
    <p>{{ message }}</p>
  </div>
</template>
<script setup>
const props = defineProps({
  // title: {
  //   type: String,
  //   default: 'Oops!'
  // },
  customHeight: {
    type: String,
    default: ''
  },
  message: {
    type: String,
    default: 'No data'
  },
})
</script>
