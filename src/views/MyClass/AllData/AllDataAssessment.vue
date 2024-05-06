<template>
  <div class="martop24">
    <Filter
      :filterData="filterObj"
      :mountedFunctionCalls="[
        'fetchTeacherCompanyDropdown',
        'fetchTypeDropdown',
      ]"
      :vueSelectedDate="classObj.date"
      @onSelect="onSearchingClass"
      @resetSelection="onResetSelection"
      @onClose="onClose"
    />
  </div>
  <div class="martop16 alldata-assement">
    <!-- <ClassFeedbackTable/> -->
    <TableVue
      :fields="fields"
      :data="assessmentData"
      :page="page"
      :totalRecord="totalRecords"
      :limit="limit"
      @paginationHandler="onChangeRecord"
    >
      <!-- Time -->
      <template #time="{ slotData }">
        {{ `${slotData.start_time} ~ ${slotData.end_time}` }}
      </template>
      <!-- Attendance -->
      <template #attendance="{ slotData }">
        <button
          class="present"
          v-if="presentStatus.includes(slotData.attendance_status)"
        >
          Present
        </button>
        <button
          class="absent"
          v-else-if="absentStatus.includes(slotData.attendance_status)"
        >
          Absent
        </button>
        <button class="no-class" v-else>No Class</button>
      </template>
      <!-- Assessment -->
      <template #assessment="{ slotData }">
        <button
          v-if="
            slotData.has_am === 0 ||
            !slotData.attendance_status ||
            absentStatus.includes(slotData.attendance_status) ||
            noClassStatus.includes(slotData.attendance_status)
          "
          class="no-class"
          style="pointer-events: none"
        >
          Assessment &nbsp;<img
            src="@/assets/teacher/icons/right-icon-grey.svg"
          />
        </button>
        <button v-else-if="slotData.am_count > 0" class="present">
          <img src="@/assets/teacher/icons/check.svg" /> &nbsp;Completed
        </button>
        <button v-else class="bluebtn" @click.stop="To(slotData)">
          Assessment <img src="@/assets/teacher/icons/righticon-blue.svg" />
        </button>
      </template>
    </TableVue>
  </div>
  <LoaderVue :loading="loaderState" />
</template>

<script setup>
import moment from "moment";
import Filter from "@/components/common/Filter.vue";
import { ref, onMounted, reactive, computed } from "vue";
import { isEqual } from "lodash";
import {
  presentStatus,
  absentStatus,
  noClassStatus,
} from "@/config/constants.js";
import { CheckList } from "@/services/MyClass/CheckList";
import { useRouter } from "vue-router";
const router = useRouter();
const allDataService = new CheckList();
const assessmentData = ref([]);
const loaderState = ref(false);
const updateKey = ref(1);
const page = ref(1);
const limit = 10;
const totalRecords = ref(0);
const classObj = reactive({
  company_id: null,
  class_id: null,
  cpName_id: null,
  date: moment().format("YYYY-MM-DD"),
  type: null,
});

const filterObj = computed(() => {
  return [
    {
      name: "company",
      key: "company_name_en",
      selected: classObj.company_id,
      value: "company_id",
      label: "Select Company Name",
      resetDependency: ["class_id"],
      storeVariable: "teacher_company_dropdown",
      onSelectFunction: ["fetchClassDropdown"],
      updateKey: updateKey.value,
    },
    {
      name: "type",
      key: "program3",
      selected: classObj.type,
      value: "program3_seq",
      label: "Select Type",
      resetDependency: [],
      storeVariable: "type_dropdown",
      onSelectFunction: [],
      updateKey: updateKey.value,
    },
    {
      name: "class",
      key: "class_name",
      selected: classObj.class_id,
      value: "class_seq",
      label: "All Classes",
      resetDependency: ["cpName_id"],
      storeVariable: "class_dropdown",
      onSelectFunction: ["fetchCPListDropdown"],
      otherDependcy: true,
      ownDependency: true,
      updateKey: updateKey.value,
    },

    {
      name: "cp_name",
      key: "user_name_en",
      selected: classObj.cpName_id,
      value: "user_id",
      label: "Participant Name",
      resetDependency: [],
      storeVariable: "cp_list",
      onSelectFunction: [],
      updateKey: updateKey.value,
    },

    {
      name: "date",
      key: "date",
      selected: classObj.date,
      label: "",
      type: "vue-date",
      resetDependency: [],
      onSelectFunction: [],
      updateKey: updateKey.value,
    },
  ];
});
const fields = [
  {
    title: "Date",
    key: "lesson_date",
    is_display_on_both: true,
  },
  {
    title: "Class",
    key: "class_name",
    is_display_on_both: true,
  },
  {
    title: "Participant Name",
    key: "user_name_en",
    is_display_on_both: true,
  },
  {
    title: "Time",
    key: "actions",
    slot_name: "time",
    is_display_on_both: true,
  },
  {
    title: "Company",
    key: "company_name_en",
  },
  {
    title: "Type",
    key: "program3",
  },
  {
    title: "Location",
    key: "area_name_en",
  },
  {
    title: "Attendance",
    key: "actions",
    slot_name: "attendance",
    is_display_on_both: true,
  },
  {
    title: "Status",
    key: "actions",
    slot_name: "assessment",
    is_display_on_both: true,
  },
];
const To = (data) => {
  router.push({
    name: "FeedbackAssessment",
    params: {
      date: moment(classObj.date).format("YYYYMMDD"),
      class_seq: data.class_seq,
      course_seq: data.course_seq,
      schedule_seq: data.schedule_seq,
    },
  });
};

const onChangeRecord = async (_page) => {
  page.value = _page;
  await getALLDataAssessmentList();
};

const onSearchingClass = async (_data, _type) => {
  if (isEqual(_type, "company")) classObj.company_id = _data;
  if (isEqual(_type, "class")) classObj.class_id = _data;
  if (isEqual(_type, "cp_name")) classObj.cpName_id = _data;
  if (isEqual(_type, "type")) classObj.type = _data;
  if (isEqual(_type, "date")) classObj.date = _data;
  if (
    classObj.company_id != "" ||
    classObj.class_id != "" ||
    classObj.cpName_id != "" ||
    classObj.date != "" ||
    classObj.type != ""
  )
    page.value = 1;
  await getALLDataAssessmentList();
};

const onResetSelection = (_key) => {
  classObj[_key] = "";
};
const onClose = () => {
  updateKey.value++;
};
const getALLDataAssessmentList = async () => {
  const data = {
    page: page.value,
    limit: limit,
    status: "all",
    lesson_date: moment(classObj.date).format("YYYY-MM-DD"),
    ...(classObj.company_id && { company_id: classObj.company_id }),
    ...(classObj.cpName_id && { cp_id: classObj.cpName_id }),
    ...(classObj.type && { type_id: classObj.type }),
    ...(classObj.class_id && { class_id: classObj.class_id }),
  };
  try {
    loaderState.value = true;
    let res = await allDataService.getAllDataCheckListData(data, "assessment");
    if (res.data) {
      assessmentData.value = res.data.list;
      assessmentData.value.forEach((item) => {
        item.start_time = moment({
          hour: item.start_hour,
          minute: item.start_minute,
        }).format("HH:mm");
        item.end_time = moment({
          hour: item.end_hour,
          minute: item.end_minute,
        }).format("HH:mm");
      });
      totalRecords.value = res.data.totalRows;
    }
  } catch (error) {
    console.log(error);
  } finally {
    loaderState.value = false;
  }
};
onMounted(async () => {
  await getALLDataAssessmentList();
});
</script>
<style>
.dp__outer_menu_wrap.dp--menu-wrapper{
  top: 55px !important;
}
</style>
