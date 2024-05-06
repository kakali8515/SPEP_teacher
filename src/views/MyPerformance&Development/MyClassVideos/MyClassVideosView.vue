<template>
  <div class="martop24 mob-mr-to">
    <Filter
      :filterData="filterObj"
      :mountedFunctionCalls="['fetchCommonYearDropdown']"
      @onSelect="onSearchingClass"
      @resetSelection="onResetSelection"
      @onClose="onClose"
    />
  </div>
  <div class="martop16 hightsfix">
    <TableVue
      :fields="fields"
      :data="ApiRes"
      :page="page"
      :totalRecord="totalRecord"
      :limit="limit"
      @paginationHandler="onChangeRecord"
    >
      <template #year_session="{ slotData }">
        <div>{{ slotData.year }}/{{ slotData.order_num }}</div>
      </template>
      <template #audio="{ slotData }">
        <div>
          <Audio
            :audioSrc="'https://exi.spep.co.kr/files/' + slotData.video"
            :isPlaying="currentPlay == slotData.id ? true : false"
            :isHLS="false"
            :isPaused="currentPaused == slotData.id ? true : false"
            @onPause="
              currentPlay = null;
              currentPaused = slotData.id;
            "
            @onPlay="
              currentPlay = slotData.id;
              currentPaused = null;
            "
            @close="
              currentPlay = null;
              currentPaused = null;
            "
            :isProgress="false"
            :endDuration="false"
            :startDuration="false"
          ></Audio>
        </div>
      </template>

      <template #self-evaluation="{ slotData }">
        <button
          type="button"
          :class="!slotData.self_score ? 'bg-ef' : ''"
          @click="openEvaluation(slotData)"
        >
          {{ slotData.self_score ? "Submitted" : "Assess" }}
        </button>
      </template>
      <template #QM-monitoring="{ slotData }">
        <button
          type="button"
          :class="!slotData.qm_score ? 'bg-ef' : ''"
          @click="openQMMonitoring(slotData)"
        >
          {{ slotData.qm_score ? "Submitted" : "Assess" }}
        </button>
      </template>
      <template #link="{ slotData }">
        <img
          :class="{ 'disable-event': !slotData.video }"
          src="@/assets/icons/link.svg"
          alt=""
          @click="slotData.video ? openLink(slotData) : ''"
        />
      </template>

      <template #actions>
        <img src="@/assets/icons/play.svg" alt="" />
      </template>

      <template #add-video="{ slotData }">
        <img
          v-if="!slotData.set_fav"
          src="@/assets/icons/pluscircle.svg"
          alt=""
          @click="openAddVideo(slotData)"
        />
        <img v-else src="@/assets/icons/check-circle.svg" alt="" />
      </template>
    </TableVue>
  </div>

  <AddVideoModal
    v-if="displayAddVideo"
    :visible="displayAddVideo"
    :recSeq="recSeq"
    :program1Data="myProgramListData"
    @onCancel="displayAddVideo = false"
    @onSave="
      displayAddVideo = false;
      getClassVideoList();
    "
  />

  <QMMonitoring
    v-if="displayQMMonitoringDetails"
    v-model="displayQMMonitoringDetails"
    @close="closeQMMonitoring"
    :qmMonitoringDataItem="qmMonitoringData"
  />
  <SelfEvaluation
    v-if="visible"
    :visible="visible"
    @save="
      getClassVideoList();
      visible = false;
    "
    @close="
      () => {
        visible = false;
      }
    "
    :companyData="companyData"
  />
  <LoaderVue :loading="loaderState" />
</template>

<script setup>
import Filter from "@/components/common/Filter.vue";
import Audio from "@/components/common/Audio.vue";
import { MyClassVideo } from "@/services/MyPerformance&Development/MyClassVideo.js";
import QMMonitoring from "@/components/MyPerformance&Development/MyClassVideos/QMMonitoringModal.vue";
import SelfEvaluation from "@/components/MyPerformance&Development/MyClassVideos/SelfEvaluationModal.vue";
import AddVideoModal from "@/components/MyPerformance&Development/MyClassVideos/AddVideoModal.vue";
import { onMounted, ref, reactive, computed } from "vue";
import { useUserData } from "@/stores/useUserDataCopy";
import moment from "moment";
import { isEqual } from "lodash";
const myClassVideoService = new MyClassVideo();
const userStore = useUserData();
const loaderState = ref(false);
const ApiRes = ref([]);
const companyData = ref({});
const displayQMMonitoringDetails = ref(false);
const visible = ref(false);
const qmMonitoringData = ref({});
const recSeq = ref("");
const displayAddVideo = ref(false);
const myProgramListData = ref([]);
const updateKey = ref(1);
const currentPlay = ref(null);
const currentPaused = ref(null);
const page = ref(1);
const limit = ref(10);
const totalRecord = ref(10);

const classObj = reactive({
  year: "",
});

const openAddVideo = (value) => {
  displayAddVideo.value = true;
  recSeq.value = value.rec_seq;
};

const filterObj = computed(() => {
  return [
    {
      name: "year",
      key: "year",
      selected: classObj.year,
      value: "year",
      label: "Select Year",
      resetDependency: [],
      storeVariable: "common_year_dropdown",
      // onSelectFunction:[]
      updateKey: updateKey.value,
    },
  ];
});

const fields = [
  {
    title: "Date",
    key: "cr_reg_date",
    formatter: (value) => moment(value).format("YYYY-MM-DD"),
    is_display_on_both: true,
  },
  {
    title: "Year / Session",
    slot_name: "year_session",
    key: "actions",
    is_display_on_both: true,
  },
  {
    title: "Company",
    is_display_on_both: true,
    key: "company_name_en",
  },
  {
    title: "Course",
    is_display_on_both: true,
    key: "program1",
  },
  {
    title: "Subject",
    key: "program2",
    is_display_on_both: true,
  },
  {
    title: "Type",
    key: "program3",
    is_display_on_both: true,
  },
  {
    title: "PS Name",
    key: "teacher_name_kr",
    is_display_on_both: true,
  },

  {
    title: "Class",
    key: "class_code",
    is_display_on_both: true,
  },
  {
    title: "Link",
    key: "actions",
    slot_name: "link",
    is_display_on_both: true,
  },
  {
    title: "Video",
    key: "actions",
    slot_name: "audio",
    is_display_on_both: true,
  },

  {
    title: "Self-Evaluation",
    key: "actions",
    slot_name: "self-evaluation",
    is_display_on_both: true,
  },

  {
    title: "QM Monitoring",
    key: "actions",
    slot_name: "QM-monitoring",
    is_display_on_both: true,
  },

  {
    title: "Add Video",
    key: "actions",
    slot_name: "add-video",
    is_display_on_both: true,
  },
];

const openQMMonitoring = (item) => {
  displayQMMonitoringDetails.value = true;
  qmMonitoringData.value = item;
};
const openEvaluation = (item) => {
  companyData.value = item;
  visible.value = true;
};

const closeQMMonitoring = (event) => {
  displayQMMonitoringDetails.value = false;
  if (event) {
    getClassVideoList();
  }
};

const openLink = (value) => {
  window.open("https://exi.spep.co.kr/files/" + value.video);
};

//Myclassvideo list
const getClassVideoList = async () => {
  const obj = {
    lgCode: "kr",
    teacher_id: userStore.getUserData.id,
    page: page.value,
    limit: limit.value,
    year: classObj.year,
  };
  try {
    loaderState.value = true;
    const res = await myClassVideoService.myClassList(obj);
    if (res.data.result) {
      ApiRes.value = res.data.list.map((item, index) => {
        item.id = index;
        return item;
      });

      totalRecord.value = res.data.count;
    }
  } catch (error) {
    console.log(error);
  } finally {
    loaderState.value = false;
  }
};

const myProgramList = async () => {
  try {
    loaderState.value = true;
    const res = await myClassVideoService.myProgramList();
    if (res?.data) {
      myProgramListData.value = res.data.data;
    }
  } catch (error) {
    console.log(error);
  } finally {
    loaderState.value = false;
  }
};
const onSearchingClass = async (_data, _type) => {
  if (isEqual(_type, "year")) classObj.year = _data;
  page.value = 1;
  await getClassVideoList();
};
const onResetSelection = (_key) => {
  classObj[_key] = "";
};
const onClose = () => {
  updateKey.value++;
};

// ===== HANDLING PAGINATION =====
const onChangeRecord = async (_page) => {
  page.value = _page;
  await getClassVideoList();
};
onMounted(async () => {
  loaderState.value = true;
  await userStore.getUserDetails();
  await getClassVideoList();
  await myProgramList();
});
</script>
