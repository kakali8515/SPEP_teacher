<template>
  <div class="martop24">
    <div class="select-wrap listening-lab-wrap">
      <div class="sub-select-box">
        <p>Lecture</p>
        <select @change="changeLecture($event.target.value)">
          <option v-for="item in lectureList" :value="item.lecture_seq">
            {{ item.lecture_name }}
          </option>
        </select>
      </div>
      <div class="sub-select-box item-select">
        <p>Items</p>
        <select v-model="unitPageLimit" @change="changeLimit">
          <option value="10">10</option>
          <option value="20">20</option>
          <option value="30">30</option>
        </select>
      </div>
    </div>
  </div>
  <div class="martop16">
    <div class="tablemain-wrap">
      <div class="table"></div>
    </div>
  </div>
  <TableVue
    :fields="fields"
    :data="unitList"
    :page="unitPage"
    :limit="unitPageLimit"
    :totalRecord="unitTotalRecords"
    @paginationHandler="onChangeRecord"
  >
    <template #audio="{ slotData }">
      <div>
        <Audio
          :audioSrc="slotData.audio"
          :isPlaying="currentPlay == slotData.id ? true : false"
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
          :isHLS="true"
        >
        </Audio>
      </div>
    </template>
    <template #No="{ slotData }">{{ slotData.id + 1 }}</template>
  </TableVue>
  <LoaderVue :loading="loaderState" />
</template>

<script setup>
import Audio from "@/components/common/Audio.vue";
import { ClassDetails } from "@/services/MyClass/ClassDetails";
import { computed, ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
const classDetailsService = new ClassDetails();
const route = useRoute();
const loaderState = ref(false);
const lectureList = ref([]);
const unitList = ref([]);
const lectureSeq = ref("");
const unitPage = ref(1);
const unitPageLimit = ref(10);
const unitTotalRecords = ref(0);
const currentPlay = ref(null);
const currentPaused = ref(null);
const fields = [
  {
    title: "No",
    key: "actions",
    slot_name: "No",
  },
  {
    title: "Unit",
    key: "unit",
    is_display_on_both: true,
    class: "",
  },
  {
    title: "Title",
    key: "title",
    is_display_on_both: true,
    class: "cc",
  },
  {
    title: "Audio",
    key: "actions",
    slot_name: "audio",
    is_display_on_both: true,
  },
];

const getLectureList = async () => {
  let data = {
    page: 1,
    limit: 10,
    course_seq: route.params.course_seq,
  };
  try {
    loaderState.value = true;
    const res = await classDetailsService.getLectureList(data);
    if (res.data?.list) {
      loaderState.value = false;
      lectureList.value = res.data.list;
    }
  } catch (error) {
    console.log(error);
  } finally {
    loaderState.value = false;
  }
};

const changeLecture = async (lecture) => {
  lectureSeq.value = lecture;
  getListeningLabUnits();
};

const getListeningLabUnits = async () => {
  let data = {
    page: unitPage.value,
    limit: unitPageLimit.value,
    // lecture_seq: lectureSeq.value,
    lecture_seq: "2901",
  };
  try {
    loaderState.value = true;
    const res = await classDetailsService.getListeningLabUnits(data);
    if (res.data) {
      loaderState.value = false;
      unitList.value = res.data.list.map((item, index) => {
        item.id = index;
        return item;
      });
      unitTotalRecords.value = res.data.totalRows;
    }
  } catch (error) {
    console.log(error);
  } finally {
    loaderState.value = false;
  }
};
const changeLimit = () => {
  unitPage.value = 1;
  getListeningLabUnits();
};

const onChangeRecord = async (_page) => {
  unitPage.value = _page;
  await getListeningLabUnits();
};
onMounted(async () => {
  await getLectureList();
});
</script>
