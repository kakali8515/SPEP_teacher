

<template>
    <div class="option-wrap">
        <div class="overlay" v-if="!displayCamera"></div>
        <div class="all-option" v-if="!displayCamera">
            <ul>
                <li class="pointer" @click="openCamera()">
                    <img src="@/assets/icons/camera.svg" /><span>Camera</span>
                </li>
                <li class="pointer" @click="openGallery()">
                    <img src="@/assets/icons/image-icon.svg" /><span>Gallery</span>
                </li>
                <li class="pointer" @click="openDocs()">
                    <img src="@/assets/icons/doc-icon.svg" /><span>Documents</span>
                </li>
                <li class="pointer" @click="openAudio()">
                    <img src="@/assets/icons/audio-file.svg" /><span>Audio file</span>
                </li>
                <li class="pointer" @click="$emit('cancel')">
                    <img src="@/assets/icons/close-icon.svg" /><span>Cancel</span>
                </li>
            </ul>
            <input class="d-none" id="cameraInput" accept="image/*" type="file" capture="camera"
                @change="getFile($event)" />
            <input class="d-none" id="galleryFileInput" type="file"
                accept=".jpeg, .jpg, .png, .mp4, .avi, .wmv, .mov" @change="getFile($event)" />
            <input class="d-none" id="docsInput" type="file" accept=".pdf, .doc, .xls, .ppt, .xlsx"
                @change="getFile($event)" />
            <input class="d-none" id="audioInput" type="file" accept=".mp3*"
                @change="getFile($event)" />
        </div>
    </div>
    <!-- Video Recorder Modal -->
    <ModalVue v-if="displayCamera" :show="displayCamera" :defaultCloseBtn="true" @close="onCloseCaptureCamera"
        mWidth="700px">
        <template #body>
            <CaptureImage v-if="displayCamera" @close="onCloseCaptureCamera" @save="onSave" />
        </template>
    </ModalVue>
</template>
<script setup>
import Toast from "@/alert/alert.js";
import CaptureImage from "./CaptureImage.vue";
import { ref, onMounted, onUnmounted } from "vue";
import { useUserData } from "@/stores/useUserDataCopy";
const userStore = useUserData();
const emit = defineEmits(["cancel", "onFileSave"]);
const displayCamera = ref(false);
onMounted(() => {
    document.body.classList.add("hideScroll");
});
onUnmounted(() => {
    document.body.classList.remove("hideScroll");
});
function isMobileDevice() {
    return /Mobi|Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
    );
}
const onSave = (_data) => {
    const obj = {
        data: [_data],
        type: "image",
    };
    emit("onFileSave", obj);
    emit("cancel");
};

function openCamera() {
    if (isMobileDevice() || userStore.getIsMobileViewReady) {
        const camera = document.getElementById("cameraInput");
        camera.showPicker();
    } else {
        displayCamera.value = true;
    }
}

function openGallery() {
    const gallery = document.getElementById("galleryFileInput");
    gallery.showPicker();
}

function openDocs() {
    const docs = document.getElementById("docsInput");
    docs.showPicker();
}

function openAudio() {
    const audio = document.getElementById("audioInput");
    audio.showPicker();
}
const getFileType = (file) => {
    if (file.type.match("image.*")) {
        return "image";
    } else if (file.type.match("video.*")) {
        return "video";
    } else if (file.type.match("audio.*")) {
        return "audio";
    } else {
        return "document";
    }
};
function getFile(event) {
    const files = [...event.target.files];
    let fileType = getFileType(files[0]);
    // Checking selected files won't be more than 10
    if (files?.length > 10) {
        Toast.fire({
            title: "You can not add more than 10 files.",
            background: "#e2e8f0",
        });
        emit("cancel");
        return;
    }
    // Checking same file type or not
    if (!files.every((item) => fileType === getFileType(item))) {
        Toast.fire({
            title: "Please select same file type",
            background: "#e2e8f0",
        });
        emit("cancel");
        return;
    }
    emit("onFileSave", { data: [...files], type: fileType });
    emit("cancel");
}
const onCloseCaptureCamera = () => {
    displayCamera.value = false;
    emit("cancel");
}
</script>

<style scoped lang="scss">
.overlay {
  width: 100%;
  height: 100%;
  z-index: 1;
  position: absolute;
  top: 0;
  bottom: 0;
  background-color: rgba(6, 13, 24, 0.9);
}

#videoElement {
  width: 500px;
  height: 375px;
  background-color: #666;
  /*Mirror code starts*/
  transform: rotateY(180deg);
  -webkit-transform: rotateY(180deg);
  /* Safari and Chrome */
  -moz-transform: rotateY(180deg);
  /* Firefox */
  /*Mirror code ends*/
}

.camera-btn {
  border: none;
  outline: none;
  background-color: white;
  border-radius: 5px;
  display: flex;
  align-items: center;
  padding: 5px;
  font-size: 12px;
  cursor: pointer;

  &.success {
    background: rgb(23, 190, 23);
    color: white;
  }

  &.error {
    background: red;
    color: white;
  }
}</style>
