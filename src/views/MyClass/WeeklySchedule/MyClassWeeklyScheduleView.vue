<template>
    <div class="martop24 weeks mobile-week-calendar">
        <SliderCalendar 
            :isDisabledSelection="true" 
            :selected-date="currentDate" 
            change-type-by-day-or-week="week"
            :hide-filter-button="true" 
            :hide-sunday="true"
            @on-display-date-picker="showPicker = true" 
            @on-date-change="onSearchingClass" 
        />
    </div>
    <div class="weekly-schedule-wrap">
        <div class="week-main-wrap" v-if="scheduleList">
            <div class="every-week" v-for="day in Object?.keys(scheduleList)" :key="day">
                <div class="day">
                    <p>{{ capitalize(day) }}</p>
                </div>
                <div class="content pointer" v-for="(item, idx) in scheduleList?.[day]" :key="idx">
                    <WeeklyScheduleCard :data="item" :is-clinic="item?.clinic === 'Y'" :selectedId="selectedSchduleSeq"
                    @click="openDetailModal(item)" @on-reschedule="onOpenRescheduleModal"/>
                </div>
                <div class="content" v-if="!scheduleList?.[day].length">
                    <NoClass />
                </div>
            </div>
        </div>
    </div>
    <!-- POP UP CALENDER -->
    <PopUpCalendar v-if="showPicker" v-model="showPicker" :disabledWeekDays="[0]" :WeekPicker="true"
        :datePicked="currentDate" @onDatePicked="onSearchingClass" />

    <!-- show weekly schedule details modal screen -->
    <weeklyScheduleDetail v-if="weeklyScheduleDetailModal" :showModal="weeklyScheduleDetailModal" :data="weeklyDetailData"
    :extra-data="cardData"
        @close="closeWeeklyScheduleDetailsModal" @openRescheduleModal="onOpenRescheduleModal"
        :currentDate="moment(classObj.current_date).format('YYYYMMDD')" :scheduleSeq="schedule_seq_val"
        @openUploadFileModal="onOpenUploadFileModal" @enterClass="openEnterClass" 
        @enter-clinic-attendance="onOpenClinicAttendence"
        />
    <TodaysClassAttendanceFeedbackDrawer 
        v-if="displayFeedbackModal"
        :visible="displayFeedbackModal"
        :data="feedbackData"
        :seleted-date="cardData.lesson_date"
        @close="displayFeedbackModal = false"
  />
    <!-- Loader  -->
    <LoaderVue :loading="isLoading" />

    <!-- lecture file modal  -->
    <TodaysClassLectureFilesModal v-if="displayFileUploadModal" :mydata="modal_data" :visible="displayFileUploadModal"
        @close="displayFileUploadModal = false" :classItem="classItem" />
     <!-- rescheduleClass :: start  -->
    <RescheduleModal 
        v-if="dispalyRescheduleModal" 
        v-model="dispalyRescheduleModal"
        :data="scheduleObj" 
        :schedule_seq="schedule_seq_val"
        @on-success="onRescheduleSuccess"
    />
    <!-- rescheduleClass :: end  -->
</template>


<script setup>
import moment from "moment";
import { capitalize } from "lodash";
import { onMounted, ref, reactive, computed, shallowRef } from "vue";
import SliderCalendar from '@/components/common/SliderCalendar.vue';
import PopUpCalendar from '@/components/common/PopUpCalendar.vue';
import WeeklyScheduleCard from '@/components/MyClass/WeeklySchedule/WeeklyScheduleCard.vue';
import weeklyScheduleDetail from '@/components/MyClass/WeeklySchedule/WeeklyScheduleDetailModal.vue';
import TodaysClassLectureFilesModal from "@/components/MyClass/TodaysClass/TodaysClassLectureFilesModal.vue";
import NoClass from '@/components/MyClass/WeeklySchedule/NoClass.vue';
import { WeeklySchedule } from "@/services/MyClass/WeeklySchedule";
import { useUserData } from "@/stores/useUserDataCopy";
import { TodaysClass } from "@/services/MyClass/TodaysClass";
import { useRouter } from "vue-router";
const router = useRouter();
import RescheduleModal from "@/components/MyClass/RescheduleModal.vue";
import TodaysClassAttendanceFeedbackDrawer from "@/components/MyClass/TodaysClass/TodaysClassAttendanceFeedbackDrawer.vue";
const WeeklyScheduleService = new WeeklySchedule();
const todaysClassService = new TodaysClass();
const store = useUserData();

const date = ref(new Date());
const currentDate = ref(new Date());
const displayFileUploadModal = ref(false);
const showPicker = ref(false);
const isLoading = ref(false);
const scheduleList = ref(null);
const weeklyScheduleDetailModal = ref(false);
const dispalyRescheduleModal = ref(false);
const scheduleError = ref(null);
const time2 = ref(null);
const scheduleObj = ref({});
const schedule_seq_val = ref('')
const weeklyDetailData = ref()
const modal_data = ref(null);
const classItem = ref();
const isDetailedScreen = ref(false);
const displayFeedbackModal = ref(false);
const feedbackData = ref(null);
const cardData = shallowRef({})
const selectedSchduleSeq = ref(null)
const classObj = reactive({
    current_date: moment().format("YYYY-MM-DD"),
});
const time1 = ref({
    hours: new Date().getHours(),
    minutes: new Date().getMinutes(),
});



// For filtering for selected date
const onSearchingClass = async (_data, _type) => {
    var startDate = Array.isArray(_data) ? _data[0] : _data;
    currentDate.value = moment(startDate).format('YYYY-MM-DD')
    await onGetWeeklyScheduleList();
}
// For getting week no for selected date
const getWeekNo = computed(() => {
    // Specify a date within the month
    var specificDate = moment(currentDate.value); // Use your desired date
    // Get the week number for the specified date
    var weekNumber = specificDate.isoWeek();
    // Get the week number for the first day of the month
    var firstDayOfMonthWeekNumber = moment(specificDate).startOf('month').isoWeek();
    // Calculate the week number within the month
    var weekNumberInMonth = weekNumber - firstDayOfMonthWeekNumber + 1;
    return weekNumberInMonth.toString();
})

// API calling for getting schedule list
const onGetWeeklyScheduleList = async () => {
    const date = moment(currentDate.value)
    const obj = {
        user_id: store.getUserData.id, //'johnshaw',//store.getUserData.id,
        lgCode: "kr",
        year: date.format('YYYY'),
        month: date.format('MM'),
        week: getWeekNo.value
    }
    try {
        isLoading.value = true;
        const res = await WeeklyScheduleService.getWeeklyScheduleList(obj);
        if (!res.data.result) throw new Error("Something wrong");
        const res_data = res.data.data;
        const list = Object.entries(res_data.reduce((acc, item) => {
            if (acc[item.day_of_week]) {
                acc[item.day_of_week] = [...acc[item.day_of_week], item];               
            }
            return acc;
        }, { '2': [], '3': [], '4': [], '5': [], '6': [], '7': [] }))
        const filterdList = list?.reduce((acc, [k, item], idx) => {
            const weekdays = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
            acc[weekdays[idx]] = item;
            return acc;
        }, {});
        scheduleList.value = filterdList;
    } catch (error) {
        console.log(error);
    } finally {
        isLoading.value = false;
    }
}

const openDetailModal = async (item) => {
    isDetailedScreen.value = true
    selectedSchduleSeq.value = item.schedule_seq
    weeklyScheduleDetailModal.value = true
    cardData.value = {...item,
        start_time: moment(item?.o_start_time, 'HH:mm:ss').format('HH:mm'), 
        end_time: moment(item?.o_end_time, 'HH:mm:ss').format('HH:mm')
    };
    schedule_seq_val.value = item.schedule_seq
    await getWeeklyDetail(item)
}
const onOpenClinicAttendence = async (_data) => {
    feedbackData.value = {..._data, ...cardData.value};
    displayFeedbackModal.value = true
    closeWeeklyScheduleDetailsModal();
}
const getWeeklyDetail = async (item) => {
    const obj = {
        class_seq: item.class_seq,
        lgCode: "kr",
    }
    try {
        isLoading.value = true;
        const res = await WeeklyScheduleService.getWeeklyScheduleDetail(obj);
        weeklyDetailData.value = res.data
    } catch (error) {
        console.log(error);
    } finally {
        isLoading.value = false;
    }
}
const closeWeeklyScheduleDetailsModal = () =>{
    weeklyScheduleDetailModal.value = false
    isDetailedScreen.value = false
}
const onOpenUploadFileModal = (_data) => {
    weeklyScheduleDetailModal.value = false
    modal_data.value = _data;
    classItem.value = _data;
    displayFileUploadModal.value = true;
};
const parseClassTime = (timeString) => {
        const [startTime, endTime] = timeString.split('~');

        const [start_hour, start_minute] = startTime.split(':').map(Number);
        const [end_hour, end_minute] = endTime.split(':').map(Number);

        return {
            start_hour,
            start_minute,
            end_hour,
            end_minute
        };
    }
const onOpenRescheduleModal = (_data) => {
    selectedSchduleSeq.value = _data.schedule_seq
    if(isDetailedScreen.value) {
        // const classTimeInfo = parseClassTime(_data.class_time);
        const modifiedData = {
            ..._data,
            ...cardData.value
        };
        scheduleObj.value = modifiedData
    }else {
        scheduleObj.value = _data
    }
    dispalyRescheduleModal.value = true;
};
const onRescheduleSuccess = async () => {
  scheduleObj.value = {};
  dispalyRescheduleModal.value = false;
  weeklyScheduleDetailModal.value = false
//   await onGetTodaysClassList();
}
const openEnterClass = (data) => {
    weeklyScheduleDetailModal.value = false;
    setTimeout(() => {
        router.push({
            name: 'ClassDetailsAttendance', 
            params: {
                date: moment(classObj.current_date).format('YYYYMMDD'),
                class_seq: data.class_seq,
                course_seq: data.course_seq,
                schedule_seq: schedule_seq_val.value,
            },
        });
    }, 100);
}


// ===== LIFE CYCLE ====
onMounted(async () => {
    isLoading.value = true;
    await store.getUserDetails();
    await onGetWeeklyScheduleList();
})
</script>