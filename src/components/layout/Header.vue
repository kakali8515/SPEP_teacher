<template>
  <Mobileheader />
  <header>
    <div class="head-wrap">
      <div class="title">
        <h1>{{ headerTitle }}</h1>
      </div>
      <div class="bread-crumb">
        <ul>
          <li :class="{ actives: $route.name === 'TeacherClass' }">Home</li>
          <li
            v-for="item in breadCrumb"
            :class="{ active: $route.name === item.to }"
          >
            {{ item?.text }}
          </li>
        </ul>
      </div>
    </div>
  </header>
</template>

<script setup>
import { computed } from "vue";
import { useRoute } from "vue-router";
import Mobileheader from "./Mobileheader.vue";

const route = useRoute();

const headerTitle = computed(() => route.meta.headerTitle);
const breadCrumb = computed(() => route.meta.breadcrumb);
</script>
