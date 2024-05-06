<template>
    <div class="martop32 mob-martop8 survey-tab">
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
      <SurveyResultsSurvey v-if="currentRouteName === 'SurveyResultsSurvey'"/>
      <SurveyResultsFeedback v-if="currentRouteName === 'SurveyResultsFeedback'"/>
    </div>
  </template>
  
  <script setup>
  import SurveyResultsSurvey from "./SurveyResultsSurvey.vue";
  import SurveyResultsFeedback from "./SurveyResultsFeedback.vue";
  import { computed } from "vue";
  import { useRoute, useRouter } from "vue-router";
  const tabList = [
    { name: "Survey", to: "SurveyResultsSurvey" },
    { name: "Feedback", to: "SurveyResultsFeedback" },
  ];
  
  const route = useRoute();
  const router = useRouter();
  
  const currentRouteName = computed(() => route.name);
  const To = (name) => {
    router.push({ name });
  };
  </script>
  