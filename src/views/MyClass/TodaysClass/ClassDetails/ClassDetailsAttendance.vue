<template>
  <!-- <div class="martop32">
        <div class="row">
            <div class="col-lg-3 col-md-12 col-sm-12">
                <Date/>
            </div>  
            <div class="col-lg-9 col-md-12 col-sm-12">
                <Filtertwo/>
            </div>
        </div>
    </div>
    <div class="martop16">
        <classinfoOne/>
    </div> -->
  <div class="martop32 mobmar-16">
    <div class="card-button-wrap">
      <button type="button" @click="openSeeDetails" class="blue-bordered">
        See Details
      </button>
      <button type="button" @click="openNoteDetails" class="gray-bordered">
        Note for SPEP
      </button>
    </div>
  </div>
  <NoteForSpep
    v-if="displayNoteDetails"
    v-model="displayNoteDetails"
    @close="displayNoteDetails = false"
  />
  <div class="row martop16">
    <div
      v-for="info in finalClassInfo"
      class="col-lg-3 col-md-6 col-sm-6 col-xs-12"
    >
      <classinfoCard
        :data="info"
        :statusData="statusData"
        @display-cp-details="onDisplayClassCPInfoModal(info)"
        @markAttendence="checkAttendence"
        :selectedClass="selectedClass"
      />
    </div>
    <NoDataFoundVue v-if="!finalClassInfo.length && !loaderState" />
  </div>

  <div class="row">
    <div class="go-back-button" v-if="finalClassInfo.length">
      <button type="button" @click="To">Enter Class</button>
    </div>
  </div>

  <CpInformationDetailModal
    v-if="displayCpInfoModal"
    v-model="displayCpInfoModal"
    :data="cpDetails"
  />

  <SeeDetails
    v-if="displaySeeDetails"
    v-model="displaySeeDetails"
    :studentInfo="finalClassInfo"
    :course_seq="route.params.course_seq"
    :schedule_seq="props.scheduleSeq"
    @close="displayNoteDetails = false"
  />
  <LoaderVue :loading="loaderState" />
</template>

<script setup>
import classinfoCard from "@/components/MyClass/ClassDetails/classinfoCard.vue";
import CpInformationDetailModal from "@/components/MyClass/ClassDetails/ClassDetailsAttendance/CpInformationDetailModal.vue";
import NoteForSpep from "@/components/MyClass/ClassDetails/ClassDetailsAttendance/NoteForSpepModal.vue";
import SeeDetails from "@/components/MyClass/ClassDetails/ClassDetailsAttendance/Classseedetailsmodal.vue";
import { ClassDetails } from "@/services/MyClass/ClassDetails";
import { computed, ref, onMounted, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useUserData } from "@/stores/useUserDataCopy";
import Note from "@/components/Note.vue";
const userStore = useUserData();
const classDetailsService = new ClassDetails();
const route = useRoute();
const router = useRouter();
const classInfo = ref([]);
const statusData = ref([]);
const attendanceList = ref([]);
const loaderState = ref(false);
const displayCpInfoModal = ref(false);
const displayNoteDetails = ref(false);
const displaySeeDetails = ref(false);
const cpDetails = ref(null);
const selectedClass = ref(null);
const props = defineProps({
  scheduleSeq: String,
  selectedDate: {
    type: [String, Object],
  },
});
watch(
  () => props.selectedDate,
  (nV, oV) => {
    getAttandanceList();
  }
);

const openNoteDetails = () => {
  displayNoteDetails.value = true;
};
const openSeeDetails = () => {
  displaySeeDetails.value = true;
};
const onDisplayClassCPInfoModal = (_data) => {
  cpDetails.value = _data;
  selectedClass.value = _data.id;
  displayCpInfoModal.value = true;
};

const getAttandanceList = async () => {
  let data = {
    user_id: userStore.getUserData.id,
    class_seq: route.params.class_seq,
    schedule_seq: props.scheduleSeq,
  };
  try {
    loaderState.value = true;
    const res = await classDetailsService.getAttandanceList(data);
    if (res.data?.result) {
      attendanceList.value = res.data.data;
    }
  } catch (error) {
    console.log(error);
  } finally {
    loaderState.value = false;
  }
};
const finalClassInfo = computed(() => {
  return classInfo.value.map((itm) => ({
    ...attendanceList.value.find(
      (item) => item.user_id === itm.user_id && item
    ),
    ...itm,
  }));
});

const checkAttendence = async (attendence, userData) => {
  let data = {
    user_id: userStore.getUserData.id,
    schedule_seq: props.scheduleSeq,
    class_seq: route.params.class_seq,
    target_id: userData.user_id,
    status: attendence,
  };

  try {
    loaderState.value = true;
    const res = await classDetailsService.classAttendenceCheck(data);
    if (res.data?.result) {
      await assignPoint(attendence);
      await getAttandanceList();
      await getClassInformation();
    }
  } catch (error) {
    console.log(error);
  } finally {
    loaderState.value = false;
  }
};

const assignPoint = async (attendence) => {
  console.log("here---", attendence);
  let data = {
    user_id: userStore.getUserData.id, // Student_id
    exi_sub_category_seq: "137", // Fixed value for attendance
    target_seq: props.scheduleSeq, // schedule_seq
    schedule_seq: props.scheduleSeq, // schedule_seq
    attendance_status: attendence, // Attendance status
  };
  console.log(data);
  try {
    loaderState.value = true;
    const res = await classDetailsService.assignPoint(data);
    if (res) {
      console.log(res);
    }
  } catch (error) {
    console.log(error);
  } finally {
    loaderState.value = false;
  }
};

const getAttendanceStatusList = async () => {
  try {
    loaderState.value = true;
    const res = await classDetailsService.getAttendanceStatusList();
    if (res.status == 200) {
      statusData.value = res.data.status;
    }
  } catch (error) {
    console.log(error);
  } finally {
    loaderState.value = false;
  }
};

const getClassInformation = async () => {
  let data = {
    user_id: userStore.getUserData.id,
    class_seq: route.params.class_seq,
    course_seq: route.params.course_seq,
    lgCode: "kr",
  };
  try {
    loaderState.value = true;
    const res = await classDetailsService.getClassInformation(data);
    if (res.data?.result) {
      loaderState.value = false;
      classInfo.value = res.data.data.map((item, index) => {
        item.id = index + 1;
        return item;
      });
    }
  } catch (error) {
    console.log(error);
  } finally {
    loaderState.value = false;
  }
};
const To = () => {
  router.push({
    name: "MyClassFeedback",
    params: {
      date: route.params.date,
      class_seq: route.params.class_seq,
      course_seq: route.params.course_seq,
      schedule_seq: route.params.schedule_seq,
    },
  });
};
onMounted(async () => {
  loaderState.value = true;
  await userStore.getUserDetails();
  loaderState.value = false;
  await getAttandanceList();
  await getAttendanceStatusList();
  await getClassInformation();
});
</script>
