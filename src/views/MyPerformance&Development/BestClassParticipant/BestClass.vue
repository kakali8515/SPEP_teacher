<template>
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
  <div class="martop16 hightsfix">
    <TableVue
      :fields="fields"
      :data="bestClassList"
      :page="pageDetails.currentPage"
      :totalRecord="pageDetails.totalRecord"
      :limit="pageDetails.limit"
      :sortKey="sortKeyTitle"
      :sortOrder="sortOrder"
      @paginationHandler="onChangeRecord"
      @on-row-clicked="onSlectedRowData"
      @onSorting="onSorting"
    >
      <!-- Year -->
      <template #year="{ slotData }">
        <span>{{ `${slotData.year} / ${slotData.order_num}` }}</span>
      </template>
      <!-- Point -->
      <template #point="{ slotData }">
        <span
          ><img src="/src/assets/teacher/icons/starsolid.svg" />{{
            slotData.point
          }}</span
        >
      </template>
    </TableVue>
  </div>
  <BestClassDetailDrawer
    v-if="displayDetailsModal"
    :data="selectedData"
    :visible="displayDetailsModal"
    @close="displayDetailsModal = false"
  />
  <LoaderVue :loading="isLoading" />
</template>

<script setup>
import { ref, onMounted, reactive } from "vue";
import { BestClassParticipant } from "@/services/MyPerformance&Development/BestClassParticipant";
import { useUserData } from "@/stores/useUserDataCopy";
import FilterWrapper from "@/components/common/FilterWrapper.vue";
import BestClassParticipantFilter from "@/components/MyPerformance&Development/BestClassParticipant/BestClassParticipantFilter.vue";
import BestClassDetailDrawer from "@/components/MyPerformance&Development/BestClassParticipant/BestClassDetailDrawer.vue";
import { isEqual } from "lodash";
import moment from "moment";
const userStore = useUserData();
const bestClassParticipantService = new BestClassParticipant();
const bestClassList = ref([]);
const isLoading = ref(false);
const displayFilter = ref(false);
const displayDetailsModal = ref(false);
const selectedData = ref(null);
const pageDetails = reactive({
  currentPage: 1,
  limit: 10,
  totalRecord: 0,
});
const sortKey = ref(0);
const sortOrder = ref("asc");
const sortKeyTitle = ref("Class");
const fields = [
  {
    title: "Ranking",
    key: "rnum",
    is_display_on_both: true,
  },
  {
    title: "Class",
    key: "class_name",
    is_sorting: true,
    is_display_on_both: true,
  },
  {
    title: "Year / Session",
    is_display_on_both: true,
    key: "actions",
    is_sorting: true,
    slot_name: "year", //
  },
  {
    title: "Point",
    key: "actions",
    slot_name: "point",
    is_display_on_both: true,
  },
  {
    title: "Registered date",
    key: "best_class_date",
    formatter: (value) => {
      return value ? `<span>${moment(value).format("YYYY-MM-DD")}</span>` : "";
    },
  },
];
const classObj = reactive({
  company_id: null,
  year: null,
  session: null,
  course_id: null,
  month: null,
  class: null,
  sort_type: null,
});
const filterObj = reactive({
  company_id: null,
  year: null,
  session: null,
  course_id: null,
  month: null,
  class: null,
  sort_type: null,
});

const onSorting = (key) => {
  if (key == "Class") {
    sortKey.value = 0;
  } else {
    sortKey.value = 3;
  }
  sortKeyTitle.value = key;

  if (sortOrder.value == "asc") sortOrder.value = "desc";
  else sortOrder.value = "asc";
  onGetBestClassList();
};
const openDisplayFilter = () => {
  displayFilter.value = true;
  filterObj.company_id = classObj.company_id;
  filterObj.year = classObj.year;
  filterObj.course_id = classObj.course_id;
  filterObj.session = classObj.session;
  filterObj.month = classObj.month;
  filterObj.class = classObj.class;
  filterObj.sort_type = classObj.sort_type;
};

const onSearchingClass = async (_data, _type) => {
  if (isEqual(_type, "company")) classObj.company_id = _data;
  if (isEqual(_type, "year")) classObj.year = _data;
  if (isEqual(_type, "session")) classObj.session = _data;
  if (isEqual(_type, "course")) classObj.course_id = _data;
  if (isEqual(_type, "month")) classObj.month = _data;
  if (isEqual(_type, "class")) classObj.class = _data;
  if (isEqual(_type, "sort_type")) classObj.sort_type = _data;
  if (displayFilter.value) return;
  pageDetails.currentPage = 1;
  await onGetBestClassList();
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
  filterObj.sort_type = classObj.sort_type;
  displayFilter.value = false;
  pageDetails.currentPage = 1;
  await onGetBestClassList();
};

const onCloseFilter = () => {
  classObj.company_id = filterObj.company_id;
  classObj.year = filterObj.year;
  classObj.course_id = filterObj.course_id;
  classObj.session = filterObj.session;
  classObj.month = filterObj.month;
  classObj.class = filterObj.class;
  classObj.sort_type = filterObj.sort_type;
  displayFilter.value = false;
};
// ===== API CALL FOR GETTING BEST CLASS LIST =====
const onGetBestClassList = async () => {
  const obj = {
    page: pageDetails.currentPage,
    limit: pageDetails.limit,
    sort_key: sortKey.value,
    sort_by: sortOrder.value,
  };
  if (classObj.company_id) obj.company_id = classObj.company_id;
  if (classObj.year) obj.year = classObj.year;
  if (classObj.session) obj.session = classObj.session;
  if (classObj.course_id) obj.course_id = classObj.course_id;
  if (classObj.month) obj.month = `${classObj.year}-${classObj.month}`;
  if (classObj.class) obj.class_id = classObj.class;
  // if (classObj.sort_type) obj.sort_key = classObj.sort_type;
  try {
    isLoading.value = true;
    const res = await bestClassParticipantService.getBestClassList(obj);
    if (!res.data.success) throw new Error("Something wrong");
    bestClassList.value = res.data.list;
    pageDetails.totalRecord = res.data.totalRows;
  } catch (error) {
    console.log(error);
  } finally {
    isLoading.value = false;
  }
};
// ===== HANDLING PAGINATION =====
const onChangeRecord = async (_page) => {
  pageDetails.currentPage = _page;
  await onGetBestClassList();
};

const onSlectedRowData = (_data) => {
  selectedData.value = _data;
  displayDetailsModal.value = true;
};
// ===== LIFECYCLE =====
onMounted(async () => {
  isLoading.value = true;
  await userStore.getUserDetails();
  await onGetBestClassList();
});
</script>
