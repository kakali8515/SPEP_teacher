<template>
  <form>
    <div class="uploadform">
      <div class="form-wrapper">
        <div class="scroll-wrap">
          <!-- to :: start -->
          <div class="wrap">
            <p>To</p>
            <select v-model="state.to" @change="getMemberValue(state.to)">
              <option selected class="pointer" value="1">All</option>
              <option v-for="item in memberList" class="pointer" :value="item.user_id">
                {{ item.user_name }}
              </option>
            </select>
          </div>
          <!-- to :: end -->

          <!-- title :: start -->
          <div class="wrap">
            <p>Title</p>
            <input type="text" placeholder="Title" v-model="state.title" maxlength="100" />
            <p style="color: red" class="pt-2" v-if="v$.title?.$error">{{ v$.title?.$errors[0].$message
              }}</p>
          </div>
          <!-- title :: end -->

          <!-- url :: start -->
          <div class="wrap">
            <p>URL</p>
            <input type="text" placeholder="http://" v-model="state.url" @keyup="checkURL" maxlength="50" />
            <p style="color: red" class="pt-2" v-if="v$.url?.$error || error.url">{{ v$.url?.$errors[0]?.$message ||
              error.url
              }}</p>
          </div>
          <!-- url :: end -->

          <!-- files :: start -->
          <div class="wrap">
            <p>File Upload</p>
            <div class="upload-file">
              <p>
                <button type="button">
                  <img src="@/assets/teacher/icons/uploadicon.svg" />
                </button>
                Please upload the files.
              </p>
              <div class="plus">
                <button type="button" class="plus">
                  <img src="@/assets/teacher/icons/plus.svg" />
                </button>
                <input class="pointer" type="file" ref="fileInput" multiple @change="handleFileUpload" />
              </div>
            </div>
            <p style="color: red" class="pt-2" v-if="error.isFile">{{ error.isFile }}</p>
          </div>
          <div style="width: 100%;">
            <div v-for="(file, index) in filePreviews" :key="index" class="upload-img">
              <!-- for image preview  -->
              <!-- <img :src="file.preview" alt="File Preview" style="width: 50px; height: 50px;" /> -->
              <img src="@/assets/icons/File.svg">
              <div class="p-2">
                <p>{{ file.name }}</p>
                <p>{{ formatFileSize(file.size) }}</p>
              </div>
              <div class="pointer remove-img" @click.prevent="removeImage(index)">
                <img src="@/assets/icons/modal-x.svg">
              </div>
            </div>
            <div v-if="parsedFiles && parsedFiles?.files?.length">
              <div v-for="(file, index) in parsedFiles?.files" :key="index" class="upload-img">
                <div class="close pointer remove-img" @click.prevent="removeImage(index)">
                  <img src="@/assets/icons/modal-close.svg">
                </div>
                <!-- <img v-if="file.m_type === 'img'" :src="getFileUrl(file.file)" alt="File Preview"
              style="width: 50px; height: 50px;" /> -->
                <img src="@/assets/icons/File.svg">
                <div class="pointer" @click="downloadFile(file.file_name)">
                  <p>{{ file.file_name }}</p>
                  <p>{{ file.size }}</p>
                </div>
              </div>
            </div>

          </div>
          <!-- files :: end  -->

          <!-- feedback :: start -->
          <div class="wrap">
            <p>Note</p>
            <!-- <p v-else>Feedback</p> -->
            <textarea maxlength="500" placeholder="Please enter your details." v-model="state.feedback"></textarea>
            <p style="color: red" class="pt-2" v-if="v$.feedback?.$error">{{ v$.feedback?.$errors[0].$message
              }}</p>
          </div>
          <!-- feedback :: end -->
          <div class="form-delete-btn" @click="displayDeleteModal = true">
            <button v-if="isEdit" class="delete ms-auto" type="button">Delete<img
                src="@/assets/teacher/icons/trash.svg"></button>
          </div>

        </div>
        <div>
          <!-- fileUploadBtn :: start -->
          <div class="button-wrapper">
            <button type="button" @click="submitForm">
              <span v-if="isEdit">Save</span>
              <span v-else><img src="@/assets/teacher/icons/uploadwhite.svg" />File Upload</span>
            </button>
          </div>
          <!-- fileUploadBtn :: end -->
        </div>
      </div>
    </div>
  </form>
  <LoaderVue :loading="loaderState" />

  <!-- Delete Modal-->
  <ConfirmModalVue :visible="displayDeleteModal" :restrict-scroll="true" :is-loading="loaderState"
    title="Are you sure you want to delete?" primaryButtonText="Delete" secondaryButtonText="Cancel"
    @on-cancel="closeDeleteModal" @on-confirm="DeleteLectureList" />
</template>

<script setup>
import { ref, onMounted, reactive } from "vue";
import { API_BASE_URL, API_KEY } from '@/services/Base.js';
import { TodaysClass } from "@/services/MyClass/TodaysClass";
import { ClassDetails } from "@/services/MyClass/ClassDetails";
import { useVuelidate } from '@vuelidate/core'
import { required, helpers, url } from '@vuelidate/validators'
import { useUserData } from "@/stores/useUserDataCopy";
import useMixins from '@/composables/useMixins.js';
import usePostMessage from "@/composables/usePostMessage";
const { onPostMessageFire } = usePostMessage();

const { saveFile } = useMixins();
const store = useUserData();
const my_class = new TodaysClass();
const classService = new ClassDetails();

// data
const loaderState = ref(false);
const uploadData = ref({})
const filePreviews = ref([]);
const maxFileCount = 10;
const filesArray = ref([]);
const memberList = ref([])
const memberData = ref(1)
const parsedFiles = ref([]);
const isEdit = ref(false);
const displayDeleteModal = ref(false);
const state = reactive({
  to: "1",
  title: '',
  url: "",
  feedback: "",
});
const error = reactive({
  url: "",
  isFile: ""
});
const rules = {
  title: {
    required: helpers.withMessage('Please enter the title', required)
  },
  feedback: {
    required: helpers.withMessage('Please enter the feedback', required)
  },
  url: {
    url: helpers.withMessage('Please enter valid url', url)
  }
}
// events
const emit = defineEmits(["state", "close", "getUploadList"]);

// props
const props = defineProps({
  classSeq: {
    type: [String, Number]
  },
  formData: Object
});

const getFileUrl = (filePath) => {
  console.log('file----', filePath)
  return `baseFileURL/${filePath}`;
};
const clearField = () => {
  Object.assign(state, {
    to: "1",
    title: "",
    url: "",
    feedback: "",
  });
  filePreviews.value = [];
  filesArray.value = [];
  v$.value.$reset();
};

const handleFileUpload = (event) => {
  const files = event.target.files;
  if (!files) {
    return;
  }

  if (files.length > maxFileCount) {
    alert(`You can upload a maximum of ${maxFileCount} files.`);
    event.target.value = null;
    return;
  }

  for (let i = 0; i < files.length; i++) {
    if (event.target.files[i].size > 1024 * 1024 * 1024) {
      alert(`You can upload a maximum of 1GB files.`);
      // Toast.fire({
      //       title: 'You can upload a maximum of 1GB files.',
      //       background: "red",
      //       color: 'white'
      //   });
      event.target.value = null;
      return;
    }
  }


  // Loop through each selected file
  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const reader = new FileReader();
    error.isFile = "";
    reader.onload = async () => {
      try {
        const formData = new FormData();
        formData.append("isProfile", 0);
        formData.append("thumbPath", '');
        formData.append("useDateFolder", 1);
        formData.append("useUniqueFileName", 0);
        formData.append("filePath", "class");
        formData.append("file", file);
        filePreviews.value.push({
          name: file.name,
          size: file.size,
          preview: reader.result,
        });
        loaderState.value = true;
        const res = await my_class.lectureFileUpload(formData);
        if (res.data?.result) {
          filesArray.value.push({
            m_type: res.data.fileType,
            file: res.data.filePath + res.data.fileName,
            thumb: res.data.fileThumb,
            file_name: res.data.fileName
          });
        }

      } catch (error) {
        console.log("Error uploading file:", error);
      } finally {
        loaderState.value = false;
      }
    };
    reader.readAsDataURL(file);
  }
};

const formatFileSize = (size) => {
  const units = ["B", "KB", "MB", "GB", "TB"];
  let unitIndex = 0;
  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024;
    unitIndex++;
  }
  return size.toFixed(2) + " " + units[unitIndex];
};
const removeImage = (index) => {
  filePreviews.value.splice(index, 1);
  filesArray.value.splice(index, 1);
  parsedFiles.value.files.length ? parsedFiles.value.files.splice(index, 1) : [];
}

// prefilled data of uploaded form 
const getUploadedFormData = async () => {
  const data = {
    user_id: store.getUserData.id,
    cr_seq: props.formData.cr_seq,
    lgCode: 'kr'
  }
  try {
    loaderState.value = true;
    let res = await classService.getFileUploadData(data);
    if (res.data?.result) {
      uploadData.value = res.data.data;
    }
  } catch (error) {
    console.log(error);
  } finally {
    loaderState.value = false;
  }
};
const getMemberList = async () => {
  const data = {
    user_id: store.getUserData.id,
    class_seq: props.classSeq,
    lgCode: 'en'
  }
  try {
    loaderState.value = true;
    let res = await my_class.getClassMemberList(data);
    if (res.data?.result) {
      memberList.value = res.data.data
    }
  } catch (error) {
    console.log(error);
  } finally {
    loaderState.value = false;
  }
};
const getMemberValue = (data) => {
  memberData.value = data
}
const v$ = useVuelidate(rules, state);

const submitForm = async () => {
  const isFormCorrect = await v$.value.$validate();
  if (!isEdit.value && filesArray.value.length == 0) {
    error.isFile = "Please upload the files.";
  } else if (isEdit.value && filesArray.value.length == 0 && parsedFiles.value.files?.length == 0) {
    error.isFile = "Please upload the files.";
  }
  if (!isFormCorrect || error.url || error.isFile) {
    return;
  } else {
    let existFileData = parsedFiles.value.files?.length ? parsedFiles.value.files : [];
    const combinedFiles = { files: [...existFileData, ...filesArray.value] };
    error.isFile = "";
    try {
      const data = {
        class_seq: props.classSeq,
        target_type: memberData.value == 1 ? 1 : 2,
        files: JSON.stringify(combinedFiles),
        url: state.url,
        target_id: memberData.value != 1 ? memberData.value : "",
        comment: state.feedback,
        image: "",
        title: state.title,
        image_thumb: ""
      }
      if (!isEdit.value) {
        data.user_id = store.getUserData.id,
          data.lgCode = 'en'
      }
      loaderState.value = true;
      let res;
      if (isEdit.value) {
        data.cr_seq = props.formData.cr_seq
        res = await my_class.updateFileUploadForm(data);
        if (res.data?.success) {
          emit('close')
        }
      } else {
        res = await my_class.submitUploadForm(data);
        if (res.data?.result) {
          clearField()
          emit('close')
        }
      }
    } catch (error) {
      console.log(error);
    } finally {
      loaderState.value = false;
    }
  }
}
onMounted(async () => {
  await store.getUserDetails();
  await getMemberList()
  if (props.formData) {
    const openedFromList = props.formData.cr_seq;
    if (openedFromList) {
      isEdit.value = true;
      await getUploadedFormData();
      if (uploadData.value) {

        state.to = uploadData.value.target_id ? uploadData.value.target_id : "1";
        state.title = uploadData.value.title;
        state.url = uploadData.value.url ? uploadData.value.url : "";
        state.feedback = uploadData.value.comment;
        parsedFiles.value = JSON.parse(uploadData.value.files);
      }
    }
  }
});

// close delete modal
const closeDeleteModal = () => {
  displayDeleteModal.value = false;
};

// delete lecture file
const DeleteLectureList = async () => {
  try {
    loaderState.value = true;
    let res = await my_class.deleteLectureFile(props.formData.cr_seq);
    if (res.data) {
      displayDeleteModal.value = false;
      emit('getUploadList')
    }
  } catch (error) {
    console.log(error);
  } finally {
    loaderState.value = false;
  }
};

// download lecture file
const downloadFile = async (fileName) => {
  if (store.getIsMobileViewReady) {
    const data = {
      'file_url': `${API_BASE_URL}teacher/myclass/download-lecture-file/${props.formData.cr_seq}/file/${fileName}`,
      'fileName': fileName,
      'x-api-key': API_KEY
    }
    onPostMessageFire("fileDownload", data);
  } else {
    try {
      loaderState.value = true;
      let res = await my_class.downloadLectureFile(props.formData.cr_seq, fileName);
      if (res.data) {
        saveFile(res, fileName);
      }
    } catch (error) {
      console.log(error);
    } finally {
      loaderState.value = false;
    }
  }
};

// url check
const checkURL = () => {
  if (state.url == "") {
    error.url = "";
    return true;
  }
  if (!isValidUrl(state.url)) {
    error.url = "Please enter valid url";
    return false;
  } else {
    error.url = "";
  }
};

const isValidUrl = (urlString) => {
  var urlPattern = new RegExp(
    "^(https?:\\/\\/)?" + // validate protocol
    "((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|" + // validate domain name
    "((\\d{1,3}\\.){3}\\d{1,3}))" + // validate OR ip (v4) address
    "(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*" + // validate port and path
    "(\\?[;&a-z\\d%_.~+=-]*)?" + // validate query string
    "(\\#[-a-z\\d_]*)?$",
    "i"
  ); // validate fragment locator
  return !!urlPattern.test(urlString);
}
</script>

<style lang="scss">
.border-box {
  width: 100%;
  margin-top: 8px;
  background-color: #ffffff;
  border: 1px solid #cfcfcf;
  padding: 16px;
  border-radius: 4px;
}

.upload-img {
  display: flex;
  width: 100%;
  border: 1px solid #0000001f;
  margin: 8px 0px 0;
  position: relative;
  padding: 10px 20px;
  border-radius: 5px;

  .remove-img {
    position: absolute;
    right: 16px;
    top: 21%;
    opacity: 1;
  }
}

.p-2 {
  display: flex;
  flex-direction: column;
  gap: 8px;

  p {
    color: var(--Gray-4, #828282);
    font-size: 12px;
    font-style: normal;
    font-weight: 600;
    line-height: 100%;
    word-break: break-all;
  }
}
</style>
