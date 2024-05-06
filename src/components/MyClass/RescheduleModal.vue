<template>
  <ModalVue v-if="modelValue" :show="modelValue" mWidth="360px" :defaultCloseBtn="false" @close="$emit('update:modelValue', false)">
    <template #body>
      <div class="inner-body-content-area">
        <VueDatePicker
          v-model="date"
          inline
          auto-apply
          :month-change-on-scroll="false"
          :enable-time-picker="false"
          :min-date="new Date()"
          :disabled-week-days="[0]" 
          month-name-format="long"
          hide-offset-dates 
        >
          <template #arrow-left>
              <img class="slot-icon" src="@/assets/teacher/icons/calendar-left-arrow.svg"/>
          </template>
          <template #arrow-right>
              <img class="slot-icon" src="@/assets/teacher/icons/calendar-right-arrow.svg"/>
          </template>
        </VueDatePicker>

        <div class="form-group times-pic">
          <label for="inputEmail3" class="">Time</label>
          <div class="col-sm-10 p-0 pl-3">
            <div class="d-flex">
              <div class="changeBG">
              <VueDatePicker
                class="my-time"
                :class="{ 'time-error': time1 == null || scheduleError }"
                v-model="time1"
                time-picker
                center 
                placeholder="00:00"
                auto-apply
              />
              <span>~</span>
              <VueDatePicker
                disabled
                class="my-time"
                v-model="time2"
                time-picker
                placeholder="00:00"
              />
            </div>
          </div>
            <p class="error-text" v-if="time1 == null">
              Please enter start time.
            </p>
          </div>
        </div>
      </div>
    </template>
    <template #footer>
      <div class="common-button-wrap">
        <button
          type="button"
          class="light-grey-bordered"
          style=""
          @click="$emit('update:modelValue', false)"
        >
          Cancel
        </button>
        <ButtonVue
          :disabled="!time1"
          :loading="isLoading"
          class="blue-fill"
          @click.prevent="displayVerificationModal = true"
          style=""
          >Save</ButtonVue
        >
      </div>
    </template>
  </ModalVue>
  <!-- Verification Modal-->
  <ConfirmModalVue
    :visible="displayVerificationModal"
    :restrict-scroll="true"
    :is-loading="loaderState"
    title="Are you sure you want to edit?"
    primaryButtonText="Confirm"
    secondaryButtonText="Cancel"
    @on-cancel="closeConfirmModal"
    @on-confirm="rescheduleFn"
  />

  <!-- Confirmation Modal-->
  <ConfirmModalVue
    :visible="displayConfirmationModal"
    :restrict-scroll="true"
    :is-loading="loaderState"
    title="Update Completed"
    secondaryButtonText="Cancel"
    @on-cancel="closeUpdateModal"
  />

  <!-- Error Modal-->
  <ConfirmModalVue
    :visible="displayErrorModal"
    :restrict-scroll="true"
    :is-loading="loaderState"
    secondaryButtonText="Cancel"
    @on-cancel="closeErrorModal"
  >
    <h3 class="h3-class">Lecture already exists at that time.</h3>
    <h3 class="h3-class">Please select another time.</h3>
  </ConfirmModalVue>
</template>
<script setup>
import { onMounted, ref, watch } from "vue";
import { useUserData } from "@/stores/useUserDataCopy";
import { TodaysClass } from "@/services/MyClass/TodaysClass";
import moment from "moment";
const todaysClassService = new TodaysClass();
const userStore = useUserData();
const isLoading = ref(false);
const isAlreadyTimeExist = ref(false);
const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false,
  },
  data: {
    type: Object,
  },
  class_seq: {
    type: [String, Number],
    required: false,
  },
  schedule_seq: {
    type: [String, Number],
    required: false,
  },
});
const emits = defineEmits(["update:modelValue", "on-success"]);

const time1 = ref({
  hours: new Date().getHours(),
  minutes: new Date().getMinutes(),
});
const time2 = ref(null);
const date = ref(new Date());
const scheduleError = ref(null);
const loaderState = ref(false);
const displayVerificationModal = ref(false);
const displayConfirmationModal = ref(false);
const displayErrorModal = ref(false);
const timeLimit = ref(30);

const closeConfirmModal = () => {
  displayVerificationModal.value = false;
  displayConfirmationModal.value = false;
};

const closeUpdateModal = () => {
  displayConfirmationModal.value = false;
  emits("on-success");
};

const closeErrorModal = () => {
  displayErrorModal.value = false;
  displayVerificationModal.value = false;
};
const rescheduleFn = async () => {
  let formattedDate = moment(date.value).format("YYYY-MM-DD");
  const payload = {
    user_id: userStore.getUserData.id,
    class_seq: props.data.class_seq,
    schedule_seq: props.data.schedule_seq ?? props.schedule_seq,
    lesson_date: formattedDate,
    start_time: moment(time1.value).format("HH:mm:ss"),
    end_time: moment(time2.value).format("HH:mm:ss"),
  };
  try {
    loaderState.value = true;
    isLoading.value = true;
    const res = await todaysClassService.rescheduleClass(payload);
    if (!res.data.result) {
      scheduleError.value = res.data.message;
      displayErrorModal.value = true;
      isAlreadyTimeExist.value =
        res.data.code === "suc/api/teacher/add_class_file/03";
    } else {
      if (!res.data.message || res.data.message === null) {
        displayConfirmationModal.value = true;  
        return     
      }
      scheduleError.value = res.data.message;
      displayErrorModal.value = true;
    }
  } catch (error) {
    console.log("error", error.response);
  } finally {
    isLoading.value = false;
    loaderState.value = false;
  }
};

const add30Minutes = (timeStr) => {
  const time = moment({
    hour: timeStr.hours,
    minute: timeStr.minutes,
  });
  const finalTime = moment(time).add(timeLimit.value, "minutes");
  return {
    hours: finalTime.hour(),
    minutes: finalTime.minute(),
  };
};
watch(time1, (nv, ov) => {
  if (nv && nv != ov) {
    time2.value = add30Minutes(nv);
  } else if (!nv) {
    time2.value = null;
  }
});
onMounted(() => {
  time1.value.hours = props.data.start_hour;
  time1.value.minutes = props.data.start_minute;
  time2.value = { hours: props.data.end_hour, minutes: props.data.end_minute };
  const staticStartTime = moment({
          hour:  props.data.start_hour,
          minute: props.data.start_minute,
        });
  const staticEndTime = moment({
    hour:  props.data.end_hour,
    minute: props.data.end_minute,
  });
  timeLimit.value = staticEndTime.diff(staticStartTime, 'minutes')
});
</script>
<style lang="scss">
.dp__menu {
  border: none !important;
}

.dp__calendar_header_separator {
  background-color: white;
}

.dp__flex_display {
  display: block;
}

.dp__relative {
  height: 330px !important;
}

// .my-time {
//   margin: 5px;
// }
.changeBG{
  display: flex;
  align-items: center;
}
.changeBG .dp--menu-wrapper {
    position: absolute;
    z-index: 99999;    
    left: -50px !important;
    padding-bottom: 15px;
    background: rgba(0,0,0,0.6);
    // background: #fff;
    min-width: 316px;
    min-height: 323px;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 8px;
}
.dp--menu--inner-stretched{
  padding: 0;
}
.changeBG .dp--overlay-relative{
  height: 170px !important;
  border-radius: 8px;
}
.times-pic .dp__outer_menu_wrap.dp--menu-wrapper{
  top: -332px !important;
  @media screen and (max-width:767px) {
    // top: -328px !important;
    // left: -56px !important;
  }
  @media screen and (max-width:320px) {
    top: -328px !important;
    left: -56px !important;
    max-width: 285px;
    overflow: hidden;
  }
  
}

.time-error {
  border: 1px solid red;
  border-radius: 5px;
}
.dp__action_row{
  width: 100% !important;
  min-width: 316px;
  @media screen and (max-width:320px) {    
    min-width: 286px;
    overflow: hidden;
  }
}
.h3-class{
line-height: 19.6px !important;
margin-bottom: 0 !important;
}
</style>
