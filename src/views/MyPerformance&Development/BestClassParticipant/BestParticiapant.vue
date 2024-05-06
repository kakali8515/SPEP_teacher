<template>
  <!-- Filter -->
  <div class="martop32">
    <FilterWrapper
      v-model="displayFilter"
      @on-display-filter="openDisplayFilter"
      @on-apply-filter="applyFilter"
      @on-close="onCloseFilter"
    >
      <BestClassParticipantFilter
        :company="classObj.company_id"
        :session="classObj.session"
        :course="classObj.course_id"
        :class="classObj.class"
        :year="classObj.year"
        :month="classObj.month"
        :sort-type="classObj.sort_type"
        @rest-selection="onRestSelection"
        @on-select="onSearchingClass"
      />
    </FilterWrapper>
  </div>
  <!-- Table -->
  <div class="martop16">
    <TableVue
      :fields="fields"
      :data="bestParticipantList"
      :page="pageDetails.currentPage"
      :totalRecord="pageDetails.totalRecord"
      :limit="pageDetails.limit"
      :sortKey="sortKeyTitle"
      :sortOrder="sortOrder"
      @paginationHandler="onChangeRecord"
      @onSorting="onSorting"
    >
      <!-- Year / session -->
      <template #year="{ slotData }">
        <span>{{ `${slotData.year} / ${slotData.order_num}` }}</span>
      </template>
      <!-- Point -->
      <template #point="{ slotData }">
        <span>
          <img src="/src/assets/teacher/icons/starsolid.svg" />{{
            slotData.point !== null ? slotData.point : "0"
          }}
        </span>
      </template>
      <!-- Moile Rate -->
      <template #mobile_rate="{ slotData }">
        <p v-html="getPercentRate(slotData.mobile_rate)"></p>
      </template>
      <!-- Moile Rate -->
      <template #lpe="{ slotData }">
        <p v-html="getPercentRate(slotData.lpe_rate)"></p>
      </template>
      <!-- Moile Rate -->
      <template #cumulative_attendance_rate="{ slotData }">
        <p v-html="getPercentRate(slotData.attandance_rate)"></p>
      </template>
      <!-- Moile Rate -->
      <template #monthly_attendance_rate="{ slotData }">
        <p v-html="getPercentRate(slotData.month_attandance)"></p>
      </template>
    </TableVue>
  </div>
  <LoaderVue :loading="isLoading" />
</template>

<script setup>
import { ref, onMounted, reactive } from "vue";
import { BestClassParticipant } from "@/services/MyPerformance&Development/BestClassParticipant";
import { useUserData } from "@/stores/useUserDataCopy";
import FilterWrapper from "@/components/common/FilterWrapper.vue";
import BestClassParticipantFilter from "@/components/MyPerformance&Development/BestClassParticipant/BestClassParticipantFilter.vue";
import { isEqual } from "lodash";
const userStore = useUserData();
const bestClassParticipantService = new BestClassParticipant();
const bestParticipantList = ref([]);
const displayFilter = ref(false);
const isLoading = ref(false);
const pageDetails = reactive({
  currentPage: 1,
  limit: 10,
  totalRecord: 0,
});
const fields = [
  {
    title: "Company",
    key: "company_name_kr",
    is_display_on_both: true,
  },
  {
    title: "Course",
    key: "program1",
    is_display_on_both: true,
  },
  {
    title: "Year / Session",
    is_display_on_both: true,
    key: "actions",
    slot_name: "year", //
  },
  {
    title: "Class",
    key: "class_name",
    is_sorting: true,
    is_display_on_both: true,
  },
  {
    title: "Participant",
    key: "user_name_kr",
  },
  {
    title: "Employee number",
    key: "emp_number",
  },
  {
    title: "Position",
    key: "position",
  },
  {
    title: "Mobile learning rate",
    key: "actions",
    is_sorting: true,
    slot_name: "mobile_rate",
  },
  {
    title: "LPE",
    key: "actions",
    is_sorting: true,
    slot_name: "lpe",
  },
  {
    title: "Cumulative attendance rate",
    key: "actions",
    is_sorting: true,
    slot_name: "cumulative_attendance_rate",
  },
  {
    title: "Monthly Attendance Rate",
    key: "actions",
    is_sorting: true,
    slot_name: "monthly_attendance_rate",
  },
  {
    title: "Date",
    key: "best_student_date",
    formatter: (value) => {
      return value ? `<span>${moment(value).format("YYYY-MM-DD")}</span>` : "-";
    },
  },
  {
    title: "Point",
    key: "actions",
    slot_name: "point",
    is_display_on_both: true,
  },
];
const classObj = reactive({
  company_id: null,
  year: null,
  session: null,
  course_id: null,
  month: null,
  class: null,
  // sort_type: null,
});
const filterObj = reactive({
  company_id: null,
  year: null,
  session: null,
  course_id: null,
  month: null,
  class: null,
  // sort_type: null,
});
const sortKey = ref(0);
const sortOrder = ref("asc");
const sortKeyTitle = ref("Class");

const onSorting = (key) => {
  switch (key) {
    case "Class":
      sortKey.value = 0;
      break;
    case "Cumulative attendance rate":
      sortKey.value = 1;
      break;
    case "Monthly Attendance Rate":
      sortKey.value = 2;
      break;
    case "Mobile learning rate":
      sortKey.value = 3;
      break;
    case "LPE":
      sortKey.value = 4;
      break;
  }
  sortKeyTitle.value = key;

  if (sortOrder.value == "" || sortOrder.value == "desc")
    sortOrder.value = "asc";
  else sortOrder.value = "desc";

  onGetBestParticipantList();
};
const openDisplayFilter = () => {
  displayFilter.value = true;
  filterObj.company_id = classObj.company_id;
  filterObj.year = classObj.year;
  filterObj.course_id = classObj.course_id;
  filterObj.session = classObj.session;
  filterObj.month = classObj.month;
  filterObj.class = classObj.class;
  // filterObj.sort_type = classObj.sort_type;
};

const onSearchingClass = async (_data, _type) => {
  if (isEqual(_type, "company")) classObj.company_id = _data;
  if (isEqual(_type, "year")) classObj.year = _data;
  if (isEqual(_type, "session")) classObj.session = _data;
  if (isEqual(_type, "course")) classObj.course_id = _data;
  if (isEqual(_type, "month")) classObj.month = _data;
  if (isEqual(_type, "class")) classObj.class = _data;
  // if (isEqual(_type, "sort_type")) classObj.sort_type = _data;
  if (displayFilter.value) return;
  pageDetails.currentPage = 1;
  await onGetBestParticipantList();
};
const onRestSelection = (_key) => {
  classObj[_key] = null;
};
const applyFilter = async () => {
  filterObj.company_id = classObj.company_id;
  filterObj.year = classObj.year;
  filterObj.course_id = classObj.course_id;
  filterObj.session = classObj.session;
  filterObj.month = classObj.month;
  filterObj.class = classObj.class;
  // filterObj.sort_type = classObj.sort_type;
  displayFilter.value = false;
  pageDetails.currentPage = 1;
  await onGetBestParticipantList();
};

const onCloseFilter = () => {
  classObj.company_id = filterObj.company_id;
  classObj.year = filterObj.year;
  classObj.course_id = filterObj.course_id;
  classObj.session = filterObj.session;
  classObj.month = filterObj.month;
  classObj.class = filterObj.class;
  // classObj.sort_type = filterObj.sort_type;
  displayFilter.value = false;
};
// ===== API CALL FOR GETTING BEST CLASS LIST =====
const onGetBestParticipantList = async () => {
  const obj = {
    page: pageDetails.currentPage,
    sort_key: sortKey.value,
    sort_order: sortOrder.value,
  };
  if (classObj.company_id) obj.company_id = classObj.company_id;
  if (classObj.year) obj.year = classObj.year;
  if (classObj.session) obj.order_num = classObj.session;
  if (classObj.course_id) obj.program1_seq = classObj.course_id;
  if (classObj.class) obj.class_seq = classObj.class;
  // if (classObj.sort_type) obj.sort_type = classObj.sort_type;
  if (classObj.month) {
    obj.month = `${classObj.year}-${classObj.month}`;
    obj.is_best = 'true';
  }
  try {
    isLoading.value = true;
    const res = await bestClassParticipantService.getBestParticipantList(obj);
    if (!res.data.success) throw new Error("Something wrong");
    bestParticipantList.value = res.data.data;
    pageDetails.totalRecord = res.data.count;
  } catch (error) {
    console.log(error);
  } finally {
    isLoading.value = false;
  }
};
// ===== HANDLING PAGINATION =====
const onChangeRecord = async (_page) => {
  pageDetails.currentPage = _page;
  await onGetBestParticipantList();
};
const getPercentRate = (_data) => {
  if (_data) {
    const sepData = _data.split(",");
    const newData = sepData.map(
      (item) => `<span class='text-danger'>${Number(item).toFixed(2)}%</span>`
    );
    return newData.join(" / ");
  } else return `<span> - </span>`;
};
// ===== LIFECYCLE =====
onMounted(async () => {
  isLoading.value = true;
  await userStore.getUserDetails();
  await onGetBestParticipantList();
});
</script>
