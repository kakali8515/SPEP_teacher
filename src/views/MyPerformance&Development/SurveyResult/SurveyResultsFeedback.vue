<template>
  <div class="martop24">
    <Filter
      :filterData="filterObj"
      :mountedFunctionCalls="['fetchTeacherCompanyDropdown']"
      @onSelect="onSearchingClass"
      @restSelection="onResetSelection"
      @onClose="onClose"
    />
  </div>
  <div class="martop16">
    <TableVue
      :page="page"
      :totalRecord="totalRecord"
      @paginationHandler="onChangeRecord"
      :fields="fields"
      :data="ApiRes"
      :limit="10"
      @on-row-clicked="showSurveyDetails"
    >
      <template #start_date="{ slotData }">
        {{ moment(slotData.start_date).format("YYYY-MM-DD") }}
      </template>
      <template #difficulty="{ slotData }">
        <Rating :rating="slotData.difficulty" />
      </template>
      <template #achievement="{ slotData }">
        <Rating :rating="slotData.achievement" />
      </template>
      <template #preference="{ slotData }">
        <Rating :rating="slotData.preference" />
      </template>
    </TableVue>
  </div>
  <LoaderVue :loading="isLoading" />
</template>

<script setup>
import moment from "moment";
import Filter from "@/components/common/Filter.vue";
import { onMounted, ref, reactive, watch } from "vue";
import { useGlobalDropdown } from "@/stores/globalDropdown";
import { useUserData } from "@/stores/useUserDataCopy";
import { isEqual } from "lodash";
import { SurveyResult } from "@/services/MyPerformance&Development/SurveyResult";
import Rating from "@/components/Survey/FeedbackRating.vue";
const storedropdown = useGlobalDropdown();
const store = useUserData();

const surveyResult = new SurveyResult();
const ApiRes = ref([]);
const isLoading = ref(false);
const page = ref(1);
const totalRecord = ref(0);
const updateKey = ref(1);

const classObj = reactive({
  session: null,
  year: null,
  course_id: null,
  company_id: null,
});
const fields = [
  {
    title: "Company",
    key: "company_name_en",
    is_display_on_both: true,
  },
  {
    title: "Location",
    key: "area_name_en",
    is_display_on_both: true,
  },
  {
    title: "Year",
    key: "year",
    is_display_on_both: true,
  },
  {
    title: "Session",
    key: "order_num",
    is_display_on_both: true,
  },
  {
    title: "Course",
    key: "program1",
  },
  {
    title: "Difficulty",
    key: "actions",
    slot_name: "difficulty",
  },
  {
    title: "Achievement",
    key: "actions",
    slot_name: "achievement",
  },
  {
    title: "Preference",
    key: "actions",
    slot_name: "preference",
  },
  {
    title: "Registed date",
    key: "actions",
    slot_name: "start_date",
  },
];
const filterObj = reactive([
  {
    name: "company",
    key: "company_name_kr",
    selected: classObj.company_id,
    value: "company_id",
    label: "Select Company Name",
    resetDependency: ["year", "session"],
    storeVariable: "teacher_company_dropdown",
    onSelectFunction: ["fetchTeacherSessionDropdown", "fetchYearDropdown"],
    updateKey: updateKey.value,
  },
  {
    name: "year",
    key: "year",
    selected: classObj.year,
    value: "year",
    label: "Select Year",
    resetDependency: [],
    storeVariable: "year_dropdown",
    // onSelectFunction:[]
    updateKey: updateKey.value,
  },
  {
    name: "session",
    key: "order_num",
    selected: classObj.session,
    value: "order_num",
    label: "Select session",
    resetDependency: ["course_id"],
    storeVariable: "teacher_session_dropdown",
    onSelectFunction: ["fetchTeacherCourseDropdown"],
    updateKey: updateKey.value,
  },
  {
    name: "course",
    key: "program1",
    selected: classObj.course_id,
    value: "program1_seq",
    label: "Select Course",
    resetDependency: [],
    storeVariable: "teacher_course_dropdown",
    // onSelectFunction:[]
    updateKey: updateKey.value,
  },
]);
const onSearchingClass = async (_data, _type) => {
  if (isEqual(_type, "company")) classObj.company_id = _data;
  if (isEqual(_type, "session")) classObj.session = _data;
  if (isEqual(_type, "course")) classObj.course_id = _data;
  if (isEqual(_type, "year")) classObj.year = _data;

  await getSurveyFeedback();
};
const onResetSelection = (_key) => {
  classObj[_key] = null;
};

const onClose = () => {
  updateKey.value++;
};
const showSurveyDetails = (item) => {
  visible.value = true;
};

const onChangeRecord = async (_page) => {
  page.value = _page;
  await getSurveyFeedback();
};
const getSurveyFeedback = async () => {
  let data = {
    user_id: store.getUserData.id,
    lgCode: "en",
    company_id: classObj.company_id,
    year: classObj.year,
    order_num: classObj.session,
    program1_seq: classObj.course_id,
    page: page.value,
  };
  try {
    isLoading.value = true;
    const res = await surveyResult.getSurveyFeedback(data);
    if (res.data?.result) {
      isLoading.value = false;
      ApiRes.value = res.data.data;
      totalRecord.value = res.data.count;
    }
  } catch (error) {
    console.log(error);
  } finally {
    isLoading.value = false;
  }
};

// ===== LIFE CYCLE ====
onMounted(async () => {
  isLoading.value = true;
  await store.getUserDetails();
  await getSurveyFeedback();
});
</script>
