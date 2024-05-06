<template>
    <div class="martop16 bestClass">
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
      <BestClass v-if="currentRouteName === 'BestClass'"/>
      <BestParticiapant v-if="currentRouteName === 'BestParticipant'"/>
    </div>
  </template>
  
  <script setup>
  import BestParticiapant from "./BestParticiapant.vue";
  import BestClass from "./BestClass.vue";
  import { computed } from "vue";
  import { useRoute, useRouter } from "vue-router";
  const tabList = [
    { name: "Best Class", to: "BestClass" },
    { name: "Best Participant", to: "BestParticipant" },
  ];
  
  const route = useRoute();
  const router = useRouter();
  
  const currentRouteName = computed(() => route.name);
  const To = (name) => {
    router.push({ name });
  };
  </script>
  