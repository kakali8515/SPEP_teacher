<template>
    <DrawerVue :visible="visible" type="right" title="Attendance&Feedback" @close="$emit('close')" :noFooter="true" :loading="isLoading">
        <div class="uploadform">
            <div class="form-wrapper no-flex">
                <div class="wrap">
                    <div class="switch-wrap">
                        <p>Present</p>
                        <div class="switch">
                            <div class="can-toggle">
                            <input id="a" type="checkbox" v-model="attendanceObj.attendance_status" :checked="attendanceObj.attendance_status" :disabled="isSubmitted">
                            <label for="a">
                                <div class="can-toggle__switch pointer" data-checked="No" data-unchecked="Yes" style="opacity: 1;"></div>
                            </label>
                            </div>
                        </div>
                    </div>
                 </div>
                <div class="wrap">
                    <p>Feedback</p>
                    <textarea placeholder="Please enter your details." :disabled="isSubmitted" v-model="attendanceObj.memo"></textarea>
                </div>
            </div>
            <div class="button-wrapper">
                <button type="button" :class="{'disable-event': isSubmitted}"  @click="displayConfirmationModal = true">Send</button>
                <!-- <ButtonVue :class="{'disable-event': isSubmitted}" :loading="loaderState" @click="onSubmitClinicAttendance" >Send</ButtonVue> -->
            </div>          
        </div>
        <!-- Confirmation Modal-->
       <!-- Verification Modal-->
      <ConfirmModalVue
        :visible="displayConfirmationModal"
        :restrict-scroll="true"
        :is-loading="loaderState"
        title="Are you sure you want to save?"
        primaryButtonText="Cancel"
        secondaryButtonText="Yes"
        button-loader-for="2"
        @on-cancel="onSubmitClinicAttendance"
        @on-confirm="displayConfirmationModal = false"  
      />
    </DrawerVue>
  </template>
  
  <script setup>
  import { ref, onMounted, reactive } from "vue";
  import { TodaysClass } from "@/services/MyClass/TodaysClass";
  import { useUserData } from "@/stores/useUserDataCopy";
  import moment from "moment";
  import useMixins from '@/composables/useMixins.js';
  const { getWeekNo } = useMixins();
  const userStore = useUserData();
  const attendanceData = ref({});
  const todaysClassService = new TodaysClass();
  const loaderState = ref(false);
  const isLoading = ref(false);
  const displayConfirmationModal = ref(false)
  const attendanceObj = reactive({
    attendance_status: false,
    memo: ''
  });
  const isSubmitted = ref(false)
  const props = defineProps({
    visible: Boolean,
    data: {
      type: Object,
      default: {}
    },
    seletedDate: {
      type: [Object, String],
      default: null
    }
  });
  const emit = defineEmits(['close'])
  const getClinicPhoneScheduleListData = async () => {
    const data = {
      user_id: userStore.getUserData.id,//userStore.getUserData.id, //'johnshaw'
      lgCode: 'Kr',
      year: moment(props.seletedDate).format('YYYY'),
      month: moment(props.seletedDate).format('MM'),
      week: getWeekNo(props.seletedDate)
    }
    try {
      isLoading.value = true;
      let res = await todaysClassService.getClinicPhoneScheduleListData(data);
      if (res.data?.result) {
          const list = res.data.data.filter((item) => moment(item.program_date).format('YYYY-MM-DD') === moment(props.seletedDate).format('YYYY-MM-DD'));
          const filterData = list?.find((item) => moment(item.start_time).format('HH:mm') === moment(props.data.start_time).format('HH:mm') && moment(item.end_time).format('HH:mm') === moment(props.data.end_time).format('HH:mm'));
          attendanceData.value = filterData;
          attendanceObj.attendance_status = filterData?.absence_yn === 'Y';
          attendanceObj.memo = filterData?.memo;
          isSubmitted.value = filterData?.send_yn === 'Y'
      }
    } catch (error) {
      console.log(error);
    } finally {
      isLoading.value = false
    }
  };
  const onSubmitClinicAttendance = async () => {
    const data = {
      user_id: attendanceData.value?.user_id,//userStore.getUserData.id, //'johnshaw'
      op_idx: attendanceData.value?.op_idx,
      send_yn: "Y",
      class_idx: attendanceData.value?.class_idx,
      absence_yn: attendanceObj.attendance_status ? 'Y' : 'N',
      memo: attendanceObj.memo
    }
    try {
      loaderState.value = true;
      let res = await todaysClassService.giveClinicAttendance(data);
      if (res.data?.result) {
        displayConfirmationModal.value = false;
        emit('close');
      }
    } catch (error) {
      console.log(error);
    } finally {
      loaderState.value = false;
    }
  };
onMounted(async () => {
   await getClinicPhoneScheduleListData()
})
  </script>
  