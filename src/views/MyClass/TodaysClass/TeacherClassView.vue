<template>
  <div class="extra-wrap martop24 mobfixed">
    <div class="row  xtrabreak align-end">
      <div class="col-lg-5 col-md-12 mob-calender-fixed">
        <SliderCalendar
          :selected-date="classObj.current_date"
          :hide-filter-button="true"
          @on-date-change="onSearchingClass"
          @on-display-date-picker="showPicker = true"
          @on-display-filter="displayFilter = true"
        />
      </div>
    </div>
    <!-- <div class="row martop32">
        <div class="col-md-12 col-xs-12">
            <Progress/>
        </div>                
    </div> -->

    <div class="row martop32 mob-content" v-if="classList.length">
      <div
        class="col-lg-3 col-spep-2 col-spep-3 col-md-6 col-sm-12"
        :key="idx"
        v-for="(item, idx) in classList"
      >
        <TodaysClassCard
          :data="item"
          :is-clinic="item?.clinic === 'Y'"
          :currentDate="moment(classObj.current_date).format('YYYYMMDD')"
          @openRescheduleModal="onOpenRescheduleModal"
          @openUploadFileModal="onOpenUploadFileModal"
          @openFeedbackModal="onOpenFeedbackModal"
          @enterClass="
            $router.push({
              name: 'ClassDetailsAttendance',
              params: {
                date: moment(classObj.current_date).format('YYYYMMDD'),
                class_seq: item.class_seq,
                course_seq: item.course_seq,
                schedule_seq: item.schedule_seq,
              },
            })
          "
        />
      </div>
    </div>
    <NoDataFoundVue v-else-if="!classList.length && !isLoading" message="There are no classes."/>
    <!-- <PaginationVue
      v-if="classList.length > 0"
      :currentPage="classObj.page"
      :records="classObj.total_records"
      :perPage="classObj.limit"
      @clickPaginate="onPaginate"
    /> -->
  </div>
  <!-- rescheduleClass :: start  -->
  <RescheduleModal 
    v-if="dispalyRescheduleModal" 
    v-model="dispalyRescheduleModal"
    :data="scheduleObj" 
    @on-success="onRescheduleSuccess"
  />
  <!-- rescheduleClass :: end  -->

  <PopUpCalendar
    v-if="showPicker"
    v-model="showPicker"
    :datePicked="classObj.current_date"
    @onDatePicked="onSearchingClass"
  />
  <TodaysClassAttendanceFeedbackDrawer 
    v-if="displayFeedbackModal"
    :visible="displayFeedbackModal"
    :data="feedbackData"
    :seleted-date="classObj.current_date"
    @close="displayFeedbackModal = false"
  />
  <TodaysClassLectureFilesModal
    v-if="displayFileUploadModal"
    :mydata="modal_data"
    :visible="displayFileUploadModal"
    @close="displayFileUploadModal = false"
    :classItem="classItem"
  />
  <LoaderVue :loading="isLoading" />
</template>
<script setup>
import moment from "moment";
import { onMounted, ref, reactive, watch } from "vue";
import { isEqual } from "lodash";
import { TodaysClass } from "@/services/MyClass/TodaysClass";

import SliderCalendar from "@/components/common/SliderCalendar.vue";
import PopUpCalendar from "@/components/common/PopUpCalendar.vue";
import RescheduleModal from "@/components/MyClass/RescheduleModal.vue";
import TodaysClassCard from "@/components/MyClass/TodaysClass/TodaysClassCard.vue";
import TodaysClassLectureFilesModal from "@/components/MyClass/TodaysClass/TodaysClassLectureFilesModal.vue";
import TodaysClassAttendanceFeedbackDrawer from "@/components/MyClass/TodaysClass/TodaysClassAttendanceFeedbackDrawer.vue";
import { useUserData } from "@/stores/useUserDataCopy";
// import Progress from '@/components/Progress.vue';

// INITIALIZE
const showPicker = ref(false);
const userStore = useUserData();
const dispalyRescheduleModal = ref(false);
const displayFileUploadModal = ref(false);
const displayFeedbackModal = ref(false);
const todaysClassService = new TodaysClass();
const isLoading = ref(false);
const classList = ref([]);
const classItem = ref();
const modal_data = ref({});
const displayFilter = ref(false);
const feedbackData = ref(null);
const classObj = reactive({
  page: 1,
  limit: 8,
  total_records: 0,
  current_date: moment().format("YYYY-MM-DD"),
  session: null,
  type: null,
  course_id: null,
  company_id: null,
});
const filterObj = reactive({
  company_id: null,
  course_id: null,
  session: null,
  type: null
})
const scheduleObj = ref({});

// =========== *** FUNCTIONS *** ==============
// For searching class list
const onSearchingClass = async (_data, _type) => {
  if (isEqual(_type, "date")) classObj.current_date = _data;
  // if (isEqual(_type, "company")) classObj.company_id = _data;
  // if (isEqual(_type, "session")) classObj.session = _data;
  // if (isEqual(_type, "course")) classObj.course_id = _data;
  // if (isEqual(_type, "type")) classObj.type = _data;
  // if (displayFilter.value) return;
  await onGetTodaysClassList();
};
// const onRestSelection = (_key) => {
//   classObj[_key] = null;
// };
// On pagination class list
// const onPaginate = async (_page) => {
//   classObj.page = _page;
//   await onGetTodaysClassList();
// };

// const applyFilter = async () => {
//   filterObj.company_id = classObj.company_id
//   filterObj.course_id = classObj.course_id
//   filterObj.session = classObj.session
//   filterObj.type = classObj.type
//   displayFilter.value = false;
//   await onGetTodaysClassList();
// }

// const onCloseFilter = () => {
//   classObj.company_id = filterObj.company_id
//   classObj.course_id = filterObj.course_id
//   classObj.session = filterObj.session
//   classObj.type = filterObj.type
//   displayFilter.value = false;
// }

// CLASS List API
const onGetTodaysClassList = async () => {
  const obj = {
    // query_date: classObj.current_date, //required
    // page: classObj.page, // required
    // limit: classObj.limit, //required

    // NEW 20.11.23
    user_id: userStore.getUserData.id,//userStore.getUserData.id, //'johnshaw',
    lgCode: "kr",
    target_date: classObj.current_date,
  };
  try {
    isLoading.value = true;
    const res = await todaysClassService.getTodaysClassList(obj);
    if (res.data?.result) {
      res.data.data.forEach((item) => {
        item.start_time = moment({
          hour: item.start_hour,
          minute: item.start_minute,
        });
        item.end_time = moment({
          hour: item.end_hour,
          minute: item.end_minute,
        });
      });
      classList.value = [
        ...new Map(
          res.data.data.map((item) => [item["schedule_seq"], item])
        ).values(),
      ];
    }
  } catch (error) {
    console.log(error);
  } finally {
    isLoading.value = false;
  }
};
const onOpenRescheduleModal = (_data) => {
  scheduleObj.value = _data;
  dispalyRescheduleModal.value = true;
};
const onOpenUploadFileModal = (_data) => {
  modal_data.value = _data;
  classItem.value = _data;
  displayFileUploadModal.value = true;
};
const onOpenFeedbackModal = (_data) => {
  feedbackData.value = _data;
  displayFeedbackModal.value = true;
};
const onRescheduleSuccess = async () => {
  scheduleObj.value = {};
  dispalyRescheduleModal.value = false;
  await onGetTodaysClassList();
}


// LIFECYCLE HOOKS
onMounted(async () => {
  isLoading.value = true;
  await userStore.getUserDetails();
  await onGetTodaysClassList();
});
</script>
