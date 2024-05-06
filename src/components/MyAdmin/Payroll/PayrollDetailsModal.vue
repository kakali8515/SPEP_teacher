<template>
  <DrawerVue :visible="true" type="bottom" @close="$emit('close')" title="Attendance Info" :noFooter="true">
    <div class="payrolldetails-wrap">
      <div class="martop32">
        <div class="tablemain-wrap payrolltable">
          <div class="table">
            <table>
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Type</th>
                  <th>Program Specialist</th>
                  <th>Period</th>
                  <th>Time</th>
                  <th>Day</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    {{ attendanceInfo.program1 }} /
                    {{ attendanceInfo.class_code }}
                  </td>
                  <td>{{ attendanceInfo.program3 }}</td>
                  <td>{{ attendanceInfo.teacher_name }}</td>
                  <td>
                    {{ attendanceInfo.start_date ? moment(attendanceInfo.start_date).format("YYYY-MM-DD") : '' }}
                    ~ {{ attendanceInfo.end_date ? moment(attendanceInfo.end_date).format("YYYY-MM-DD") : '' }}
                  </td>
                  <td>
                    {{
                      attendanceInfo.start_hour ? moment({
                        hour: attendanceInfo.start_hour,
                        minute: attendanceInfo.start_minute,
                      }).format("HH:mm") : ''
                    }}
                    ~
                    {{
                      attendanceInfo.end_hour ? moment({
                        hour: attendanceInfo.end_hour,
                        minute: attendanceInfo.end_minute,
                      }).format("HH:mm") : ''
                    }}
                  </td>
                  <td>{{ daysMap[attendanceInfo.day_of_week] }}</td>
                  <td>{{ statusMap[attendanceInfo.status] }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <div class="martop32">
        <div class="table-heading">
          <h4>Attendance</h4>
        </div>
        <div class="martop16">
          <!-- try new table  -->
          <div class="mobile-views">
            <div class="attendencs-tarck-table-wrap">
              <div class="name-content-area">
                <div class="name-row-top">
                  <span>Name</span>
                  <span>Type</span>
                  <span>Participant Name</span>
                </div>
                <div class="name-colm">
                  <div class="name-row" v-for="data in attendanceTableData" :key="data">
                    <span>{{ data.user_id }}</span>
                    <span>{{ attendanceInfo.program3 }}</span>
                    <span>{{ data.user_name_en }}</span>
                  </div>
                </div>

              </div>
              <div class="attendencs-tarck-area scroll-tables">
                <div class="loop-table-div" v-for="data in attendanceTableHeaderData" :key="data">
                  <p>{{ data.month }}</p>
                  <table class="loop-table">
                    <thead>
                      <tr>
                        <th v-for="item in data.dates" :key="item">{{ item.date }}</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="row in attendanceTableData" :key="row">
                        <td v-for="day in data.dates" :key="day">
                          <template v-if="currentDate > day.full_date">
                            <template v-if="day.attendance">
                              {{ day.attendance }}
                            </template>
                            <select v-else @change="
                              changeAttendance($event, day, row.user_id)
                              ">
                              <option>Select</option>
                              <option v-for="item in attendanceStatusList" :key="item">
                                {{ item.code_value2 }}
                              </option>
                            </select>
                          </template>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>


        </div>
      </div>
      <div class="martop32">
        <div class="atten-wrap">
          <div class="main-wrap">
            <div class="table-heading">
              <h4>Attendance Legend</h4>
            </div>
            <div class="attendence">
              <ul>
                <li>P = Present</li>
                <li>L = Late</li>
                <li>EL = Early Leave</li>
                <li>W = Work</li>
                <li>A = Absent</li>
                <li>E = Education</li>
                <li>BD/BA = Biz Trip(Domestic/Abroad)</li>
              </ul>
              <ul>
                <li>C = Cancelation</li>
                <li>H = National Holiday</li>
                <li>F = Family event</li>
                <li>IC = Instructor’s Cancelation</li>
                <li>S = Swap</li>
                <li>U = Union Strike</li>
              </ul>
            </div>
          </div>
          <div class="main-wrap">
            <div class="table-heading">
              <h4>Attendance Rate</h4>
            </div>
            <div class="attendence">
              <p>
                1. Attendance rate (Including excused absences) : 100.00%
                [Attendance 2, Absent 0]
              </p>
              <p>
                2. Attendance rate (Excluding excused absences) : 50.00%
                [Classes Attendance 1, Classes Absent 1]
              </p>
            </div>
          </div>
        </div>
      </div>
      <div class="martop32">
        <div class="program-wrap">
          <h4>Program Specialist’s Overall Recommendation</h4>
          <textarea v-model="memo"></textarea>
        </div>
      </div>
      <div class="martop32">
        <div class="btn-wrap">
          <button type="button" @click="attendanceSavePayroll">Save</button>
        </div>
      </div>
    </div>
  </DrawerVue>
  <LoaderVue :loading="loaderState" />
</template>
<script setup>
import { onMounted, ref } from "vue";
import moment from "moment";
import { useUserData } from "@/stores/useUserDataCopy";
import { Payroll } from "@/services/MyAdmin/Payroll.js";
const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false,
  },
  payrollRowData: {
    type: Object,
    default: {},
  },
});
const emit = defineEmits(["close"]);
const closeModal = () => {
  emit("close");
};

const userStore = useUserData();
const PayrollService = new Payroll();
const loaderState = ref(false);
const attendanceInfo = ref({});
const attendanceData = ref([]);
const attendanceTableHeaderData = ref([]);
const attendanceTableData = ref([]);
const attendanceStatusList = ref([]);
const checkAttendance = ref({});
const memo = ref("");
const currentDate = moment(new Date()).format("YYYY-MM-DD");

const daysMap = {
  1: "Sunday",
  2: "Monday",
  3: "Tuesday",
  4: "Wednesday",
  5: "Thursday",
  6: "Friday",
  7: "Saturday",
};

const statusMap = {
  R: "Unconfirmed",
  Y: "In Progress",
  S: "Stopped",
  N: "Canceled",
  M: "Modified ",
  E: "Ended ",
  C: "Closed ",
};

// get payroll details
const getPayrollDetails = async () => {
  const obj = {
    lgCode: "kr",
    class_seq: props.payrollRowData.class_seq,
    user_id: userStore.getUserData.id,
  };
  try {
    loaderState.value = true;
    const res = await PayrollService.getPayrollDetails(obj);
    attendanceInfo.value = res.data.data;
    attendanceData.value = res.data.schedule;

    // Group schedules by user_id, then by month, and then by date within each month for each user
    const groupedByUserAndDate = {};

    attendanceData.value.forEach((schedule) => {
      const userId = schedule.user_id;
      const user_name_en = schedule.user_name_en;
      const date = new Date(schedule.lesson_date);
      const monthYear = moment(date).format("YYYY-MM");
      const day = moment(date).format("DD");

      if (!groupedByUserAndDate[userId]) {
        groupedByUserAndDate[userId] = {
          user_name_en: user_name_en,
          months: {},
        };
      }

      if (!groupedByUserAndDate[userId].months[monthYear]) {
        groupedByUserAndDate[userId].months[monthYear] = {
          month: monthYear,
          dates: {},
        };
      }

      if (!groupedByUserAndDate[userId].months[monthYear].dates[day]) {
        groupedByUserAndDate[userId].months[monthYear].dates[day] = {};
      }

      groupedByUserAndDate[userId].months[monthYear].dates[day]["attendance"] =
        schedule.code_value2;
      groupedByUserAndDate[userId].months[monthYear].dates[day][
        "schedule_seq"
      ] = schedule.schedule_seq;
      groupedByUserAndDate[userId].months[monthYear].dates[day]["full_date"] =
        moment(date).format("YYYY-MM-DD");
      groupedByUserAndDate[userId]["user_name_en"] = user_name_en;
    });
    //console.log(groupedByUserAndDate);

    // Convert object to array of objects grouped by user_id, month, and date
    const arrayOfObjects = Object.keys(groupedByUserAndDate).map((userId) => ({
      user_id: userId,
      user_name_en: groupedByUserAndDate[userId]["user_name_en"],
      months: Object.values(groupedByUserAndDate[userId].months).map(
        (month) => ({
          month: month.month,
          dates: Object.keys(month.dates)
            .sort((a, b) => a - b)
            .map((date) => ({
              date: date,
              attendance: month.dates[date].attendance,
              schedule_seq: month.dates[date].schedule_seq,
              full_date: month.dates[date].full_date,
            })),
        })
      ),
    }));

    attendanceTableHeaderData.value = arrayOfObjects[0].months;
    attendanceTableData.value = arrayOfObjects;

    console.log(arrayOfObjects);
  } catch (error) {
    console.log(error);
  } finally {
    loaderState.value = false;
  }
};

const getattendanceStatusList = async () => {
  try {
    const res = await PayrollService.attendanceStatusList();
    attendanceStatusList.value = res.data.status;
  } catch (error) {
    console.log(error);
  } finally {
    loaderState.value = false;
  }
};

const getmemoData = async () => {
  let payload = {
    class_seq: props.payrollRowData.class_seq,
  };
  try {
    const res = await PayrollService.getmemoData(payload);
    memo.value = res.data.memo;
  } catch (error) {
    console.log(error);
  } finally {
    loaderState.value = false;
  }
};

const changeAttendance = (event, data, target_id) => {
  let input = {
    status: event.target.value,
    class_seq: props.payrollRowData.class_seq,
    user_id: userStore.getUserData.id,
    schedule_seq: data.schedule_seq,
    target_id: target_id,
  };
  checkAttendance.value = input;
  if (event.target.value) {
    classAttendanceCheck();
  }
};

const classAttendanceCheck = async () => {
  try {
    loaderState.value = true;
    const res = await PayrollService.attendanceCheck(checkAttendance.value);
    console.log(res);
    await getPayrollDetails();
  } catch (error) {
    console.log(error);
  } finally {
    loaderState.value = false;
  }
};

const attendanceSavePayroll = async () => {
  let data = {
    memo: memo.value,
    class_seq: props.payrollRowData.class_seq,
  };
  try {
    loaderState.value = true;
    const res = await PayrollService.attendanceSavePayroll(data);
    if (res.status == 200) {
      loaderState.value = false;
      getmemoData();
    }
  } catch (error) {
    console.log(error);
  } finally {
    loaderState.value = false;
  }
};

onMounted(async () => {
  loaderState.value = true;
  await userStore.getUserDetails();
  await getPayrollDetails();
  getattendanceStatusList();
  getmemoData();
});
</script>
