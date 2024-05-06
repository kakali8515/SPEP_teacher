<template>
  <!-- Training Library List -->
  <div class="martop16 ">
    <TableVue :fields="fields" :data="ApiRes" :page="pageDetails.currentPage" :totalRecord="pageDetails.totalRecord"
      :limit="pageDetails.limit" @paginationHandler="onChangeRecord" @on-row-clicked="openTrainingLibraryDetails">
    </TableVue>
  </div>
  <!-- Training Library Details -->
  <DrawerVue v-if="displayTrainingLibraryDetails" :visible="displayTrainingLibraryDetails"
    :title="trainingDetails.title" type="bottom" @close="closeTrainingLibraryDetails" :noFooter="true">
    <div class="training-library-wrap">
      <div class="library-detail-wrap">
        <div class="main-wrap">
          <div class="detail-head-sec">
            <div class="head-date">
              <h2>Topic.</h2>
              <h2>{{ trainingDetails.program2 }}</h2>
            </div>
            <div class="head-date date">
              <p>Date</p>
              <p>{{ trainingDetails.registration_date }}</p>
            </div>
          </div>
          <div class="detail-area">
            <div class="detail-cnt">
              <!-- <p>Where does it come from?</p> -->
              <p>
                {{ trainingDetails.content }}
              </p>
            </div>
          </div>
        </div>
        <div class="attach-area pointer" @click="downloadTrainingLibraryFile()">
          <div class="attach-detail">
            <img src="@/assets/icons/File.svg">
            <div class="attach-properties">
              <h2>{{ trainingDetails.file_name }}</h2>
              <p>13MB</p>
            </div>
          </div>
          <img src="@/assets/icons/download.svg">
        </div>
      </div>
    </div>
  </DrawerVue>
  <!-- Loader -->
  <LoaderVue :loading="loaderState" />
</template>

<script setup>
import { ref, onMounted, reactive } from "vue";
import { API_BASE_URL, API_KEY } from '@/services/Base.js';
import { TrainingLibrary } from "@/services/MyPerformance&Development/TrainingLibrary.js";
import useMixins from '@/composables/useMixins.js';
import { useUserData } from "@/stores/useUserDataCopy";
import usePostMessage from "@/composables/usePostMessage";
const { onPostMessageFire } = usePostMessage();
const store = useUserData();

const { saveFile } = useMixins();
const trainingLibraryService = new TrainingLibrary();
const loaderState = ref(false);
const displayTrainingLibraryDetails = ref(false)
const trainingDetails = ref({});
const trainingId = ref(null);

const fields = [
  {
    title: "Date",
    key: "REG_DT",
    is_display_on_both: true,
  },

  {
    title: "Topic",
    key: "PROGRAM2",
    is_display_on_both: true,
  },

  {
    title: "Title",
    key: "TITLE",
    is_display_on_both: true,
  },

  {
    title: "Note",
    key: "COMMENTS",
    is_display_on_both: true,
  },
];

const ApiRes = ref([]);
const pageDetails = reactive({
  currentPage: 1,
  limit: 10,
  totalRecord: 0,
})


const openTrainingLibraryDetails = (id) => {
  displayTrainingLibraryDetails.value = true;
  trainingId.value = id.TRANING_ID
  getTrainingLibraryDetails(trainingId.value);
};

const closeTrainingLibraryDetails = () => {
  displayTrainingLibraryDetails.value = false;
};

const getTrainingLibrary = async () => {
  const obj = {
    page: pageDetails.currentPage,
    limit: pageDetails.limit
  }
  try {
    loaderState.value = true;
    const res = await trainingLibraryService.trainingLibrary(obj);
    if (res.data.success) {
      ApiRes.value = res.data.trainingLibrary;
      pageDetails.totalRecord = res.data.totalRows;
    }
  } catch (error) {
    console.log(error);
  } finally {
    loaderState.value = false;
  }
};




const getTrainingLibraryDetails = async (trainingId) => {
  try {
    loaderState.value = true;
    const res = await trainingLibraryService.trainingLibraryDetails(trainingId);
    if (res.data.success) {
      trainingDetails.value = res.data.trainingLibrarydetails.trainingLibrary;
      trainingDetails.value.program2 = res.data.trainingLibrarydetails.courseDetails.program2;
    }
  } catch (error) {
    console.log(error);
  } finally {
    loaderState.value = false;
  }
};

// download training library file
const downloadTrainingLibraryFile = async () => {
  if (store.getIsMobileViewReady) {
    const data = {
      'file_url': `${API_BASE_URL}teacher/myData/training-library-download/${trainingId.value}`,
      'fileName': trainingDetails.value.file_name,
      'x-api-key': API_KEY
    }
    onPostMessageFire("fileDownload", data);
  } else {
    try {
      loaderState.value = true;
      let res = await trainingLibraryService.downloadTrainingLibrary(trainingId.value);
      if (res.data) {
        saveFile(res, trainingDetails.value.file_name);
      }
    } catch (error) {
      console.log(error);
    } finally {
      loaderState.value = false;
    }
  }
};

// ===== HANDLING PAGINATION =====
const onChangeRecord = async (_page) => {
  pageDetails.currentPage = _page;
  await getTrainingLibrary();
}

onMounted(async () => {
  await getTrainingLibrary();
});
</script>
