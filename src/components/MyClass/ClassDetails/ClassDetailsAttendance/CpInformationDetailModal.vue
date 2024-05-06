<template>
    <ModalVue v-if="modelValue" :show="modelValue"  mWidth="670px" :is-loading="loaderState" @close="$emit('update:modelValue', false)">
        <template #body>
            <div class="class-dtls-info-modal">
                <!-- <div class="cancel pointer" @click="$emit('update:modelValue', false)"><img src="@/assets/icons/close.svg"></div> -->
                <div class="infowrap">
                    <h4>Additional Notes</h4>
                    <p><img src="@/assets/icons/phone.svg">{{ data.phone_mobile }}</p>
                    <p><img src="@/assets/icons/envelope.svg">{{ data.email }}</p>
                </div>
                <div class="progress-wrap">
                    <div class="learning-state">
                        <p>Attendance Rate</p>
                        <div class="progress-bar d-flex justify-content-between align-items-start">
                            <progress id="file" max="100" :value="attendanceData.monthData?.attandance_rate"> {{ attendanceData.monthData?.attandance_rate }}% </progress>
                            <span>{{ attendanceData.monthData?.attandance_rate }}%</span>
                        </div>
                    </div>
                    <div class="learning-state">
                        <p>Learning Progress</p>
                        <div class="progress-bar d-flex justify-content-between align-items-start">
                            <progress id="mobile_rate" max="100" :value="attendanceData.monthData?.mobile_rate"> {{ attendanceData.monthData?.mobile_rate }}% </progress>
                            <span>{{ attendanceData.monthData?.mobile_rate }}%</span>
                        </div>
                    </div>
                </div>
                <div class="calender-wrap">
                    <div class="heading-wrap">
                        <p>Attendance</p>
                        <span>As of {{ moment(currentDate).format('LL') }}</span>
                    </div>
                    <div class="year-wrap">
                        <img class="pointer" @click="onChangeMonth('prev')" src="@/assets/icons/calenderarrow1.svg">
                        <p>{{ currentMonth.format('MMM YYYY') }}</p>
                        <img class="pointer" src="@/assets/icons/calenderarrow2.svg" @click="onChangeMonth('next')">
                    </div>
                    <div class="calender">
                        <div class="table">
                            <table class="table">
                                <thead>
                                    <tr>
                                        <th>Mon</th>
                                        <th>Tue</th>
                                        <th>Wed</th>
                                        <th>Thu</th>
                                        <th>Fri</th>
                                        <th>Sat</th>
                                        <th>Sun</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="week in weeksVal">
                                        <td v-for="item in filterWeek(week)">
                                            {{ item ? item.day.format('M') == currentMonth.format('M') ? item.day.format('D') : '' : ''
                                            }}
                                            <img v-if="absent.includes(item.status)" src="@/assets/teacher/icons/Checkboxred.svg">
                                            <img v-else-if="bluePresent.includes(item.status)" src="@/assets/teacher/icons/Checkboxblue.svg">
                                            <img v-else-if="grayPresent.includes(item.status)" src="@/assets/teacher/icons/checkboxgray.svg">
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <div class="score-wrap">
                        <div class="list">
                            <div class="content">
                                <p>CP Level</p>
                                <span>{{ cc(data.clevel) }}</span>
                            </div>
                            <div class="content">
                                <p>S.P.A Scrore</p>
                                <span>{{ cc(data.spa_value) }}</span>
                            </div>
                            <div class="content">
                                <p>LPE</p>
                                <span>{{ data.lpe_score ? `${data.lpe_score}%` : '-' }}</span>
                            </div>
                            <div class="content">
                                <p>Division</p>
                                <span>{{ cc(data.department) }}</span>
                            </div>
                            <div class="content">
                                <p>Position</p>
                                <span>{{ cc(data.position) }}</span>
                            </div>
                        </div>
                        <div class="interest">
                            <p>Interest</p>
                            <span>{{ data.interest }}</span>
                        </div>
                        <div class="interest">
                            <p>Needs</p>
                            <span> {{ data.want1 ? `${data.want1}, ${data.want2}, ${data.want3}, ${data.want4}` : '-' }}</span>
                        </div>
                    </div>
                </div>
            </div>
        </template>
    </ModalVue>
    <LoaderVue :loading="loaderState"/>
</template>
<script setup>
import moment from "moment";
import { ref, onMounted, reactive } from "vue";
import { ClassDetails } from "@/services/MyClass/ClassDetails";
import { find } from "lodash";
const classDetailsService = new ClassDetails();
const props = defineProps({
    modelValue: {
        type: Boolean,
        default: false
    },
    data: {
        default: {},
        type: Object
    },
})
// date.value = props.datePicked;
const emits = defineEmits(['update:modelValue']);
const loaderState = ref(false);
const currentMonth = ref(moment());
const currentDate = ref(moment());
const weeksVal = ref([]);
const grayPresent = ref(["3", "6", "8", "14", "11"]);
const bluePresent = ref(["1", "2", "13", "15", "16"]);
const absent = ref(["4", "5", "7"]);
const attendanceData = reactive({
    monthData: null,
    attendance: []
});
const getWeeks = () => {
    const firstDayOfMonth = currentMonth.value.clone().startOf('month').startOf('week');
    const lastDayOfMonth = currentMonth.value.clone().endOf('month').endOf('week').add(1, 'day');
    const days = [];
    let currentDay = firstDayOfMonth.clone();

    while (currentDay.isBefore(lastDayOfMonth)) {
        days.push(currentDay.clone());
        currentDay.add(1, 'day');
    }

    const weeks = [];
    for (let i = 0; i < days.length; i += 7) {
        weeks.push(days.slice(i + 1, i + 8).map(day => { return {day: day.clone(), status: ''}}));
    }
    const filteredWeeks = weeks.filter((subArray) => subArray.length > 0);
    weeksVal.value = filteredWeeks;
};
const onChangeMonth = async (_type) => {
    _type === 'next' ? currentMonth.value.add(1, 'month') : currentMonth.value.subtract(1, 'month');;
    getWeeks();
    await getCpInfoDetails();
}
const filterWeek = (_data) => {
    const check = _data.some(item =>  moment(item?.day).format('YYYY-MM') === moment(currentMonth.value).format('YYYY-MM'))
    return check? _data:[]
}
const getCpInfoDetails = async () => {
    const obj = {
        "user_id": props.data.user_id,
        "class_seq": props.data.class_seq,
        "target_date": moment(currentMonth.value).format('YYYY-MM'),
    }
    loaderState.value = true;
    try {
    const res = await classDetailsService.getClassCPInformationDetails(obj);
    if (!res.data.result) throw new Error("Something wrong");
    attendanceData.monthData = res.data.monthData;
    attendanceData.attendance = res.data.attendance;
    weeksVal.value = weeksVal.value.map((week) => {
        return week.map(item => {
            const idx = find(attendanceData.attendance, function(o) { return o?.lesson_date == moment(item.day).format('YYYY-MM-DD HH:mm:ss') });
            const obj = {
                day: item.day,
                status: idx ? idx.status : ''
            }
            return obj
        })
    })
  } catch (error) {
    console.log(error);
  } finally {
    loaderState.value = false;
  }
}
const cc = (_data) => {
    return _data ? _data : '-'
}
onMounted(async () => {
    getWeeks();
    await getCpInfoDetails();
})
</script>