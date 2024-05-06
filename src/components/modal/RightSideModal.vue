<template>
  <DrawerVue :visible="visible" type="right" title="Lecture files" @close="$emit('close')" :noFooter="true"
    :mydata="mydata">
    <div class="upload-button">
        <button type="button" class="active" @click="getSelectedTab('fileUpload')">File Upload</button>
        <button type="button" class="uploadbtn" @click="getSelectedTab('uploadList')">Upload List</button>
    </div>
    <LectureFileUploadedForm v-if="selectedTab == 'fileUpload'" :classItem="classItem" />
    <LectureFileUploadList v-if="selectedTab == 'uploadList'" :uploadList="uploadList" />
  </DrawerVue>
</template>

<script setup>
import LectureFileUploadedForm from "@/components/MyClass/TodaysClass/LectureFileUploadedForm.vue";
import LectureFileUploadList from "@/components/MyClass/TodaysClass/LectureFileUploadList.vue";
import { ref, onMounted } from "vue";
import { TodaysClass } from "@/services/MyClass/TodaysClass";
const todaysClassService = new TodaysClass();
let selectedTab = ref("fileUpload");
const uploadList = ref();
const my_class = new TodaysClass();
const props = defineProps({
  visible: Boolean,
  mydata: Object,
  classItem: Object,
});
onMounted(() => {
  getLectureUploadList();
});
function getSelectedTab(val) {
  return (selectedTab.value = val);
}
const getLectureUploadList = async () => {
  const data = {
    page: 1,
    limit: 10,
    class_id: props.mydata.class_seq,
    schedule_id: props.mydata.lesson_seq,
    lecture_id: props.mydata.teacher_id
  }
  try {
    let res = await my_class.getLectureUploadList(data);
    if (res.status === 200) {
      uploadList.value = res.data.lecture;
    }
  } catch (error) {
    console.log(error);
  }
};

// const getFormData = async (formData) => {
// console.log('formdata---', formData)
//     try {
//       const formDataInfo = new FormData();
//       formDataInfo.append("lectureFile", formData.lectureFile);
//       formDataInfo.append("to", formData.to);
//       formDataInfo.append("title", formData.title);

//       formDataInfo.append("url", formData.url);

//       formDataInfo.append("feedback", formData.feedback);

//       formDataInfo.append("class_seq", formData.class_seq);

//       formDataInfo.append("lession_seq", formData.lession_seq);
//       // formDataInfo.append("formData", formData)
//       console.log('forminfo00000000000', formDataInfo)
//         let res = await todaysClassService.lectureFileUpload(formDataInfo);
//         console.log('res', res)

//     } catch (error) {
//         console.log(error);
//     }
// };
</script>
