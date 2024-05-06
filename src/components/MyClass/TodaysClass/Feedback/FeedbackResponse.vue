<template>
    <div class="feedback-sec shadow-background nopad">
        <div class="head delets" v-if="!isSingle && !data.fuf_seq">
            <h5>&nbsp;</h5>
            <button type="button" @click="onDelete"><img src="@/assets/icons/trash-red.svg"> Delete Lesson </button>
        </div>
        <div class="book-record-area">
            <div class="adiuo-box-area">
                <h3>Lesson Audio Play</h3>
                <div class="audio-record-box">
                    <div class="rcording-wrap">
                        <div class="record">
                            <div class="wrap">
                                <HlsAudioPlayer v-if="lessonAudio?.audio" :audioSrc="lessonAudio?.audio" :isHLS="true"  id="todays-lesson-hls-player">
                                </HlsAudioPlayer>
                                <p v-else><strong>No Lesson Audio Present Currently.</strong></p>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
            <div class="adiuo-box-area mx-wdt">
                <h3>Class Record </h3>
                <div class="audio-content-box rowtwos">
                    <div class="times" :class="{'disable-event': data.file_path || (getRecordingStatus && !recording)}">{{ timer }}</div>
                    <div class="divided-btn">
                        <button type="button" class="solid" v-if="!recording" @click="startAudioRecording" :class="{'disable-event': data.file_path || (getRecordingStatus && !recording) || data.fuf_seq}"><img src="@/assets/icons/microphone-wht.svg" >New
                            Recording</button>
                        <button v-else type="button" class="stops" @click="stopAudioRecording"><img
                                        src="@/assets/teacher/icons/stop-circle.svg">Stop</button>
                    </div>
                </div>
            </div>
            <div class="adiuo-box-area">
                <h3>Play Recorded Audio</h3>
                <div class="audio-record-box" style="min-height: 100px; flex-direction: column;">
                    <div class="dated" v-if="data?.created_at">{{ data?.created_at ? moment(data.created_at).format('YYYY-MM-DD HH:mm') : '' }}</div>
                    <div class="rcording-wrap">
                        <div class="record">
                            <!-- <NormalAudioPlayer :audio-url="loaclRecordPath ? loaclRecordPath : `https://exi.spep.co.kr/files/${data.file_path}`" :disabled="!data.file_path" :id="`feedback-player-${id}`" ref="childComponentRef" :durationCount="sentCountTime"/> -->
                            <TranscriptAudioPlayer :data="loaclRecordPath ? loaclRecordPath : data.file_path" :audio-url="loaclRecordPath ? loaclRecordPath : `https://exi.spep.co.kr/files/${data.file_path}`" :id="`feedback-hls-player-${id}`" @transcript-data="setEditorData" :disabled="!data.file_path"  ref="childComponentRef" :durationCount="sentCountTime">
                            </TranscriptAudioPlayer>
                            <img src="/src/assets/teacher/icons/soundmenu.svg" class="pointer" @click="showOption = !showOption" v-if="!data.fuf_seq" :class="{'disable-event': !data.file_path}" >

                        </div>
                        <div class="option" v-show="showOption" style="z-index: 9999;">
                            <ul>
                                <li class="active pointer" @click="onUploadRecordFile">Save</li>
                                <li class="pointer" @click="reset('delete')">Delete</li>
                            </ul>
                        </div>
                    </div>
                </div>

            </div>
        </div>
        <div class="record-text-wrap mrtop32">
            <div class="head d-flex justify-content-between align-items-center">
                <h5>Your Suggestions, Feedback & Comments</h5>
            </div>
            <div class="texteditor">
                <!-- here use text editor plugins -->
                <!-- <RichTextEditor></RichTextEditor> -->
                <div class="text-area">
                    <RichTextEditor :id="`content_editor_rte_edit-${id}`" v-model="data.stt" @setHtml="setEditResHtml" :setContent="sttData"/>
                </div>
            </div>
        </div>
        <div class="record-text-wrap">
            <div class="head wrapper">
                <h5>Edited Participant's Response</h5>
                <button type="button" @click="startSpeaking">Text to Speech <img src="@/assets/teacher/icons/speach.svg"></button>
            </div>
            <div class="texteditor">
                <!-- here use text editor plugins -->
                <div class="text-area">
                    <RichTextEditor :id="`content_editor_rte_${id}`" v-model="data.response"  @setHtml="setHtml" :setContent="editedSttData"/>
                </div>
            </div>
        </div>
    </div>
</template>
<script setup>
import { ref } from "vue";
import moment from "moment";
import RichTextEditor from "@/utilities/RichTextEditor.vue";
import TranscriptAudioPlayer from "./TranscriptAudioPlayer.vue";
import HlsAudioPlayer from "./HlsAudioPlayer.vue";
import { Feedback } from "@/services/MyClass/Feedback";
import useTimer from '@/composables/useTimer.js';
import { useFeedback} from "@/stores/useFeedback";
import { storeToRefs } from "pinia";
import { useUserData } from "@/stores/useUserDataCopy";
import Toast from "@/alert/alert.js";
const userStore = useUserData();
const store = useFeedback();
const childComponentRef = ref()
const { getRecordingStatus, getTranscriptingStatus } = storeToRefs(useFeedback());
const { timer, recording, startRecording, stopRecording, resetTimer } = useTimer();
const props = defineProps({
    data: {
        default: {},
    },
    id: {
        default: 1,
    },
    isSingle: {
        default: false,
    },
    lessonAudio: {
        type: Object
    }
})
const emit = defineEmits(['on-delete', 'update:data'])
const feedback = new Feedback();
const showOption = ref(false)
const isUploadingRecordFile = ref(false);
const sttData = ref('');
const editedSttData = ref('');
// Audio recording variables
const mediaRecorder = ref(null);
const audioChunks = ref([]);
const isRecording = ref(false);
const loaclRecordPath = ref('')
const recordFile = ref(null)
const sentCountTime = ref('')
let stream;;
const setEditorData = (_data) => {
    const htmlData1 = `${props.data.stt} <p>${_data}</p>`
    const htmlData2 = `${props.data.response} <p>${_data}</p>`
    sttData.value = htmlData1
    editedSttData.value = htmlData2
}
const setHtml = (html) => {
    props.data.response = html;
    
};
const setEditResHtml = (html) => {
    props.data.stt = html;
};
sttData.value = props.data.stt;
editedSttData.value = props.data.response;
const onDelete = () => {
    emit('on-delete', props.data, props.id)
}
const startSpeaking = () => {
  if (userStore.getIsMobileViewReady) {
    window.flutter_inappwebview.callHandler("startSpeaking", props.data.response);
    return;
  }
  const synth = window.speechSynthesis;
  const utterance = new SpeechSynthesisUtterance();
  utterance.text = props.data.response;
  synth.speak(utterance);
};
const stopSpeaking = () => {
  if (userStore.getIsMobileViewReady) {
    window.flutter_inappwebview.callHandler("stopSpeaking");
    return;
  }
  const synth = window.speechSynthesis;
  synth.cancel();
};

const reset = (_type) => {
    audioChunks.value = [];
    mediaRecorder.value = null;
    showOption.value = false
    props.data.file_path = "";
    props.data.file_size = "";
    props.data.file_type = "";
    loaclRecordPath.value  =  "";
    sentCountTime.value= ""
    resetTimer();
    if(_type) {
        childComponentRef.value.reset();
    }
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
    startRecording()
    store.$patch({is_recording_ongoing: true});
    navigator.mediaDevices.getUserMedia({ audio: { sampleRate: 44100, channelCount: 2, bitrate: 192000 } })
    .then(mediaStream => {
        stream = mediaStream;
      mediaRecorder.value = new MediaRecorder(mediaStream);
      mediaRecorder.value.ondataavailable = event => {
        audioChunks.value.push(event.data);
      };
      mediaRecorder.value.onstop = () => {
        const audioBlob = new Blob(audioChunks.value, { type: 'audio/mp3' });
        recordFile.value = audioBlob;
        const audioUrl = URL.createObjectURL(audioBlob);
        props.data.file_path  = audioUrl;
        loaclRecordPath.value = audioUrl;
        stream.getTracks().forEach(track => track.stop());
      };
      mediaRecorder.value.start();
      isRecording.value = true;
    })
    .catch(error => {
      console.error('Error accessing microphone:', error);
    });
};

// Function to stop recording
const stopAudioRecording = () => {
  if (mediaRecorder.value && isRecording.value) {
    mediaRecorder.value.stop();
    isRecording.value = false;
    store.$patch({is_recording_ongoing: false});
    stopRecording();
    sentCountTime.value = timer.value;
  }
};
const onUploadRecordFile = async () => {
    const fileName = 'feedback-recording.mp3'
    const fd = new FormData();
    showOption.value = false;
    fd.append('class_record', recordFile.value, fileName);
    try {
        isUploadingRecordFile.value = true;
        let res = await feedback.uploadClassRecordMediaFile(fd);
        if (res.data.success) {
            props.data.file_path = res.data.recordedFile.filePath;
            props.data.file_size = res.data.recordedFile.fileSizeInByte;
            props.data.file_type = 'audio';
        }
    } catch (error) {
        console.log(error);
    } finally {
        isUploadingRecordFile.value = false;
    }
}
</script>