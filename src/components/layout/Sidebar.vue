<template>
  <div class="sidebar">
    <div class="main-wrap">
      <div class="menu-wrap">
        <div class="d-flex justify-content-between mobile-sidebar-logo-wrap">
          <div class="logo pointer" @click="To('TeacherClass')">
            <img src="@/assets/teacher/images/logo.svg" />
          </div>
          <div class="icon pointer" @click="emit('on-item-click')">
            <img src="@/assets/teacher/icons/close.svg" />
          </div>
        </div>

        <div class="menu-wrapper">
          <!-- ================= ***** My Class ***** =============== -->
          <div class="menu">
            <a
              class="d-flex justify-content-between align-items-center"
              @click="onToggle('myClass')"
              :class="{ navicon: toggleBtn.myClass }"
            >
              <span class="d-flex justify-content-start align-items-center"
                ><img src="@/assets/teacher/icons/comp.svg" />My Class</span
              >
              <!-- <img class="arrow" src="@/assets/teacher/icons/navicon.svg" /> -->
            </a>
            <ul v-show="toggleBtn.myClass">
              <!-- Toggle Sub Menu List -->
              <li
                v-for="item in myClassDropdownList"
                @click="To(item.to)"
                :class="{
                  active: item.activeRoutes.includes(currentRouteName),
                }"
              >
                {{ item.name }}
              </li>
            </ul>
          </div>
          <!-- =============== ***** My Data ***** =============== -->
          <div class="menu">
            <a
              class="d-flex justify-content-between align-items-center"
              @click="onToggle('performance')"
              :class="{ navicon: toggleBtn.performance }"
            >
              <span class="d-flex justify-content-start align-items-center"
                ><img src="@/assets/teacher/icons/data.svg" />My Performance &
                Development</span
              >
              <!-- <img class="arrow" src="@/assets/teacher/icons/navicon.svg" /> -->
            </a>
            <ul v-show="toggleBtn.performance">
              <!-- Toggle Sub Menu List -->
              <li
                v-for="item in performanceDropdownList"
                @click="To(item.to)"
                :class="{
                  active: item.activeRoutes.includes(currentRouteName),
                }"
              >
                {{ item.name }}
              </li>
            </ul>
          </div>
          <!-- ================= ***** My Admin ***** =================== -->
          <div class="menu">
            <a
              class="d-flex justify-content-between align-items-center"
              @click="onToggle('myAdmin')"
              :class="{ navicon: toggleBtn.myAdmin }"
            >
              <span class="d-flex justify-content-start align-items-center"
                ><img src="@/assets/teacher/icons/admin.svg" />My Admin</span
              >
              <!-- <img class="arrow" src="@/assets/teacher/icons/navicon.svg" /> -->
            </a>
            <ul v-show="toggleBtn.myAdmin">
              <!-- Toggle Sub Menu List -->
              <li
                v-for="item in myAdminDropdownList"
                @click="To(item.to)"
                :class="{
                  active: item.activeRoutes.includes(currentRouteName),
                }"
              >
                {{ item.name }}
              </li>
            </ul>
          </div>
          <!-- ================== ***** Message ***** ================= -->
          <div class="menu">
            <a
              class="d-flex justify-content-between align-items-center"
              @click="onToggle('message')"
              :class="{ navicon: toggleBtn.message }"
            >
              <span class="d-flex justify-content-start align-items-center"
                ><img src="@/assets/teacher/icons/chart.svg" />Message</span
              >
              <!-- <img class="arrow" src="@/assets/teacher/icons/navicon.svg" /> -->
            </a>
            <ul v-show="toggleBtn.message">
              <!-- Toggle Sub Menu List -->
              <li
                v-for="item in messageDropdownList"
                @click="To(item.to)"
                :class="{
                  active: item.activeRoutes.includes(currentRouteName),
                }"
              >
                {{ item.name }}
              </li>
            </ul>
          </div>
        </div>
      </div>
      <!-- ================ ***** Setting & Logout ***** ================ -->
      <div class="setting">
        <div class="menu" v-if="!store.getIsMobileViewReady">
            <a
              class="d-flex justify-content-between align-items-center"
              @click="onToggle('settings')"
              :class="{ navicon: toggleBtn.settings }"
            >
              <span><img src="@/assets/teacher/icons/setting.svg" />Settings</span
              >
              <!-- <img class="arrow" src="@/assets/teacher/icons/navicon.svg" /> -->
            </a>
            <ul class="subs" v-show="toggleBtn.settings">
              <!-- Toggle Sub Menu List -->
              <li
                v-for="item in settingsDropdownList"
                @click="To(item.to)"
                :class="{
                  active: item.activeRoutes.includes(currentRouteName),
                }"
              >
                {{ item.name }}
              </li>
            </ul>
          </div>
        <ul>
          <li v-if="store.getIsMobileViewReady" @click="onPostMessageFire('handleSettingPage')"><img src="@/assets/teacher/icons/setting.svg" />Settings</li>
          <li @click="onLogoutUserConfirm">
            <img src="@/assets/teacher/icons/logout.svg" />Logout
          </li>
        </ul>
      </div>
    </div>
  </div>
  <!-- Delete modal -->
  <ConfirmModalVue :visible="displayLogoutModal" :is-loading="isLoading"
    title="Are you sure you want to logout?" primaryButtonText="Ok" secondaryButtonText="Close"
    @on-cancel="displayLogoutModal = false" @on-confirm="onLogoutUserConfirm" />
  <!-- Loading -->
  <LoaderVue :loading="isLoading" />
</template>
<script setup>
import { computed, reactive, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { includes } from "lodash";
import { useUserData } from "@/stores/useUserDataCopy";
import { Token } from "@/services/Token";
import usePostMessage from "@/composables/usePostMessage";
const {onPostMessageFire} = usePostMessage();
const tokenUtil = new Token();
const store = useUserData();

const route = useRoute();
const router = useRouter();
const currentRouteName = computed(() => route.name);
const isMobileMenu = ref(false);
const isLoading = ref(false);
const displayLogoutModal = ref(false);
const toggleBtn = reactive({
  myClass: false,
  performance: false,
  myAdmin: false,
  message: false,
  settings: false
});
const emit = defineEmits(["on-item-click"]);
// ========= *** My Class *** ===============
const myClassDropdownList = [
  {
    name: "Today’s Class",
    to: "TeacherClass",
    activeRoutes: [
      "TeacherClass",
      "MyClassFeedback",
      "FeedbackAssessment",
      "FeedbackLPE",
      "ClassDetailsAttendance",
      "ClassDetailLecture",
      "ClassDetailsListeningLab",
      "ClassDetailsActiveLearningPrep",
      "FeedbackLecture"
    ],
  },
  {
    name: "Weekly Schedule",
    to: "MyClassWeeklySchedule",
    activeRoutes: ["MyClassWeeklySchedule"],
  },
  { name: "Check List", 
    to: "CheckList", 
    activeRoutes: [
      "CheckList", 
      "CheckListDetailFeedback",
      "CheckListDetailAssessment",
      "CheckListDetailAttendance",
      "CheckListDetailLpe"
    ] 
  },
  {
    name: "All Data",
    to: "AllDataFeedback",
    activeRoutes: ["AllDataFeedback", "AllDataLPE", "AllDataAssessment"],
  },
];

// ======== *** PERFORMANCE & DEVELOPMENT **** ===========
const performanceDropdownList = [
  {
    name: "Survey Result",
    to: "SurveyResultsSurvey",
    activeRoutes: ["Survey", "SurveyResultsFeedback", "SurveyResultsSurvey"],
  },
  {
    name: "My Class Videos",
    to: "MyClassVideo",
    activeRoutes: ["MyClassVideo"],
  },
  {
    name: "Best Class & Participant History",
    to: "BestClass",
    activeRoutes: ["BestClass", "BestParticipant"],
  },
  {
    name: "Training Library",
    to: "TrainingLibrary",
    activeRoutes: ["TrainingLibrary"],
  },
];

// ======== *** MY ADMIN **** ===========
const myAdminDropdownList = [
  {
    name: "My Info",
    to: "MyInfo",
    activeRoutes: ["MyInfo"],
  },
  {
    name: "Material Management",
    to: "MaterialManagement",
    activeRoutes: ["MaterialManagement"],
  },
  { name: "Payroll", to: "Payroll", activeRoutes: ["Payroll"] },
];
// ======== *** MESSAGE **** ===========
const messageDropdownList = [
  {
    name: "Message",
    to: "ChatList",
    activeRoutes: ["ChatList", "ChatBox"],
  },
  {
    name: "Notice",
    to: "Notice",
    activeRoutes: ["Notice"],
  },
  {
    name: "1:1 Message",
    to: "OneMessage",
    activeRoutes: ["OneMessage", "WriteMessage"],
  },
];
const settingsDropdownList = [
{
    name: "Terms Of Use",
    to: "TermsOfUse",
    activeRoutes: ["TermsOfUse"],
  },
  {
    name: "Privacy Policy",
    to: "PrivacyPolicy",
    activeRoutes: ["PrivacyPolicy"],
  },
]

// For Toggling [***Need to add route name, for those routes auto toggled]
toggleBtn.myClass = includes(
  [
    "TeacherClass",
    "MyClassFeedback",
    "FeedbackAssessment",
    "FeedbackLPE",
    "ClassDetailsAttendance",
    "ClassDetailLecture",
    "ClassDetailsListeningLab",
    "ClassDetailsActiveLearningPrep",
    "AllDataFeedback",
    "AllDataLPE",
    "AllDataAssessment",
    "MyClassWeeklySchedule",
    "CheckList",
    "CheckListDetailFeedback",
    "CheckListDetailAssessment",
    "CheckListDetailAttendance",
    "CheckListDetailLpe",
    "FeedbackLecture"
  ],
  currentRouteName.value
);
toggleBtn.myAdmin = includes(
  ["MyInfo", "Payroll", "MaterialManagement"],
  currentRouteName.value
);
toggleBtn.performance = includes(
  [
    "SurveyResultsFeedback",
    "SurveyResultsSurvey",
    "MyClassVideo",
    "TrainingLibrary",
    "BestParticipant",
    "BestClass",
  ],
  currentRouteName.value
);
toggleBtn.message = includes(
  ["Notice", "OneMessage", "WriteMessage", "ChatList", "ChatBox"],
  currentRouteName.value
);
toggleBtn.settings = includes(
  ["TermsOfUse", "PrivacyPolicy"],
  currentRouteName.value
);

// Functions
const To = (name) => {
  router.push({ name });
  emit("on-item-click");
};
const onToggle = (_key) => {
  const _toggleKeys = Object.keys(toggleBtn);
  _toggleKeys.splice(_toggleKeys.indexOf(_key), 1);
  toggleBtn[_key] = !toggleBtn[_key];
  _toggleKeys.map((_name) => (toggleBtn[_name] = false));
};
// Logout Function
const onLogoutUserConfirm = () => {
  isLoading.value = true;
  setTimeout(() => {
    isLoading.value = false;
    isMobileMenu.value = false;
    tokenUtil.remove("accessTokenT");
    tokenUtil.remove("refreshTokenT");
    store.removeUserData();
    onPostMessageFire("logout");
    displayLogoutModal.value = false;
    router.push({name: 'Login'});
    // window.location.href = '/login';
  }, 1000);
};
</script>
<style scoped lang="scss">
li {
  cursor: pointer;
}
</style>
