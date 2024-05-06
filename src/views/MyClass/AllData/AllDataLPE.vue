<template>
  <div class="martop24">
    <Filter
      :filterData="filterObj"
      :mountedFunctionCalls="['fetchTeacherCompanyDropdown']"
      :vueSelectedDate="classObj.date"
      @onSelect="onSearchingClass"
      @resetSelection="onResetSelection"
      @onClose="onClose"
    />
  </div>
  <div class="martop16">
    <!-- <ClassFeedbackTable/> -->
    <TableVue
      :fields="fields"
      :data="lpeData"
      :page="classObj.page"
      :totalRecord="totalRecord"
      :limit="classObj.limit"
      @paginationHandler="getLpeData"
    >
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
      <template #lpe="{ slotData }">
        <button
          v-if="
            slotData.has_lpe === 0 ||
            !slotData.attendance_status ||
            absentStatus.includes(slotData.attendance_status) ||
            noClassStatus.includes(slotData.attendance_status)
          "
          class="no-class"
          style="pointer-events: none"
        >
          LPE &nbsp;<img src="@/assets/teacher/icons/right-icon-grey.svg" />
        </button>
        <button v-else-if="slotData.lpe_count > 0" class="present">
          <img src="@/assets/teacher/icons/check.svg" /> &nbsp;Completed
        </button>
        <button v-else class="bluebtn" @click.stop="To(slotData)">
          LPE <img src="@/assets/teacher/icons/righticon-blue.svg" />
        </button>
      </template>
    </TableVue>
  </div>
  <LoaderVue :loading="loaderState" />
</template>

<script setup>
import moment from "moment";
import { isEqual } from "lodash";
import Filter from "@/components/common/Filter.vue";
import { ref, onMounted, reactive, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { AllData } from "@/services/MyClass/AllData.js";
import {
  presentStatus,
  absentStatus,
  noClassStatus,
} from "@/config/constants.js";
const AllDataService = new AllData();
const router = useRouter();
const classObj = reactive({
  company_id: null,
  class_id: null,
  cpName_id: null,
  date: moment().format("YYYY-MM-DD"),
  status: "all",
  limit: 10,
  page: 1,
});
const loaderState = ref(false);
const lpeData = ref([]);
const totalRecord = ref(0);
const updateKey = ref(1);

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
    slot_name: "lpe",
    is_display_on_both: true,
  },
];
const To = (data) => {
  router.push({
    name: "FeedbackLPE",
    params: {
      date: moment(classObj.date).format("YYYYMMDD"),
      class_seq: data.class_seq,
      course_seq: data.course_seq,
      schedule_seq: data.schedule_seq,
    },
  });
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
  classObj.page = 1;
  await getALLDataLPEList();
};

const onResetSelection = (_key) => {
  classObj[_key] = "";
};
const onClose = () => {
  updateKey.value++;
};

const getALLDataLPEList = async () => {
  const data = {
    page: classObj.page,
    limit: classObj.limit,
    status: "all",
    lesson_date: moment(classObj.date).format("YYYY-MM-DD"),
    ...(classObj.company_id && { company_id: classObj.company_id }),
    ...(classObj.cpName_id && { cp_id: classObj.cpName_id }),
    ...(classObj.class_id && { class_id: classObj.class_id }),
  };
  try {
    loaderState.value = true;
    const res = await AllDataService.LPEList(data);
    if (res.data) {
      loaderState.value = false;
      lpeData.value = res.data.list;
      lpeData.value.forEach((item) => {
        item.start_time = moment({
          hour: item.start_hour,
          minute: item.start_minute,
        }).format("HH:mm");
        item.end_time = moment({
          hour: item.end_hour,
          minute: item.end_minute,
        }).format("HH:mm");
      });
      totalRecord.value = res.data.totalRows;
    }
  } catch (error) {
    console.log(error);
  } finally {
    loaderState.value = false;
  }
};

const getLpeData = (event) => {
  classObj.page = event;
  getALLDataLPEList();
};

onMounted(async () => {
  await getALLDataLPEList();
});
</script>
<style>
.dp__outer_menu_wrap.dp--menu-wrapper{
  top: 55px !important;
}
</style>
