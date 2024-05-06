<template>
    <DrawerVue :visible="visible" type="right" title="Lecture files" @close="$emit('close')" :noFooter="true">
      <LectureFileUploadedForm v-if="selectedTab == 'fileUpload'" :classSeq="classSeq"  :formData="formData" @close="closeDrawer" @getUploadList="closeDrawer"/>
      <LoaderVue :loading="loaderState" />
    </DrawerVue>
  </template>
  
  <script setup>
  import LectureFileUploadedForm from "@/components/MyClass/TodaysClass/LectureFileUploadedForm.vue";
  import { ref, onMounted } from "vue";
  import { TodaysClass } from "@/services/MyClass/TodaysClass";
  import { ClassDetails } from "@/services/MyClass/ClassDetails";
  import { useUserData } from "@/stores/useUserDataCopy";
  const userStore = useUserData();
  let selectedTab = ref("fileUpload");
  const uploadList = ref();
  const my_class = new TodaysClass();
  const class_detail = new ClassDetails();
  const loaderState = ref(false);
  const props = defineProps({
    visible: Boolean,
    classSeq: {
      type: [String, Number]
    },
    formData: Object,
    showBtn: {
        type: Boolean,
        default: true,
    },
  });
const emit = defineEmits([ "close"]);
  const closeDrawer = () => {
  emit('close')
}
 
  </script>
  