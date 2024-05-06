<template>
  <div class="martop24 mob-martop15">
    <Filter
      :filterData="filterObj"
      :mountedFunctionCalls="['fetchTeacherCompanyDropdown']"
      :vueSelectedDate="classObj.date"
      @onSelect="onSearchingClass"
      @resetSelection="onResetSelection"
      @onClose="onClose"
    />
  </div>
  <div class="martop16 alldata-feedback">
    <!-- <ClassFeedbackTable/> -->
    <TableVue
      :fields="fields"
      :data="feedbackData"
      :page="page"
      :totalRecord="totalRecords"
      :limit="limit"
      @paginationHandler="onChangeRecord"
    >
      <template #time="{ slotData }">
        {{ `${slotData.start_time} ~ ${slotData.end_time}` }}
      </template>
      <template #attendance_status="{ slotData }">
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
      <template #feedback="{ slotData }">
        <button
          v-if="
            slotData.has_feedback === 0 ||
            !slotData.attendance_status ||
            absentStatus.includes(slotData.attendance_status) ||
            noClassStatus.includes(slotData.attendance_status)
          "
          class="no-class"
          style="pointer-events: none"
        >
          Feedback &nbsp;<img
            src="@/assets/teacher/icons/right-icon-grey.svg"
          />
        </button>
        <button v-else-if="slotData.feedback_count > 0" class="present">
          <img src="@/assets/teacher/icons/check.svg" /> &nbsp;Completed
        </button>
        <button v-else class="bluebtn" @click.stop="To(slotData)">
          Feedback <img src="@/assets/teacher/icons/righticon-blue.svg" />
        </button>
      </template>
    </TableVue>
  </div>
  <LoaderVue :loading="loaderState" />
</template>

<script setup>
import Filter from "@/components/common/Filter.vue";
// import Filter from '@/components/Filter.vue';
import moment from "moment";
import { ref, reactive, onMounted, computed } from "vue";
import { CheckList } from "@/services/MyClass/CheckList";
import {
  presentStatus,
  absentStatus,
  noClassStatus,
} from "@/config/constants.js";
import { isEqual } from "lodash";
import { useRouter } from "vue-router";
const router = useRouter();
const checkListService = new CheckList();
const loaderState = ref(false);
const updateKey = ref(1);
const classObj = reactive({
  date: moment().format("YYYY-MM-DD"),
  year: "",
  class_id: "",
  company_id: "",
  cpName_id: "",
});
const page = ref(1);
const limit = ref(10);
const totalRecords = ref(0);
const feedbackData = ref([]);

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
    key: "area_name_kr",
  },
  {
    title: "Attendance",
    key: "actions",
    slot_name: "attendance_status",
    is_display_on_both: true,
  },
  {
    title: "Status",
    key: "actions",
    slot_name: "feedback",
    is_display_on_both: true,
  },
];
const To = (data) => {
  router.push({
    name: "MyClassFeedback",
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
  await getALLDataFeedbackList();
};

const onSearchingClass = async (_data, _type) => {
  if (isEqual(_type, "company")) classObj.company_id = _data;
  if (isEqual(_type, "class")) classObj.class_id = _data;
  if (isEqual(_type, "cp_name")) classObj.cpName_id = _data;
  if (isEqual(_type, "date")) classObj.date = _data;
  if (
    classObj.company_id != "" ||
    classObj.class_id != "" ||
    classObj.cpName_id != "" ||
    classObj.date != ""
  )
    page.value = 1;
  await getALLDataFeedbackList();
};

const onResetSelection = (_key) => {
  classObj[_key] = "";
};
const onClose = () => {
  updateKey.value++;
};

const getALLDataFeedbackList = async () => {
  const data = {
    page: page.value,
    limit: limit.value,
    status: "all",
    lesson_date: moment(classObj.date).format("YYYY-MM-DD"),
    ...(classObj.company_id && { company_id: classObj.company_id }),
    ...(classObj.year && { year: classObj.year }),
    ...(classObj.cpName_id && { cp_id: classObj.cpName_id }),
    ...(classObj.class_id && { class_id: classObj.class_id }),
  };
  try {
    loaderState.value = true;
    const res = await checkListService.getAllDataCheckListData(
      data,
      "feedback"
    );
    if (res.data) {
      feedbackData.value = res.data.list;
      feedbackData.value.forEach((item) => {
        item.start_time = moment({
          hour: item.start_hour,
          minute: item.start_minute,
        }).format("HH:mm");
        item.end_time = moment({
          hour: item.end_hour,
          minute: item.end_minute,
        }).format("HH:mm");
        item.lesson_date = moment(item.lesson_date).format("YYYY-MM-DD");
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
  await getALLDataFeedbackList();
});
</script>
<style>
.dp__outer_menu_wrap.dp--menu-wrapper{
  top: 55px !important;
}
</style>
