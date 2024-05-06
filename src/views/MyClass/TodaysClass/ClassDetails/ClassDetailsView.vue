<template>
  <div class="martop32 mobmar-16 mobTab">
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
    <!-- Filter  -->
    <!-- <div class="martop32" v-if="currentRouteName === 'ClassDetailsFeedback'">
      <div class="class-filter-wrap">
        <div class="v-upload">
          
            <button type="button" @click="showVideoListModal">
            Class Video Upload
            <img src="@/assets/teacher/icons/upload-btn.svg" />
          </button>  
        </div>
      </div>
    </div> -->
    <div class="martop24 mobmar-16 mobs-today-class" v-if="currentRouteName === 'ClassDetailsAttendance'">
      <SingleDateSliderCalendar
        @on-date-change="getSelectedDate"
        :availableDate="dateData"
        :currentDate="currentDate"
      />
    </div>
    <!-- Class Details -->
    <div class="martop16">
      <ClassDetailsInfoCard
        :data="classDetails"
        v-if="currentRouteName !== 'ClassDetailsListeningLab'"
      />
    </div>
    <ClassDetailsAttendance
      v-if="currentRouteName === 'ClassDetailsAttendance'"
      :selected-date="currentDate"
      :scheduleSeq="currentScheduleSeq"
    />
    <!-- <ClassDetailsFeedback v-if="currentRouteName === 'ClassDetailsFeedback'" /> -->
    <ClassDetailLecture v-if="currentRouteName === 'ClassDetailLecture'" />
    <ClassDetailsListeningLab
      v-if="currentRouteName === 'ClassDetailsListeningLab'"
    />
    <ClassDetailsActiveLearningPrep
      :type="type"
      v-if="currentRouteName === 'ClassDetailsActiveLearningPrep'"
    />

    <!-- <VideoDetails v-if="showVideoList" :show="showVideoList" @close="showVideoList = false" /> -->
  </div>
</template>
<script setup>
import ClassDetailsInfoCard from "@/components/MyClass/ClassDetails/ClassDetailsInfoCard.vue";
import ClassDetailsAttendance from "./ClassDetailsAttendance.vue";
// import ClassDetailsFeedback from "./ClassDetailsFeedback.vue";
import ClassDetailLecture from "./ClassDetailLecture.vue";
import ClassDetailsListeningLab from "./ClassDetailsListeningLab.vue";
import ClassDetailsActiveLearningPrep from "./ClassDetailsActiveLearningPrep.vue";
import { ClassDetails } from "@/services/MyClass/ClassDetails";
import { computed, ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useUserData } from "@/stores/useUserDataCopy";
import moment from "moment";
import SingleDateSliderCalendar from "@/components/common/SingleDateSliderCalendar.vue";
// const currentDate = ref(new Date());
// import VideoDetails from "@/components/modal/Firstlist.vue"

// const { getUserData } = storeToRefs(useUserData());

const userStore = useUserData();
const classDetailsService = new ClassDetails();
const route = useRoute();
const router = useRouter();
const classDetails = ref({});
const loaderState = ref(false);
const currentScheduleSeq = ref(route.params.schedule_seq);
const type = ref("");
const dateData = ref([]);
const lessonData = ref([]);
const currentRouteName = computed(() => route.name);
const currentDate = ref(moment(route.params.date).format("LL"));
const tabList = [
  { name: "Attendance", to: "ClassDetailsAttendance" },
  { name: "Listening Lab", to: "ClassDetailsListeningLab" },
  { name: "Active Learning Prep", to: "ClassDetailsActiveLearningPrep" },
  { name: "Lecture", to: "ClassDetailLecture" },
];
const To = (name) => {
  router.push({ name });
};

const getClassDetails = async () => {
  let data = {
    user_id: userStore.getUserData.id,
    class_seq: route.params.class_seq,
    schedule_seq: route.params.schedule_seq,
  };
  try {
    loaderState.value = true;
    const res = await classDetailsService.getClassDetails(data);
    if (res.status == 200) {
      classDetails.value = res.data.data;
      type.value = classDetails.value.program3;
    }
  } catch (error) {
    console.log(error);
  } finally {
    loaderState.value = false;
  }
};

const getLessonDate = async () => {
  let data = {
    user_id: userStore.getUserData.id,
    class_seq: route.params.class_seq,
    schedule_seq: route.params.schedule_seq,
  };
  try {
    loaderState.value = true;
    const res = await classDetailsService.getLessonDate(data);
    if (res.status == 200) {
      lessonData.value = res.data.data;
      dateData.value = res.data.data
        .map((item) => {
          return moment(item.lesson_date).format("LL");
        })
        .sort((a, b) => {
          return moment(a, "LL") - moment(b, "LL");
        });
    }
  } catch (error) {
    console.log(error);
  } finally {
    loaderState.value = false;
  }
};
const getSelectedDate = (_date) => {
  currentDate.value = _date;
  let currentDateObject = lessonData.value.find((item) => {
    return moment(item.lesson_date).format("LL") == _date;
  });
  currentScheduleSeq.value = "" + currentDateObject.schedule_seq;
};
onMounted(async () => {
  await userStore.getUserDetails();
  await getClassDetails();
  await getLessonDate();
});
</script>
