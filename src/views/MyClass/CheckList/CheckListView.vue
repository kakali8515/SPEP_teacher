<template>
  <div class="checklist-wrap">
    <!-- Filter -->
    <div class="martop24 mob-mr-to">
      <Filter :filterData="filterObj" :mountedFunctionCalls="['fetchTeacherCompanyDropdown', 'fetchTypeDropdown']"
        :vueSelectedDate="classObj.date" @onSelect="onSearchingClass" @resetSelection="onResetSelection"
        @onClose="onClose" />
    </div>
    <!-- List -->
    <div class="martop16" v-for="item in staticItems" :key="item.text">
      <div class="table-heading heading-background d-flex justify-content-between align-items-center pointer"
        @click="$router.push({ name: item.to })">
        <h4>{{ item.text }}</h4>
        <img src="@/assets/teacher/icons/caretright.svg" />
      </div>
      <div class="martop15 chek-attend" v-if="item.value">
        <CheckListCommonTable :data="checkListData[item.value]?.slice(0, 5)"
          @passCheckListRowData="getCheckListRowData(item.value, $event)" />
      </div>
    </div>
  </div>
  <LoaderVue :loading="loaderState" />
</template>

<script setup>
import moment from "moment";
import Filter from "@/components/common/Filter.vue";
import { ref, onMounted, reactive, computed } from "vue";
import { isEqual } from "lodash";
import CheckListCommonTable from "@/components/MyClass/CheckList/CheckListCommonTable.vue";
import { CheckList } from "@/services/MyClass/CheckList";
import { useRoute, useRouter } from "vue-router";
const route = useRoute();
const router = useRouter();
const checkListService = new CheckList();
const checkListData = ref({});
const loaderState = ref(false);
const updateKey = ref(1);
const staticItems = [
  { text: 'Attendance', value: 'attendance', to: 'CheckListDetailAttendance' },
  { text: 'Assessment', value: 'assessment', to: 'CheckListDetailAssessment' },
  { text: 'Feedback', value: 'feedback', to: 'CheckListDetailFeedback' },
  { text: 'LPE', value: 'lpe', to: 'CheckListDetailLpe' },
];
const classObj = reactive({
  date: moment().format('YYYY-MM-DD'),
  type: "",
  class_id: "",
  company_id: "",
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
    // {
    //   name: "year",
    //   key: "year",
    //   selected: classObj.year,
    //   value: "year",
    //   label: "Select Year",
    //   resetDependency: ["class_id"],
    //   storeVariable: "year_dropdown",
    //   onSelectFunction: ["fetchClassDropdown"],
    //   apiParameter: ['year'],
    //   updateKey: updateKey.value,
    // },
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
      resetDependency: [],
      storeVariable: "class_dropdown",
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
    },
  ];
});
const onSearchingClass = async (_data, _type) => {
  if (isEqual(_type, "company")) classObj.company_id = _data;
  if (isEqual(_type, "session")) classObj.session = _data;
  if (isEqual(_type, "type")) classObj.type = _data;
  if (isEqual(_type, "class")) classObj.class_id = _data;
  if (isEqual(_type, "date")) classObj.date = _data;
  if (
    classObj.company_id != "" ||
    classObj.session != "" ||
    classObj.type != "" ||
    classObj.class_id != "" ||
    classObj.date != ""
  )
    await getDetailsData();
};
const onResetSelection = (_key) => {
  classObj[_key] = "";
};
const onClose = () => {
  updateKey.value++;
};
const getDetailsData = async () => {
  const data = {
    lesson_date: moment(classObj.date).format('YYYY-MM-DD'),
    ...(classObj.company_id && { company_id: classObj.company_id }),
    ...(classObj.type && { program3_seq: classObj.type }),
    ...(classObj.class_id && { class_seq: classObj.class_id }),
  };
  try {
    loaderState.value = true;
    let res = await checkListService.getCheckListTableData(data);
    if (res.status) {
      checkListData.value = res.data;
    }
  } catch (error) {
    console.log(error);
  } finally {
    loaderState.value = false;
  }
};
const getCheckListRowData = (section, rowData) => {
  let name;
  if (section == 'attendance') {
    name = 'ClassDetailsAttendance'
  } else if (section == 'feedback') {
    name = 'MyClassFeedback'
  } else if (section == 'lpe') {
    name = 'FeedbackLPE'
  } else if (section == 'assessment') {
    name = 'FeedbackAssessment'
  }
  router.push({
    name: name,
    params: {
      date: moment(classObj.current_date).format('YYYYMMDD'),
      class_seq: rowData.class_seq,
      course_seq: rowData.course_seq,
      schedule_seq: rowData.schedule_seq,
    },
  })
}
onMounted(async () => {
  await getDetailsData();
});
</script>
<style scoped>
.dp--menu-wrapper{
  background: #fff !important;
}
.dp__menu{
  background: #fff !important;
}
.dp__outer_menu_wrap.dp--menu-wrapper {
  top: 55px !important;  
  
  /* left: calc(50% - 132px) !important; */
}
@media screen and (max-width: 767px) {
  .dp__outer_menu_wrap.dp--menu-wrapper {
  top: 55px !important;  
  /* left: calc(50% - 132px) !important; */
}
}
</style>