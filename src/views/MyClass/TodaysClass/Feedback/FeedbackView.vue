<template>
    <div class="martop32 mobs-mar mobTab">
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
      <ClassFeedback v-if="currentRouteName === 'MyClassFeedback'"/>
      <FeedbackLPE v-if="currentRouteName === 'FeedbackLPE'" :class-details="details"/>
      <ClassDetailLecture v-if="currentRouteName === 'FeedbackLecture'" :class-details="details"/>
      <FeedbackAssessment v-if="currentRouteName === 'FeedbackAssessment'" :class-details="details"/>
    </div>
  </template>
  
  <script setup>
  import ClassFeedback from "~/MyClass/TodaysClass/Feedback/FeedbackFeedback.vue";
  import FeedbackLPE from "~/MyClass/TodaysClass/Feedback/ClassFeedbackLPE.vue";
  import FeedbackAssessment from "~/MyClass/TodaysClass/Feedback/FeedbackAssessment.vue";
  import ClassDetailLecture from "~/MyClass/TodaysClass/Feedback/ClassFeedbackLecture.vue";
  import { computed, ref, onMounted } from "vue";
  import { useRoute, useRouter } from "vue-router";
  import { Feedback } from "@/services/MyClass/Feedback";

  const feedbackService = new Feedback();
  const tabList = [
    { name: "Feedback", to: "MyClassFeedback" },
    { name: "Assessment", to: "FeedbackAssessment" },
    { name: "Lecture", to: "FeedbackLecture" },
    { name: "LPE", to: "FeedbackLPE" },
  ];
  
  const details = ref({});
  const route = useRoute();
  const router = useRouter();
  
  const currentRouteName = computed(() => route.name);
  const To = (name) => {
    router.push({ name });
  };

  const getManagerClassDetails = async () => {
  let data = {
    class_seq: route.params.class_seq,
    lgCode: "kr",
  };
  try {
    const res = await feedbackService.getManagerClassDetails(data);
    if (res.status == 200) {
      details.value = res.data.data;
    }
  } catch (error) {
    console.log(error);
  } finally {
  }
};

  onMounted(async () => {
  await getManagerClassDetails();
});
  </script>
  