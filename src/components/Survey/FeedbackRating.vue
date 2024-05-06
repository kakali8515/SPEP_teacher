<template>
  <div class="rating-wrap">
    <div class="star" v-for="item in props.rating">
      <li><img src="@/assets/teacher/icons/starsolid.svg" /></li>
    </div>
    <div class="star" v-for="item in remaining">
      <li><img src="@/assets/teacher/icons/star.svg" /></li>
    </div>
  </div>
</template>
<script setup>
import { computed } from "vue";

const props = defineProps(["rating"]);
const remaining = computed(() => 5 - Number(props.rating));
</script>
