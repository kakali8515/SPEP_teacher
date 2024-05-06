<template>
  <div class="martop24 servays-fil">
    <!-- <div class="col-lg-7 col-md-12"> -->
    <Filter
      :filterData="filterObj"
      :mountedFunctionCalls="['fetchTeacherCompanyDropdown']"
      @onSelect="onSearchingClass"
      @resetSelection="onResetSelection"
      @onClose="onClose"
    />
  </div>
  <div class="martop16 survey-table">
    <TableVue
      :fields="fields"
      :data="ApiRes"
      :limit="10"
      :sortKey="sortKeyTitle"
      :sortOrder="sortOrder"
      @on-row-clicked="showSurveyDetails"
      :page="page"
      :totalRecord="totalRecord"
      @paginationHandler="onChangeRecord"
      @onSorting="onSorting"
    >
      <template #response="{ slotData }">
        {{
          responseData(slotData.total_replied, slotData.total_reply_requested)
        }}% ({{ slotData.total_replied }}/{{ slotData.total_reply_requested }})
      </template>
      <template #session="{ slotData }">
       {{ slotData.order_num }} ({{ slotData.star_date }} ~ {{ slotData.end_date }})
      </template>
    </TableVue>
  </div>
  <div>
    <SurveyResultsDetails
      v-if="visible"
      :visible="visible"
      :surveyItem="surveyItem"
      :page="page"
      @close="
        () => {
          visible = false;
        }
      "
    ></SurveyResultsDetails>
  </div>
  <LoaderVue :loading="loaderState" />
</template>

<script setup>
import Filter from "@/components/common/Filter.vue";
import moment from "moment";
import { onMounted, ref, reactive, computed } from "vue";
import { isEqual } from "lodash";
import { SurveyResult } from "@/services/MyPerformance&Development/SurveyResult";
import SurveyResultsDetails from "@/components/Survey/SurveyResultsDetails.vue";
const surveyResult = new SurveyResult();
const loaderState = ref(false);
const visible = ref(false);
const updateKey = ref(1);
const page = ref(1);
const limit = ref(10);
const totalRecord = ref(10);
const sortKeyTitle = ref("");
const sortKey = ref("");
const sortOrder = ref("asc");
const surveyItem = ref({});

const classObj = reactive({
  session: "",
  year: "",
  course_id: "",
  company_id: "",
});

const ApiRes = ref([]);
const fields = [
  {
    title: "Company",
    key: "company_name_kr",
    is_display_on_both: true,
    is_sorting: true,
  },
  {
    title: "Course",
    key: "course",
    is_sorting: true,
    is_display_on_both: true,
  },
  {
    title: "Year",
    key: "year",
    is_display_on_both: true,
    is_sorting: true,
  },
  {
    title: "Session",
    key: "actions",
    slot_name: "session",
    is_display_on_both: true,
    is_sorting: true,
  },
  {
    title: "Week",
    key: "week",
    is_sorting: true,
  },
  {
    title: "Response",
    key: "actions",
    slot_name: "response",
    is_sorting: true,
  },
  {
    title: "Average Score",
    key: "average_score",
    is_sorting: true,
  },
];
const filterObj = computed(() => {
  return [
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
  ];
});

const responseData = (value1, value2) => {
  return (value1 / value2) * 100;
};
const onSearchingClass = async (_data, _type) => {
  if (isEqual(_type, "company")) classObj.company_id = _data;
  if (isEqual(_type, "session")) classObj.session = _data;
  if (isEqual(_type, "course")) classObj.course_id = _data;
  if (isEqual(_type, "year")) classObj.year = _data;

  await getSurveyResult();
};

const onSorting = (key) => {
  if (sortKeyTitle.value == key) {
    if (sortOrder.value == "asc") sortOrder.value = "desc";
    else sortOrder.value = "asc";
  }

  sortKeyTitle.value = key;
  sortKey.value = fields.findIndex((item) => item.title === key);

  getSurveyResult();
};

const onResetSelection = (_key) => {
  classObj[_key] = "";
};
const onClose = () => {
  updateKey.value++;
};

const onChangeRecord = async (_page) => {
  page.value = _page;
  await getSurveyResult();
};
const showSurveyDetails = (item) => {
  surveyItem.value = item;
  visible.value = true;
};
const getSurveyResult = async () => {
  let data = {
    company_id: classObj.company_id,
    year: classObj.year,
    order_num: classObj.session,
    program1_seq: classObj.course_id,
    page: page.value,
    limit: limit.value,
    sortKey: sortKey.value, // (0,1,2,3,4,5,6)
    sortBy: sortOrder.value, // ("asc", "desc")
  };
  try {
    loaderState.value = true;
    const res = await surveyResult.getSurveyResult(data);
    if (res.data) {
      loaderState.value = false;
      ApiRes.value = res.data.list;
      ApiRes.value = res.data.list.map((item) => {
        item.star_date = moment
          .utc(item.session.split("~")[0], "YYYY.MM.DD")
          .format("LL");
        item.end_date = moment
          .utc(item.session.split("~")[1], "YYYY.MM.DD")
          .format("LL");
        return item;
      });
      totalRecord.value = res.data.totalRows;
    }
  } catch (error) {
    console.log(error);
  } finally {
    loaderState.value = false;
  }
};

onMounted(async () => {
  await getSurveyResult();
});
</script>
