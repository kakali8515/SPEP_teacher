<template>
  <DrawerVue :visible="visible" type="right" title="Lecture files" @close="$emit('close')" :noFooter="true"
    :mydata="mydata">
    <div class="upload-button" v-if="showBtn">
      <button type="button" :class="{ 'active': selectedTab === 'fileUpload' }" @click="getSelectedTab('fileUpload')">File
        Upload</button>
      <button type="button" class="uploadbtn" :class="{ 'active': selectedTab === 'uploadList' }"
        @click="getSelectedTab('uploadList')">Upload List</button>
    </div>
    <LectureFileUploadedForm v-if="selectedTab == 'fileUpload'" :classSeq="mydata.class_seq" :formData="formData"
      @close="closeDrawer" @getUploadList="getLectureList" />
    <LectureFileUploadList v-if="selectedTab == 'uploadList'" :uploadList="uploadList"
      @openFileUploadData="openUploadDataForm" :pageDetails="pageDetails" @getUploadList="getUploadList" />
    <LoaderVue :loading="loaderState" />
  </DrawerVue>
</template>
  
<script setup>
import LectureFileUploadedForm from "@/components/MyClass/TodaysClass/LectureFileUploadedForm.vue";
import LectureFileUploadList from "@/components/MyClass/TodaysClass/LectureFileUploadList.vue";
import { ref, onMounted, reactive } from "vue";
import { TodaysClass } from "@/services/MyClass/TodaysClass";
import { ClassDetails } from "@/services/MyClass/ClassDetails";
import { useUserData } from "@/stores/useUserDataCopy";
const userStore = useUserData();
let selectedTab = ref("fileUpload");
const uploadList = ref();
const my_class = new TodaysClass();
const class_detail = new ClassDetails();
const loaderState = ref(false);
const formData = ref({});
const showBtn = ref(true)
const props = defineProps({
  visible: Boolean,
  mydata: Object,
  classItem: Object,
});
const pageDetails = reactive({
  currentPage: 1,
  limit: 10,
  totalRecord: 0,
})
function getSelectedTab(val) {
  formData.value = {}
  if (val == 'uploadList') {
    getLectureUploadList()
  }
  return (selectedTab.value = val);
}
const openUploadDataForm = (data) => {
  selectedTab.value = 'fileUpload'
  formData.value = data;
  showBtn.value = true;
}
// #pending due to client no response
// to get lecture upload list by teacher 
const getLectureUploadList = async () => {
  const data = {
    user_id: userStore.getUserData.id,
    // course_seq: props.mydata.course_seq,
    class_seq: props.mydata.class_seq,
    lgCode: "kr",
    page: pageDetails.currentPage,
  }
  try {
    loaderState.value = true;
    let res = await class_detail.getClassLectureList(data);
    if (res.data?.result) {
      uploadList.value = res.data.data;
      pageDetails.totalRecord = res.data.count;
    }
  } catch (error) {
    console.log(error);
  } finally {
    loaderState.value = false;
  }
};
const getUploadList = (event) => {
  pageDetails.currentPage = event;
  getLectureUploadList();
};

const getLectureList = () => {
  selectedTab.value = 'uploadList'
  getLectureUploadList();
};

const emit = defineEmits(["close"]);

const closeDrawer = () => {
  // emit('close')
  showBtn.value = true;
  selectedTab.value = 'uploadList'
  getLectureUploadList()

}
</script>
  