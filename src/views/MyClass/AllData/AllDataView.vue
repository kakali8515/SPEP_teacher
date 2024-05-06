<template>
    <div class="martop16 mob-martop8">
      <div class="tab-wrap">
        <ul>
          <li
            :class="{ active: currentRouteName === tab.to }"
            v-for="tab in tabList"
            @click="To(tab.to)"
          >
            <a href="javascript:void(0)">{{ tab.name }}</a>
          </li>
        </ul>
      </div>
    </div>
    <div>
        <Feedback v-if="currentRouteName === 'AllDataFeedback'"/>
        <LPE v-if="currentRouteName === 'AllDataLPE'"/>
        <Assessment v-if="currentRouteName === 'AllDataAssessment'"/>
    </div>
  </template>
  
  <script setup>
  import Assessment from "./AllDataAssessment.vue";
  import Feedback from "./AllDataFeedback.vue";
  import LPE from "./AllDataLPE.vue";
  import { computed } from "vue";
  import { useRoute, useRouter } from "vue-router";
  const tabList = [
      { name: "Feedback", to: "AllDataFeedback" },
      { name: "Assessment", to: "AllDataAssessment" },
      { name: "LPE", to: "AllDataLPE" },
  ];
  
  const route = useRoute();
  const router = useRouter();
  
  const currentRouteName = computed(() => route.name);
  const To = (name) => {
    router.push({ name });
  };
  </script>
  