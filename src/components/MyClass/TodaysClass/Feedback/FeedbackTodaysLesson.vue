<template>
    <div class="feedback-sec ">
        <div class="head">
            <h3>Today's Lesson</h3>
        </div>
        <div class="lesson-content-area">
            <div class="sub-head">
                <div class="text-heads">
                    <h5>To:</h5>
                    <h5>{{ cpName }}</h5>
                </div>
                <div class="divided-btn d-flex">
                    <input class="d-none" id="facilatorInput" accept=".doc" type="file"
                        @change="onUploadFeedbackFile($event)" />
                    <ButtonVue @click="onDownloadFacilatorFile" :loading="isFacilatorFileDownloading">Facilitator Guide
                    </ButtonVue>
                    <ButtonVue class="ml-2" @click="showFileUploadManager" :loading="isUploading"
                        :disabled="feedbackFile.length == 5 || isSubmitted || isDataEntryNotAllow">Feedback File Upload
                    </ButtonVue>
                </div>
            </div>
            <!-- Uploaded Feedback Files -->
            <div class="object-upload-area" v-if="feedbackFile.length">
                <div class="objects-box" v-for="item in feedbackFile">
                    <p class="nam">{{ item.file_name }}</p>
                    <div class="object-right">
                        <p>{{ niceBytes(item.file_size) }}</p>
                        <SpinnerVue
                            v-if="isFeedbackFileDownloading.loading && isFeedbackFileDownloading.id === item.fuf_seq" />
                        <span v-else class="pointer" @click="onDownloadFeedbackFile(item.fuf_seq, item.file_name)"><img
                                src="@/assets/icons/downloadFile.svg"></span>
                    </div>
                </div>
            </div>
        </div>
        <div class="lesson-content-area">
            <!-- Unit Dropdown -->
            <div class="head marbtm24">
                <select name="cars" id="cars" class="outborder-slect-box" :value="selectedUnit?.unit_seq"
                    @change="onSelect($event.target.value)">
                    <option v-for="item in unitList" :key="item.unit_seq" :value="item.unit_seq">
                        {{ item.unit_title }}
                    </option>
                </select>
            </div>
            <!-- Lesson Audio -->
            <div class="book-record-area">
                <div class="adiuo-box-area">
                    <h3>Lesson Audio Play</h3>
                    <div class="audio-record-box">
                        <!-- <div class="dated">&nbsp;</div> -->
                        <div class="rcording-wrap">
                            <div class="record">
                                    <HlsAudioPlayer v-if="lessonAudio?.audio" :audioSrc="lessonAudio?.audio" :isHLS="true"  id="todays-lesson-hls-player">
                                </HlsAudioPlayer>
                                <p v-else><strong>No Lesson Audio Present Currently.</strong></p>
                            </div>

                        </div>
                    </div>
                </div>

                <div class="adiuo-box-area">
                    <h3>Class Record </h3>
                    <div class="audio-content-box rowtwos smpad">
                        <input class="d-none" id="cameraInput" accept=".mp4" type="file" capture="camera"
                            @change="getVideoFile($event)" />
                        <template v-if="qmData.file_path">
                            <div class="d-flex justify-content-between">
                                <img src="@/assets/icons/File.svg" />
                                <h3 class="ml-2">File already present</h3>
                            </div>
                        </template>
                        <template v-else-if="!isUploadingRecordFile && !qmData.file_path">
                            <div class="times">
                                {{ timer }}
                            </div>

                            <div class="divided-btn">
                                <div class="recodrBtn">

                                </div>
                                <button type="button" class="solid"
                                    :class="{ 'disable-event': (getRecordingStatus && !recording) || qmData.fuf_seq }"
                                    @click="displayVideoRecorderType = true" v-if="!recording"><img
                                        src="@/assets/icons/microphone-wht.svg">New Recording</button>
                                <!-- <button type="button" class="solid" ><img
                                        src="@/assets/icons/microphone-wht.svg">Recording</button> -->
                                <button type="button" class="stops" v-else @click="stopAudioRecording"><img
                                        src="@/assets/teacher/icons/stop-circle.svg">Stop</button>
                            </div>
                        </template>
                        <template v-else>
                            <div v-if="qmData.file_path" class="d-flex">
                                <img src="@/assets/icons/File.svg" />
                                <p class="ml-2">Class Record Uploaded</p>
                            </div>
                            <div v-else>
                                <p class="text-center"><strong>Uploading....</strong></p>
                            </div>
                        </template>
                    </div>
                </div>
            </div>

            <div class="head">
                <h5>Your Suggestions, Feedback & Comments</h5>
            </div>
            <div class="text-area" :class="{ 'invalid': error }">
                <RichTextEditor id="feedback_rte_editor" v-model="qmData.response" @setHtml="setHtmlData" />
            </div>
            <small v-if="error" class="error-text">This is mandatory field.</small>
        </div>
    </div>
    <!-- Video Recorder Modal -->
    <ModalVue v-if="openVideoRecord" :show="openVideoRecord" :defaultCloseBtn="true" @close="openVideoRecord = false"
        mWidth="990px">
        <template #body>
            <VideoRecorder @getVideoData="($event) => onUploadRecordFile($event, 'video')"
                @onClose="openVideoRecord = false" />
        </template>
    </ModalVue>
    <!-- Recording Type Selection Modal -->
    <ModalVue v-if="displayVideoRecorderType" :show="displayVideoRecorderType"
        @close="displayVideoRecorderType = false">
        <template #body>
            <div class="feedback-select-modal">
                <div class="select-btn-area">
                    <button class="grey-btn-outline" @click="onSelectRecordingType('video')"><img
                            src="@/assets/teacher/icons/video-camera.svg">Video</button>
                    <button class="grey-btn-outline" @click="onSelectRecordingType('audio')"><img
                            src="@/assets/teacher/icons/microphone-grey.svg">Audio</button>
                </div>
            </div>
        </template>
    </ModalVue>
</template>
<script setup>
import { ref } from "vue";
import { useRoute } from "vue-router";
import { Feedback } from "@/services/MyClass/Feedback";
import { useUserData } from "@/stores/useUserDataCopy";
import HlsAudioPlayer from "./HlsAudioPlayer.vue";
import VideoRecorder from "@/components/MyClass/TodaysClass/Feedback/VideoRecorder.vue";
import RichTextEditor from "@/utilities/RichTextEditor.vue";
import useMixins from '@/composables/useMixins.js';
import useTimer from '@/composables/useTimer.js';
import { useFeedback } from "@/stores/useFeedback";
import { storeToRefs } from "pinia";
import Toast from "@/alert/alert.js";
import { API_BASE_URL, API_KEY } from '@/services/Base.js';
import usePostMessage from "@/composables/usePostMessage";
const { onPostMessageFire } = usePostMessage();
const feedbackStore = useFeedback();
const { getRecordingStatus, getTranscriptingStatus } = storeToRefs(useFeedback());

const { saveFile, isMobileDevice, niceBytes } = useMixins();
const { timer, recording, startRecording, stopRecording } = useTimer();
const route = useRoute();
const store = useUserData();
const feedback = new Feedback();
const openVideoRecord = ref(false);
const isFacilatorFileDownloading = ref(false);
const isFeedbackFileDownloading = ref({ loading: false, id: null });
const isUploading = ref(false);
const displayVideoRecorderType = ref(false);
const mediaRecorder = ref(null);
const isUploadingRecordFile = ref(false);
const audioChunks = ref([]);
const isAudioRecording = ref(false);
const audioElement = ref(null);
let stream;
const props = defineProps({
    cpName: {
        type: String,
    },
    unitList: {
        type: Array,
        default: []
    },
    selectedUnit: {
        type: Object
    },
    selectedSate: {
        type: Object
    },
    feedbackFile: {
        type: Array
    },
    qmData: {
        type: Object
    },
    lessonAudio: {
        type: Object
    },
    error: {
        type: Boolean
    },
    isSubmitted: {
        type: Boolean,
        default: Boolean
    },
    isDataEntryNotAllow: {
        type: Boolean,
        default: Boolean
    }
})
const emit = defineEmits(['setClassUnit', 'update:qmData', 'call-details']);

const setHtmlData = (html) => {
    props.qmData.response = html;
};

const videoRecorderByDevice = () => {
    const camera = document.getElementById("cameraInput");
    if (isMobileDevice() || store.getIsMobileViewReady) {
        camera.showPicker();
    } else {
        openVideoRecord.value = true;
    }
}

const reset = () => {
    audioChunks.value = [];
    mediaRecorder.value = null;
}
// Function to start recording
const startAudioRecording = () => {
    if (getTranscriptingStatus.value) {
        Toast.fire({
            title: 'Transcripting is going on!!',
            background: "red",
            color: 'white'
        });
        return;
    }
    reset();
    feedbackStore.$patch({ is_recording_ongoing: true });
    displayVideoRecorderType.value = false;
    startRecording();
    navigator.mediaDevices.getUserMedia({ audio: { sampleRate: 44100, channelCount: 2, bitrate: 192000 } })
        .then(mediaStream => {
            stream = mediaStream;
            mediaRecorder.value = new MediaRecorder(mediaStream);
            mediaRecorder.value.ondataavailable = event => {
                audioChunks.value.push(event.data);
            };
            mediaRecorder.value.onstop = () => {
                const audioBlob = new Blob(audioChunks.value, { type: 'audio/mp3' });
                audioElement.value = audioBlob;
                onUploadRecordFile(audioElement.value, 'audio')
                stream.getTracks().forEach(track => track.stop());
            };
            mediaRecorder.value.start();
            isAudioRecording.value = true;
        })
        .catch(error => {
            console.error('Error accessing microphone:', error);
        });
};

// Function to stop recording
const stopAudioRecording = () => {
    if (mediaRecorder.value && isAudioRecording.value) {
        mediaRecorder.value.stop();
        isAudioRecording.value = false;
        stopRecording();
        feedbackStore.$patch({ is_recording_ongoing: false });
    }
};
const getVideoFile = (event) => {
    const file = event.target.files[0];
    onUploadRecordFile(file, 'video')
}
const showFileUploadManager = () => {
    const file = document.getElementById("facilatorInput");
    file.showPicker();
}
const onSelectRecordingType = (_data) => {
    if (_data === 'video') {
        videoRecorderByDevice();
        displayVideoRecorderType.value = false;
    } else {
        startAudioRecording();
    }
}
// API CALL
const onDownloadFacilatorFile = async (fileName) => {
    if (store.getIsMobileViewReady) {
        const data = {
            "file_url": `${API_BASE_URL}teacher/myclass/feedback/facilitator-guide`,
            "fileName": 'facilator.pdf',
            "unit_seq": props.selectedSate.selected_todays_class_unit?.unit_seq,
            "x-api-key": API_KEY
        }
        onPostMessageFire("fileDownloadPostMethod", data);
    } else {
        const obj = {
            "unit_seq": props.selectedSate.selected_todays_class_unit?.unit_seq
        }
        try {
            isFacilatorFileDownloading.value = true;
            let res = await feedback.downloadFacilatorGuideFile(obj);
            if (res.data) {
                saveFile(res, 'facilator.pdf');
            }
        } catch (error) {
            console.log(error);
        } finally {
            isFacilatorFileDownloading.value = false;
        }
    }
};
// PEnding
const onDownloadFeedbackFile = async (_seq_id, _name) => {
    if (store.getIsMobileViewReady) {
        const data = {
            "file_url": `${API_BASE_URL}teacher/myclass/feedback/file/${_seq_id}/download`,
            "fileName": _name,
            "x-api-key": API_KEY
        }
        onPostMessageFire("fileDownload", data);
    } else {
        try {
            isFeedbackFileDownloading.value.loading = true;
            isFeedbackFileDownloading.value.id = _seq_id;
            let res = await feedback.downloadFeedbackFile(_seq_id);
            if (res.data) {
                saveFile(res, _name);
            }
        } catch (error) {
            console.log(error);
        } finally {
            isFeedbackFileDownloading.value.loading = false;
        }
    }
};
const onUploadFeedbackFile = async (_data) => {
    const file = _data.target.files[0]
    // return;
    const fd = new FormData();
    fd.append('user_id', props.selectedSate.cp_id);
    fd.append('feedback_file', file);
    fd.append('schedule_seq', route.params.schedule_seq);
    fd.append('unit_seq', props.selectedSate.selected_todays_class_unit?.unit_seq);
    try {
        isUploading.value = true;
        let res = await feedback.uploadFeedbackFile(fd);
        if (res.data.sucess) {
            emit('call-details', 'feedback-file')
        }
    } catch (error) {
        console.log(error);
    } finally {
        isUploading.value = false;
    }
}
const onUploadRecordFile = async (_data, _fileType) => {
    const fileName = _fileType === 'audio' ? 'qm-recording.mp3' : 'qm-recording.mp4'
    const file = _data;
    const fd = new FormData();
    fd.append('class_record', file, fileName);
    try {
        isUploadingRecordFile.value = true;
        let res = await feedback.uploadClassRecordMediaFile(fd);
        if (res.data.success) {
            props.qmData.file_path = res.data.recordedFile.filePath;
            props.qmData.file_size = res.data.recordedFile.fileSizeInByte;
            props.qmData.file_type = _fileType;
        }
    } catch (error) {
        console.log(error);
    } finally {
        isUploadingRecordFile.value = false;
    }
}
const onSelect = (_unit_seq) => {
    const obj = props.unitList.find(item => item.unit_seq == _unit_seq);
    emit('setClassUnit', obj)
}

</script>