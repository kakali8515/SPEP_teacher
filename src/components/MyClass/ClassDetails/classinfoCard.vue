<template>
  <div
    class="classinfo-card"
    :class="data.id == selectedClass ? ' active-line' : ''"
  >
    <div class="info d-flex justify-content-between align-items-start">
      <div class="info-wrap">
        <h4>{{ data.user_name }}</h4>
        <p>
          <img src="@/assets/teacher/icons/phone.svg" />{{ data.phone_mobile }}
        </p>
        <p><img src="@/assets/teacher/icons/envelop.svg" />{{ data.email }}</p>
      </div>
      <div class="right-icon" @click="$emit('display-cp-details')">
        <a href="javascript:void(0)"
          ><img src="@/assets/teacher/icons/righticon.svg"
        /></a>
      </div>
    </div>
    <div class="learning-state">
      <p>Learning State</p>
      <div
        class="progress-bar d-flex justify-content-between align-items-start"
      >
        <progress
          id="file"
          max="100"
          :value="data?.mobile_rate ? data.mobile_rate : 0"
        >
          {{ data?.mobile_rate }}%
        </progress>
        <span>{{ !data.mobile_rate ? "0" : data.mobile_rate }}%</span>
      </div>
    </div>
    <div class="attendance-wrap martop16">
      <div class="wrap d-flex justify-content-between align-items-center">
        <p>Attendance</p>
        <!-- <span>{{ data.start_date }}</span> -->
      </div>
      <div v-if="!data?.status" class="check-wrap grey-colors">
        <p>Please select attendance status</p>
      </div>
      <div v-if="grayPresent.includes(data.status)" class="check-wrap">
        <img src="@/assets/teacher/icons/checkboxgray.svg" />
        <p>Present</p>
      </div>
      <div v-if="bluePresent.includes(data.status)" class="check-wrap">
        <img src="@/assets/teacher/icons/Checkboxblue.svg" />
        <p>Present</p>
      </div>
      <div v-if="absent.includes(data.status)" class="check-wrap">
        <img src="@/assets/teacher/icons/Checkboxred.svg" />
        <p>Absent</p>
      </div>
      <div v-if="noClass.includes(data.status)" class="check-wrap">
        <img src="@/assets/teacher/icons/calendar.svg" />
        <p>No Class</p>
      </div>
      <div class="select-wrap d-flex justify-content-start align-items-center">
        <select @change="$emit('markAttendence', $event.target.value, data)">
          <option selected class="pointer" value disabled>Choice</option>
          <option
            v-for="item in props.statusData"
            :value="item.code_seq"
            :selected="
              item.code_seq == data.status || item.code_value2 == data.status
            "
          >
            {{ item.code_value }}
          </option>
        </select>
      </div>
    </div>
  </div>
  <LoaderVue :loading="loaderState" />
</template>
<script setup>
import { computed, ref } from "vue";
const props = defineProps({
  data: {
    type: Object,
    default: {},
  },
  statusData: {
    type: Array,
    default: [],
  },
  selectedClass: {
    type: Number,
    default: null,
  },
});
const emit = defineEmits(["markAttendence", "display-cp-details"]);
const loaderState = ref(false);
const grayPresent = ref(["3", "6", "8", "14", "11", "EL", "E", "BA", "F", "U"]);
const bluePresent = ref([
  "1",
  "2",
  "13",
  "15",
  "16",
  "P",
  "L",
  "S",
  "L15",
  "L30",
]);
const absent = ref(["4", "5", "7", "W", "A", "BD"]);
const noClass = ref(["9", "10", "12", "C", "H", "IC"]);
</script>
