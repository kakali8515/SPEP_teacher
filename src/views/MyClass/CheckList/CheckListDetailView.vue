<template>
    <div class="checklist-wrap">
      <div class="martop24">
        <Filter
          :filterData="filterObj"
          :mountedFunctionCalls="['fetchTeacherCompanyDropdown', 'fetchTypeDropdown']"
          :vueSelectedDate="classObj.date"
          @onSelect="onSearchingClass"
          @resetSelection="onResetSelection"
          @onClose="onClose"
        />
      </div>
      <div class="martop16">
        <div
          v-if="!userStore.getIsMobileViewReady"
          class="table-heading heading-background d-flex justify-content-between align-items-center"
        >
          <h4>{{ route.meta?.breadcrumb[2]?.text }}</h4>
          <!-- <img src="@/assets/teacher/icons/caretright.svg" /> -->
        </div>
        <div class="martop15">
          <TableVue
            :fields="fields"
            :data="feedbackData"
            :page="page"
            :totalRecord="totalRecords"
            :limit="limit"
            @paginationHandler="onChangeRecord"
            @on-row-clicked="getRowValue"
          >
            <template #date="{ slotData }">
              {{ moment(slotData.lesson_date).format("YYYY-MM-DD") }}
            </template>
            <template #time="{ slotData }">
              {{ `${slotData.start_time} ~ ${slotData.end_time}` }}
            </template>
          </TableVue>
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
  import { CheckList } from "@/services/MyClass/CheckList";
  import { useRoute, useRouter } from "vue-router";
  import { useUserData } from "@/stores/useUserDataCopy";
  const userStore = useUserData();
  const route = useRoute();
  const router = useRouter();
  const checkListService = new CheckList();
  const feedbackData = ref([]);
  const loaderState = ref(false);
  const updateKey = ref(1);
  const page = ref(1);
  const limit = 10;
  const totalRecords = ref(0);
  const fields = [
    {
      title: "Date",
      key: "actions",
      slot_name: "date",
      is_display_on_both: true,
    },
    {
      title: "Time",
      key: "actions",
      slot_name: "time",
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
      title: "Company",
      key: "company_name_en",
    },
    {
      title: "Type",
      key: "program3",
    },
  
    {
      title: "Location 1",
      key: "area_name_kr",
    },
  
    {
      title: "Location 2",
      key: "area_d_name_kr",
    },
  ];
  

  const classObj = reactive({
    date: moment().format('YYYY-MM-DD'),
    type: "",
    year: "",
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
        resetDependency: ["year", "class_id"],
        storeVariable: "teacher_company_dropdown",
        onSelectFunction: ["fetchYearDropdown"],
        updateKey: updateKey.value,
      },
      {
        name: "year",
        key: "year",
        selected: classObj.year,
        value: "year",
        label: "Select Year",
        resetDependency: ["class_id"],
        storeVariable: "year_dropdown",
        onSelectFunction: ["fetchClassDropdown"],
        ownDependency: true,
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
        resetDependency: [],
        storeVariable: "class_dropdown",
        onSelectFunction:[],
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
  const getType = computed(() => {
    let type;
    if (route.name === 'CheckListDetailFeedback') {
        type = 'feedback';
    } else if (route.name === 'CheckListDetailAssessment') {
        type = 'assessment';
    } else if (route.name === 'CheckListDetailAttendance') {
        type = 'attendance';
    } else if (route.name === 'CheckListDetailLpe') {
        type = 'lpe';
    }
    return type;
  })
  
  const onChangeRecord = async (_page) => {
    page.value = _page;
    await getDetailsData();
  };
  
  const onSearchingClass = async (_data, _type) => {
    if (isEqual(_type, "company")) classObj.company_id = _data;
    if (isEqual(_type, "class")) classObj.class_id = _data;
    if (isEqual(_type, "type")) classObj.type = _data;
    if (isEqual(_type, "year")) classObj.year = _data;
    if (isEqual(_type, "date")) classObj.date = _data;
    if (
      classObj.company_id != "" ||
      classObj.class_id != "" ||
      classObj.type != "" ||
      classObj.year != "" || 
      classObj.date != ""
    )
      page.value = 1;
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
      page: page.value,
      limit: limit,
      lesson_date: moment(classObj.date).format('YYYY-MM-DD'),
      ...(classObj.company_id && { company_id: classObj.company_id }),
      ...(classObj.year && { year: classObj.year }),
      ...(classObj.type && { type_id: classObj.type }),
      ...(getType.value !== 'attendance' && { status: "pending" }),
      ...(classObj.class_id && { class_id: classObj.class_id })
    };
    try {
      loaderState.value = true;
      let res = await checkListService.getAllDataCheckListData(data, getType.value);
      if (res.data) {
        feedbackData.value = res.data.list;
        feedbackData.value.forEach(item => {
            item.start_time = moment({
                hour: item.start_hour,
                minute: item.start_minute,
            }).format('HH:mm');
            item.end_time = moment({
                hour: item.end_hour,
                minute: item.end_minute,
            }).format('HH:mm');
        })
        totalRecords.value = res.data.totalRows;
      }
    } catch (error) {
      console.log(error);
    } finally {
      loaderState.value = false;
    }
  };
  const getRowValue = (rowData) => {
    let name;
  if (getType.value == 'attendance') {
    name = 'ClassDetailsAttendance'
  } else if (getType.value == 'feedback') {
    name = 'MyClassFeedback'
  } else if (getType.value == 'lpe') {
    name = 'FeedbackLPE'
  } else if (getType.value == 'assessment') {
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
  .dp__outer_menu_wrap.dp--menu-wrapper{
    top: 55px !important;
  }
  .dp--menu-wrapper {
    position: absolute;
    z-index: 99999;
    /* box-shadow: 0px 0px 15px 0px rgba(164, 164, 164, 0.35); */
    left: inherit;
    padding-bottom: 15px;
    background: #fff;
    min-width: 316px;
    min-height: 323px;
}
  </style>